// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface ISeed {
  function totalSupply() external returns (uint256);

  function mint(address to, uint256 tokenId) external;

  function transferOwnership(address newOwner) external;
}
