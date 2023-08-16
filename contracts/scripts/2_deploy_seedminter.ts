import { ethers, upgrades } from "hardhat";
import deployed from "./deployed";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);

  // TODO WARNING: check me when deploying !!!
  const seedContractAddress = deployed.getSeedContract();
  // TODO WARNING: check me when deploying !!!
  const pointsTokenAddress = deployed.getMockPointsContract();
  // TODO WARNING: check me when deploying !!!
  const pointsCountCondi_ = ethers.getBigInt(5_000);

  // deploy SeedManager contract
  console.log(
    `Deploying [SeedManager] with params (${seedContractAddress}) ...`
  );
  const SeedManager = await ethers.getContractFactory("SeedManager");
  const seedManager = await upgrades.deployProxy(SeedManager, [
    seedContractAddress,
    pointsTokenAddress,
    pointsCountCondi_,
  ]);
  await seedManager.waitForDeployment();

  deployed.setSeedMinterContract(seedManager.target.toString());
  console.log(`[SeedManager] deployed to ${seedManager.target}`);

  // transfer Seed's owner to SeedManager contract
  console.log(
    `Transfer [Seed]'s owner to [SeedManager]@${seedManager.target} ...`
  );
  const seed = await ethers.getContractAt("Seed", deployed.getSeedContract());
  await seed.transferOwnership(seedManager.target.toString());
  console.log("[Seed]'s owner transferred");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
