import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import nReadlines from "n-readlines";

export function readWhitelist(): string[][] {
  const liner = new nReadlines("scripts/whitelist/whitelist.txt");
  let line;

  let result: string[][] = [];

  while ((line = liner.next())) {
    // console.log(line.toString());
    result.push([line.toString()]);
  }

  return result;
}

export function generateMerkleTree(
  whitelist: string[][]
): StandardMerkleTree<string[]> {
  return StandardMerkleTree.of(whitelist, ["address"]);
}

export function generateProof(
  tree: StandardMerkleTree<string[]>,
  address: string
): string[] {
  return tree.getProof([address]);
}
