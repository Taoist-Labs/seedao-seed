## 1. List all SGN and holders

```bash
$ npx hardhat run --network mainnet scripts/snapshot/snapshot_holders.ts
```

> !! `--network` param must be `mainnet`, because of old SGN contract is deployed at mainnet.

will generate `snapshot_holders.md` file.

## 2. List all claimed addresses

```bash
$ npx hardhat run --network mainnet scripts/snapshot/snapshot_claimed.ts
```

> !! `--network` param must be `mainnet`, because of old SGN contract is deployed at mainnet.

will generate `snapshot_claimed.md` file.
