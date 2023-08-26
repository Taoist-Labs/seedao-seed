import nReadlines from "n-readlines";

export function readAddresses(file: string, batchSize: number): string[][] {
  const liner = new nReadlines(file);
  let line;

  let result: string[][] = [];

  let index = 0;
  let batchId = -1;
  while ((line = liner.next())) {
    // console.log(line.toString());
    if (line.toString().trim().length == 0) {
      continue;
    }

    if (index % batchSize == 0) {
      batchId++;
      result[batchId] = [];
    }

    result[batchId][index - batchSize * batchId] = line.toString();

    index++;
  }

  return result;
}
