import { ethers } from "hardhat";
import deployed from "./deployed";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);

  console.log("Deploying [MockPoints]...");

  const mockPoints = await ethers.deployContract("MockPoints");
  await mockPoints.waitForDeployment();

  deployed.setMockPointsContract(mockPoints.target.toString());
  console.log(`[MockPoints] deployed to ${mockPoints.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
