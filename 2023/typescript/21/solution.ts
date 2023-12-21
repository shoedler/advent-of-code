import { assert } from "console";
import * as fs from "fs";
import { Hashset, runPart } from "../../../lib";
console.clear();

const map = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split(""));

const DIRS = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
};

const startY = map.findIndex((row) => row.includes("S"));
const startX = map[startY].findIndex((x) => x === "S");
assert(map[startY][startX] === "S");

const partOne = () => {
  let positions = new Hashset<[number, number]>(
    (key) => key[0] + "," + key[1],
    (hash) => hash.split(",").map((x) => Number(x)) as [number, number]
  );

  positions.put([startX, startY]);

  let i = 0;
  while (i < 64) {
    const next = new Hashset<[number, number]>(
      (key) => key[0] + "," + key[1],
      (hash) => hash.split(",").map((x) => Number(x)) as [number, number]
    );

    positions.items().forEach(([x, y]) => {
      Object.values(DIRS)
        .map(([nx, ny]) => [nx + x, ny + y])
        .filter(([ny, nx]) => map[ny][nx] !== "#")
        .forEach((n) => next.put(n as [number, number]));
    });

    positions = next;
    i++;
  }

  return positions.size();
};

const partOneDebug = () => {
  let positions = new Hashset<[number, number, number, number]>(
    (key) => key[0] + "," + key[1] + "," + key[2] + "," + key[3],
    (hash) =>
      hash.split(",").map((x) => Number(x)) as [number, number, number, number]
  );

  positions.put([0, 0, startX, startY]);

  let i = 0;
  while (i < 80) {
    const next = new Hashset<[number, number, number, number]>(
      (key) => key[0] + "," + key[1] + "," + key[2] + "," + key[3],
      (hash) =>
        hash.split(",").map((x) => Number(x)) as [
          number,
          number,
          number,
          number
        ]
    );

    positions.items().forEach(([mapX, mapY, x, y]) => {
      Object.values(DIRS)
        .map(([dx, dy]) => {
          let [nx, ny] = [dx + x, dy + y];
          if (nx < 0) {
            mapX -= 1;
            nx += map[0].length;
          }
          if (nx >= map[0].length) {
            mapX += 1;
            nx -= map[0].length;
          }
          if (ny < 0) {
            mapY -= 1;
            ny += map.length;
          }
          if (ny >= map.length) {
            mapY += 1;
            ny -= map.length;
          }
          return [mapX, mapY, nx, ny];
        })
        .filter(([, , x, y]) => map[y][x] !== "#")
        .forEach((n) => next.put(n as [number, number, number, number]));
    });

    positions = next;
    i++;
  }

  const maps = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [0, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  const grid = maps.map(([mapX, mapY]) => {
    const lines = [];
    for (let y = 0; y < map.length; y++) {
      let line = "";
      for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] === "#") {
          line += "#";
        } else if (positions.has([mapX, mapY, x, y])) {
          line += "O";
        } else {
          line += ".";
        }
      }
      lines.push(line);
    }
    return lines;
  });

  const row1 = [grid[0], grid[1], grid[2]];
  const row2 = [grid[3], grid[4], grid[5]];
  const row3 = [grid[6], grid[7], grid[8]];

  for (let y = 0; y < row1[0].length; y++) {
    console.log(row1.map((row) => row[y]).join(""));
  }
  for (let y = 0; y < row2[0].length; y++) {
    console.log(row2.map((row) => row[y]).join(""));
  }
  for (let y = 0; y < row3[0].length; y++) {
    console.log(row3.map((row) => row[y]).join(""));
  }
};

// const partTwo = () => {
//   const lines = fs.readFileSync("input.txt", "utf-8").trim().split("\n");
//   const grid = lines.map((row) => row.split(""));
//   const rows = grid.length;
//   const cols = grid[0].length;

//   const startY = map.findIndex((row) => row.includes("S"));
//   const startX = map[startY].findIndex((x) => x === "S");
//   assert(map[startY][startX] === "S");

//   type Distance = {
//     [key: string]: number;
//   };

//   function findDistance(): Distance {
//     const dists: Distance = {};
//     const queue: [number, number, number, number, number][] = [
//       [0, 0, startY, startX, 0],
//     ];

//     while (queue.length) {
//       let [mapY, mapX, y, x, dist] = queue.shift()!;
//       if (y < 0) {
//         mapY -= 1;
//         y += rows;
//       }
//       if (y >= rows) {
//         mapY += 1;
//         y -= rows;
//       }
//       if (x < 0) {
//         mapX -= 1;
//         x += cols;
//       }
//       if (x >= cols) {
//         mapX += 1;
//         x -= cols;
//       }
//       if (!(0 <= y && y < rows && 0 <= x && x < cols && grid[y][x] !== "#")) {
//         continue;
//       }
//       if ([mapY, mapX, y, x].join(",") in dists) {
//         continue;
//       }
//       if (Math.abs(mapY) > 4 || Math.abs(mapX) > 4) {
//         continue;
//       }
//       dists[[mapY, mapX, y, x].join(",")] = dist;

//       Object.values(DIRS)
//         .map(([nx, ny]) => [mapY, mapX, ny + y, nx + x, dist + 1])
//         .forEach((n) => queue.push(n as any));
//     }
//     return dists;
//   }

//   const distances = findDistance();

//   type SolveCache = {
//     [key: string]: number;
//   };

//   const cache: SolveCache = {};

//   function solve(dist: number, v: number, steps: number): number {
//     const key = `${dist},${v},${steps}`;
//     if (key in cache) {
//       return cache[key];
//     }
//     let result = 0;
//     const amount = Math.floor((steps - dist) / rows);
//     for (let x = 1; x <= amount; x++) {
//       if (dist + rows * x <= steps && (dist + rows * x) % 2 === steps % 2) {
//         result += v === 2 ? x + 1 : 1;
//       }
//     }
//     cache[key] = result;
//     return result;
//   }

//   function solve21(part1: boolean): number {
//     const steps = part1 ? 64 : 26501365;
//     let ans = 0;
//     for (let y = 0; y < rows; y++) {
//       for (let x = 0; x < cols; x++) {
//         if ([0, 0, y, x].join(",") in distances) {
//           const OPT = [-3, -2, -1, 0, 1, 2, 3];
//           for (const ty of OPT) {
//             for (const tx of OPT) {
//               if (part1 && (ty !== 0 || tx !== 0)) {
//                 continue;
//               }
//               const dist = distances[[ty, tx, y, x].join(",")];
//               if (dist % 2 === steps % 2 && dist <= steps) {
//                 ans += 1;
//               }
//               if (ty === Math.min(...OPT) || ty === Math.max(...OPT)) {
//                 if (tx === Math.min(...OPT) || tx === Math.max(...OPT)) {
//                   ans += solve(dist, 2, steps);
//                 } else {
//                   ans += solve(dist, 1, steps);
//                 }
//               } else if (tx === Math.min(...OPT) || tx === Math.max(...OPT)) {
//                 ans += solve(dist, 1, steps);
//               }
//             }
//           }
//         }
//       }
//     }
//     return ans;
//   }

//   console.log(solve21(true));
//   console.log(solve21(false));
// };
partOneDebug();
runPart("One", partOne); // 3687 took 91.664300ms, allocated 10.841792MB on the vm-heap.
// runPart("Two", partTwo);
// 615682976896016 <-- too high
// 610321885082978
