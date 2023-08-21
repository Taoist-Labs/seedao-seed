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

`MockPoints` contract is used to simulate the SCR contract, which is only used for testing and does not need to be deployed to the mainnet when deploying.

```bash
$ npx hardhat run --network sepolia scripts/0_deploy_mockpoints.ts
```

#### 3.2 Deploy `Seed` contract

Please modify and confirm the address of the SCR contract in `scripts/1_deploy_seed.ts` #9 line, and then execute the deployment command:

```bash
$ npx hardhat run --network mainnet scripts/1_deploy_seed.ts
```

!! Before calling the `tokenURI(uint256)` method to get the correct token URI, you need to call the `setBaseURI(string)` method to set the base URI !!

!! The contract is paused by default, and you need to call `unpause()` method to unpause the contract before open-picture to return the correct token URI !!

Management methods supported by `Seed` contract:

- `transferOwnership(address)` : change owner address
- `setSCR(address)` : set SCR contract address
- `setMaxSupply(uint256)` : set the maximum supply of NFT
- `setURILevelRange(uint256[])` : set the URI level parameter rule of NFT
- `setBaseURI(string)` : set the base URI of NFT
- `pause()` : pause contract
- `unpause()` : unpause contract

#### 3.3 Deploy `SeedMinter` contract

Please modify and confirm the value of the `Seed` contract address, the SCR address and the SCR amount condition in `scripts/2_deploy_seedminter.ts` #9 #11 #13 line, and then execute the deployment command:

```bash
$ npx hardhat run --network mainnet scripts/2_deploy_seedminter.ts
```

!! After the `SeedMinter` contract is deployed successfully in the `scripts/2_deploy_seedminter.ts` script, the `transferOwnership(address)` method of the `Seed` contract is called to modify its owner address to the address of the `SeedMinter` contract !!

> You can call `airdrop(address[])` method to migrate SGN to SEED, up to 200 addresses can be passed at one time, if you need to migrate more addresses, you can call this method multiple times.

> To enable the whitelist free claim feature, you need to call:

- `setWhitelist(uint256, bytes32)` : set whitelist
- `unpauseClaimWithWhitelist()` : enable whitelist claim feature

Call `unpauseClaimWithWhitelist()` to disable the whitelist free claim feature.

> To enable the SCR free claim feature, you need to call:

- `unpauseClaimWithSCR()` : enable SCR free claim feature

You can call `setSCR(address)` to set the SCR contract address, call `setSCRAmountCondi(uint256)` to set the SCR amount condition, call `pauseClaimWithSCR()` to disable the SCR free claim feature.

> To enable pay mint feature, you need to call:

- `setPrice(uint256)` : set NFT price
- `unpauseMint()` : enable pay mint feature

Call `pauseMint()` to disable the pay mint feature.

> Other methods:

- `setClaimed(address[]` : set has claimed addresses
- `changeMinter(address)` : change minter address
- `withdraw()` : withdraw native token from contract to owner address
- `setSeedMaxSupply(uint256)` : set `Seed` contract's max supply
- `setSeedSCR(address)` : set `Seed` contract's SCR address
- `setSeedBaseURI(string)` : set `Seed` contract's base URI
- `setSeedURILevelRange(uint256[])` : set `Seed` contract's URI level range
- `pauseSeed()` : pause `Seed` contract
- `unpauseSeed()` : unpause `Seed` contract
- `transferSeedOwnership(address)` : change Seed contract's owner address

## 4. Upgrade `SeedMinter` contracts

```bash
$ npx hardhat run --network mainnet scripts/upgrade_seedminter.ts
```

## 5. Verify contracts

```bash
# verify `Seed` contract
$ npx hardhat verify --network mainnet [Seed address] [SCR address]

# verify `SeedMinter` contract
$ npx hardhat verify --network mainnet [SeedMinter address]
```
