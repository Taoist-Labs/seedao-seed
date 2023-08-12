import { ethers } from "hardhat";
import deployed from "../deployed";

async function main() {
  const seeDAOAddress = deployed.getSeeDAOContract();
  const seeDAO = await ethers.getContractAt("SeeDAO", seeDAOAddress);

  // !! Max 200 addresses is allowed to batch mint
  const tx = await seeDAO.batchMint([
    "0x332345477Db00239f88CA2Eb015B159750Cf3C44",
    "0xa76A36765c8Af45Affec2b5De2ABfC33aDC1488a",
    "0x79eeD13cf2d1530E36D07b9A96C17AB795302a54",
  ]);
  console.log(
    `Call batchMint() to SeeDAO[${seeDAOAddress}] at Tx[${tx.hash}] successfully!`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
