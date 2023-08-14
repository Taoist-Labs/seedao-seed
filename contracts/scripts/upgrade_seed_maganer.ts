import { ethers, upgrades } from "hardhat";
import deployed from "./deployed";

async function main() {
  console.log("Upgrading [SeedManager]...");

  const SeedManager = await ethers.getContractFactory("SeedManager");
  const seedManager = await upgrades.upgradeProxy(
    deployed.getSeedManagerContract(),
    SeedManager
  );
  await seedManager.waitForDeployment();

  console.log("[SeedManager] upgraded");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
