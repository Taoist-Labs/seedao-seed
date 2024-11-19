## 

为 whitelist.txt 里的地址生成 Merkle Tree Proof

## How to run?

first, fill whitelist addresses in `whitelist.txt` file, and then execute:

```bash
$ npx hardhat run scripts/whitelist/generate_merkletree.ts
```

this command will read `whitelist.txt` and then generate `output.json`

- `output.json` will be used in web frontend
- `rootHash` field in `output.json` will be used in `set_whitelist.ts`
