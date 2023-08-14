import { ethers, upgrades } from "hardhat";
import deployed from "./deployed";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);

  console.log("Deploying [SeedManager]...");

  // TODO WARNING: check me when deploying !!!
  const seedContractAddress = deployed.getSeedContract();

  const SeedManager = await ethers.getContractFactory("SeedManager");
  const seedManager = await upgrades.deployProxy(SeedManager, [
    seedContractAddress,
  ]);
  await seedManager.waitForDeployment();

  deployed.setSeedManagerContract(seedManager.target.toString());
  console.log(`[SeedManager] deployed to ${seedManager.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
