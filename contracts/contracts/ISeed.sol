// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface ISeed {
  function mint(address to) external;

  function batchMint(address[] calldata to) external;
}
