# SEED 合约

[Seed Now, See the DAO](https://seed.seedao.xyz/)

## 1. 开发和部署前的准备工作

在开发和部署之前，你需要复制 `.env.example` 并将其重命名为 `.env`，然后修改变量的值。

- `PRIVATE_KEY` 是用于部署合约的账户的私钥

## 2. 运行单元测试

```bash
$ REPORT_GAS=true npx hardhat test
```

## 3. 部署合约

#### 3.1 (可选，部署到主网时不需要) 部署 `MockPoints` 合约

`MockPoints` 合约用于模拟 SCR 合约，仅用于测试，部署到主网时不需要部署。

```bash
$ npx hardhat run --network sepolia scripts/0_deploy_mockpoints.ts
```

#### 3.2 部署 `Seed` 合约

请先在 `scripts/1_deploy_seed.ts` #9 行修改和确认 SCR 合约的地址、#11 行修改和确认 baseURI 的值，然后执行部署命令：

```bash
$ npx hardhat run --network mainnet scripts/1_deploy_seed.ts
```

!! 在调用 `tokenURI(uint256)` 方法获取正确的 token URI 前还需要调用 `setBaseURI(string)` 方法设置 base URI !!

!! 合约默认是 paused 的，开图前需要调用 `unpause()` 方法取消暂停合约才能返回正确的 token URI !!

`Seed` 合约支持的管理方法：

- `transferOwnership(address)` : 修改 owner 地址
- `setSCR(address)` 设置 SCR 合约地址
- `setMaxSupply(uint256)` : 设置 NFT 的最大供应量
- `setURILevelRange(uint256[])` : 设置 NFT 的 URI 等级参数规则
- `setBaseURI(string)` : 设置 NFT 的 base URI
- `pause()` : 暂停合约
- `unpause()` : 取消暂停合约

#### 3.3 部署 `SeedMinter` 合约

请先在 `scripts/2_deploy_seedminter.ts` #9 #11 #13 行修改和确认 `Seed` 合约的地址、SCR 合约的地址和 SCR 数量条件的值，然后执行部署命令：

```bash
$ npx hardhat run --network mainnet scripts/2_deploy_seedminter.ts
```

!! 在 `scripts/2_deploy_seedminter.ts` 脚本中当部署 `SeedMinter` 成功后接着调用了 `Seed` 合约的 `transferOwnership(address)` 方法修改其 owner 的地址为 `SeedMinter` 合约的地址 !!

> 可以调用 `airdrop(address[])` 方法迁移 SGN 到 SEED，一次最多可以传200个地址，如果需要迁移更多的地址，可以多次调用该方法。

> 开启白名单免费 claim 功能，需要调用：

- `setWhitelist(uint256, bytes32)` : 设置白名单
- `unpauseClaimWithWhitelist()` : 开启白名单免费 claim 功能

调用 `unpauseClaimWithWhitelist()` 关闭白名单免费 claim 功能。

> 开启 SCR 免费 claim 功能，需要调用：

- `unpauseClaimWithSCR()` : 开启 SCR 免费 claim 功能

可以调用`setSCR(address)` 设置积分 token 合约地址，调用 `setSCRAmountCondi(uint256)` 设置 SCR 数量条件，调用 `pauseClaimWithSCR()` 关闭 SCR 免费 claim 功能。

> 开启付费 mint 功能，需要调用：

- `setPrice(uint256)` : 设置 NFT 售卖价格
- `unpauseMint()` : 开启付费 mint 功能

调用 `pauseMint()` 关闭付费 mint 功能。

> 其他方法：

- `setClaimed(address[]` : 设置已经 claim 过的地址
- `changeMinter(address)` : 修改 minter 地址
- `withdraw()` : 提取合约中的原生币到 owner 地址
- `setSeedMaxSupply(uint256)` : 设置 `Seed` 合约的最大供应量
- `setSeedSCR(address)` : 设置 `Seed` 合约的 SCR 地址
- `setSeedBaseURI(string)` : 设置 `Seed` 合约的 base URI
- `setSeedURILevelRange(uint256[])` : 设置 `Seed` 合约的 URI 等级参数规则
- `pauseSeed()` : 暂停 `Seed` 合约
- `unpauseSeed()` : 取消暂停 `Seed` 合约
- `transferSeedOwnership(address)` : 修改 Seed 合约的 owner 地址

## 4. 升级 `SeedMinter` 合约

```bash
$ npx hardhat run --network mainnet scripts/upgrade_seedminter.ts
```

## 5. 验证合约

```bash
# 验证 `Seed` 合约
$ npx hardhat verify --network mainnet [Seed 合约地址] [SCR 合约地址]

# 验证 `SeedMinter` 合约
$ npx hardhat verify --network mainnet [SeedMinter 合约地址]
```
