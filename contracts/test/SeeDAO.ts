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
    const mockERC20 = (await upgrades.deployProxy(
      MockERC20
    )) as unknown as MockERC20;
    await mockERC20.waitForDeployment();

    return { mockERC20, owner };
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

  // generate migrate param
  async function fakeMigrateParam() {
    const [owner, secondAccount, thirdAccount] = await ethers.getSigners();

    const ids = [
      ethers.getBigInt(100),
      ethers.getBigInt(101),
      ethers.getBigInt(102),
    ];

    const tos = [owner.address, secondAccount.address, thirdAccount.address];

    return { ids, tos };
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

  describe("Function changeMinter()", function () {
    describe("Validations", function () {
      it("Should revert when caller is not owner", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        await expect(
          seeDAO.connect(secondAccount).changeMinter(secondAccount.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should change minter success", async function () {
        const { seeDAO, owner, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        expect(await seeDAO.minter()).to.equal(owner.address);
        await seeDAO.changeMinter(secondAccount.address);
        expect(await seeDAO.minter()).to.equal(secondAccount.address);
      });
    });

    describe("Events", function () {
      it("Should emit an event on changeMinter", async function () {
        const { seeDAO, owner, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        await expect(seeDAO.changeMinter(secondAccount.address))
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
      expect(await seeDAO.pointsCondi()).to.equal(
        bigInt(5_000, await mockERC20.decimals())
      );
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
      it("Should revert when not enableClaimWithWhiteList", async function () {
        const { seeDAO } = await loadFixture(deploySeeDAOFixture);
        const { proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        await expect(
          seeDAO.claimWithWhiteList(whiteListId, proofOfSecondAccount)
        ).to.be.revertedWith("Claim with white list is not open");
      });

      it("Should revert when not int whiteList", async function () {
        const { seeDAO } = await loadFixture(deploySeeDAOFixture);
        const { proofOfFakeAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seeDAO.unpauseClaimWithWhiteList();

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
        await seeDAO.unpauseClaimWithWhiteList();
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
        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(1));
        expect(await seeDAO.totalSupply()).to.equal(ethers.getBigInt(1));
        expect(await seeDAO.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(1)
        );
        expect(
          await seeDAO.tokenOfOwnerByIndex(secondAccount.address, 0)
        ).to.equal(ethers.getBigInt(0));
      });

      it("Should revert when has claimed", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { rootHash, proofOfSecondAccount } = await loadFixture(
          generateMerkleTreeAndProof
        );

        // enable claim
        await seeDAO.unpauseClaimWithWhiteList();
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
        await seeDAO.unpauseClaimWithWhiteList();
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

  describe("Function claimWithPoints", function () {
    describe("Validations", function () {
      it("Should revert when not enableClaimWithPoints", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        await expect(
          seeDAO.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("Claim with point is not open");
      });

      it("Should revert when not set points token address", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        // enable claim
        await seeDAO.unpauseClaimWithPoints();

        await expect(
          seeDAO.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("Points token address is not set");
      });

      it("Should revert when not have enough points", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { mockERC20 } = await loadFixture(deployMockERC20Fixture);

        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(0)
        );

        // enable claim
        await seeDAO.unpauseClaimWithPoints();
        // set points token address
        await seeDAO.setPointsTokenAddress(mockERC20);

        // revert because of `pointsCondi == 0`
        await expect(
          seeDAO.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("You don't have enough points");

        // set condition to 5k
        await seeDAO.setPointsCondition(ethers.getBigInt(5_000));
        // only mint 2k points
        const bigInt2k = bigInt(2_000, await mockERC20.decimals());
        await mockERC20.mint(secondAccount.address, bigInt2k);
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(
          bigInt2k
        );

        // revert because of `points < pointsCondi`
        await expect(
          seeDAO.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("You don't have enough points");
      });

      it("Should claim success", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { mockERC20 } = await loadFixture(deployMockERC20Fixture);

        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(0)
        );

        // enable claim
        await seeDAO.unpauseClaimWithPoints();
        // set points token address and set condition to 5k
        await seeDAO.setPointsTokenAddress(mockERC20);
        await seeDAO.setPointsCondition(ethers.getBigInt(5_000));
        // mint 5k points
        const bigInt5k = bigInt(5_000, await mockERC20.decimals());
        await mockERC20.mint(secondAccount.address, bigInt5k);
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(
          bigInt5k
        );

        // claim
        expect(
          await seeDAO.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(false);
        await seeDAO.connect(secondAccount).claimWithPoints();
        expect(
          await seeDAO.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(true);
        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(1));
        expect(await seeDAO.totalSupply()).to.equal(ethers.getBigInt(1));
        expect(await seeDAO.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(1)
        );
        expect(
          await seeDAO.tokenOfOwnerByIndex(secondAccount.address, 0)
        ).to.equal(ethers.getBigInt(0));
      });

      it("Should revert when has claimed", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { mockERC20 } = await loadFixture(deployMockERC20Fixture);

        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(0)
        );

        // enable claim
        await seeDAO.unpauseClaimWithPoints();
        // set points token address and set condition to 5k
        await seeDAO.setPointsTokenAddress(mockERC20);
        await seeDAO.setPointsCondition(ethers.getBigInt(5_000));
        // mint 5k points
        const bigInt5k = bigInt(5_000, await mockERC20.decimals());
        await mockERC20.mint(secondAccount.address, bigInt5k);
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(
          bigInt5k
        );

        // claim
        expect(
          await seeDAO.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(false);
        await seeDAO.connect(secondAccount).claimWithPoints();
        expect(
          await seeDAO.connect(secondAccount).claimed(secondAccount.address)
        ).to.equal(true);

        // claim again should revert
        await expect(
          seeDAO.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("You have claimed");
      });
    });

    describe("Events", function () {
      it("Should emit an event on claimWithWhiteList", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { mockERC20 } = await loadFixture(deployMockERC20Fixture);

        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(0)
        );

        // enable claim
        await seeDAO.unpauseClaimWithPoints();
        // set points token address and set condition to 5k
        await seeDAO.setPointsTokenAddress(mockERC20);
        await seeDAO.setPointsCondition(ethers.getBigInt(5_000));
        // mint 5k points
        const bigInt5k = bigInt(5_000, await mockERC20.decimals());
        await mockERC20.mint(secondAccount.address, bigInt5k);
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(
          bigInt5k
        );

        // claim
        expect(await seeDAO.claimed(secondAccount.address)).to.equal(false);
        await expect(seeDAO.connect(secondAccount).claimWithPoints())
          .to.be.emit(seeDAO, "Transfer")
          .withArgs(ethers.ZeroAddress, secondAccount.address, 0);
        expect(await seeDAO.claimed(secondAccount.address)).to.equal(true);
      });
    });
  });

  describe("Function batchMint", function () {
    describe("Validations", function () {
      it("Should revert when caller is not minter", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { addresses } = await loadFixture(fakeBatchMintParam);

        await expect(
          seeDAO.connect(secondAccount).batchMint(addresses)
        ).to.be.revertedWith("Only minter can call this method");
      });

      it("Should revert when exceeds max supply", async function () {
        const { seeDAO } = await loadFixture(deploySeeDAOFixture);
        const { addresses } = await loadFixture(fakeBatchMintParam);

        // set max supply to 2
        await seeDAO.setMaxSupply(ethers.getBigInt(2));

        // will revert when batch mint 3
        await expect(seeDAO.batchMint(addresses)).to.be.revertedWith(
          "Exceeds the maximum supply"
        );
      });

      it("Should mint success", async function () {
        const { seeDAO, owner } = await loadFixture(deploySeeDAOFixture);
        const { addresses } = await loadFixture(fakeBatchMintParam);

        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(0));

        // batch mint 3 nfts
        await seeDAO.batchMint(addresses); // minted nft id: 0, 1, 2

        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(3));
        expect(await seeDAO.totalSupply()).to.equal(ethers.getBigInt(3));

        for (let i = 0; i < addresses.length; i++) {
          expect(await seeDAO.balanceOf(addresses[i])).to.equal(
            ethers.getBigInt(1)
          );
          expect(await seeDAO.tokenOfOwnerByIndex(addresses[i], 0)).to.equal(
            ethers.getBigInt(i)
          );
        }
      });
    });

    // describe("Events", function () {
    //   it("Should emit an event on batchMint", async function () {
    //     });
    // });
  });

  describe("Function mint", function () {
    describe("Validations", function () {
      it("Should revert when not mintable", async function () {
        const { seeDAO } = await loadFixture(deploySeeDAOFixture);

        await expect(seeDAO.mint(ethers.getBigInt(1))).to.be.revertedWith(
          "Mint is not open"
        );
      });

      it("Should revert when mint amount is zero", async function () {
        const { seeDAO } = await loadFixture(deploySeeDAOFixture);

        // enable mint
        await seeDAO.unpauseMint();

        // will revert when mint 0
        await expect(seeDAO.mint(ethers.getBigInt(0))).to.be.revertedWith(
          "Mint amount must bigger than zero"
        );
      });

      it("Should revert when exceeds max supply", async function () {
        const { seeDAO } = await loadFixture(deploySeeDAOFixture);

        // enable mint
        await seeDAO.unpauseMint();

        // set price
        await seeDAO.setPrice(ethers.parseEther("2"));

        // set max supply to 2
        await seeDAO.setMaxSupply(ethers.getBigInt(2));

        // will revert when mint 3
        await expect(
          seeDAO.mint(ethers.getBigInt(3), { value: ethers.parseEther("6") })
        ).to.be.revertedWith("Exceeds the maximum supply");
      });

      it("Should revert when not set price", async function () {
        const { seeDAO } = await loadFixture(deploySeeDAOFixture);

        // enable mint
        await seeDAO.unpauseMint();

        await expect(seeDAO.mint(ethers.getBigInt(1))).to.be.revertedWith(
          "Insufficient payment"
        );
      });

      it("Should revert when insufficient payment", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        // enable mint
        await seeDAO.unpauseMint();

        // set price
        await seeDAO.setPrice(ethers.parseEther("2"));

        // revert because of zero payment
        await expect(seeDAO.mint(ethers.getBigInt(1))).to.be.revertedWith(
          "Insufficient payment"
        );

        // revert because of insufficient payment
        await expect(
          seeDAO
            .connect(secondAccount)
            .mint(ethers.getBigInt(1), { value: ethers.parseEther("1") })
        ).to.be.revertedWith("Insufficient payment");
      });

      it("Should mint success", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        // enable mint
        await seeDAO.unpauseMint();

        // set price
        await seeDAO.setPrice(ethers.parseEther("2"));

        await seeDAO
          .connect(secondAccount)
          .mint(ethers.getBigInt(1), { value: ethers.parseEther("2") }); // minted nft id: 0
        //
        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(1));
        expect(await seeDAO.totalSupply()).to.equal(ethers.getBigInt(1));
        //
        expect(await seeDAO.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(1)
        );
        expect(
          await seeDAO.tokenOfOwnerByIndex(secondAccount.address, 0)
        ).to.equal(ethers.getBigInt(0));

        await seeDAO
          .connect(secondAccount)
          .mint(ethers.getBigInt(2), { value: ethers.parseEther("4.5") }); // minted nft id: 1, 2
        //
        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(3));
        expect(await seeDAO.totalSupply()).to.equal(ethers.getBigInt(3));
        //
        expect(await seeDAO.balanceOf(secondAccount.address)).to.equal(
          ethers.getBigInt(3)
        );
        expect(
          await seeDAO.tokenOfOwnerByIndex(secondAccount.address, 0)
        ).to.equal(ethers.getBigInt(0));
        expect(
          await seeDAO.tokenOfOwnerByIndex(secondAccount.address, 1)
        ).to.equal(ethers.getBigInt(1));
        expect(
          await seeDAO.tokenOfOwnerByIndex(secondAccount.address, 2)
        ).to.equal(ethers.getBigInt(2));
      });
    });

    // describe("Events", function () {
    //   it("Should emit an event on batchMint", async function () {
    //     });
    // });
  });

  describe("Function tokenURI", function () {
    describe("Validations", function () {
      it("Use default uri level ranges", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { mockERC20, owner } = await loadFixture(deployMockERC20Fixture);

        const baseURI = "ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD";

        const mockERC20Decimals = await mockERC20.decimals();

        // secondAccount mint nft #0
        await seeDAO.unpauseMint();
        await seeDAO.setPrice(ethers.parseEther("1"));
        await seeDAO
          .connect(secondAccount)
          .mint(ethers.getBigInt(1), { value: ethers.parseEther("1") });

        // set token uri
        await seeDAO.setBaseURI(baseURI);

        // set points token address firstly
        await seeDAO.setPointsTokenAddress(mockERC20);

        // [20_000, 300_000, 3_000_000, 30_000_000]
        // case1: mint 100 points to secondAccount
        await mockERC20.connect(owner).mint(secondAccount.address, ethers.parseUnits("100", mockERC20Decimals));
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("100", mockERC20Decimals));
        // with 100 points, nft uri level is 1
        expect(await seeDAO.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_1.json`);
        // case2: mint 20_000 points to secondAccount
        await mockERC20.connect(owner).mint(secondAccount.address, ethers.parseUnits("20000", mockERC20Decimals));
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("20100", mockERC20Decimals));
        // with 20_000 points, nft uri level is 2
        expect(await seeDAO.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_2.json`);
        // case3: mint 300_000 points to secondAccount
        await mockERC20.connect(owner).mint(secondAccount.address, ethers.parseUnits("300000", mockERC20Decimals));
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("320100", mockERC20Decimals));
        // with 300_000 points, nft uri level is 3
        expect(await seeDAO.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_3.json`);
        // case4: mint 3_000_000 points to secondAccount
        await mockERC20.connect(owner).mint(secondAccount.address, ethers.parseUnits("3000000", mockERC20Decimals));
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("3320100", mockERC20Decimals));
        // with 3_000_000 points, nft uri level is 4
        expect(await seeDAO.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_4.json`);
        // case5: mint 30_000_000 points to secondAccount
        await mockERC20.connect(owner).mint(secondAccount.address, ethers.parseUnits("30000000", mockERC20Decimals));
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("33320100", mockERC20Decimals));
        // with 30_000_000 points, nft uri level is 5
        expect(await seeDAO.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_5.json`);
      });

      it("Use custom uri level ranges", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { mockERC20, owner } = await loadFixture(deployMockERC20Fixture);

        const baseURI = "ipfs://QmSDdbLq2QDEgNUQGwRH7iVrcZiTy6PvCnKrdawGbTa7QD";

        const mockERC20Decimals = await mockERC20.decimals();

        // secondAccount mint nft #0
        await seeDAO.unpauseMint();
        await seeDAO.setPrice(ethers.parseEther("1"));
        await seeDAO.connect(secondAccount).mint(ethers.getBigInt(1), { value: ethers.parseEther("1") });

        // set token uri
        await seeDAO.setBaseURI(baseURI);

        // set points token address firstly
        await seeDAO.setPointsTokenAddress(mockERC20);

        // set custom uri level ranges: [100, 1_000, 10_000, 100_000]
        await seeDAO.setURILevelRange([ethers.getBigInt(100), ethers.getBigInt(1_000), ethers.getBigInt(10_000), ethers.getBigInt(100_000), ]);

        // [100, 1_000, 10_000, 100_000]
        // case1: mint 10 points to secondAccount
        await mockERC20.connect(owner).mint(secondAccount.address, ethers.parseUnits("10", mockERC20Decimals));
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("10", mockERC20Decimals));
        // with 10 points, nft uri level is 1
        expect(await seeDAO.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_1.json`);
        // case2: mint 100 points to secondAccount
        await mockERC20.connect(owner).mint(secondAccount.address, ethers.parseUnits("100", mockERC20Decimals));
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("110", mockERC20Decimals));
        // with 100 points, nft uri level is 2
        expect(await seeDAO.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_2.json`);
        // case3: mint 1_000 points to secondAccount
        await mockERC20.connect(owner).mint(secondAccount.address, ethers.parseUnits("1000", mockERC20Decimals));
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("1110", mockERC20Decimals));
        // with 1_000 points, nft uri level is 3
        expect(await seeDAO.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_3.json`);
        // case4: mint 10_000 points to secondAccount
        await mockERC20.connect(owner).mint(secondAccount.address, ethers.parseUnits("10000", mockERC20Decimals));
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("11110", mockERC20Decimals));
        // with 10_000 points, nft uri level is 4
        expect(await seeDAO.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_4.json`);
        // case5: mint 100_000 points to secondAccount
        await mockERC20.connect(owner).mint(secondAccount.address, ethers.parseUnits("100000", mockERC20Decimals));
        expect(await mockERC20.balanceOf(secondAccount.address)).to.equal(ethers.parseUnits("111110", mockERC20Decimals));
        // with 100_000 points, nft uri level is 5
        expect(await seeDAO.tokenURI(ethers.getBigInt(0))).to.equal(`${baseURI}/0_5.json`);
      });
    });
  });
});
