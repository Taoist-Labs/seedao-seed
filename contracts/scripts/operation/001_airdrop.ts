import { ethers } from "hardhat";
import deployed from "../deployed";
import { readAddresses } from "./helper";
async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);

  const seedMinter = await ethers.getContractAt(
    "SeedMinter",
    deployed.getSeedMinterContract()
  );

  const addresses = readAddresses(
    "scripts/operation/001_airdrop_addresses.txt",
    200
  );

  console.log(`Calling [SeedMinter]'s airdrop(...) ...`);
  for (const address of addresses) {
    // for (const add of address) {
    //   console.log(`address: ${add}`);
    // }
    // console.log(`------------------------`);

    const tx = await seedMinter.airdrop(address);
    await tx.wait();
    console.log(`airdrop(...) called, tx: ${tx.hash}`);
  }
  console.log(`Calling [SeedMinter]'s airdrop(...) done`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
