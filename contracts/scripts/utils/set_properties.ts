import { ethers } from "hardhat";
import deployed from "../deployed";

async function main() {
  const seeDAOAddress = deployed.getSeeDAOContract();
  const seeDAO = await ethers.getContractAt("SeeDAO", seeDAOAddress);

  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  const minter = "0xc1eE7cB74583D1509362467443C44f1FCa981283";
  await seeDAO.changeMinter(minter);
  console.log(
    `Call changeMinter() with parameter (minter=${minter}) to SeeDAO contract at ${seeDAOAddress} successfully!`
  );

  const pointsTokenAddress = "0x77dea9602D6768889819B24D6f5deB7e3362B496";
  await seeDAO.setPointsTokenAddress(pointsTokenAddress);
  console.log(
    `Call setPointsTokenAddress() with parameter (pointsTokenAddress=${pointsTokenAddress}) to SeeDAO contract at ${seeDAOAddress} successfully!`
  );

  const pointsCondition = ethers.getBigInt(50_000);
  await seeDAO.setPointsCondition(pointsCondition);
  console.log(
    `Call setPointsCondition() with parameter (pointsCondition=${pointsCondition}) to SeeDAO contract at ${seeDAOAddress} successfully!`
  );

  const price = ethers.parseEther("0.8");
  await seeDAO.setPrice(price);
  console.log(
    `Call setPrice() with parameter (price=${price}) to SeeDAO contract at ${seeDAOAddress} successfully!`
  );

  const maxSupply = ethers.getBigInt(10_000);
  await seeDAO.setMaxSupply(maxSupply);
  console.log(
    `Call setMaxSupply() with parameter (maxSupply=${maxSupply}) to SeeDAO contract at ${seeDAOAddress} successfully!`
  );

  const baseURI = "ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD";
  await seeDAO.setBaseURI(baseURI);
  console.log(
    `Call setBaseURI() with parameter (baseURI=${baseURI}) to SeeDAO contract at ${seeDAOAddress} successfully!`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
