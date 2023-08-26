import { ethers } from "hardhat";
import deployed from "../deployed";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);

  const seedMinter = await ethers.getContractAt(
    "SeedMinter",
    deployed.getSeedMinterContract()
  );

  console.log(`Calling [SeedMinter]'s unpauseClaimWithWhitelist() ...`);
  let tx = await seedMinter.unpauseClaimWithWhitelist();
  await tx.wait();
  console.log(`[SeedMinter]'s unpauseClaimWithWhitelist() called`);

  console.log(`Calling [SeedMinter]'s unpauseClaimWithSCR() ...`);
  tx = await seedMinter.unpauseClaimWithSCR();
  await tx.wait();
  console.log(`[SeedMinter]'s unpauseClaimWithSCR() called`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
