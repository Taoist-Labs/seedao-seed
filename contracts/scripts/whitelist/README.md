## Run

first, fill whitelist addresses in `whitelist.txt` file, and then execute:

```bash
$ npx hardhat run scripts/whitelist/generate_merkletree.ts
```

this command will read `whitelist.txt` and then generate `out.json`

- `out.json` will be used in web frontend
- `rootHash` field in `out.json` will be used in `set_whitelist.ts`
