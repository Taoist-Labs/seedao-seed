import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { SeeDAO, MockERC20 } from "../typechain-types";

describe("SeeDAO", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySeeDAOFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, secondAccount, thirdAccount] = await ethers.getSigners();

    const SeeDAO = await ethers.getContractFactory("SeeDAO");
    const seeDAO = (await upgrades.deployProxy(SeeDAO)) as unknown as SeeDAO;
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
    const mockERC20 = (await MockERC20.deploy()) as unknown as MockERC20;

    return { mockERC20, owner };
  }

  async function generateMerkleTreeAndProof() {
    // correct tree
    const [owner, secondAccount, thirdAccount] = await ethers.getSigners();
    const addresses = [
      [owner.address],
      [secondAccount.address],
      [thirdAccount.address],
    ];
    const tree = StandardMerkleTree.of(addresses, ["address"]);
    const rootHash = tree.root;
    //const proofOfOwner = tree.getProof([ownerAddress]);
    const proofOfSecondAccount = tree.getProof([secondAccount.address]);
    //const proofOfThirdAccount = tree.getProof([thirdAccountAddress]);

    // incorrect tree
    const fakeAddresses = [
      ["0x183F09C3cE99C02118c570e03808476b22d63191"],
      ["0xc1eE7cB74583D1509362467443C44f1FCa981283"],
    ];
    const fakeTree = StandardMerkleTree.of(fakeAddresses, ["address"]);
    const proofOfFakeAccount = fakeTree.getProof([
      "0x183F09C3cE99C02118c570e03808476b22d63191",
    ]);

    return { rootHash, proofOfSecondAccount, proofOfFakeAccount };
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

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

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

  describe("Function setWhiteList", function () {
    const whiteListId = ethers.getBigInt(1);
    const rootHash = ethers.randomBytes(32);

    it("Should revert when caller is not owner", async function () {
      const { seeDAO, secondAccount } = await loadFixture(deploySeeDAOFixture);

      await expect(
        seeDAO.connect(secondAccount).setWhiteList(whiteListId, rootHash)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set whitelist success", async function () {
      const { seeDAO } = await loadFixture(deploySeeDAOFixture);
      const { mockERC20 } = await loadFixture(deployMockERC20Fixture);

      // TODO FIXME
      // expect(await seeDAO.whiteListRootHashes(whiteListId)).to.equal(ethers.hexlify(ethers.randomBytes(0)));
      await seeDAO.setWhiteList(whiteListId, rootHash);
      expect(await seeDAO.whiteListRootHashes(whiteListId)).to.equal(
        ethers.hexlify(rootHash)
      );
    });
  });

  describe("Function setPrice", function () {
    const zero = ethers.getBigInt(0);
    const price = ethers.parseEther("1");

    it("Should revert when caller is not owner", async function () {
      const { seeDAO, secondAccount } = await loadFixture(deploySeeDAOFixture);

      await expect(
        seeDAO.connect(secondAccount).setPrice(price)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set price success", async function () {
      const { seeDAO } = await loadFixture(deploySeeDAOFixture);

      expect(await seeDAO.price()).to.equal(zero);
      await seeDAO.setPrice(price);
      expect(await seeDAO.price()).to.equal(price);
    });
  });

  describe("Function setMaxSupply", function () {
    const defaultMaxSupply = ethers.getBigInt(100_000);
    const maxSupply = ethers.getBigInt(2_000_000);

    it("Should revert when caller is not owner", async function () {
      const { seeDAO, secondAccount } = await loadFixture(deploySeeDAOFixture);

      await expect(
        seeDAO.connect(secondAccount).setMaxSupply(maxSupply)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set max supply success", async function () {
      const { seeDAO } = await loadFixture(deploySeeDAOFixture);

      expect(await seeDAO.maxSupply()).to.equal(defaultMaxSupply);
      await seeDAO.setMaxSupply(maxSupply);
      expect(await seeDAO.maxSupply()).to.equal(maxSupply);
    });
  });

  describe("Function setBaseURI", function () {
    const baseURI = "ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD";

    it("Should revert when caller is not owner", async function () {
      const { seeDAO, secondAccount } = await loadFixture(deploySeeDAOFixture);

      await expect(
        seeDAO.connect(secondAccount).setBaseURI(baseURI)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set base uri success", async function () {
      const { seeDAO } = await loadFixture(deploySeeDAOFixture);

      expect(await seeDAO.baseURI()).to.equal("");
      await seeDAO.setBaseURI(baseURI);
      expect(await seeDAO.baseURI()).to.equal(baseURI);
    });
  });

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  describe("Function claimWithWhiteList", function () {
    const whiteListId = ethers.getBigInt(1);

    describe("Validations", function () {
      it("Should revert when not claimable", async function () {
        const { seeDAO } = await loadFixture(deploySeeDAOFixture);
        const { proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        await expect(
          seeDAO.claimWithWhiteList(whiteListId, proofOfSecondAccount)
        ).to.be.revertedWith("Claim is not open");
      });

      it("Should revert when not int whiteList", async function () {
        const { seeDAO } = await loadFixture(deploySeeDAOFixture);
        const { proofOfFakeAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        await seeDAO.unpauseClaim();

        await expect(
          seeDAO.claimWithWhiteList(whiteListId, proofOfFakeAccount)
        ).to.be.revertedWith("You are not in the white list");
      });

      it("Should claim success", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { rootHash, proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seeDAO.unpauseClaim();
        // set white list
        await seeDAO.setWhiteList(whiteListId, rootHash);

        // claim
        expect(
          await seeDAO.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(false);
        await seeDAO
          .connect(secondAccount)
          .claimWithWhiteList(whiteListId, proofOfSecondAccount);
        expect(
          await seeDAO.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(true);
      });

      it("Should revert when has claimed", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { rootHash, proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seeDAO.unpauseClaim();
        // set white list
        await seeDAO.setWhiteList(whiteListId, rootHash);

        // claim
        expect(
          await seeDAO.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(false);
        await seeDAO
          .connect(secondAccount)
          .claimWithWhiteList(whiteListId, proofOfSecondAccount);
        expect(
          await seeDAO.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(true);
        // TODO 还要验证 nft 余额

        // claim again should revert
        await expect(
          seeDAO
            .connect(secondAccount)
            .claimWithWhiteList(whiteListId, proofOfSecondAccount)
        ).to.be.revertedWith("You have claimed");
      });
    });

    describe("Events", function () {
      it("Should emit an event on claimWithWhiteList", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { rootHash, proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seeDAO.unpauseClaim();
        // set white list
        await seeDAO.setWhiteList(whiteListId, rootHash);

        // claim
        expect(await seeDAO.claimed(secondAccount.address)).to.equal(false);
        await expect(
          seeDAO
            .connect(secondAccount)
            .claimWithWhiteList(whiteListId, proofOfSecondAccount)
        )
          .to.be.emit(seeDAO, "Transfer")
          .withArgs(ethers.ZeroAddress, secondAccount.address, 0);
        expect(await seeDAO.claimed(secondAccount.address)).to.equal(true);
      });
    });
  });
});
