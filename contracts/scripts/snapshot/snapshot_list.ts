import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  // https://etherscan.io/address/0x23fDA8a873e9E46Dbe51c78754dddccFbC41CFE1#readContract
  const seeDAO = await ethers.getContractAt(
    "Seed",
    "0x23fDA8a873e9E46Dbe51c78754dddccFbC41CFE1"
  );

  const outputFile = "scripts/snapshot/output/snapshot_list.md";

  // write to markdown file
  fs.writeFileSync(outputFile, "| Token ID | Owner |\n|----------|-------|\n", {
    flag: "w",
  });

  const totalSupply = await seeDAO.totalSupply();
  // console.log(`totalSupply: ${totalSupply}\n`);
  for (let i = 0; i < totalSupply; i++) {
    const tokenId = await seeDAO.tokenByIndex(i);
    const owner = await seeDAO.ownerOf(tokenId);

    console.log(`tokenId: ${tokenId}, owner: ${owner}`);

    // write to markdown file
    fs.writeFileSync(outputFile, `| ${tokenId} | ${owner} |\n`, {
      flag: "a+",
    });
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
