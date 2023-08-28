import { ethers } from "hardhat";
import deployed from "../deployed";
import { readAddresses } from "./helper";
import fs from "fs";
import * as readline from "node:readline/promises";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);
  console.log("Miner contract: ", deployed.getSeedMinterContract());

  const seedMinter = await ethers.getContractAt(
    "SeedMinter",
    deployed.getSeedMinterContract()
  );

  // -----  -----  -----  -----  -----  -----  -----  -----

  const batchSize = 200;
  const addresses: string[][] = readAddresses(
    "scripts/operation/001_airdrop_addresses.txt",
    batchSize
  );

  console.log(
    `All batch index is [${Array.from(Array(addresses.length).keys())}]`
  );

  // -----  -----  -----  -----  -----  -----  -----  -----

  const batchIndexFile = "scripts/operation/001_airdrop_batchIndex.txt";
  // read batchIndex from `batchIndexFile`
  let batchIndex = Number(fs.readFileSync(batchIndexFile, "utf-8").trim());

  // -----  -----  -----  -----  -----  -----  -----  -----

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(
    `Current batch index is [${batchIndex}], do you want to continue? (y/n) `
  );

  if (answer.toLowerCase() === "y") {
    console.log(`Continue with batch index [${batchIndex}]`);
  } else {
    console.log(`Exit`);
    process.exit(0);
  }

  rl.close();

  // -----  -----  -----  -----  -----  -----  -----  -----

  for (let i = 0; i < addresses.length; i++) {
    if (i < batchIndex) {
      console.log(`Batch index [${i}] skipped`);
      continue;
    }

    for (const add of addresses[i]) {
      console.log(`address: ${add}`);
    }
    console.log(`------------------------`);

    const tx = await seedMinter.airdrop(addresses[i]);
    await tx.wait();
    console.log(`Batch index [${i}] executed, tx: ${tx.hash}`);
    // console.log(`Batch index [${i}] executed`);

    // update batchIndex at `batchIndexFile`
    batchIndex++;
    fs.writeFileSync(batchIndexFile, batchIndex.toString(), { flag: "w" });
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
