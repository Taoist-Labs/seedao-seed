import { ethers, upgrades } from "hardhat";
import deployed from "./deployed";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);

  // TODO WARNING: check me when deploying !!!
  const seedContractAddress = deployed.getSeedContract();
  // TODO WARNING: check me when deploying !!!
  const SCRAddress = deployed.getMockPointsContract();
  // TODO WARNING: check me when deploying !!!
  const SCRAmountCondi = ethers.getBigInt(5_000);

  // deploy SeedMinter contract
  console.log(
    `Deploying [SeedMinter] with params (seed_: ${seedContractAddress}, scr_: ${SCRAddress}, scrAmountCondi_: ${SCRAmountCondi}) ...`
  );
  const SeedMinter = await ethers.getContractFactory("SeedMinter");
  const seedMinter = await upgrades.deployProxy(SeedMinter, [
    seedContractAddress,
    SCRAddress,
    SCRAmountCondi,
  ]);
  await seedMinter.waitForDeployment();

  deployed.setSeedMinterContract(seedMinter.target.toString());
  console.log(`[SeedMinter] deployed to ${seedMinter.target}`);

  // transfer Seed's ownership to SeedMinter contract
  console.log(
    `Transfer [Seed]'s ownership to [SeedMinter]@${seedMinter.target} ...`
  );
  const seed = await ethers.getContractAt("Seed", deployed.getSeedContract());
  await seed.transferOwnership(seedMinter.target.toString());
  console.log("[Seed]'s ownership transferred");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
