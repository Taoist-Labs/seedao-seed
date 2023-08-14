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

contract SeedManager is
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
  // claim once whenever the claim method is whitelist or points
  mapping(address => bool) public claimed;

  // flag of mint feature gate
  bool public onMint;
  // flag of claim with white list feature gate
  bool public onClaimWithWhiteList;
  // flag of claim with points feature gate
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

  /// @dev 用于限制只有 minter 地址才能调用的方法
  modifier onlyMinter() {
    require(_msgSender() == minter, "Only minter can call this method");
    _;
  }

  /// @dev 限制每个用户只能领取一次，无论是通过白名单条件还是通过积分条件都只能免费领取一次
  modifier noClaimed() {
    require(!claimed[_msgSender()], "You have claimed");
    _;
  }

  /// @dev 用于限制只有合约开启 mint 功能时才能调用的方法
  modifier enableMint() {
    require(onMint, "Mint is not open");
    _;
  }

  /// @dev 用于限制只有合约开启使用白名单 claim 功能时才能调用的方法
  modifier enableClaimWithWhiteList() {
    require(onClaimWithWhiteList, "Claim with white list is not open");
    _;
  }

  /// @dev 用于限制只有合约开启使用积分 claim 功能时才能调用的方法
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

  function initialize(address seed_) public initializer {
    seed = seed_;

    // set default minter
    minter = msg.sender;
    // `onMint` is disabled by default
    // `onClaimWithWhiteList` is disabled by default
    // `onClaimWithPoints` is disabled by default

    __Ownable_init();
    __ReentrancyGuard_init();
  }

  /// @dev 白名单用户免费领取，调用时需要指定白名单 ID 和 Merkle Proof
  /// enableClaimWithWhiteList 修饰器用于限制只有合约开启 claim 功能时才能调用当前方法
  /// noClaimed 修饰器用于限制每个用户只能领取一次，无论是通过白名单还是通过积分都只能免费领取一次
  /// nonReentrant 修饰器用于限制当前方法不能重入
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

  /// @dev 使用积分数量免费 claim
  /// enableClaimWithPoints 修饰器用于限制只有合约开启 claim 功能时才能调用当前方法
  /// noClaimed 修饰器用于限制每个用户只能领取一次，无论是通过白名单还是通过积分都只能免费领取一次
  /// nonReentrant 修饰器用于限制当前方法不能重入
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

  /// @dev 批量 mint NFT，必须是 minter 才能调用，调用时需要指定接收地址，可用于批量空投
  function batchMint(address[] calldata to) external onlyMinter {
    _batchMint(to);
  }

  /// @dev 直接购买 NFT，支持一次购买多个
  /// payable 修饰器说明当前方法可以接收 native token
  /// enableMint 修饰器用于限制只有合约开启 mint 功能时才能调用当前方法
  /// nonReentrant 修饰器用于限制当前方法不能重入
  function mint(uint256 amount) external payable enableMint nonReentrant {
    require(amount > 0, "Mint amount must bigger than zero");

    uint256 payValue = amount * price;
    require(price != 0 && msg.value >= payValue, "Insufficient payment");

    // 退回多余的 native token
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

  /// @dev 验证某个地址是否在白名单中
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

  /// @dev 修改 minter 地址，minter 具有 mint 权限
  function changeMinter(address minter_) external onlyOwner {
    address oldMinter = minter;
    minter = minter_;
    emit MinterChanged(oldMinter, minter_);
  }

  /// @dev 设置积分 ERC20 token 合约地址
  function setPointsTokenAddress(address pointsToken_) external onlyOwner {
    pointsToken = pointsToken_;
  }

  /// @dev 设置积分兑换 NFT 的积分数量条件
  /// 如：条件是需要 50_000 积分就传入整数 50_000
  function setPointsCountCondition(
    uint256 pointsCountCondi_
  ) external onlyOwner {
    require(pointsToken != address(0), "Points token address is not set");

    pointsCountCondi =
      pointsCountCondi_ *
      10 ** IERC20Metadata(pointsToken).decimals();
  }

  /// @dev 设置白名单的，调用时需要传入白名单 ID 和 Merkle Tree Root Hash
  /// 白名单分不同的批次，需要新增白名单时，需要使用新的白名单 ID
  function setWhiteList(
    uint256 whiteListId,
    bytes32 rootHash
  ) external onlyOwner {
    whiteListRootHashes[whiteListId] = rootHash;
  }

  /// @dev 设置 NFT 价格，价格的精度与链 native token 的精度相同
  function setPrice(uint256 price_) external onlyOwner {
    price = price_;
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @dev 暂停 mint 功能，暂停后无法再 mint 新的 NFT
  function pauseMint() public onlyOwner {
    onMint = false;
    emit MintDisabled(_msgSender());
  }

  /// @dev 取消暂停 mint 功能，取消暂停后，可以继续 mint 新的 NFT
  function unpauseMint() public onlyOwner {
    onMint = true;
    emit MintEnabled(_msgSender());
  }

  /// @dev 暂停使用白名单 claim 功能，暂停后无法再使用白名单 claim 新的 NFT
  function pauseClaimWithWhiteList() public onlyOwner {
    onClaimWithWhiteList = false;
    emit ClaimWithWhiteListDisabled(_msgSender());
  }

  /// @dev 取消暂停使用白名单 claim 功能，取消暂停后，可以继续使用白名单 claim 新的 NFT
  function unpauseClaimWithWhiteList() public onlyOwner {
    onClaimWithWhiteList = true;
    emit ClaimWithWhiteListEnabled(_msgSender());
  }

  /// @dev 暂停使用积分 claim 功能，暂停后无法再使用积分 claim 新的 NFT
  function pauseClaimWithPoints() public onlyOwner {
    onClaimWithPoints = false;
    emit ClaimWithPointsDisabled(_msgSender());
  }

  /// @dev 取消暂停使用积分 claim 功能，取消暂停后，可以继续使用积分 claim 新的 NFT
  function unpauseClaimWithPoints() public onlyOwner {
    onClaimWithPoints = true;
    emit ClaimWithPointsEnabled(_msgSender());
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  receive() external payable {}

  /// @dev 将合约 native token 余额全都提取到 owner 地址
  function withdraw() external onlyOwner {
    uint256 balance = address(this).balance;
    payable(owner()).transfer(balance);
  }
}
