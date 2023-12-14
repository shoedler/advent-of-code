import { log } from "console";
import * as fs from "fs";
import { Hashset, runPart } from "../../../lib";
console.clear();

type Vec = [number, number];
const hash = (v: Vec) => `${v[0]},${v[1]}`;
const unhash = (v: string) => v.split(",").map(Number) as Vec;

const north = (v: Vec) => [v[0], v[1] - 1] as Vec;
const south = (v: Vec) => [v[0], v[1] + 1] as Vec;
const east = (v: Vec) => [v[0] + 1, v[1]] as Vec;
const west = (v: Vec) => [v[0] - 1, v[1]] as Vec;

const DIRS = [north, west, south, east];

const CUBES = new Hashset<Vec>(hash, unhash);
const ROCKS = new Hashset<Vec>(hash, unhash);

const data = fs
  .readFileSync("./sample.txt", "utf8")
  .split("\r\n")
  .map((line, y) =>
    line.split("").map((c, x) => {
      if (c === "#") {
        CUBES.put([x, y]);
      } else if (c === "O") {
        ROCKS.put([x, y]);
      }
      line;
    })
  );

const COLS = data[0].length;
const ROWS = data.length;

const calcSum = (rocks: Hashset<Vec>) => {
  let sum = 0;
  for (let y = 0; y < ROWS; y++) {
    let rowSum = 0;
    for (let x = 0; x < COLS; x++) {
      if (rocks.has([x, y])) {
        rowSum++;
      }
    }
    sum += rowSum * (ROWS - y);
  }
  return sum;
};

const printMap = (rocks: Hashset<Vec>) => {
  for (let y = 0; y < ROWS; y++) {
    const row = new Array(COLS).fill(" ");
    for (let x = 0; x < COLS; x++) {
      if (CUBES.has([x, y])) {
        row[x] = "#";
      }
      if (rocks.has([x, y])) {
        row[x] = "O";
      }
    }
    log(row.join(""));
  }
};

const simulate = (dir: (typeof DIRS)[0], rocks: Hashset<Vec>): Hashset<Vec> => {
  let moved = false;
  do {
    let next = new Hashset<Vec>(hash, unhash);
    const current = rocks.items();
    moved = false;
    for (const [x, y] of current) {
      const nextPos = dir([x, y]);
      if (y === 0 || y === ROWS - 1 || x === 0 || x === COLS - 1) {
        next.put([x, y]);
        continue;
      }

      if (CUBES.has(nextPos)) {
        next.put([x, y]);
        continue;
      }

      if (rocks.has(nextPos)) {
        next.put([x, y]);
        continue;
      }

      next.put(nextPos);
      moved = true;
    }

    rocks = next;
    next = new Hashset<Vec>(hash, unhash);
  } while (moved);

  return rocks;
};

const partOne = () => {
  const final = simulate(north, ROCKS);
  return calcSum(final);
};

const partTwo = () => {
  const sums: number[] = [];
  const strSums: string[] = [];
  let dir = 0;
  let next = ROCKS;
  let strSum = [];
  printMap(next);
  do {
    const currentDir = DIRS[dir];
    dir = (dir + 1) % DIRS.length;

    next = simulate(currentDir, next);
    const sum = calcSum(next);

    // log("DIR", dir);
    // printMap(next);
    log(dir);
    if (dir === 0) {
      const str = strSum.join(",");
      log(str);
      if (strSums.includes(str)) {
        strSums.push(str);
        break;
      }
      strSums.push(str);
      strSum = [];
    } else {
      strSum.push(sum);
    }

    // if (sums.includes(sum)) {
    //   sums.push(sum);
    //   break;
    // }
    // sums.push(sum);
  } while (true);

  log("SUMS", strSums);
};

runPart("One", partOne); // 110677 took 57.2498ms, allocated -0.416096MB on the vm-heap.
runPart("Two", partTwo); //
