import { ethers, upgrades } from "hardhat";
import deployed from "../deployed";

async function main() {
  const seeDAOAddress = deployed.getSeeDAOContract();
  const seeDAO = await ethers.getContractAt("SeeDAO", seeDAOAddress);

  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  await seeDAO.pauseMint();
  console.log(
    `Call pauseMint() to SeeDAO contract at ${seeDAOAddress} successfully!`
  );

  await seeDAO.unpauseMint();
  console.log(
    `Call unpauseMint() to SeeDAO contract at ${seeDAOAddress} successfully!`
  );
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  await seeDAO.pauseClaimWithWhiteList();
  console.log(
    `Call pauseClaimWithWhiteList() to SeeDAO contract at ${seeDAOAddress} successfully!`
  );

  await seeDAO.unpauseClaimWithWhiteList();
  console.log(
    `Call unpauseClaimWithWhiteList() to SeeDAO contract at ${seeDAOAddress} successfully!`
  );

  await seeDAO.pauseClaimWithPoints();
  console.log(
    `Call pauseClaimWithPoints() to SeeDAO contract at ${seeDAOAddress} successfully!`
  );

  await seeDAO.unpauseClaimWithPoints();
  console.log(
    `Call unpauseClaim() to SeeDAO contract at ${seeDAOAddress} successfully!`
  );
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  await seeDAO.pause();
  console.log(
    `Call unpause() to SeeDAO contract at ${seeDAOAddress} successfully!`
  );

  await seeDAO.unpauseMint();
  console.log(
    `Call unpause() to SeeDAO contract at ${seeDAOAddress} successfully!`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
