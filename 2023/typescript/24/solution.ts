import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

type Origin = { px: number; py: number; pz: number };
type VelVector = { vx: number; vy: number; vz: number };
type Hailstone = Origin & VelVector;

const hailstones = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => {
    const [px, py, pz, vx, vy, vz] = line.split(/[\s,@]+/).map(Number);
    return { px, py, pz, vx, vy, vz };
  }) as Hailstone[];

const BOUND = [200000000000000, 400000000000000];

const partOne = () => {
  let intersections = 0;
  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const h1 = hailstones[i];
      const h2 = hailstones[j];
      const [a1, b1, c1] = [h1.vy, -h1.vx, h1.vy * h1.px - h1.vx * h1.py];
      const [a2, b2, c2] = [h2.vy, -h2.vx, h2.vy * h2.px - h2.vx * h2.py];
      const det = a1 * b2 - a2 * b1;

      if (det === 0) continue;

      const x = (b2 * c1 - b1 * c2) / det;
      const y = (a1 * c2 - a2 * c1) / det;

      if (BOUND[0] <= x && x <= BOUND[1] && BOUND[0] <= y && y <= BOUND[1]) {
        if (
          (x - h1.px) * h1.vx >= 0 && // Dot product to check if they point in the same direction
          (y - h1.py) * h1.vy >= 0 &&
          (x - h2.px) * h2.vx >= 0 && // Dot product to check if they point in the same direction
          (y - h2.py) * h2.vy >= 0
        ) {
          intersections++;
        }
      }
    }
  }
  return intersections;
};
const partTwo = () => 2;

runPart("One", partOne); // 14799 took 9.706200ms, allocated -6.632472MB on the vm-heap.
runPart("Two", partTwo); //
