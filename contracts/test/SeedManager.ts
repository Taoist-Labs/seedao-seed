import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { SeedMinter } from "../typechain-types";

describe("SeedMinter", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySeedMinterFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, secondAccount, thirdAccount] = await ethers.getSigners();

    const mockPoints = await ethers.deployContract("MockPoints");

    const seed = await ethers.deployContract("Seed", [
      await mockPoints.getAddress(),
    ]);

    const SeedMinter = await ethers.getContractFactory("SeedMinter");
    const seedMinter = (await upgrades.deployProxy(SeedMinter, [
      await seed.getAddress(),
      await mockPoints.getAddress(),
      ethers.getBigInt(5000),
    ])) as unknown as SeedMinter;

    // transfer Seed's owner to SeedManager contract
    await seed.transferOwnership(seedMinter.target.toString());

    return {
      mockPoints,
      seed,
      seedMinter,
      owner,
      secondAccount,
      thirdAccount,
    };
  }

  // generate merkle tree and leaf's proof
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

  // convert number to bigInt
  function bigInt(value: number, decimals: bigint) {
    return ethers.getBigInt(BigInt(value) * BigInt(10) ** decimals);
  }

  describe("Deployment", function () {
    it("Should set the right seed contract address", async function () {
      const { seed, seedMinter } = await loadFixture(deploySeedMinterFixture);

      expect(await seedMinter.seed()).to.equal(await seed.getAddress());
    });

    it("Should set the right pointsTokenAddress and pointsCountCond", async function () {
      const { mockPoints, seed, seedMinter } = await loadFixture(
        deploySeedMinterFixture
      );

      expect(await seedMinter.pointsToken()).to.equal(
        await mockPoints.getAddress()
      );
      expect(await seedMinter.pointsCountCondi()).to.equal(
        bigInt(5_000, await mockPoints.decimals())
      );
    });

    it("Should set the right minter", async function () {
      const { seedMinter, owner } = await loadFixture(deploySeedMinterFixture);

      expect(await seedMinter.minter()).to.equal(owner.address);
    });

    it("Should disable `onMint` `onClaimWithWhiteList` `onClaimWithPoints` default", async function () {
      const { seedMinter, owner } = await loadFixture(deploySeedMinterFixture);

      expect(await seedMinter.onMint()).to.equal(false);
      expect(await seedMinter.onClaimWithWhiteList()).to.equal(false);
      expect(await seedMinter.onClaimWithPoints()).to.equal(false);
    });

    it("Should set the right owner", async function () {
      const { seedMinter, owner } = await loadFixture(deploySeedMinterFixture);

      expect(await seedMinter.owner()).to.equal(owner.address);
    });
  });

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  describe("Function changeMinter()", function () {
    describe("Validations", function () {
      it("Should revert when caller is not owner", async function () {
        const { seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        await expect(
          seedMinter.connect(secondAccount).changeMinter(secondAccount.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should change minter success", async function () {
        const { seedMinter, owner, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        expect(await seedMinter.minter()).to.equal(owner.address);
        await seedMinter.changeMinter(secondAccount.address);
        expect(await seedMinter.minter()).to.equal(secondAccount.address);
      });
    });

    describe("Events", function () {
      it("Should emit an event on changeMinter", async function () {
        const { seedMinter, owner, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        await expect(seedMinter.changeMinter(secondAccount.address))
          .to.emit(seedMinter, "MinterChanged")
          .withArgs(owner.address, secondAccount.address);
      });
    });
  });

  describe("Function setPointsTokenAddress", function () {
    it("Should revert when caller is not owner", async function () {
      const { mockPoints, seedMinter, secondAccount } = await loadFixture(
        deploySeedMinterFixture
      );

      await expect(
        seedMinter.connect(secondAccount).setPointsTokenAddress(mockPoints)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set points token address success", async function () {
      const { mockPoints, seedMinter } = await loadFixture(
        deploySeedMinterFixture
      );

      expect(await seedMinter.pointsToken()).to.equal(
        await mockPoints.getAddress()
      );
      await seedMinter.setPointsTokenAddress(ethers.ZeroAddress);
      expect(await seedMinter.pointsToken()).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Function setPointsCondition", function () {
    const Big5k = ethers.getBigInt(5_000);

    it("Should revert when caller is not owner", async function () {
      const { mockPoints, seedMinter, secondAccount } = await loadFixture(
        deploySeedMinterFixture
      );

      await expect(
        seedMinter.connect(secondAccount).setPointsCountCondition(Big5k)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert when points token address have not set", async function () {
      const { mockPoints, seedMinter } = await loadFixture(
        deploySeedMinterFixture
      );

      await seedMinter.setPointsTokenAddress(ethers.ZeroAddress);

      await expect(
        seedMinter.setPointsCountCondition(Big5k)
      ).to.be.revertedWith("Points token address is not set");
    });

    it("Should set points condition success", async function () {
      const { mockPoints, seedMinter } = await loadFixture(
        deploySeedMinterFixture
      );

      expect(await seedMinter.pointsCountCondi()).to.equal(
        bigInt(5_000, await mockPoints.decimals())
      );
      await seedMinter.setPointsCountCondition(Big5k);
      expect(await seedMinter.pointsCountCondi()).to.equal(
        bigInt(5_000, await mockPoints.decimals())
      );
    });
  });

  describe("Function setWhiteList", function () {
    const whiteListId = ethers.getBigInt(1);
    const rootHash = ethers.randomBytes(32);

    it("Should revert when caller is not owner", async function () {
      const { seedMinter, secondAccount } = await loadFixture(
        deploySeedMinterFixture
      );

      await expect(
        seedMinter.connect(secondAccount).setWhiteList(whiteListId, rootHash)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set whitelist success", async function () {
      const { seedMinter } = await loadFixture(deploySeedMinterFixture);

      // TODO FIXME
      // expect(await seedMinter.whiteListRootHashes(whiteListId)).to.equal(ethers.hexlify(ethers.randomBytes(0)));
      await seedMinter.setWhiteList(whiteListId, rootHash);
      expect(await seedMinter.whiteListRootHashes(whiteListId)).to.equal(
        ethers.hexlify(rootHash)
      );
    });
  });

  describe("Function setPrice", function () {
    const zero = ethers.getBigInt(0);
    const price = ethers.parseEther("1");

    it("Should revert when caller is not owner", async function () {
      const { seedMinter, secondAccount } = await loadFixture(
        deploySeedMinterFixture
      );

      await expect(
        seedMinter.connect(secondAccount).setPrice(price)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set price success", async function () {
      const { seedMinter } = await loadFixture(deploySeedMinterFixture);

      expect(await seedMinter.price()).to.equal(zero);
      await seedMinter.setPrice(price);
      expect(await seedMinter.price()).to.equal(price);
    });
  });

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  describe("Function claimWithWhiteList", function () {
    const whiteListId = ethers.getBigInt(1);

    describe("Validations", function () {
      it("Should revert when not enableClaimWithWhiteList", async function () {
        const { seedMinter } = await loadFixture(deploySeedMinterFixture);
        const { proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        await expect(
          seedMinter.claimWithWhiteList(whiteListId, proofOfSecondAccount)
        ).to.be.revertedWith("Claim with white list is not open");
      });

      it("Should revert when not int whiteList", async function () {
        const { seedMinter } = await loadFixture(deploySeedMinterFixture);
        const { proofOfFakeAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seedMinter.unpauseClaimWithWhiteList();

        await expect(
          seedMinter.claimWithWhiteList(whiteListId, proofOfFakeAccount)
        ).to.be.revertedWith("You are not in the white list");
      });

      it("Should claim success", async function () {
        const { seed, seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );
        const { rootHash, proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seedMinter.unpauseClaimWithWhiteList();
        // set white list
        await seedMinter.setWhiteList(whiteListId, rootHash);

        // claim
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(false);
        await seedMinter
          .connect(secondAccount)
          .claimWithWhiteList(whiteListId, proofOfSecondAccount);
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(true);
        //expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(1));
        expect(await seed.totalSupply()).to.equal(ethers.getBigInt(1));
        expect(await seed.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(1)
        );
        // TODO FIXME
        // expect(
        //   await seed.tokenOfOwnerByIndex(secondAccount.address, 0)
        // ).to.equal(ethers.getBigInt(0));
      });

      it("Should revert when has claimed", async function () {
        const { seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );
        const { rootHash, proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seedMinter.unpauseClaimWithWhiteList();
        // set white list
        await seedMinter.setWhiteList(whiteListId, rootHash);

        // claim
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(false);
        await seedMinter
          .connect(secondAccount)
          .claimWithWhiteList(whiteListId, proofOfSecondAccount);
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(true);

        // claim again should revert
        await expect(
          seedMinter
            .connect(secondAccount)
            .claimWithWhiteList(whiteListId, proofOfSecondAccount)
        ).to.be.revertedWith("You have claimed");
      });

      it("Should revert claim again by points", async function () {
        const { mockPoints, seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );
        const { rootHash, proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seedMinter.unpauseClaimWithWhiteList();
        // set white list
        await seedMinter.setWhiteList(whiteListId, rootHash);

        // claim
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(false);
        await seedMinter
          .connect(secondAccount)
          .claimWithWhiteList(whiteListId, proofOfSecondAccount);
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(true);

        // claim with points will revert
        await seedMinter.unpauseClaimWithPoints();
        const bigInt5k = bigInt(5_000, await mockPoints.decimals());
        await mockPoints.mint(secondAccount.address, bigInt5k);
        await expect(
          seedMinter.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("You have claimed");
      });
    });
  });

  describe("Function claimWithPoints", function () {
    describe("Validations", function () {
      it("Should revert when not enableClaimWithPoints", async function () {
        const { seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        await expect(
          seedMinter.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("Claim with point is not open");
      });

      it("Should revert when not set points token address", async function () {
        const { seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        // enable claim
        await seedMinter.unpauseClaimWithPoints();

        await seedMinter.setPointsTokenAddress(ethers.ZeroAddress);

        await expect(
          seedMinter.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("Points token address is not set");
      });

      it("Should revert when not have enough points", async function () {
        const { mockPoints, seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(0)
        );

        // enable claim
        await seedMinter.unpauseClaimWithPoints();

        // revert because of `pointsCondi == 0`
        await expect(
          seedMinter.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("You don't have enough points");

        // set condition to 5k
        await seedMinter.setPointsCountCondition(ethers.getBigInt(5_000));
        // only mint 2k points
        const bigInt2k = bigInt(2_000, await mockPoints.decimals());
        await mockPoints.mint(secondAccount.address, bigInt2k);
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          bigInt2k
        );

        // revert because of `points < pointsCondi`
        await expect(
          seedMinter.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("You don't have enough points");
      });

      it("Should claim success", async function () {
        const { mockPoints, seed, seedMinter, secondAccount } =
          await loadFixture(deploySeedMinterFixture);

        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(0)
        );

        // enable claim
        await seedMinter.unpauseClaimWithPoints();
        // default points condition is 5k
        // mint 5k points
        const bigInt5k = bigInt(5_000, await mockPoints.decimals());
        await mockPoints.mint(secondAccount.address, bigInt5k);
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          bigInt5k
        );

        // claim
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(false);
        await seedMinter.connect(secondAccount).claimWithPoints();
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(true);
        //expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(1));
        expect(await seed.totalSupply()).to.equal(ethers.getBigInt(1));
        expect(await seed.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(1)
        );
        // TODO FIXME
        // expect(
        //   await seed.tokenOfOwnerByIndex(secondAccount.address, 0)
        // ).to.equal(ethers.getBigInt(0));
      });

      it("Should revert when has claimed", async function () {
        const { mockPoints, seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(0)
        );

        // enable claim
        await seedMinter.unpauseClaimWithPoints();
        // default points condition is 5k
        // mint 5k points
        const bigInt5k = bigInt(5_000, await mockPoints.decimals());
        await mockPoints.mint(secondAccount.address, bigInt5k);
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          bigInt5k
        );

        // claim
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(false);
        await seedMinter.connect(secondAccount).claimWithPoints();
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(true);

        // claim again should revert
        await expect(
          seedMinter.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("You have claimed");
      });

      it("Should revert when has claimed", async function () {
        const { mockPoints, seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(0)
        );

        // enable claim
        await seedMinter.unpauseClaimWithPoints();
        // default points condition is 5k
        // mint 5k points
        const bigInt5k = bigInt(5_000, await mockPoints.decimals());
        await mockPoints.mint(secondAccount.address, bigInt5k);
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          bigInt5k
        );

        // claim
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(false);
        await seedMinter.connect(secondAccount).claimWithPoints();
        expect(
          await seedMinter.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(true);

        // claim with white list will revert
        await seedMinter.unpauseClaimWithWhiteList();
        const whiteListId = ethers.getBigInt(1);
        const { rootHash, proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );
        await seedMinter.setWhiteList(whiteListId, rootHash);
        await expect(
          seedMinter
            .connect(secondAccount)
            .claimWithWhiteList(whiteListId, proofOfSecondAccount)
        ).to.be.revertedWith("You have claimed");
      });
    });
  });

  describe("Function migrate", function () {
    describe("Validations", function () {
      it("Should revert when caller is not minter", async function () {
        const { seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );
        const { addresses } = await loadFixture(fakeBatchMintParam);

        await expect(
          seedMinter.connect(secondAccount).migrate(addresses)
        ).to.be.revertedWith("Only minter can call this method");
      });

      it("Should mint success", async function () {
        const { seed, seedMinter, owner } = await loadFixture(
          deploySeedMinterFixture
        );
        const { addresses } = await loadFixture(fakeBatchMintParam);

        //expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(0));

        // batch mint 3 nfts
        await seedMinter.migrate(addresses); // minted nft id: 0, 1, 2

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

      it("batch mint addresses can't free claim again by whitelist and points", async function () {
        const {
          mockPoints,
          seed,
          seedMinter,
          owner,
          secondAccount,
          thirdAccount,
        } = await loadFixture(deploySeedMinterFixture);

        const { addresses } = await loadFixture(fakeBatchMintParam);

        //expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(0));

        // batch mint 3 nfts
        await seedMinter.migrate(addresses); // minted nft id: 0, 1, 2

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

        // claim with white list will revert
        await seedMinter.unpauseClaimWithWhiteList();
        const whiteListId = ethers.getBigInt(1);
        const { rootHash, proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );
        await seedMinter.setWhiteList(whiteListId, rootHash);
        await expect(
          seedMinter
            .connect(secondAccount)
            .claimWithWhiteList(whiteListId, proofOfSecondAccount)
        ).to.be.revertedWith("You have claimed");
        // claim with points will revert
        await seedMinter.unpauseClaimWithPoints();
        const bigInt5k = bigInt(5_000, await mockPoints.decimals());
        await mockPoints.mint(secondAccount.address, bigInt5k);
        await expect(
          seedMinter.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("You have claimed");
      });
    });
  });

  describe("Function mint", function () {
    describe("Validations", function () {
      it("Should revert when not mintable", async function () {
        const { seedMinter } = await loadFixture(deploySeedMinterFixture);

        await expect(seedMinter.mint(ethers.getBigInt(1))).to.be.revertedWith(
          "Mint is not open"
        );
      });

      it("Should revert when mint amount is zero", async function () {
        const { seedMinter } = await loadFixture(deploySeedMinterFixture);

        // enable mint
        await seedMinter.unpauseMint();

        // will revert when mint 0
        await expect(seedMinter.mint(ethers.getBigInt(0))).to.be.revertedWith(
          "Mint amount must bigger than zero"
        );
      });

      it("Should revert when not set price", async function () {
        const { seedMinter } = await loadFixture(deploySeedMinterFixture);

        // enable mint
        await seedMinter.unpauseMint();

        await expect(seedMinter.mint(ethers.getBigInt(1))).to.be.revertedWith(
          "Insufficient payment"
        );
      });

      it("Should revert when insufficient payment", async function () {
        const { seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        // enable mint
        await seedMinter.unpauseMint();

        // set price
        await seedMinter.setPrice(ethers.parseEther("2"));

        // revert because of zero payment
        await expect(seedMinter.mint(ethers.getBigInt(1))).to.be.revertedWith(
          "Insufficient payment"
        );

        // revert because of insufficient payment
        await expect(
          seedMinter
            .connect(secondAccount)
            .mint(ethers.getBigInt(1), { value: ethers.parseEther("1") })
        ).to.be.revertedWith("Insufficient payment");
      });

      it("Should mint success", async function () {
        const { seed, seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        // enable mint
        await seedMinter.unpauseMint();

        // set price
        await seedMinter.setPrice(ethers.parseEther("2"));

        await seedMinter
          .connect(secondAccount)
          .mint(ethers.getBigInt(1), { value: ethers.parseEther("2") }); // minted nft id: 0
        //
        // expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(1));
        expect(await seed.totalSupply()).to.equal(ethers.getBigInt(1));
        //
        expect(await seed.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(1)
        );
        // TODO FIXME
        // expect(
        //   await seed.tokenOfOwnerByIndex(secondAccount.address, 0)
        // ).to.equal(ethers.getBigInt(0));

        await seedMinter
          .connect(secondAccount)
          .mint(ethers.getBigInt(2), { value: ethers.parseEther("4.5") }); // minted nft id: 1, 2
        //
        // expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(3));
        expect(await seed.totalSupply()).to.equal(ethers.getBigInt(3));
        //
        expect(await seed.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(3)
        );
        // TODO FIXME
        // expect(
        //   await seed.tokenOfOwnerByIndex(secondAccount.address, 0)
        // ).to.equal(ethers.getBigInt(0));
        // expect(
        //   await seed.tokenOfOwnerByIndex(secondAccount.address, 1)
        // ).to.equal(ethers.getBigInt(1));
        // expect(
        //   await seed.tokenOfOwnerByIndex(secondAccount.address, 2)
        // ).to.equal(ethers.getBigInt(2));
      });

      it("Should refund the extra native token", async function () {
        const { seed, seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        // enable mint
        await seedMinter.unpauseMint();

        // set price
        await seedMinter.setPrice(ethers.parseEther("2"));

        const balanceBefore = await ethers.provider.getBalance(
          secondAccount.address
        );
        // just need pay 2ETH, in act
        await seedMinter
          .connect(secondAccount)
          .mint(ethers.getBigInt(1), { value: ethers.parseEther("3.5") }); // minted nft id: 0
        const balanceAfter = await ethers.provider.getBalance(
          secondAccount.address
        );
        expect(balanceBefore - balanceAfter == ethers.parseEther("1.5"));
      });
    });
  });

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  describe("Function transferSeedOwnership", function () {
    describe("Validations", function () {
      it("Should transferSeedOwnership success", async function () {
        const { seed, seedMinter, secondAccount } = await loadFixture(
          deploySeedMinterFixture
        );

        await seedMinter.transferSeedOwnership("0x0000000000000000000000000000000000000001");

        expect(await seed.owner()).to.equal("0x0000000000000000000000000000000000000001");
      });
    });
  });

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  describe("Function withdraw", function () {
    it("Should refund the extra native token", async function () {
      const { seed, seedMinter, owner, secondAccount } = await loadFixture(
        deploySeedMinterFixture
      );

      // enable mint
      await seedMinter.unpauseMint();
      // set price
      await seedMinter.setPrice(ethers.parseEther("2"));

      // pay 2ETH to buy
      expect(
        await ethers.provider.getBalance(await seedMinter.getAddress())
      ).to.be.equal(ethers.parseEther("0"));
      const secondAccountBalanceBefore = await ethers.provider.getBalance(
        secondAccount.address
      );
      // just need pay 2ETH, in act
      await seedMinter
        .connect(secondAccount)
        .mint(ethers.getBigInt(1), { value: ethers.parseEther("3.5") }); // minted nft id: 0
      const secondAccountBalanceAfter = await ethers.provider.getBalance(
        secondAccount.address
      );
      expect(
        await ethers.provider.getBalance(await seedMinter.getAddress())
      ).to.be.equal(ethers.parseEther("2"));
      expect(
        secondAccountBalanceBefore - secondAccountBalanceAfter ==
          ethers.parseEther("1.5")
      );

      // withdraw
      const ownerAccountBalanceBefore = await ethers.provider.getBalance(
        owner.address
      );
      await seedMinter.withdraw();
      const ownerAccountBalanceAfter = await ethers.provider.getBalance(
        owner.address
      );
      expect(
        await ethers.provider.getBalance(await seedMinter.getAddress())
      ).to.be.equal(ethers.parseEther("0"));
      expect(
        ownerAccountBalanceAfter - ownerAccountBalanceBefore ==
          ethers.parseEther("1.5")
      );
    });
  });
});
