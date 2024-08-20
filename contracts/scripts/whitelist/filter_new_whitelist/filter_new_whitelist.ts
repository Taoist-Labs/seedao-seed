import { ethers } from "hardhat";
import fs from "fs";

interface Snapshot {
  wallet: string;
  value: string;
}

async function main() {
  const seedAddr = "0x30093266E34a816a53e302bE3e59a93B52792FD4";

  const scrAddr = "0xE4825A1a31a76f72befa47f7160B132AA03813E0";
  const scrAmountCondition: bigint = 100_000n;

  const seed = await ethers.getContractAt("Seed", seedAddr);

  const timestamp = Math.floor(Date.now() / 1000);
  const snapshots: Snapshot[] = await (
    await fetch(
      `https://spp-indexer.seedao.tech/snapshot/erc20/${scrAddr}/${timestamp}`
    )
  ).json();

  const total = snapshots.length;
  let i = 0;
  for (const snapshot of snapshots) {
    i++;

    const scrAmount = BigInt(parseInt(snapshot.value));
    console.log(
      `[${i}/${total}]: wallet: ${snapshot.wallet} | SCR: ${scrAmount}`
    );

    // SCR amount >= 1000n and wallet has not mint any SEED
    if (scrAmount >= scrAmountCondition) {
      const events = await seed.queryFilter(
        seed.filters.Transfer(ethers.ZeroAddress, snapshot.wallet)
      );

      if (events.length == 0) {
        console.log(`    ✅ wallet: ${snapshot.wallet} | SCR: ${scrAmount}`);

        // write to output.json file
        fs.writeFileSync(
          "scripts/whitelist/filter_new_whitelist/new_whitelist.txt",
          `${snapshot.wallet}\n`,
          {
            flag: "a",
          }
        );
      } else {
        console.log(
          `    ❌ wallet: ${snapshot.wallet} | SCR: ${scrAmount} | SEED TXs: https://etherscan.io/token/0x30093266E34a816a53e302bE3e59a93B52792FD4?a=${snapshot.wallet}`
        );
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
