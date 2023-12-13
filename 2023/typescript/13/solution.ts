import * as fs from "fs";
import { runPart } from "../../../lib";
import { assert } from "console";
console.clear();

const maps = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n\r\n")
  .map(map => map.split("\r\n"));

const findReflection = (map: string[], smudge = false): number => {
  let sum = 0;

  const rows = map.length;
  const cols = map[0].length;

  // Vertical
  for (let col = 0; col < cols - 1; col++) {
    let diff = 0;
    let left = col;
    let right = col + 1;

    do {
      for (let row = 0; row < rows; row++) {
        if (map[row][left] !== map[row][right]) {
          diff++;
        }
      }
    } while (--left >= 0 && ++right < cols);

    if ((diff === 0 && !smudge) || (smudge && diff === 1)) {
      sum += col + 1;
      break;
    }
  }

  // Horizontal
  for (let row = 0; row < rows - 1; row++) {
    let diff = 0;
    let top = row;
    let bottom = row + 1;
    do {
      for (let col = 0; col < cols; col++) {
        if (map[top][col] !== map[bottom][col]) {
          diff++;
        }
      }
    } while (--top >= 0 && ++bottom < rows);

    if ((diff === 0 && !smudge) || (smudge && diff === 1)) {
      sum += 100 * (row + 1);
      break;
    }
  }

  return sum;
};

const partOne = () =>
  maps
    .map(map => findReflection(map))
    .tap(v => assert(v))
    .reduce((a, b) => a + b);

const partTwo = () =>
  maps
    .map(map => findReflection(map, true))
    .tap(v => assert(v))
    .reduce((a, b) => a + b);

runPart("One", partOne); // 35360 took 11.1669ms, allocated 0.011696MB on the vm-heap.
runPart("Two", partTwo); // 36755 took 5.3511ms, allocated 0.007064MB on the vm-heap.
