// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";
import "./ISeed.sol";

contract SeedMinter is
  Initializable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable
{
  // seed NFT contract address
  address public seed;

  // seed NFT sale price of native token
  uint256 public price;
  // points token address
  address public pointsToken;
  // points token amount condition of free claim
  uint256 public pointsCountCondi;
  // store the merkle root hash of whitelist
  mapping(uint256 => bytes32) public whiteListRootHashes;
  // user claimed flag, true means claimed; user can only
  // free claim once whenever the claim method is whitelist or points
  mapping(address => bool) public claimed;

  // flag of payed mint feature gate
  bool public onMint;
  // flag of free claim with white list feature gate
  bool public onClaimWithWhiteList;
  // flag of free claim with points feature gate
  bool public onClaimWithPoints;

  // NFT minter address
  address public minter;

  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  event MintEnabled(address account);

  event MintDisabled(address account);

  event ClaimWithWhiteListEnabled(address account);

  event ClaimWithWhiteListDisabled(address account);

  event ClaimWithPointsEnabled(address account);

  event ClaimWithPointsDisabled(address account);

  event MinterChanged(address indexed oldMinter, address indexed newMinter);

  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @dev used to restrict methods that only minter address can call
  modifier onlyMinter() {
    require(_msgSender() == minter, "Only minter can call this method");
    _;
  }

  /// @dev used to restrict that each user can only free claim once, whether it is through the whitelist condition or the points condition, they can only free claim for free once
  modifier noClaimed() {
    require(!claimed[_msgSender()], "You have claimed");
    _;
  }

  /// @dev used to restrict methods that only can call when payed mint feature gate is open
  modifier enableMint() {
    require(onMint, "Mint is not open");
    _;
  }

  /// @dev used to restrict methods that only can call when claim with whitelist feature gate is open
  modifier enableClaimWithWhiteList() {
    require(onClaimWithWhiteList, "Claim with white list is not open");
    _;
  }

  /// @dev used to restrict methods that only can call when claim with points feature gate is open
  modifier enableClaimWithPoints() {
    require(onClaimWithPoints, "Claim with point is not open");
    _;
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(
    address seed_,
    address pointsToken_,
    uint256 pointsCountCondi_
  ) public initializer {
    seed = seed_;

    pointsToken = pointsToken_;
    pointsCountCondi =
      pointsCountCondi_ *
      10 ** IERC20Metadata(pointsToken_).decimals();

    // set default minter
    minter = msg.sender;
    // `onMint` is disabled by default
    // `onClaimWithWhiteList` is disabled by default
    // `onClaimWithPoints` is disabled by default

    __Ownable_init();
    __ReentrancyGuard_init();
  }

  /// @dev claim for free with whitelist, need to specify white list ID and Merkle Proof when calling
  /// `enableClaimWithWhiteList` modifier is used to restrict methods that only can call when claim with whitelist feature gate is open
  /// `noClaimed` modifier is used to restrict that each user can only free claim once, whether it is through the whitelist condition or the points condition, they can only free claim for free once
  /// `nonReentrant` modifier is used to restrict the current method from re-entering
  function claimWithWhiteList(
    uint256 whiteListId,
    bytes32[] calldata proof
  ) external enableClaimWithWhiteList noClaimed nonReentrant {
    require(
      _verifyWhiteList(whiteListId, proof, _msgSender()),
      "You are not in the white list"
    );
    claimed[_msgSender()] = true;

    _mint(_msgSender());
  }

  /// claim for free with points
  /// `enableClaimWithPoints` modifier is used to restrict methods that only can call when claim with points feature gate is open
  /// `noClaimed` modifier is used to restrict that each user can only free claim once, whether it is through the whitelist condition or the points condition, they can only free claim for free once
  /// `nonReentrant` modifier is used to restrict the current method from re-entering
  function claimWithPoints()
    external
    enableClaimWithPoints
    noClaimed
    nonReentrant
  {
    require(pointsToken != address(0), "Points token address is not set");

    uint256 points = IERC20(pointsToken).balanceOf(_msgSender());
    require(
      pointsCountCondi != 0 && points >= pointsCountCondi,
      "You don't have enough points"
    );
    claimed[_msgSender()] = true;

    _mint(_msgSender());
  }

  /// batch mint NFT, only minter can call, need to specify the receiving addresses, can be used for batch airdrop
  function batchMint(address[] calldata to) external onlyMinter {
    // this method is for migrating from SGN to SEED, so those addresses can't free claim again by whitelist and points
    for (uint256 i = 0; i < to.length; i++) {
      claimed[to[i]] = true;
    }

    _batchMint(to);
  }

  /// @dev direct buy NFT, support buy multiple NFTs at once
  /// `payable` modifier indicates that the current method can receive native token
  /// `enableMint` modifier is used to restrict methods that only can call when payed mint feature gate is open
  /// `nonReentrant` modifier is used to restrict the current method from re-entering
  function mint(uint256 amount) external payable enableMint nonReentrant {
    require(amount > 0, "Mint amount must bigger than zero");

    uint256 payValue = amount * price;
    require(price != 0 && msg.value >= payValue, "Insufficient payment");

    // refund the extra native token
    if (msg.value > payValue) {
      payable(_msgSender()).transfer(msg.value - payValue);
    }

    address[] memory to = new address[](amount);
    for (uint256 i = 0; i < amount; i++) {
      to[i] = _msgSender();
    }
    _batchMint(to);
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @dev verify whether an address is in the whitelist
  function _verifyWhiteList(
    uint256 whiteListId,
    bytes32[] calldata proof,
    address addr
  ) internal view returns (bool) {
    bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(addr))));
    return
      MerkleProofUpgradeable.verify(
        proof,
        whiteListRootHashes[whiteListId],
        leaf
      );
  }

  /// @dev mint NFT
  function _mint(address to) internal {
    ISeed(seed).mint(to);
  }

  /// @dev batch mint NFT
  function _batchMint(address[] memory to) internal {
    ISeed(seed).batchMint(to);
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @dev change minter address
  function changeMinter(address minter_) external onlyOwner {
    address oldMinter = minter;
    minter = minter_;
    emit MinterChanged(oldMinter, minter_);
  }

  /// @dev set points token contract address
  function setPointsTokenAddress(address pointsToken_) external onlyOwner {
    pointsToken = pointsToken_;
  }

  /// @dev set the points count condition for free claim NFT
  /// for example: if the condition is `50_000` points, then pass in the integer `50_000`
  function setPointsCountCondition(
    uint256 pointsCountCondi_
  ) external onlyOwner {
    require(pointsToken != address(0), "Points token address is not set");

    pointsCountCondi =
      pointsCountCondi_ *
      10 ** IERC20Metadata(pointsToken).decimals();
  }

  /// @dev set whitelist, need to pass in whitelist ID and Merkle Tree Root Hash when calling
  /// the whitelist has different batches, when adding a new whitelist, a new whitelist ID is required
  /// start from 0 !!
  function setWhiteList(
    uint256 whiteListId,
    bytes32 rootHash
  ) external onlyOwner {
    whiteListRootHashes[whiteListId] = rootHash;
  }

  /// @dev set NFT price, the decimals of the price is the same as the decimals of the chain native token
  function setPrice(uint256 price_) external onlyOwner {
    price = price_;
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @dev pause payed mint feature, after paused, can't mint new NFT
  function pauseMint() public onlyOwner {
    onMint = false;
    emit MintDisabled(_msgSender());
  }

  /// @dev unpause payed mint feature, after unpaused, can mint new NFT
  function unpauseMint() public onlyOwner {
    onMint = true;
    emit MintEnabled(_msgSender());
  }

  /// @dev pause free claim with whitelist feature, after paused, can't free claim new NFT with whitelist
  function pauseClaimWithWhiteList() public onlyOwner {
    onClaimWithWhiteList = false;
    emit ClaimWithWhiteListDisabled(_msgSender());
  }

  /// @dev unpause free claim with whitelist feature, after unpaused, can free claim new NFT with whitelist
  function unpauseClaimWithWhiteList() public onlyOwner {
    onClaimWithWhiteList = true;
    emit ClaimWithWhiteListEnabled(_msgSender());
  }

  /// @dev pause free claim with points feature, after paused, can't free claim new NFT with points
  function pauseClaimWithPoints() public onlyOwner {
    onClaimWithPoints = false;
    emit ClaimWithPointsDisabled(_msgSender());
  }

  /// @dev unpause free claim with points feature, after unpaused, can free claim new NFT with points
  function unpauseClaimWithPoints() public onlyOwner {
    onClaimWithPoints = true;
    emit ClaimWithPointsEnabled(_msgSender());
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @dev transfer `Seed` contract's ownership
  function transferSeedOwnership(address newOwner) external onlyOwner {
    ISeed(seed).transferOwnership(newOwner);
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  receive() external payable {}

  /// @dev transfer all native token balance of this contract to the owner address
  function withdraw() external onlyOwner {
    uint256 balance = address(this).balance;
    payable(owner()).transfer(balance);
  }
}
