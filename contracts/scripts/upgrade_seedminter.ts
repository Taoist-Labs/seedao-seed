import { ethers, upgrades } from "hardhat";
import deployed from "./deployed";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);

  console.log("Upgrading [SeedMinter]...");

  const SeedMinter = await ethers.getContractFactory("SeedMinter");
  const seedMinter = await upgrades.upgradeProxy(
    deployed.getSeedMinterContract(),
    SeedMinter
  );
  await seedMinter.waitForDeployment();

  console.log("[SeedMinter] upgraded");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
