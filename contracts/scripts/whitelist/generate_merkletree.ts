import { generateMerkleTree, generateProof, readWhitelist } from "./helper";
import fs from "fs";

async function main() {
  // read whitelist
  const whitelist = readWhitelist();

  // generate merkletree
  const tree = generateMerkleTree(whitelist);

  // generate proofs
  const proofs = whitelist.map((item) => {
    const proof = generateProof(tree, item[0]);
    return { address: item[0], proof: proof };
  });

  console.log(`rootHash: ${tree.root}`);

  // write to output.json file
  fs.writeFileSync(
    "scripts/whitelist/output.json",
    JSON.stringify({ rootHash: tree.root, proofs: proofs }, null, 2),
    {
      flag: "a+",
    }
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
