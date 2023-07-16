import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("SeeDAO", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySeeDAOFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, secondAccount, thirdAccount] = await ethers.getSigners();

    const SeeDAO = await ethers.getContractFactory("SeeDAO");
    const seeDAO = await upgrades.deployProxy(SeeDAO);
    await seeDAO.waitForDeployment();

    return { seeDAO, owner, secondAccount, thirdAccount };
  }

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMockERC20Fixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockERC20 = await MockERC20.deploy();

    return { mockERC20, owner };
  }

  describe("Deployment", function () {
    it("Should set the right maxSupply", async function () {
      const { seeDAO } = await loadFixture(deploySeeDAOFixture);

      expect(await seeDAO.maxSupply()).to.equal(ethers.getBigInt(100_000));
    });

    it("Should set the right owner", async function () {
      const { seeDAO, owner } = await loadFixture(deploySeeDAOFixture);

      expect(await seeDAO.owner()).to.equal(owner.address);
    });

    it("Should set the right minter", async function () {
      const { seeDAO, owner } = await loadFixture(deploySeeDAOFixture);

      expect(await seeDAO.minter()).to.equal(owner.address);
    });
  });

  describe("Function setMinter()", function () {
    describe("Validations", function () {
      it("Should revert when caller is not owner", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        await expect(
          seeDAO.connect(secondAccount).setMinter(secondAccount.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should set minter success", async function () {
        const { seeDAO, owner, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        expect(await seeDAO.minter()).to.equal(owner.address);
        await seeDAO.setMinter(secondAccount.address);
        expect(await seeDAO.minter()).to.equal(secondAccount.address);
      });
    });

    describe("Events", function () {
      it("Should emit an event on setMinter", async function () {
        const { seeDAO, owner, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        await expect(seeDAO.setMinter(secondAccount.address))
          .to.emit(seeDAO, "MinterChanged")
          .withArgs(owner.address, secondAccount.address);
      });
    });
  });

  describe("Function setPointsTokenAddress", function () {
    it("Should revert when caller is not owner", async function () {
      const { seeDAO, secondAccount } = await loadFixture(deploySeeDAOFixture);
      const { mockERC20 } = await loadFixture(deployMockERC20Fixture);

      await expect(
        seeDAO.connect(secondAccount).setPointsTokenAddress(mockERC20)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set points token address success", async function () {
      const { seeDAO } = await loadFixture(deploySeeDAOFixture);
      const { mockERC20 } = await loadFixture(deployMockERC20Fixture);

      expect(await seeDAO.pointsToken()).to.equal(ethers.ZeroAddress);
      await seeDAO.setPointsTokenAddress(mockERC20);
      expect(await seeDAO.pointsToken()).to.equal(await mockERC20.getAddress());
    });
  });

  describe("Function setPointsCondition", function () {
    const zero = ethers.getBigInt(0);
    const Big5k = ethers.getBigInt(5_000);

    it("Should revert when caller is not owner", async function () {
      const { seeDAO, secondAccount } = await loadFixture(deploySeeDAOFixture);
      const { mockERC20 } = await loadFixture(deployMockERC20Fixture);

      await expect(
        seeDAO.connect(secondAccount).setPointsCondition(Big5k)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert when points token address have not set", async function () {
      const { seeDAO } = await loadFixture(deploySeeDAOFixture);
      const { mockERC20 } = await loadFixture(deployMockERC20Fixture);

      await expect(seeDAO.setPointsCondition(Big5k)).to.be.revertedWith(
        "Points token address is not set"
      );
    });

    it("Should set points condition success", async function () {
      const { seeDAO } = await loadFixture(deploySeeDAOFixture);
      const { mockERC20 } = await loadFixture(deployMockERC20Fixture);

      // set points token address firstly
      await seeDAO.setPointsTokenAddress(mockERC20);

      expect(await seeDAO.pointsCondi()).to.equal(zero);
      await seeDAO.setPointsCondition(Big5k);
      const Big5kWithDecimals = ethers.getBigInt(
        BigInt(5_000) * BigInt(10) ** BigInt(await mockERC20.decimals())
      );
      expect(await seeDAO.pointsCondi()).to.equal(Big5kWithDecimals);
    });
  });
});
