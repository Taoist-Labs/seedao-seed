## 

先获取 SCR 代币的所有持有地址，然后过滤出 SCR 数量大于 100_000 的地址，最后再检查这些地址有没有 mint 过 SEED，如果没有就是新的白名单地址。

## How to run?

```bash
$ npx hardhat run --network mainnet scripts/whitelist/filter_new_whitelist/filter_new_whitelist.ts
```

The new whitelist addresses will be saved in `scripts/whitelist/filter_new_whitelist/new_whitelist.txt`.
