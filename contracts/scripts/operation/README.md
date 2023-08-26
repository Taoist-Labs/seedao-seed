## 001 airdrop

set the address that needs to be airdropped to `001_airdrop_addresses.txt` and execute the following command to start airdrop:

```shell
$ npx hardhat run --network mainnet scripts/operation/001_airdrop.ts
```

## 002 setClaimed

set the address that needs to be claimed to `002_setClaimed_addresses.txt` and execute the following command to start setting:

```shell
$ npx hardhat run --network mainnet scripts/operation/002_setClaimed.ts
```

## 003

#### 003.1 unpauseClaimWithWhitelist and unpauseClaimWithSCR.ts

enable claim with whitelist and scr:

```shell
$ npx hardhat run --network mainnet scripts/operation/003.1_unpauseClaimWithWhitelist_and_unpauseClaimWithSCR.ts
```

#### 003.2_unpauseSeed.ts

unpause `Seed` contract:

```shell
$ npx hardhat run --network mainnet scripts/operation/003.2_unpauseSeed.ts
```

## 004_setWhitelist.ts

modify and check value of `whitelistId` and `merkleTreeRootHash` in `004_setWhitelist.ts`'s line #14 #16, and execute:

```shell
$ npx hardhat run --network mainnet scripts/operation/004_setWhitelist.ts
```
