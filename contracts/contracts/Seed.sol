// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract Seed is ERC721, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {
  using Strings for uint256;

  uint256 private tokenIndex;

  // max supply amount
  uint256 public maxSupply;

  // NFT URI base
  string public baseURI;
  // uri level range rules
  uint256[] public uriLevelRanges;
  // points token address
  address public pointsToken;

  // NFT minter address
  address public minter;

  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  event MinterChanged(address indexed oldMinter, address indexed newMinter);

  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @dev used to restrict methods that only minter address can call
  modifier onlyMinter() {
    require(_msgSender() == minter, "Only minter can call this method");
    _;
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  constructor(address pointsToken_) ERC721("SeeDAO Seed NFT", "SEED") {
    pointsToken = pointsToken_;

    // set default max supply
    maxSupply = 100_000;
    // set default minter
    minter = msg.sender;
    // set default uri level ranges
    uriLevelRanges.push(20_000);
    uriLevelRanges.push(300_000);
    uriLevelRanges.push(3_000_000);
    uriLevelRanges.push(30_000_000);

    // pause contract default
    pause();
  }

  /// @dev mint NFT method
  function mint(address to) public onlyMinter {
    require(tokenIndex < maxSupply, "Exceeds the maximum supply");

    _safeMint(to, tokenIndex);
    tokenIndex += 1;
  }

  /// @dev batch mint NFT method
  function batchMint(address[] calldata to) public onlyMinter {
    require(tokenIndex + to.length < maxSupply, "Exceeds the maximum supply");

    for (uint i = 0; i < to.length; i++) {
      _safeMint(to[i], tokenIndex);
      tokenIndex += 1;
    }
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @dev change minter address
  function changeMinter(address minter_) external onlyOwner {
    address oldMinter = minter;
    minter = minter_;
    emit MinterChanged(oldMinter, minter_);
  }

  /// @dev set max supply
  function setMaxSupply(uint256 maxSupply_) external onlyOwner {
    maxSupply = maxSupply_;
  }

  /// @dev set NFT URI base
  /// e.g：ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD
  function setBaseURI(string memory baseURI_) public onlyOwner {
    baseURI = baseURI_;
  }

  /// @dev set URI level range rules
  /// URI format：ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD/{tokenID}_{level}.json
  //
  /// for example：
  /// level1: < 20_000
  /// level2: >=20_000 && < 300_000
  /// level3: >=300_000 && < 3_000_000
  /// level4: >=3_000_000 && < 30_000_000
  /// level5: >=30_000_000
  /// for this example, the input param is：[20_000, 300_000, 3_000_000, 30_000_000]
  function setURILevelRange(
    uint256[] calldata uriLevelRanges_
  ) external onlyOwner {
    uriLevelRanges = uriLevelRanges_;
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  /// @dev get NFT URI, the method will return different NFT URI according to the the `tokenId` owner's amount of points, so as to realize Dynamic NFT
  /// e.g：
  /// ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD/1_1.json
  /// ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD/1_2.json
  /// ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD/404.json
  function tokenURI(
    uint256 tokenId
  ) public view override returns (string memory) {
    _requireMinted(tokenId);

    if (paused()) {
      // ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD/404.json
      return string(abi.encodePacked(baseURI, "/404.json"));
    } else {
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
    }
  }

  /// @dev get level by owner's points amount
  function _parseLevel(uint256 tokenId) internal view returns (uint256) {
    uint256 de = 10 ** IERC20Metadata(pointsToken).decimals();
    uint256 points = IERC20(pointsToken).balanceOf(ownerOf(tokenId));

    for (uint i = 0; i < uriLevelRanges.length; i++) {
      if (points < uriLevelRanges[i] * de) {
        return i + 1;
      }
    }
    return uriLevelRanges.length + 1;
  }

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override(ERC721, ERC721Enumerable) {
    // don't use `whenNotPaused` modifier, because minter can mint even contract is paused
    if (paused()) {
      require(from == address(0) && msg.sender == minter, "");
    }

    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }

  // The following functions are overrides required by Solidity.

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
