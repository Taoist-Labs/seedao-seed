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
    // in order to get unique `to` address, use `Set` to deduplicate
    const toAddressSet = new Set<string>();

    logs.forEach((log) => {
      console.log(
        `from: ${log.args[0]}, to: ${log.args[1]}, tokenId: ${log.args[2]}`
      );

      // 1. `from` address is zero address means the operation is mint not transfer
      // 2. in order to get unique `to` address, use `Set` to deduplicate
      if (log.args[0] == ethers.ZeroAddress && !toAddressSet.has(log.args[1].toLowerCase())) {
        toAddressSet.add(log.args[1].toLowerCase());

        // write to markdown file
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
