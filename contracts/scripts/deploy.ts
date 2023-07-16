import { ethers, upgrades } from "hardhat";
import deployed from "./deployed";

async function main() {
  console.log("Deploying SeeDAO...");

  const SeeDAO = await ethers.getContractFactory("SeeDAO");
  const seeDAO = await upgrades.deployProxy(SeeDAO);
  await seeDAO.waitForDeployment();

  deployed.setContract("SeeDAO", seeDAO.target.toString());
  console.log(`SeeDAO deployed to ${seeDAO.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
