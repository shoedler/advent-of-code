import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const [timesStr, distsStr] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.substring(10));

const times = timesStr.split(/\s+/).map(Number);
const dists = distsStr.split(/\s+/).map(Number);

const evalGame = (maxTime, winningDist) => {
  let result = 0;

  for (let i = 0; i <= maxTime; i++) {
    const possibleDist = i * (maxTime - i);
    if (possibleDist >= winningDist) {
      result++;
    }
  }

  return result;
};

const partOne = () =>
  times
    .map((t, i) => [t, dists[i]])
    .reduce((acc, [t, d]) => acc * evalGame(t, d), 1);

const partTwo = () => {
  let largeTime = parseInt(timesStr.replace(/\s+/g, ""), 10);
  let largeDist = parseInt(distsStr.replace(/\s+/g, ""), 10);

  return evalGame(largeTime, largeDist);
};

runPart("One", partOne); // 275724 took 0.327ms, allocated 0.002768MB on the heap.
runPart("Two", partTwo); // 37286485 took 58.2601ms, allocated 0.96816MB on the heap.
