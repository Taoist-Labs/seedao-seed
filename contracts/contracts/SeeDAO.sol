// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

contract SeeDAO is
  Initializable,
  ReentrancyGuardUpgradeable,
  ERC721Upgradeable,
  ERC721EnumerableUpgradeable,
  PausableUpgradeable,
  OwnableUpgradeable,
  ERC721BurnableUpgradeable
{
  using SafeMathUpgradeable for uint256;
  using StringsUpgradeable for uint256;

  uint256 public tokenIndex;

  uint256 public price;
  uint256 public maxSupply;

  string public baseURI;
  uint256[] public uriLevelRanges;

  address public pointsToken;
  uint256 public pointsCondi;

  bool public onMint;
  bool public onClaimWithWhiteList;
  bool public onClaimWithPoints;

  mapping(uint256 => bytes32) public whiteListRootHashes;
  uint256[] public whiteListIds;
  mapping(address => bool) public claimed;

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
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize() public initializer {
    // set default max supply
    maxSupply = 100_000;
    // set default minter
    minter = msg.sender;
    // set default uri level ranges
    uriLevelRanges.push(20_000);
    uriLevelRanges.push(300_000);
    uriLevelRanges.push(3_000_000);
    uriLevelRanges.push(30_000_000);

    __ERC721_init("SeeDAO Seed NFT", "SEED");
    __ERC721Enumerable_init();
    __Pausable_init();
    __Ownable_init();
    __ERC721Burnable_init();
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
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

  /// @dev 有5万积分用户免费领取，调用者必须有5w积分
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

    uint256 points = IERC20Upgradeable(pointsToken).balanceOf(_msgSender());
    require(
      pointsCondi != 0 && points >= pointsCondi,
      "You don't have enough points"
    );
    claimed[_msgSender()] = true;

    _mint(_msgSender());
  }

  /// @dev 批量 mint NFT，必须是 minter 才能调用，调用时需要指定接收地址，可用于批量空投
  function batchMint(address[] calldata addresses) external onlyMinter {
    require(
      tokenIndex + addresses.length <= maxSupply,
      "Exceeds the maximum supply"
    );

    for (uint256 i = 0; i < addresses.length; i++) {
      _mint(addresses[i]);
    }
  }

  /// @dev 直接购买 NFT，支持一次购买多个
  /// payable 修饰器说明当前方法可以接收 native token
  /// enableMint 修饰器用于限制只有合约开启 mint 功能时才能调用当前方法
  /// nonReentrant 修饰器用于限制当前方法不能重入
  function mint(uint256 amount) external payable enableMint nonReentrant {
    require(amount > 0, "Mint amount must bigger than zero");
    require(tokenIndex + amount <= maxSupply, "Exceeds the maximum supply");

    uint256 payValue = amount.mul(price);
    require(price != 0 && msg.value >= payValue, "Insufficient payment");

    for (uint256 i = 0; i < amount; i++) {
      _mint(_msgSender());
    }
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
    require(tokenIndex < maxSupply, "Exceeds the maximum supply");

    uint256 tokenId = tokenIndex;
    tokenIndex += 1;
    _safeMint(to, tokenId);
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
  function setPointsCondition(uint256 pointsCondi_) external onlyOwner {
    require(pointsToken != address(0), "Points token address is not set");

    pointsCondi = pointsCondi_.mul(
      10 ** IERC20MetadataUpgradeable(pointsToken).decimals()
    );
  }

  /// @dev 设置白名单的，调用时需要传入白名单 ID 和 Merkle Tree Root Hash
  /// 白名单分不同的批次，需要新增白名单时，需要使用新的白名单 ID
  function setWhiteList(
    uint256 whiteListId,
    bytes32 rootHash
  ) external onlyOwner {
    whiteListRootHashes[whiteListId] = rootHash;
    whiteListIds.push(whiteListId);
  }

  /// @dev 设置 NFT 价格，价格的精度与链 native token 的精度相同
  function setPrice(uint256 price_) external onlyOwner {
    price = price_;
  }

  /// @dev 设置 NFT 最大供应量
  function setMaxSupply(uint256 maxSupply_) external onlyOwner {
    maxSupply = maxSupply_;
  }

  /// @dev 设置 NFT URI 的等级范围
  /// URI 的格式：ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD/{tokenID}_{level}.json
  /// 例如：
  /// level1: < 20_000
  /// level2: >=20_000 && < 300_000
  /// level3: >=300_000 && < 3_000_000
  /// level4: >=3_000_000 && < 30_000_000
  /// level5: >=30_000_000
  /// 则传入的参数为：[20_000, 300_000, 3_000_000, 30_000_000]
  function setURILevelRange(
    uint256[] calldata uriLevelRanges_
  ) external onlyOwner {
    uriLevelRanges = uriLevelRanges_;
  }

  /// @dev 设置 NFT URI 的基础部分
  /// 如：ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD
  function setBaseURI(string memory baseURI_) public onlyOwner {
    baseURI = baseURI_;
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @dev 获取 NFT URI，方法内部会根据 `tokenId` 拥有者地址拥有的积分数量或其他 Token、NFT 的不同而返回不同的 NFT URI，从而实现实现 Dynamic NFT
  /// 如：
  /// ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD/1_1.json
  /// ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD/1_2.json
  /// ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD/404.json
  function tokenURI(
    uint256 tokenId
  ) public view override returns (string memory) {
    _requireMinted(tokenId);

    if (onMint) {
      uint256 level = _parseLevel(tokenId);

      // ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD/1_1.json
      return
        string(
          abi.encodePacked(
            baseURI,
            "/",
            tokenId.toString(),
            "_",
            level.toString(),
            ".json"
          )
        );
    } else {
      // ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD/404.json
      return string(abi.encodePacked(baseURI, "/404.json"));
    }
  }

  /// @dev get level by owner's points amount
  function _parseLevel(uint256 tokenId) internal view returns (uint256) {
    uint256 de = 10 ** IERC20MetadataUpgradeable(pointsToken).decimals();
    uint256 points = IERC20Upgradeable(pointsToken).balanceOf(ownerOf(tokenId));

    for (uint i = 0; i < uriLevelRanges.length; i++) {
      if (points < uriLevelRanges[i] * de) {
        return i + 1;
      }
    }
    return uriLevelRanges.length + 1;
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

  /// @dev 暂停合约，暂停后无法再 mint、claim 和 transfer NFT
  function pause() public onlyOwner {
    _pause();
  }

  /// @dev 取消暂停合约，取消暂停后，可以继续 mint、claim 和 transfer NFT
  function unpause() public onlyOwner {
    _unpause();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  )
    internal
    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    whenNotPaused
  {
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  receive() external payable {}

  /// @dev 将合约 native token 余额全都提取到 owner 地址
  function withdraw() external onlyOwner {
    uint256 balance = address(this).balance;
    payable(owner()).transfer(balance);
  }

  // The following functions are overrides required by Solidity.

  function supportsInterface(
    bytes4 interfaceId
  )
    public
    view
    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
