import * as fs from "fs";
import { Hashmap, Hashset, runPart } from "../../../lib";
console.clear();

const grid = fs
  .readFileSync("./sample.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split(""));

const rows = grid.length;
const cols = grid[0].length;

type X = number;
type Y = number;
type Vec = [X, Y];

const DIRS = [
  ["^", 0, -1],
  ["v", 0, 1],
  ["<", -1, 0],
  [">", 1, 0],
] as [string, X, Y][];
const SLOPES = DIRS.map(([c]) => c);

const longestHike = (slopesAreFlat = false) => {
  // Helpers for hashsets and -maps
  const hash = (key: Vec): string => key[0] + "," + key[1];
  const unhash = (hash: string): Vec => hash.split(",").map(Number) as Vec;

  // Find junctions
  const junctions = new Hashset<Vec>(hash, unhash);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const valid = DIRS.filter(([, dx, dy]) => {
        const yBounds = 0 <= y + dy && y + dy < rows;
        const xBounds = 0 <= x + dx && x + dx < cols;
        const inBounds = yBounds && xBounds;
        if (!inBounds) {
          return false;
        }

        const notWall = grid[y + dy][x + dx] !== "#";
        return notWall;
      });

      if (valid.length > 2 && grid[y][x] !== "#") {
        junctions.put([x, y]);
      }
    }
  }

  // Entry and exit are also junctions
  let startX = 0;
  for (let x = 0; x < cols; x++) {
    if (grid[0][x] === ".") {
      junctions.put([x, 0]);
      startX = x;
    }
    if (grid[rows - 1][x] === ".") {
      junctions.put([x, rows - 1]);
    }
  }

  const branches = new Hashmap<Vec, [Vec, number][]>(hash, unhash);
  junctions.items().forEach(([vx, vy]) => {
    const visited = new Hashset<Vec>(hash, unhash);
    branches.put([vx, vy], []);

    const queue = [[vx, vy, 0]];
    while (queue.length > 0) {
      const [x, y, dist] = queue.shift()!;
      if (visited.has([x, y])) {
        continue;
      }
      visited.put([x, y]);

      if (junctions.has([x, y]) && y !== vy && x !== vx) {
        branches.get([vx, vy]).push([[x, y], dist]);
        continue;
      }

      for (const [dc, dx, dy] of DIRS) {
        const yBounds = 0 <= y + dy && y + dy < rows;
        const xBounds = 0 <= x + dx && x + dx < cols;
        const inBounds = yBounds && xBounds;
        if (inBounds) {
          const wall = grid[y + dy][x + dx] === "#";
          if (wall) {
            continue;
          }

          if (slopesAreFlat) {
            queue.push([x + dx, y + dy, dist + 1]);
            continue;
          }

          const steep = SLOPES.includes(grid[y][x]);
          const currentSteepness = grid[y][x] === dc;
          if (steep && !currentSteepness) {
            continue;
          }

          queue.push([x + dx, y + dy, dist + 1]);
        }
      }
    }
  });

  const visited: boolean[][] = [];
  for (let y = 0; y < rows; y++) {
    visited[y] = [];
    for (let x = 0; x < cols; x++) {
      visited[y][x] = false;
    }
  }

  let amount = 0;
  let sum = 0;
  const traverse = (pos: Vec, dist: number) => {
    amount++;

    const [x, y] = pos;
    if (visited[y][x]) {
      return;
    }
    visited[y][x] = true;

    if (y === rows - 1) {
      sum = Math.max(sum, dist);
    }

    // DFS
    for (const [branchPos, branchDist] of branches.get(pos) ?? []) {
      traverse(branchPos, dist + branchDist);
    }

    visited[y][x] = false;
  };

  traverse([startX, 0], 0);
  return sum;
};

runPart("One", longestHike); // 2230 took 27.687400ms, allocated -4.187936MB on the vm-heap.
runPart("Two", () => longestHike(true)); // 6542
