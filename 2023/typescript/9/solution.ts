import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const data = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split(" ").map(Number));

const allSame = (arr: number[]) => arr.every((val) => val === arr[0]);

const findNext = (data: number[]) => {
  const lasts: number[] = [data[data.length - 1]];
  let current = data;

  while (!allSame(current)) {
    const diffs = [];
    for (let i = 0; i < current.length - 1; i++) {
      diffs.push(current[i + 1] - current[i]);
    }
    lasts.push(diffs[diffs.length - 1]);
    current = diffs;
  }

  return lasts.reduce((acc, val) => acc + val, 0);
};

const findPrev = (data: number[]) => {
  const firsts: number[] = [data[0]];
  let current = data;

  while (!allSame(current)) {
    const diffs = [];
    for (let i = 0; i < current.length - 1; i++) {
      diffs.push(current[i + 1] - current[i]);
    }
    firsts.push(diffs[0]);
    current = diffs;
  }

  firsts.reverse();
  return firsts.reduce((acc, val) => val - acc, 0);
};

const partOne = () => data.map(findNext).reduce((acc, val) => acc + val, 0);
const partTwo = () => data.map(findPrev).reduce((acc, val) => acc + val, 0);

runPart("One", partOne); // 1725987467 took 1.3807ms, allocated 0.900136MB on the heap.
runPart("Two", partTwo); // 971 took 1.6833ms, allocated 0.79872MB on the heap.
