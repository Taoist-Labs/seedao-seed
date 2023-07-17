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

  // generate batch mint infos
  async function fakeBatchMintInfos() {
    const [owner, secondAccount, thirdAccount] = await ethers.getSigners();

    // const mintInfos = [
    //   new SeeDAONS.BatchMintInfoStruct(owner.address, ethers.getBigInt(100)),
    //   new SeeDAONS.BatchMintInfoStruct(
    //     secondAccount.address,
    //     ethers.getBigInt(101)
    //   ),
    //   new SeeDAONS.BatchMintInfoStruct(
    //     thirdAccount.address,
    //     ethers.getBigInt(102)
    //   ),
    // ];

    const mint2Infos = [
      owner.address,
      secondAccount.address,
      thirdAccount.address,
    ];

    return { mint2Infos };
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

        // enable claim
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

  describe("Function claimWithPoints", function () {
    describe("Validations", function () {
      it("Should revert when not claimable", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        await expect(
          seeDAO.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWith("Claim is not open");
      });

      it("Should revert when not set points token address", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        // enable claim
        await seeDAO.unpauseClaim();

        await expect(
          seeDAO.connect(secondAccount).claimWithPoints()
        ).to.be.revertedWithoutReason();
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
        await seeDAO.unpauseClaim();
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
        await seeDAO.unpauseClaim();
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
        await seeDAO.unpauseClaim();
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
        await seeDAO.unpauseClaim();
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
        const { mintInfos } = await loadFixture(fakeBatchMintInfos);

        await expect(
          seeDAO.connect(secondAccount).batchMint(mintInfos)
        ).to.be.revertedWith("Only minter can call this method");
      });

      it("Should revert when exceeds max supply", async function () {
        const { seeDAO } = await loadFixture(deploySeeDAOFixture);
        const { mintInfos } = await loadFixture(fakeBatchMintInfos);

        // set max supply to 2
        await seeDAO.setMaxSupply(ethers.getBigInt(2));

        // will revert when batch mint 3
        await expect(seeDAO.batchMint(mintInfos)).to.be.revertedWith(
          "Exceeds the maximum supply"
        );
      });

      it("Should mint success", async function () {
        const { seeDAO, owner } = await loadFixture(deploySeeDAOFixture);
        const { mintInfos } = await loadFixture(fakeBatchMintInfos);

        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(0));

        // batch mint 3 nfts
        await seeDAO.batchMint(mintInfos); // minted nft id: 0, 1, 2

        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(3));
        expect(await seeDAO.totalSupply()).to.equal(ethers.getBigInt(3));

        for (var i = 0; i < mintInfos.length; i++) {
          expect(await seeDAO.balanceOf(mintInfos[i].to)).to.equal(
            ethers.getBigInt(1)
          );
          expect(await seeDAO.tokenOfOwnerByIndex(mintInfos[i].to, 0)).to.equal(
            mintInfos[i].tokenId
          );
        }
      });

      it("Should revert when mint a has minted nft", async function () {
        const { seeDAO, owner } = await loadFixture(deploySeeDAOFixture);
        const { mintInfos } = await loadFixture(fakeBatchMintInfos);

        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(0));

        // batch mint 3 nfts
        await seeDAO.batchMint(mintInfos); // minted nft id: 0, 1, 2

        // --- --- --- duplicate code
        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(3));
        expect(await seeDAO.totalSupply()).to.equal(ethers.getBigInt(3));

        for (var i = 0; i < mintInfos.length; i++) {
          expect(await seeDAO.balanceOf(mintInfos[i].to)).to.equal(
            ethers.getBigInt(1)
          );
          expect(await seeDAO.tokenOfOwnerByIndex(mintInfos[i].to, 0)).to.equal(
            mintInfos[i].tokenId
          );
        }
        // --- --- ---

        // batch mint 3 nfts again will revert
        await expect(seeDAO.batchMint(mintInfos)).to.be.revertedWith(
          "Token already minted"
        );
      });
    });

    // describe("Events", function () {
    //   it("Should emit an event on batchMint", async function () {
    //     });
    // });
  });

  describe("Function batchMint2", function () {
    describe("Validations", function () {
      it("Should revert when caller is not minter", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );
        const { mint2Infos } = await loadFixture(fakeBatchMintInfos);

        await expect(
          seeDAO.connect(secondAccount).batchMint2(mint2Infos)
        ).to.be.revertedWith("Only minter can call this method");
      });

      it("Should revert when exceeds max supply", async function () {
        const { seeDAO } = await loadFixture(deploySeeDAOFixture);
        const { mint2Infos } = await loadFixture(fakeBatchMintInfos);

        // set max supply to 2
        await seeDAO.setMaxSupply(ethers.getBigInt(2));

        // will revert when batch mint 3
        await expect(seeDAO.batchMint2(mint2Infos)).to.be.revertedWith(
          "Exceeds the maximum supply"
        );
      });

      it("Should mint success", async function () {
        const { seeDAO, owner } = await loadFixture(deploySeeDAOFixture);
        const { mint2Infos } = await loadFixture(fakeBatchMintInfos);

        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(0));

        // batch mint 3 nfts
        await seeDAO.batchMint2(mint2Infos); // minted nft id: 0, 1, 2

        expect(await seeDAO.tokenIndex()).to.equal(ethers.getBigInt(3));
        expect(await seeDAO.totalSupply()).to.equal(ethers.getBigInt(3));

        for (var i = 0; i < mint2Infos.length; i++) {
          expect(await seeDAO.balanceOf(mint2Infos[i])).to.equal(
            ethers.getBigInt(1)
          );
          expect(await seeDAO.tokenOfOwnerByIndex(mint2Infos[i], 0)).to.equal(
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

      it("Should revert when exceeds max supply", async function () {
        const { seeDAO, secondAccount } = await loadFixture(
          deploySeeDAOFixture
        );

        // enable mint
        await seeDAO.unpauseMint();

        // set price
        await seeDAO.setPrice(ethers.parseEther("2"));

        // set max supply to 2
        await seeDAO.setMaxSupply(ethers.getBigInt(2));

        // will revert when mint 3
        await expect(
          seeDAO
            .connect(secondAccount)
            .mint(ethers.getBigInt(3), { value: ethers.parseEther("6") })
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
        await expect(
          seeDAO.connect(secondAccount).mint(ethers.getBigInt(1))
        ).to.be.revertedWith("Insufficient payment");

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
});
