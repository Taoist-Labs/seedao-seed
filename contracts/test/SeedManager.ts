import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { SeedManager } from "../typechain-types";

describe("SeedManager", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySeedManagerFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, secondAccount, thirdAccount] = await ethers.getSigners();

    const mockPoints = await ethers.deployContract("MockPoints");

    const seed = await ethers.deployContract("Seed", [
      await mockPoints.getAddress(),
    ]);

    const SeedManager = await ethers.getContractFactory("SeedManager");
    const seedManager = (await upgrades.deployProxy(SeedManager, [
      await seed.getAddress(),
      await mockPoints.getAddress(),
      ethers.getBigInt(5000),
    ])) as unknown as SeedManager;

    // change Seed's minter to SeedManager contract
    await seed.changeMinter(seedManager.target.toString());

    return {
      mockPoints,
      seed,
      seedManager,
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
      const { seed, seedManager } = await loadFixture(deploySeedManagerFixture);

      expect(await seedManager.seed()).to.equal(await seed.getAddress());
    });

    it("Should set the right owner", async function () {
      const { seedManager, owner } = await loadFixture(
        deploySeedManagerFixture
      );

      expect(await seedManager.owner()).to.equal(owner.address);
    });

    it("Should set the right minter", async function () {
      const { seedManager, owner } = await loadFixture(
        deploySeedManagerFixture
      );

      expect(await seedManager.minter()).to.equal(owner.address);
    });

    it("Should disable `onMint` `onClaimWithWhiteList` `onClaimWithPoints` default", async function () {
      const { seedManager, owner } = await loadFixture(
        deploySeedManagerFixture
      );

      expect(await seedManager.onMint()).to.equal(false);
      expect(await seedManager.onClaimWithWhiteList()).to.equal(false);
      expect(await seedManager.onClaimWithPoints()).to.equal(false);
    });
  });

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  describe("Function changeMinter()", function () {
    describe("Validations", function () {
      it("Should revert when caller is not owner", async function () {
        const { seedManager, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );

        await expect(
          seedManager.connect(secondAccount).changeMinter(secondAccount.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should change minter success", async function () {
        const { seedManager, owner, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );

        expect(await seedManager.minter()).to.equal(owner.address);
        await seedManager.changeMinter(secondAccount.address);
        expect(await seedManager.minter()).to.equal(secondAccount.address);
      });
    });

    describe("Events", function () {
      it("Should emit an event on changeMinter", async function () {
        const { seedManager, owner, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );

        await expect(seedManager.changeMinter(secondAccount.address))
          .to.emit(seedManager, "MinterChanged")
          .withArgs(owner.address, secondAccount.address);
      });
    });
  });

  describe("Function setPointsTokenAddress", function () {
    it("Should revert when caller is not owner", async function () {
      const { mockPoints, seedManager, secondAccount } = await loadFixture(
        deploySeedManagerFixture
      );

      await expect(
        seedManager.connect(secondAccount).setPointsTokenAddress(mockPoints)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set points token address success", async function () {
      const { mockPoints, seedManager } = await loadFixture(
        deploySeedManagerFixture
      );

      expect(await seedManager.pointsToken()).to.equal(
        await mockPoints.getAddress()
      );
      await seedManager.setPointsTokenAddress(ethers.ZeroAddress);
      expect(await seedManager.pointsToken()).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Function setPointsCondition", function () {
    const Big5k = ethers.getBigInt(5_000);

    it("Should revert when caller is not owner", async function () {
      const { mockPoints, seedManager, secondAccount } = await loadFixture(
        deploySeedManagerFixture
      );

      await expect(
        seedManager.connect(secondAccount).setPointsCountCondition(Big5k)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert when points token address have not set", async function () {
      const { mockPoints, seedManager } = await loadFixture(
        deploySeedManagerFixture
      );

      await seedManager.setPointsTokenAddress(ethers.ZeroAddress);

      await expect(
        seedManager.setPointsCountCondition(Big5k)
      ).to.be.revertedWith("Points token address is not set");
    });

    it("Should set points condition success", async function () {
      const { mockPoints, seedManager } = await loadFixture(
        deploySeedManagerFixture
      );

      expect(await seedManager.pointsCountCondi()).to.equal(
        bigInt(5_000, await mockPoints.decimals())
      );
      await seedManager.setPointsCountCondition(Big5k);
      expect(await seedManager.pointsCountCondi()).to.equal(
        bigInt(5_000, await mockPoints.decimals())
      );
    });
  });

  describe("Function setWhiteList", function () {
    const whiteListId = ethers.getBigInt(1);
    const rootHash = ethers.randomBytes(32);

    it("Should revert when caller is not owner", async function () {
      const { seedManager, secondAccount } = await loadFixture(
        deploySeedManagerFixture
      );

      await expect(
        seedManager.connect(secondAccount).setWhiteList(whiteListId, rootHash)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set whitelist success", async function () {
      const { seedManager } = await loadFixture(deploySeedManagerFixture);

      // TODO FIXME
      // expect(await seedManager.whiteListRootHashes(whiteListId)).to.equal(ethers.hexlify(ethers.randomBytes(0)));
      await seedManager.setWhiteList(whiteListId, rootHash);
      expect(await seedManager.whiteListRootHashes(whiteListId)).to.equal(
        ethers.hexlify(rootHash)
      );
    });
  });

  describe("Function setPrice", function () {
    const zero = ethers.getBigInt(0);
    const price = ethers.parseEther("1");

    it("Should revert when caller is not owner", async function () {
      const { seedManager, secondAccount } = await loadFixture(
        deploySeedManagerFixture
      );

      await expect(
        seedManager.connect(secondAccount).setPrice(price)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set price success", async function () {
      const { seedManager } = await loadFixture(deploySeedManagerFixture);

      expect(await seedManager.price()).to.equal(zero);
      await seedManager.setPrice(price);
      expect(await seedManager.price()).to.equal(price);
    });
  });

  // ------ ------ ------ ------ ------ ------ ------ ------ ------
  // ------ ------ ------ ------ ------ ------ ------ ------ ------

  describe("Function claimWithWhiteList", function () {
    const whiteListId = ethers.getBigInt(1);

    describe("Validations", function () {
      it("Should revert when not enableClaimWithWhiteList", async function () {
        const { seedManager } = await loadFixture(deploySeedManagerFixture);
        const { proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        await expect(
          seedManager.claimWithWhiteList(whiteListId, proofOfSecondAccount)
        ).to.be.revertedWith("Claim with white list is not open");
      });

      it("Should revert when not int whiteList", async function () {
        const { seedManager } = await loadFixture(deploySeedManagerFixture);
        const { proofOfFakeAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seedManager.unpauseClaimWithWhiteList();

        await expect(
          seedManager.claimWithWhiteList(whiteListId, proofOfFakeAccount)
        ).to.be.revertedWith("You are not in the white list");
      });

      it("Should claim success", async function () {
        const { seed, seedManager, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );
        const { rootHash, proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seedManager.unpauseClaimWithWhiteList();
        // set white list
        await seedManager.setWhiteList(whiteListId, rootHash);

        // claim
        expect(
          await seedManager
            .connect(secondAccount)
            .claimed(secondAccount.address)
        ).to.equal(false);
        await seedManager
          .connect(secondAccount)
          .claimWithWhiteList(whiteListId, proofOfSecondAccount);
        expect(
          await seedManager
            .connect(secondAccount)
            .claimed(secondAccount.address)
        ).to.equal(true);
        //expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(1));
        expect(await seed.totalSupply()).to.equal(ethers.getBigInt(1));
        expect(await seed.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(1)
        );
        expect(
          await seed.tokenOfOwnerByIndex(secondAccount.address, 0)
        ).to.equal(ethers.getBigInt(0));
      });

      it("Should revert when has claimed", async function () {
        const { seedManager, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );
        const { rootHash, proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seedManager.unpauseClaimWithWhiteList();
        // set white list
        await seedManager.setWhiteList(whiteListId, rootHash);

        // claim
        expect(
          await seedManager
            .connect(secondAccount)
            .claimed(secondAccount.address)
        ).to.equal(false);
        await seedManager
          .connect(secondAccount)
          .claimWithWhiteList(whiteListId, proofOfSecondAccount);
        expect(
          await seedManager
            .connect(secondAccount)
            .claimed(secondAccount.address)
        ).to.equal(true);

        // claim again should revert
        await expect(
          seedManager
            .connect(secondAccount)
            .claimWithWhiteList(whiteListId, proofOfSecondAccount)
        ).to.be.revertedWith("You have claimed");
      });
    });
  });

  describe("Function claimWithPoints", function () {
    describe("Validations", function () {
      it("Should revert when not enableClaimWithPoints", async function () {
        const { seedManager, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );

        await expect(
          seedManager.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("Claim with point is not open");
      });

      it("Should revert when not set points token address", async function () {
        const { seedManager, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );

        // enable claim
        await seedManager.unpauseClaimWithPoints();

        await seedManager.setPointsTokenAddress(ethers.ZeroAddress);

        await expect(
          seedManager.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("Points token address is not set");
      });

      it("Should revert when not have enough points", async function () {
        const { mockPoints, seedManager, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );

        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(0)
        );

        // enable claim
        await seedManager.unpauseClaimWithPoints();

        // revert because of `pointsCondi == 0`
        await expect(
          seedManager.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("You don't have enough points");

        // set condition to 5k
        await seedManager.setPointsCountCondition(ethers.getBigInt(5_000));
        // only mint 2k points
        const bigInt2k = bigInt(2_000, await mockPoints.decimals());
        await mockPoints.mint(secondAccount.address, bigInt2k);
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          bigInt2k
        );

        // revert because of `points < pointsCondi`
        await expect(
          seedManager.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("You don't have enough points");
      });

      it("Should claim success", async function () {
        const { mockPoints, seed, seedManager, secondAccount } =
          await loadFixture(deploySeedManagerFixture);

        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(0)
        );

        // enable claim
        await seedManager.unpauseClaimWithPoints();
        // default points condition is 5k
        // mint 5k points
        const bigInt5k = bigInt(5_000, await mockPoints.decimals());
        await mockPoints.mint(secondAccount.address, bigInt5k);
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          bigInt5k
        );

        // claim
        expect(
          await seedManager
            .connect(secondAccount)
            .claimed(secondAccount.address)
        ).to.equal(false);
        await seedManager.connect(secondAccount).claimWithPoints();
        expect(
          await seedManager
            .connect(secondAccount)
            .claimed(secondAccount.address)
        ).to.equal(true);
        //expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(1));
        expect(await seed.totalSupply()).to.equal(ethers.getBigInt(1));
        expect(await seed.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(1)
        );
        expect(
          await seed.tokenOfOwnerByIndex(secondAccount.address, 0)
        ).to.equal(ethers.getBigInt(0));
      });

      it("Should revert when has claimed", async function () {
        const { mockPoints, seedManager, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );

        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(0)
        );

        // enable claim
        await seedManager.unpauseClaimWithPoints();
        // default points condition is 5k
        // mint 5k points
        const bigInt5k = bigInt(5_000, await mockPoints.decimals());
        await mockPoints.mint(secondAccount.address, bigInt5k);
        expect(await mockPoints.balanceOf(secondAccount.address)).to.equal(
          bigInt5k
        );

        // claim
        expect(
          await seedManager
            .connect(secondAccount)
            .claimed(secondAccount.address)
        ).to.equal(false);
        await seedManager.connect(secondAccount).claimWithPoints();
        expect(
          await seedManager
            .connect(secondAccount)
            .claimed(secondAccount.address)
        ).to.equal(true);

        // claim again should revert
        await expect(
          seedManager.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("You have claimed");
      });
    });
  });

  describe("Function batchMint", function () {
    describe("Validations", function () {
      it("Should revert when caller is not minter", async function () {
        const { seedManager, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );
        const { addresses } = await loadFixture(fakeBatchMintParam);

        await expect(
          seedManager.connect(secondAccount).batchMint(addresses)
        ).to.be.revertedWith("Only minter can call this method");
      });

      it("Should mint success", async function () {
        const { seed, seedManager, owner } = await loadFixture(
          deploySeedManagerFixture
        );
        const { addresses } = await loadFixture(fakeBatchMintParam);

        //expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(0));

        // batch mint 3 nfts
        await seedManager.batchMint(addresses); // minted nft id: 0, 1, 2

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

  describe("Function mint", function () {
    describe("Validations", function () {
      it("Should revert when not mintable", async function () {
        const { seedManager } = await loadFixture(deploySeedManagerFixture);

        await expect(seedManager.mint(ethers.getBigInt(1))).to.be.revertedWith(
          "Mint is not open"
        );
      });

      it("Should revert when mint amount is zero", async function () {
        const { seedManager } = await loadFixture(deploySeedManagerFixture);

        // enable mint
        await seedManager.unpauseMint();

        // will revert when mint 0
        await expect(seedManager.mint(ethers.getBigInt(0))).to.be.revertedWith(
          "Mint amount must bigger than zero"
        );
      });

      it("Should revert when not set price", async function () {
        const { seedManager } = await loadFixture(deploySeedManagerFixture);

        // enable mint
        await seedManager.unpauseMint();

        await expect(seedManager.mint(ethers.getBigInt(1))).to.be.revertedWith(
          "Insufficient payment"
        );
      });

      it("Should revert when insufficient payment", async function () {
        const { seedManager, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );

        // enable mint
        await seedManager.unpauseMint();

        // set price
        await seedManager.setPrice(ethers.parseEther("2"));

        // revert because of zero payment
        await expect(seedManager.mint(ethers.getBigInt(1))).to.be.revertedWith(
          "Insufficient payment"
        );

        // revert because of insufficient payment
        await expect(
          seedManager
            .connect(secondAccount)
            .mint(ethers.getBigInt(1), { value: ethers.parseEther("1") })
        ).to.be.revertedWith("Insufficient payment");
      });

      it("Should mint success", async function () {
        const { seed, seedManager, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );

        // enable mint
        await seedManager.unpauseMint();

        // set price
        await seedManager.setPrice(ethers.parseEther("2"));

        await seedManager
          .connect(secondAccount)
          .mint(ethers.getBigInt(1), { value: ethers.parseEther("2") }); // minted nft id: 0
        //
        // expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(1));
        expect(await seed.totalSupply()).to.equal(ethers.getBigInt(1));
        //
        expect(await seed.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(1)
        );
        expect(
          await seed.tokenOfOwnerByIndex(secondAccount.address, 0)
        ).to.equal(ethers.getBigInt(0));

        await seedManager
          .connect(secondAccount)
          .mint(ethers.getBigInt(2), { value: ethers.parseEther("4.5") }); // minted nft id: 1, 2
        //
        // expect(await seed.tokenIndex()).to.equal(ethers.getBigInt(3));
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

      it("Should refund the extra native token", async function () {
        const { seed, seedManager, secondAccount } = await loadFixture(
          deploySeedManagerFixture
        );

        // enable mint
        await seedManager.unpauseMint();

        // set price
        await seedManager.setPrice(ethers.parseEther("2"));

        const balanceBefore = await ethers.provider.getBalance(
          secondAccount.address
        );
        // just need pay 2ETH, in act
        await seedManager
          .connect(secondAccount)
          .mint(ethers.getBigInt(1), { value: ethers.parseEther("3.5") }); // minted nft id: 0
        const balanceAfter = await ethers.provider.getBalance(
          secondAccount.address
        );
        expect(balanceBefore - balanceAfter == ethers.parseEther("1.5"));
      });
    });
  });
});
