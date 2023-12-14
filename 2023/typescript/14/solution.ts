import { log } from "console";
import * as fs from "fs";
import { Hashmap, Hashset, runPart } from "../../../lib";
console.clear();

type Vec = [number, number];
const hash = (v: Vec) => `${v[0]},${v[1]}`;
const unhash = (v: string) => v.split(",").map(Number) as Vec;

const north = (v: Vec) => [v[0], v[1] - 1] as Vec;
const south = (v: Vec) => [v[0], v[1] + 1] as Vec;
const east = (v: Vec) => [v[0] + 1, v[1]] as Vec;
const west = (v: Vec) => [v[0] - 1, v[1]] as Vec;

const DIRS = { north, west, south, east };
const CUBES = new Hashset<Vec>(hash, unhash);
const ROCKS = new Hashset<Vec>(hash, unhash);

const data = fs
  .readFileSync("./input.txt", "utf8")
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

const simulate = (
  dir: keyof typeof DIRS,
  rocks: Hashset<Vec>
): Hashset<Vec> => {
  let moved = false;
  const dirFn = DIRS[dir];
  do {
    let next = new Hashset<Vec>(hash, unhash);
    const current = rocks.items();
    moved = false;
    for (const [x, y] of current) {
      if (y === 0 && dir === "north") {
        next.put([x, y]);
        continue;
      }

      if (y === ROWS - 1 && dir === "south") {
        next.put([x, y]);
        continue;
      }

      if (x === 0 && dir === "west") {
        next.put([x, y]);
        continue;
      }

      if (x === COLS - 1 && dir === "east") {
        next.put([x, y]);
        continue;
      }

      const nextPos = dirFn([x, y]);
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
  const final = simulate("north", ROCKS);
  return calcSum(final);
};

const partTwo = () => {
  const dirs = Object.keys(DIRS) as (keyof typeof DIRS)[];

  const cylce = (rocks: Hashset<Vec>) => {
    let next = rocks;
    let sums = [];

    for (const dir of dirs) {
      next = simulate(dir, next);
      const sum = calcSum(next);
      sums.push(sum);
    }

    return {
      sums,
      next,
    };
  };

  let cycles = 0;
  let next = ROCKS;
  const cycleResults = new Hashmap<string, number>(
    (key) => key,
    (key) => key
  );

  for (;;) {
    let result = cylce(next);

    cycles++;
    const cycleSum = result.sums.join(",");
    next = result.next;

    if (cycleResults.has(cycleSum)) {
      const target = 1_000_000_000;
      const rest = target - cycles;
      const cycleStart = cycleResults.get(cycleSum);
      const cycleLength = cycles - cycleStart;

      const remainder = rest % cycleLength;
      const x = remainder + cycleStart;

      for (const [key, value] of cycleResults.items()) {
        if (value === x) {
          log(key);
          return key.split(",").map(Number)[3];
        }
      }
    }

    cycleResults.put(cycleSum, cycles);
  }
};

runPart("One", partOne); // 110677 took 65.805300ms, allocated 0.33488MB on the vm-heap.
runPart("Two", partTwo); // 90551 took 29s 60.308300ms, allocated 76.65912MB on the vm-heap.
