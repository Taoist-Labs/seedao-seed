import { ethers, upgrades } from "hardhat";
import deployed from "./deployed";

async function main() {
  console.log("Upgrading SeeDAO...");

  const SeeDAO = await ethers.getContractFactory("SeeDAO");
  const seeDAO = await upgrades.upgradeProxy(deployed.contracts.SeeDAO, SeeDAO);
  await seeDAO.waitForDeployment();

  console.log("SeeDAO upgraded");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
