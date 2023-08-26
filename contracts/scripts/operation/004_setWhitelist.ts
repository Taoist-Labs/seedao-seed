import { ethers } from "hardhat";
import deployed from "../deployed";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);

  const seedMinter = await ethers.getContractAt(
    "SeedMinter",
    deployed.getSeedMinterContract()
  );

  // TODO WARNING: check me when deploying !!!
  const whitelistId = ethers.getBigInt(0);
  // TODO WARNING: check me when deploying !!!
  const merkleTreeRootHash =
    "0x28fc29df7b418dbf0a00ddaa38bc3f6a764a4019b32f8856f49fdb9c0cf7c472";

  console.log(
    `Calling [SeedMinter]'s setWhitelist(whitelistId: ${whitelistId}, rootHash: ${merkleTreeRootHash}) ...`
  );
  const tx = await seedMinter.setWhitelist(whitelistId, merkleTreeRootHash);
  await tx.wait();
  console.log(`[SeedMinter]'s setWhitelist(...) called`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
