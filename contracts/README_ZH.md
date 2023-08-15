# SEED 合约

[Seed Now, See the DAO](https://seed.seedao.tech/)

## 1. 开发和部署前的准备工作

在开发和部署之前，你需要复制 `.env.example` 并将其重命名为 `.env`，然后修改变量的值。

- `PRIVATE_KEY` 是用于部署合约的账户的私钥

## 2. 运行单元测试

```bash
$ REPORT_GAS=true npx hardhat test
```

## 3. 部署合约

#### 3.1 (可选，部署到主网时不需要) 部署 `MockPoints` 合约

`MockPoints` 合约用于模拟积分 token 合约，仅用于测试，部署到主网时不需要部署。

```bash
$ npx hardhat run --network sepolia scripts/deploy_mockpoints.ts
```

#### 3.2 部署 `Seed` 合约

请先在 `scripts/deploy_seed.ts` #9 行修改和确认积分 token 合约的地址，然后执行部署命令：

```bash
$ npx hardhat run --network mainnet scripts/deploy_seed.ts
```

!! 在调用 `tokenURI(uint256)` 方法获取正确的 token uri 前还需要调用 `setBaseURI(string)` 方法设置 base URI !!

`Seed` 合约支持的管理方法：
* `changeMinter(address)` : 修改 minter 地址
* `setMaxSupply(uint256)` : 设置 NFT 的最大供应量
* `setURILevelRange(uint256[])` : 设置 NFT 的 URI 等级参数规则
* `setBaseURI(string)` : 设置 NFT 的 base URI
* `pause()` : 暂停合约
* `unpause()` : 取消暂停合约

#### 3.3 部署 `SeedManger` 合约

请先在 `scripts/deploy_seed_manager.ts` #9 行修改和确认 `Seed` 合约的地址，然后执行部署命令：

```bash
$ npx hardhat run --network mainnet scripts/deploy_seed_manager.ts 
```

!! 在 `scripts/deploy_seed_manager.ts` 脚本中当部署 `SeedManger` 成功后接着调用了 `Seed` 合约的 `changeMinter(address)` 方法修改其 minter 的地址为 `SeedManger` 合约的地址 !!

> 开启白名单免费 claim 功能，需要调用：
* `setWhiteList(uint256, bytes32)` : 设置白名单
* `unpauseClaimWithWhiteList()` : 开启白名单免费 claim 功能

调用 `unpauseClaimWithWhiteList()` 关闭白名单免费 claim 功能。

> 开启积分免费 claim 功能，需要调用：
* `setPointsTokenAddress(address)` : 设置积分 token 合约地址
* `setPointsCountCondition(uint256)` : 设置积分数量条件
* `unpauseClaimWithPoints()` : 开启积分免费 claim 功能

调用 `pauseClaimWithPoints()` 关闭积分免费 claim 功能。

> 开启付费 mint 功能，需要调用：
* `setPrice(uint256)` : 设置 NFT 售卖价格
* `unpauseMint()` : 开启付费 mint 功能

调用 `pauseMint()` 关闭付费 mint 功能。

> 其他方法：
* `changeMinter(address)` : 修改 minter 地址

## 4. 升级 `SeedManager` 合约

```bash
$ npx hardhat run --network mainnet scripts/upgrade_seed_manager.ts
```

## 5. 验证合约

```bash
# 验证 `Seed` 合约
$ npx hardhat verify --network mainnet [Seed 合约地址] [积分 token 合约地址]

# 验证 `SeedManager` 合约
$ npx hardhat verify --network mainnet []SeedManger 合约地址] [Seed 合约地址]
```
