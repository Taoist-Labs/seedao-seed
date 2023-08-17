import { ethers } from "hardhat";
import deployd from "../deployed";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("current signer: ", signer.address);

  // const mockERC20 = await ethers.getContractAt(
  //   "MockERC20",
  //   "0x27D4539d19b292b68369Ed588d682Db3aF679005"
  // );
  //
  // console.log(await mockERC20.owner());
  //
  // await mockERC20.mint(
  //   "0x183F09C3cE99C02118c570e03808476b22d63191",
  //   ethers.parseUnits("100000000", await mockERC20.decimals())
  // );

  // const xx = await ethers.getContractAt("SeedMinter", deployd.getSeedMinterContract());
  // console.log("version: ", await xx.version());
  // await xx.batchMint(["0xEBAEf7C0F5Bd0fa3E15D188a7545FcEdA76609C7", "0xc1eE7cB74583D1509362467443C44f1FCa981283"])
  //
  // await xx.setPointsTokenAddress(deployd.getMockPointsContract());
  // await xx.setPointsCountCondition(ethers.getBigInt(5_000));
  // await xx.claimWithPoints();
  //
  // await xx.setWhiteList();
  // await xx.unpauseClaimWithWhiteList();
  // await xx.batchMint(["0xb4D0674e9Bb116c55C50a72E14BbC201BD5816c6"]);

  const xx = await ethers.getContractAt("Seed", deployd.getSeedContract());
  // await xx.setBaseURI("https://raw.githubusercontent.com/Taoist-Labs/test-res/main/metadata/");
  console.log("is paused: ", await xx.paused());
  await xx.unpause();
  console.log("is paused: ", await xx.paused());
  // console.log("tokenURI: ", await xx.tokenURI(ethers.getBigInt(0)));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
