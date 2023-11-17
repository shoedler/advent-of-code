import * as fs from "fs";
import { runPart } from "../../../lib";

const cubes = fs
  .readFileSync("./input.txt", "utf-8")
  .split("\r\n")
  .map((line) => line.split(",").map((num) => Number(num)));

const dirs = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const surfaceArea = () => {
  let exposedSides = 0;
  cubes.forEach((cube) => {
    const [x, y, z] = cube;

    dirs.forEach(([dx, dy, dz]) => {
      const x2 = x + dx;
      const y2 = y + dy;
      const z2 = z + dz;

      if (!cubes.some(([x3, y3, z3]) => x2 === x3 && y2 === y3 && z2 === z3))
        exposedSides++;
    });
  });
  return exposedSides;
};

const isOutsideCube = (cube: [number, number, number]) => {
  const queue = [cube];
  const visited = new Set<string>();

  // BFS
  while (queue.length) {
    const [x, y, z] = queue.shift()!;

    if (visited.has(`${x},${y},${z}`)) continue;

    // If the cube is outside the droplet, it's not part of the droplet
    if (cubes.some(([x2, y2, z2]) => x === x2 && y === y2 && z === z2))
      continue;

    visited.add(`${x},${y},${z}`);

    if (visited.size > 5000) return true;

    dirs.forEach(([dx, dy, dz]) => {
      const x2 = x + dx;
      const y2 = y + dy;
      const z2 = z + dz;
      queue.push([x2, y2, z2]);
    });
  }

  return false;
};

const outsideSurfaceArea = () => {
  let exposedSides = 0;
  cubes.forEach((cube) => {
    const [x, y, z] = cube;

    dirs.forEach(([dx, dy, dz]) => {
      const x2 = x + dx;
      const y2 = y + dy;
      const z2 = z + dz;

      if (isOutsideCube([x2, y2, z2])) exposedSides++;
    });
  });
  return exposedSides;
};

// Setup: i7-1065H, 16GB RAM node v17.8.0
runPart("One", () => surfaceArea()); // 3346 took 136ms
runPart("Two", () => outsideSurfaceArea()); // 1980 took 207553ms (around 3 minutes)
