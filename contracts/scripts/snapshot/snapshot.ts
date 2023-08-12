import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  // https://etherscan.io/address/0x23fDA8a873e9E46Dbe51c78754dddccFbC41CFE1#readContract
  const seeDAO = await ethers.getContractAt(
    "SeeDAO",
    "0x23fDA8a873e9E46Dbe51c78754dddccFbC41CFE1"
  );

  const totalSupply = await seeDAO.totalSupply();
  console.log(`totalSupply: ${totalSupply}`);

  // // write to markdown file
  // fs.writeFileSync(
  //   "scripts/snapshot/snapshot.md",
  //   "| Token ID | Owner |\n|----------|-------|\n",
  //   { flag: "a+" }
  // );

  for (let i = 0; i < totalSupply; i++) {
    const tokenId = await seeDAO.tokenByIndex(i);
    const owner = await seeDAO.ownerOf(tokenId);

    console.log(`${tokenId}: ${owner}`);

    // // write to markdown file
    // fs.writeFileSync(
    //   "scripts/snapshot/snapshot.md",
    //   `| ${tokenId} | ${owner} |\n`,
    //   {
    //     flag: "a+",
    //   }
    // );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// ------ ------ ------ ------ ------ ------ ------ ------ ------
// ------ ------ ------ ------ ------ ------ ------ ------ ------

// Run command:
// ```
// $ npx hardhat run --network mainnet scripts/snapshot/snapshot.ts
// ```

// Output:
//
// ```
// totalSupply: 524
// 0: 0x0fEcef59947fa6401FeA1ba10b3aa173dAbe2412
// 1: 0x332345477Db00239f88CA2Eb015B159750Cf3C44
// 2: 0xa76A36765c8Af45Affec2b5De2ABfC33aDC1488a
// 3: 0x79eeD13cf2d1530E36D07b9A96C17AB795302a54
// 4: 0x78f625A65Fc316D32d98d249b698fb509A6d98f2
// 5: 0xBfd8cba6a1E10e1Ab4Fa11A0062F4e52e13D260f
// 6: 0xBfd8cba6a1E10e1Ab4Fa11A0062F4e52e13D260f
// ...
// ```
