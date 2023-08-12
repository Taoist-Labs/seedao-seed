import { ethers } from "hardhat";
import deployed from "../deployed";

async function main() {
  const seeDAOAddress = deployed.getSeeDAOContract();
  const seeDAO = await ethers.getContractAt("SeeDAO", seeDAOAddress);

  // 1. get latest whitelist id
  let latestWhitelist = 0;
  for (let i = 0; i < 200; i++) {
    const rootHash = await seeDAO.whiteListRootHashes(i);
    if (rootHash == "") {
      latestWhitelist = i;
      break;
    }
  }
  latestWhitelist = latestWhitelist > 0 ? latestWhitelist - 1 : 0;
  console.log(`Latest whitelist id is ${latestWhitelist}`);

  // 2. fill merkletree root hash
  const rootHash = "_MUST_FILL_ME_"; // NOTE: this is your new root hash

  console.log(`Set whitelist for SeeDAO contract at ${seeDAOAddress} ...`);

  // 3. call contract method
  await seeDAO.setWhiteList(latestWhitelist, rootHash);

  console.log(
    `Set whitelist with parameters (whitelistId=${latestWhitelist}, rootHash=${rootHash}) successfully!`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
