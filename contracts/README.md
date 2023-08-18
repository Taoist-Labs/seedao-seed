# SEED Contract

[Seed Now, See the DAO](https://seed.seedao.xyz/)

## 1. Prepare for development and deployment

before development and deployment, you need to copy `.env.example` and rename it to `.env`, and then modify the variable's value.

- `PRIVATE_KEY` is the private key of the account used to deploy the contract

## 2. Run unit tests

```bash
$ REPORT_GAS=true npx hardhat test
```

## 3. Deploy contracts

#### 3.1 (Optional, not required when deploying to mainnet) Deploy `MockPoints` contract

`MockPoints` contract is used to simulate the points token contract, which is only used for testing and does not need to be deployed to the mainnet when deploying.

```bash
$ npx hardhat run --network sepolia scripts/0_deploy_mockpoints.ts
```

#### 3.2 Deploy `Seed` contract

Please modify and confirm the address of the points token contract in `scripts/1_deploy_seed.ts` #9 line, and then execute the deployment command:

```bash
$ npx hardhat run --network mainnet scripts/1_deploy_seed.ts
```

!! Before calling the `tokenURI(uint256)` method to get the correct token URI, you need to call the `setBaseURI(string)` method to set the base URI !!

!! The contract is paused by default, and you need to call `unpause()` method to unpause the contract before open-picture to return the correct token URI !!

Management methods supported by `Seed` contract:

- `transferOwnership(address)` : change owner address
- `setPointsTokenAddress(address)` : set points token contract address
- `setMaxSupply(uint256)` : set the maximum supply of NFT
- `setURILevelRange(uint256[])` : set the URI level parameter rule of NFT
- `setBaseURI(string)` : set the base URI of NFT
- `pause()` : pause contract
- `unpause()` : unpause contract

#### 3.3 Deploy `SeedManger` contract

Please modify and confirm the value of the `Seed` contract address, the points token address and the points count condition in `scripts/2_deploy_seedminter.ts` #9 #11 #13 line, and then execute the deployment command:

```bash
$ npx hardhat run --network mainnet scripts/2_deploy_seedminter.ts
```

!! After the `SeedManger` contract is deployed successfully in the `scripts/2_deploy_seedminter.ts` script, the `changeMinter(address)` method of the `Seed` contract is called to modify its minter address to the address of the `SeedManger` contract !!

> call `migrate(address[])` method to migrate SGN to SEED, up to 200 addresses can be passed at one time, if you need to migrate more addresses, you can call this method multiple times.

> To enable the whitelist free claim feature, you need to call:

- `setWhiteList(uint256, bytes32)` : set whitelist
- `unpauseClaimWithWhiteList()` : enable whitelist claim feature

Call `unpauseClaimWithWhiteList()` to disable the whitelist free claim feature.

> To enable the points free claim feature, you need to call:

- `unpauseClaimWithPoints()` : enable points claim feature

You can call `setPointsTokenAddress(address)` to set the points token contract address, call `setPointsCountCondition(uint256)` to set the points count condition, call `pauseClaimWithPoints()` to disable the points free claim feature.

> To enable payed mint feature, you need to call:

- `setPrice(uint256)` : set NFT price
- `unpauseMint()` : enable payed mint feature

Call `pauseMint()` to disable the payed mint feature.

> Other methods:

- `transferSeedOwnership(address)` : change Seed contract's owner address
- `setHasClaimed(address[]` : set has claimed addresses
- `changeMinter(address)` : change minter address

## 4. Upgrade `SeedManager` contracts

```bash
$ npx hardhat run --network mainnet scripts/upgrade_seedminter.ts
```

## 5. Verify contracts

```bash
# verify `Seed` contract
$ npx hardhat verify --network mainnet [Seed 合约地址] [积分 token 合约地址]

# verify `SeedManager` contract
$ npx hardhat verify --network mainnet []SeedManger 合约地址]
```
