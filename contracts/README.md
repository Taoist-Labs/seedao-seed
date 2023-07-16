## Run tests

```
$ REPORT_GAS=true npx hardhat test
```

## Deploy contracts

```
$ npx hardhat run --network bsctest scripts/deploy.ts
current network: bsctest
Deploying SeeDAO...
SeeDAO deployed to 0xfD98A13f9B815C2842b3dDbe9633dD070361490A
```

## Upgrade contracts

```
$ npx hardhat run --network bsctest scripts/upgrade.ts
current network: bsctest
Upgrading SeeDAO...
SeeDAO upgraded
```

## Verify contracts

```
$ npx hardhat verify --network bsctest 0xfD98A13f9B815C2842b3dDbe9633dD070361490A
Verifying implementation: 0x3D00bF07C722c8Bd175FA445B54F0187A2eFcd4b
Successfully submitted source code for contract
contracts/SeeDAO.sol:SeeDAO at 0x3D00bF07C722c8Bd175FA445B54F0187A2eFcd4b
for verification on the block explorer. Waiting for verification result...

Successfully verified contract SeeDAO on the block explorer.
https://testnet.bscscan.com/address/0x3D00bF07C722c8Bd175FA445B54F0187A2eFcd4b#code
Verifying proxy: 0xfD98A13f9B815C2842b3dDbe9633dD070361490A
Contract at 0xfD98A13f9B815C2842b3dDbe9633dD070361490A already verified.
Linking proxy 0xfD98A13f9B815C2842b3dDbe9633dD070361490A with implementation
Successfully linked proxy to implementation.
Verifying proxy admin: 0x3f9b514Fe2d85C464B4DA4cE4De12C0e23A24FB8
Contract at 0x3f9b514Fe2d85C464B4DA4cE4De12C0e23A24FB8 already verified.

Proxy fully verified.
```
