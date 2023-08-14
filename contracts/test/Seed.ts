import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

describe("Seed", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySeedFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, secondAccount, thirdAccount] = await ethers.getSigners();

    const mockPoints = await ethers.deployContract("MockPoints");

    const seed = await ethers.deployContract("Seed", [
      await mockPoints.getAddress(),
    ]);

    return { mockPoints, seed, owner, secondAccount, thirdAccount };
  }

  // generate batch mint param
  async function fakeBatchMintParam() {
    const [owner, secondAccount, thirdAccount] = await ethers.getSigners();

    const addresses = [
      owner.address,
      secondAccount.address,
      thirdAccount.address,
    ];

    return { addresses };
  }

  describe("Deployment", function () {
    it("Should set the right maxSupply", async function () {
      const { seed } = await loadFixture(deploySeedFixture);

      expect(await seed.maxSupply()).to.equal(ethers.getBigInt(100_000));
    });

    it("Should set the right owner", async function () {
      const { seed, owner } = await loadFixture(deploySeedFixture);

      expect(await seed.owner()).to.equal(owner.address);
    });

    it("Should set the right minter", async function () {
      const { seed, owner } = await loadFixture(deploySeedFixture);

      expect(await seed.minter()).to.equal(owner.address);
    });

    it("Should paused default", async function () {
      const { seed, owner } = await loadFixture(deploySeedFixture);

      expect(await seed.paused()).to.equal(true);
    });
  });

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  describe("Function changeMinter()", function () {
    describe("Validations", function () {
      it("Should revert when caller is not owner", async function () {
        const { seed, secondAccount } = await loadFixture(deploySeedFixture);

        await expect(
          seed.connect(secondAccount).changeMinter(secondAccount.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should change minter success", async function () {
        const { seed, owner, secondAccount } = await loadFixture(
          deploySeedFixture
        );

        expect(await seed.minter()).to.equal(owner.address);
        await seed.changeMinter(secondAccount.address);
        expect(await seed.minter()).to.equal(secondAccount.address);
      });
    });

    describe("Events", function () {
      it("Should emit an event on changeMinter", async function () {
        const { seed, owner, secondAccount } = await loadFixture(
          deploySeedFixture
        );

        await expect(seed.changeMinter(secondAccount.address))
          .to.emit(seed, "MinterChanged")
          .withArgs(owner.address, secondAccount.address);
      });
    });
  });

  describe("Function setMaxSupply", function () {
    const defaultMaxSupply = ethers.getBigInt(100_000);
    const maxSupply = ethers.getBigInt(2_000_000);

    it("Should revert when caller is not owner", async function () {
      const { seed, secondAccount } = await loadFixture(deploySeedFixture);

      await expect(
        seed.connect(secondAccount).setMaxSupply(maxSupply)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set max supply success", async function () {
      const { seed } = await loadFixture(deploySeedFixture);

      expect(await seed.maxSupply()).to.equal(defaultMaxSupply);
      await seed.setMaxSupply(maxSupply);
      expect(await seed.maxSupply()).to.equal(maxSupply);
    });
  });

  describe("Function setBaseURI", function () {
    const baseURI = "ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD";

    it("Should revert when caller is not owner", async function () {
      const { seed, secondAccount } = await loadFixture(deploySeedFixture);

      await expect(
        seed.connect(secondAccount).setBaseURI(baseURI)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set base uri success", async function () {
      const { seed } = await loadFixture(deploySeedFixture);

      expect(await seed.baseURI()).to.equal("");
      await seed.setBaseURI(baseURI);
      expect(await seed.baseURI()).to.equal(baseURI);
    });
  });

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  describe("Function mint", function () {
    describe("Validations", function () {
      it("Should revert when caller is not minter", async function () {
        const { seed, secondAccount } = await loadFixture(deploySeedFixture);

        await expect(
          seed.connect(secondAccount).mint(secondAccount.address)
        ).to.be.revertedWith("Only minter can call this method");
      });

      it("Should revert when exceeds max supply", async function () {
        const { seed, secondAccount } = await loadFixture(deploySeedFixture);

        // set max supply to 1
        await seed.setMaxSupply(ethers.getBigInt(1));

        // will revert when mint 2
        await seed.mint(secondAccount.address);
        await expect(seed.mint(secondAccount.address)).to.be.revertedWith(
          "Exceeds the maximum supply"
        );
      });

      it("Should mint success", async function () {
        const { seed, secondAccount } = await loadFixture(deploySeedFixture);

        await seed.mint(secondAccount.address); // minted nft id: 0
        //
        //expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(1));
        expect(await seed.totalSupply()).to.equal(ethers.getBigInt(1));
        //
        expect(await seed.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(1)
        );
        expect(
          await seed.tokenOfOwnerByIndex(secondAccount.address, 0)
        ).to.equal(ethers.getBigInt(0));

        await seed.mint(secondAccount.address); // minted nft id: 1
        await seed.mint(secondAccount.address); // minted nft id: 2
        //
        //expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(3));
        expect(await seed.totalSupply()).to.equal(ethers.getBigInt(3));
        //
        expect(await seed.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(3)
        );
        expect(
          await seed.tokenOfOwnerByIndex(secondAccount.address, 0)
        ).to.equal(ethers.getBigInt(0));
        expect(
          await seed.tokenOfOwnerByIndex(secondAccount.address, 1)
        ).to.equal(ethers.getBigInt(1));
        expect(
          await seed.tokenOfOwnerByIndex(secondAccount.address, 2)
        ).to.equal(ethers.getBigInt(2));
      });
    });

    describe("Events", function () {
      it("Should emit an event on claimWithWhiteList", async function () {
        const { seed, secondAccount } = await loadFixture(deploySeedFixture);

        await expect(seed.mint(secondAccount.address))
          .to.be.emit(seed, "Transfer")
          .withArgs(ethers.ZeroAddress, secondAccount.address, 0);
      });
    });
  });

  describe("Function batchMint", function () {
    describe("Validations", function () {
      it("Should revert when caller is not minter", async function () {
        const { seed, secondAccount } = await loadFixture(deploySeedFixture);
        const { addresses } = await loadFixture(fakeBatchMintParam);

        await expect(
          seed.connect(secondAccount).batchMint(addresses)
        ).to.be.revertedWith("Only minter can call this method");
      });

      it("Should revert when exceeds max supply", async function () {
        const { seed } = await loadFixture(deploySeedFixture);
        const { addresses } = await loadFixture(fakeBatchMintParam);

        // set max supply to 2
        await seed.setMaxSupply(ethers.getBigInt(2));

        // will revert when batch mint 3
        await expect(seed.batchMint(addresses)).to.be.revertedWith(
          "Exceeds the maximum supply"
        );
      });

      it("Should mint success", async function () {
        const { seed, owner } = await loadFixture(deploySeedFixture);
        const { addresses } = await loadFixture(fakeBatchMintParam);

        //expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(0));

        // batch mint 3 nfts
        await seed.batchMint(addresses); // minted nft id: 0, 1, 2

        //expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(3));
        expect(await seed.totalSupply()).to.equal(ethers.getBigInt(3));

        for (let i = 0; i < addresses.length; i++) {
          expect(await seed.balanceOf(addresses[i])).to.equal(
            ethers.getBigInt(1)
          );
          expect(await seed.tokenOfOwnerByIndex(addresses[i], 0)).to.equal(
            ethers.getBigInt(i)
          );
        }
      });
    });
  });

  describe("Function tokenURI", function () {
    describe("Validations", function () {
      it("Use default uri level ranges", async function () {
        const { seed, mockPoints, secondAccount } = await loadFixture(
          deploySeedFixture
        );

        const baseURI = "ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD";

        const mockPointsDecimals = await mockPoints.decimals();

        // secondAccount mint nft #0
        await seed.mint(secondAccount.address);

        // set token uri
        await seed.setBaseURI(baseURI);

        // [20_000, 300_000, 3_000_000, 30_000_000]
        // case1: mint 100 points to secondAccount
        await mockPoints.mint(secondAccount.address, ethers.parseUnits("100", mockPointsDecimals));
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("100", mockPointsDecimals));
        // with 100 points, nft uri level is 1
        expect(await seed.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_1.json`);
        // case2: mint 20_000 points to secondAccount
        await mockPoints.mint(secondAccount.address, ethers.parseUnits("20000", mockPointsDecimals));
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("20100", mockPointsDecimals));
        // with 20_000 points, nft uri level is 2
        expect(await seed.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_2.json`);
        // case3: mint 300_000 points to secondAccount
        await mockPoints.mint(secondAccount.address, ethers.parseUnits("300000", mockPointsDecimals));
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("320100", mockPointsDecimals));
        // with 300_000 points, nft uri level is 3
        expect(await seed.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_3.json`);
        // case4: mint 3_000_000 points to secondAccount
        await mockPoints.mint(secondAccount.address, ethers.parseUnits("3000000", mockPointsDecimals));
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("3320100", mockPointsDecimals));
        // with 3_000_000 points, nft uri level is 4
        expect(await seed.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_4.json`);
        // case5: mint 30_000_000 points to secondAccount
        await mockPoints.mint(secondAccount.address, ethers.parseUnits("30000000", mockPointsDecimals));
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("33320100", mockPointsDecimals));
        // with 30_000_000 points, nft uri level is 5
        expect(await seed.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_5.json`);
      });

      it("Use custom uri level ranges", async function () {
        const { seed, mockPoints, secondAccount } = await loadFixture(
          deploySeedFixture
        );

        const baseURI = "ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD";

        const mockPointsDecimals = await mockPoints.decimals();

        // secondAccount mint nft #0
        await seed.mint(secondAccount.address);

        // set token uri
        await seed.setBaseURI(baseURI);

        // set custom uri level ranges: [100, 1_000, 10_000, 100_000]
        await seed.setURILevelRange([
          ethers.getBigInt(100),
          ethers.getBigInt(1_000),
          ethers.getBigInt(10_000),
          ethers.getBigInt(100_000),
        ]);

        // [100, 1_000, 10_000, 100_000]
        // case1: mint 10 points to secondAccount
        await mockPoints.mint(secondAccount.address, ethers.parseUnits("10", mockPointsDecimals));
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("10", mockPointsDecimals));
        // with 10 points, nft uri level is 1
        expect(await seed.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_1.json`);
        // case2: mint 100 points to secondAccount
        await mockPoints.mint(secondAccount.address, ethers.parseUnits("100", mockPointsDecimals));
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("110", mockPointsDecimals));
        // with 100 points, nft uri level is 2
        expect(await seed.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_2.json`);
        // case3: mint 1_000 points to secondAccount
        await mockPoints.mint(secondAccount.address, ethers.parseUnits("1000", mockPointsDecimals));
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("1110", mockPointsDecimals));
        // with 1_000 points, nft uri level is 3
        expect(await seed.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_3.json`);
        // case4: mint 10_000 points to secondAccount
        await mockPoints.mint(secondAccount.address, ethers.parseUnits("10000", mockPointsDecimals));
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("11110", mockPointsDecimals));
        // with 10_000 points, nft uri level is 4
        expect(await seed.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_4.json`);
        // case5: mint 100_000 points to secondAccount
        await mockPoints.mint(secondAccount.address, ethers.parseUnits("100000", mockPointsDecimals));
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("111110", mockPointsDecimals));
        // with 100_000 points, nft uri level is 5
        expect(await seed.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_5.json`);
      });
    });
  });
});
