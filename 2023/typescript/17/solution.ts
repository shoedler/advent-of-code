import * as fs from "fs";
import { Hashset, runPart } from "../../../lib";
console.clear();

const DIRS = [
  [0, -1],
  [0, 1],
  [1, 0],
  [-1, 0],
];

const city = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split("").map(Number));

const findPathWithMinimalHeatLoss = (
  grid: number[][],
  ultraCrucibles: boolean
) => {
  const queue = [[0, 0, 0, 0, 0, 0]];
  const visited = new Hashset<string>();

  const consecutiveStepsLimit = ultraCrucibles ? 10 : 3;

  while (queue.length) {
    const [heatloss, y, x, dy, dx, consecutiveSteps] = queue
      .sort(([prevPrio], [prio]) => prio - prevPrio)
      .pop()!;

    if (
      y === grid.length - 1 &&
      x === grid[0].length - 1 &&
      (ultraCrucibles ? consecutiveSteps >= 4 : true)
    ) {
      return heatloss;
    }

    const key = `${y},${x},${dy},${dx},${consecutiveSteps}`;
    if (visited.has(key)) continue;
    visited.put(key);

    if (consecutiveSteps < consecutiveStepsLimit && !(dy === 0 && dx === 0)) {
      const newY = y + dy;
      const newX = x + dx;

      if (
        0 <= newY &&
        newY < grid.length &&
        0 <= newX &&
        newX < grid[0].length
      ) {
        queue.push([
          heatloss + grid[newY][newX],
          newY,
          newX,
          dy,
          dx,
          consecutiveSteps + 1,
        ]);
      }
    }

    if (
      ultraCrucibles ? consecutiveSteps >= 4 || (dy === 0 && dx === 0) : true
    ) {
      for (const [dirY, dirX] of DIRS) {
        if (
          (dirY !== dy || dirX !== dx) && // not the same direction as before
          (dirY !== -dy || dirX !== -dx) // not the opposite direction as before
        ) {
          const newY = y + dirY;
          const newX = x + dirX;

          if (
            0 <= newY &&
            newY < grid.length &&
            0 <= newX &&
            newX < grid[0].length
          ) {
            queue.push([
              heatloss + grid[newY][newX],
              newY,
              newX,
              dirY,
              dirX,
              1,
            ]);
          }
        }
      }
    }
  }

  return 0;
};

runPart("One", () => findPathWithMinimalHeatLoss(city, false)); // 1155 took 24s 274.870100ms, allocated 95.906144MB on the vm-heap.
runPart("Two", () => findPathWithMinimalHeatLoss(city, true)); // 1283 took 3m 3s 630.443600ms, allocated 1.129408MB on the vm-heap
