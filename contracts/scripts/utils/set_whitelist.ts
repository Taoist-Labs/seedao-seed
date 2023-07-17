import { ethers, upgrades } from "hardhat";
import deployed from "../deployed";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

async function main() {
  const seeDAO = await ethers.getContractAt(
    "SeeDAO",
    deployed.contracts.SeeDAO
  );

  // 最新的白名单 id
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

  console.log(
    `Set withlist for SeeDAO contract at ${deployed.contracts.SeeDAO} ...`
  );

  const whitelistId = latestWhitelist; // NOTE: this should be the latest whitelist id
  const whitelist = [
    ["0x183F09C3cE99C02118c570e03808476b22d63191"],
    ["0xc1eE7cB74583D1509362467443C44f1FCa981283"],
  ]; // NOTE: this is your new whitelist
  const tree = StandardMerkleTree.of(whitelist, ["address"]);
  const rootHash = tree.root;
  // const leafProof = tree.getProof(whitelist[0]); // NOTE: use the first address as an example

  // set whitelist
  await seeDAO.setWhiteList(whitelistId, rootHash);

  console.log(
    `Set withlist with parameters (whitelistId=${whitelistId}, rootHash=${rootHash}) successsfully!`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
