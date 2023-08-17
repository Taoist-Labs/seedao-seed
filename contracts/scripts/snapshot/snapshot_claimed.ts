import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  // https://etherscan.io/address/0x23fDA8a873e9E46Dbe51c78754dddccFbC41CFE1#readContract
  const seeDAO = await ethers.getContractAt(
    "Seed",
    "0x23fDA8a873e9E46Dbe51c78754dddccFbC41CFE1"
  );

  const outputFile = "scripts/snapshot/output/snapshot_claimed.md";

  // write to markdown file
  fs.writeFileSync(outputFile, "| Token ID | To  |\n|----------|-------|\n", {
    flag: "w",
  });

  seeDAO.queryFilter(seeDAO.getEvent("Transfer"), 13732627).then((logs) => {
    logs.forEach((log) => {
      console.log(
        `from: ${log.args[0]}, to: ${log.args[1]}, tokenId: ${log.args[2]}`
      );

      // write to markdown file
      if (log.args[0] == ethers.ZeroAddress) {
        fs.writeFileSync(outputFile, `| ${log.args[2]} | ${log.args[1]} |\n`, {
          flag: "a+",
        });
      }
    });
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
