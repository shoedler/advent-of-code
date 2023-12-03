import * as fs from "fs";
console.clear();

const grid = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split(""));

const rows = grid.length;
const cols = grid[0].length;
const neighborsPos = [-1, 0, 1];

let sum = 0;
const nums: { [key: string]: number[] } = {};

for (let y = 0; y < rows; y++) {
  const gears = new Set<string>();
  let n = 0;
  let hasPart = false;

  for (let x = 0; x < cols + 1; x++) {
    if (x < cols && /\d/.test(grid[y][x])) {
      n = n * 10 + parseInt(grid[y][x]);
      for (const yOfs of neighborsPos) {
        for (const xOfs of neighborsPos) {
          const yScan = y + yOfs;
          const xScan = x + xOfs;
          if (0 <= yScan && yScan < rows && 0 <= xScan && xScan < cols) {
            const char = grid[yScan][xScan];
            if (!/\d/.test(char) && char !== ".") {
              hasPart = true;
            }
            if (char === "*") {
              gears.add(`${yScan},${xScan}`);
            }
          }
        }
      }
    } else if (n > 0) {
      // End of line, or end of number
      for (const gear of gears) {
        nums[gear] === undefined ? (nums[gear] = [n]) : nums[gear].push(n);
      }

      if (hasPart) {
        sum += n;
      }

      n = 0;
      hasPart = false;
      gears.clear();
    }
  }
}

let sumP2 = 0;
for (const [k, v] of Object.entries(nums)) {
  if (v.length === 2) {
    sumP2 += v[0] * v[1];
  }
}

console.log(sum);
console.log(sumP2);
// 559667
// 86841457
