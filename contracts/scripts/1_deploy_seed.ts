import { ethers } from "hardhat";
import deployed from "./deployed";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);

  // TODO WARNING: check me when deploying !!!
  const SCRAddress = deployed.getMockPointsContract();
  // TODO WARNING: check me when deploying !!!
  const baseURI = "ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD";

  console.log(`Deploying [Seed] with params (scr_: ${SCRAddress}) ...`);
  const seed = await ethers.deployContract("Seed", [SCRAddress]);
  await seed.waitForDeployment();

  deployed.setSeedContract(seed.target.toString());
  console.log(`[Seed] deployed to ${seed.target}`);

  console.log(`Calling [Seed]'s setBaseURI(baseURI_: ${baseURI}) ...`);
  await seed.setBaseURI(baseURI);
  console.log(`[Seed]'s setBaseURI(...) called`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
