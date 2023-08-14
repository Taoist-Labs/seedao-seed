import { ethers, upgrades } from "hardhat";
import deployed from "./deployed";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);

  // TODO WARNING: check me when deploying !!!
  const seedContractAddress = deployed.getSeedContract();

  // deploy SeedManager contract
  console.log(
    `Deploying [SeedManager] with params (${seedContractAddress}) ...`
  );
  const SeedManager = await ethers.getContractFactory("SeedManager");
  const seedManager = await upgrades.deployProxy(SeedManager, [
    seedContractAddress,
  ]);
  await seedManager.waitForDeployment();

  deployed.setSeedManagerContract(seedManager.target.toString());
  console.log(`[SeedManager] deployed to ${seedManager.target}`);

  // change Seed's minter to SeedManager contract
  console.log(
    `Changing [Seed]'s minter to [SeedManager]@${seedManager.target} ...`
  );
  const seed = await ethers.getContractAt("Seed", deployed.getSeedContract());
  await seed.changeMinter(seedManager.target.toString());
  console.log("[Seed]'s minter changed");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
