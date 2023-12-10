import * as fs from "fs";
import { Hashmap, runPart } from "../../../lib";
console.clear();

const NS = { "|": ["N", "S"] };
const SE = { F: ["S", "E"] };
const SW = { "7": ["S", "W"] };
const EW = { "-": ["E", "W"] };
const NE = { L: ["N", "E"] };
const NW = { J: ["N", "W"] };
const START = { S: ["N", "E", "S", "W"] };

const CanGoNorth = { ...NS, ...NE, ...NW, ...START };
const CanGoSouth = { ...NS, ...SE, ...SW, ...START };
const CanGoEast = { ...EW, ...NE, ...SE, ...START };
const CanGoWest = { ...EW, ...NW, ...SW, ...START };

const Dirs = {
  ...CanGoNorth,
  ...CanGoSouth,
  ...CanGoEast,
  ...CanGoWest,
};

type Vec = [number, number];
type VecDist = { vec: Vec; dist: number };

const grid = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split(""));

const hash = (pos: Vec) => `${pos[0]},${pos[1]}`;
const unhash = (hash: string): Vec => hash.split(",").map(Number) as Vec;

const Visited = new Hashmap<Vec, VecDist>(hash, unhash);
const Queue: VecDist[] = [];

// Find the starting point
let start = [0, 0] as Vec;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "S") start = [x, y];
  }
}

const partOne = () => {
  Queue.push({ vec: start, dist: 0 });

  const visit = (x: number, y: number, dist: number) => {
    const entry = { vec: [x, y] as Vec, dist };
    if (!Visited.has(entry.vec)) {
      Queue.push(entry);
      Visited.put(entry.vec, entry);
    }
  };

  while (Queue.length) {
    const {
      vec: [x, y],
      dist,
    } = Queue.shift()!;

    if (grid[y - 1]?.[x] in CanGoSouth && grid[y][x] in CanGoNorth)
      visit(x, y - 1, dist + 1);
    if (grid[y + 1]?.[x] in CanGoNorth && grid[y][x] in CanGoSouth)
      visit(x, y + 1, dist + 1);
    if (grid[y][x + 1] in CanGoWest && grid[y][x] in CanGoEast)
      visit(x + 1, y, dist + 1);
    if (grid[y][x - 1] in CanGoEast && grid[y][x] in CanGoWest)
      visit(x - 1, y, dist + 1);
  }

  return Visited.values()
    .map(({ dist }) => dist)
    .sort((a, b) => b - a)[0];
};

const partTwo = () => {
  // Find a valid pipe for S
  const [first, last] = Visited.values()
    .filter(({ dist }) => dist === 1)
    .map(({ vec }) => vec);

  const dirs = [];
  [start[0] - first[0], last[0] - start[0]].forEach(
    (dx) => (dx > 0 && dirs.push("E")) || (dx < 0 && dirs.push("W"))
  );
  [start[1] - first[1], last[1] - start[1]].forEach(
    (dy) => (dy > 0 && dirs.push("N")) || (dy < 0 && dirs.push("S"))
  );

  console.assert(dirs.length === 2);
  const startChar = Object.entries(Dirs).find(([key, keyDirs]) =>
    keyDirs.every((dir) => dirs.includes(dir))
  )[0];

  // Strip out loose pipes and replace with '.'
  // bc loose pipes confuse the cn/wd (winding-, crossing-number) algo.
  // Also, use nicer chars to print the grid.
  grid[start[1]][start[0]] = startChar;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      grid[y][x] = Visited.has([x, y] as Vec) ? grid[y][x] : ".";

      if (grid[y][x] === "|") grid[y][x] = "│";
      if (grid[y][x] === "-") grid[y][x] = "─";
      if (grid[y][x] === "7") grid[y][x] = "┐";
      if (grid[y][x] === "F") grid[y][x] = "┌";
      if (grid[y][x] === "L") grid[y][x] = "└";
      if (grid[y][x] === "J") grid[y][x] = "┘";
    }
  }

  let inside = 0;
  for (let y = 0; y < grid.length; y++) {
    let parity = false;
    for (let x = 0; x < grid[y].length; x++) {
      if (Visited.has([x, y] as Vec)) {
        parity = "└┘│".includes(grid[y][x]) ? !parity : parity;
        continue;
      }

      if (parity) {
        inside++;
        grid[y][x] = "▓";
      }
    }
  }

  console.log(grid.map((line) => line.join("")).join("\n"));

  return inside;
};

runPart("One", partOne); // 6613 took 2.0453ms, allocated 0.379064MB on the heap.
runPart("Two", partTwo); // 511 took 0.738ms, allocated 0.003352MB on the heap.
