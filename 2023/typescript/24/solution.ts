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

const partOne = () => {
  const BOUND = [200000000000000, 400000000000000];
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

const partTwo = () => {
  const ROCK_VEL = {
    x: {
      possibleVels: [],
      velRange: {
        min: Math.min(...hailstones.map((h) => h.vx)),
        max: Math.max(...hailstones.map((h) => h.vx)),
      },
    },
    y: {
      possibleVels: [],
      velRange: {
        min: Math.min(...hailstones.map((h) => h.vy)),
        max: Math.max(...hailstones.map((h) => h.vy)),
      },
    },
    z: {
      possibleVels: [],
      velRange: {
        min: Math.min(...hailstones.map((h) => h.vz)),
        max: Math.max(...hailstones.map((h) => h.vz)),
      },
    },
  };

  // Finding possible rock velocities for a given dimension is done by finding two
  // hailstones that have the same velocity component in that dimension.
  // After a nice backcountry tour in the mountains I realized that the distance difference
  // between such two hailstones must be constant.
  // This means there's only a couple of possible velocities for the rock to hit them both.
  // It's possible to find these vels by getting all the values which satisfy
  // dist % (rockVel - hailstoneVel) === 0
  // where dist is the distance between the two hailstones in that dimension.
  const getPossibleRockVel = (
    dim: "x" | "y" | "z",
    a: Hailstone,
    b: Hailstone
  ) => {
    const velKey: keyof VelVector = `v${dim}` as keyof VelVector;
    const posKey: keyof Origin = `p${dim}` as keyof Origin;

    if (a[velKey] !== b[velKey]) {
      return [];
    }

    const possibleVels = new Set<number>();

    for (
      let v = ROCK_VEL[dim].velRange.min;
      v <= ROCK_VEL[dim].velRange.max;
      v++
    ) {
      if (v === a[velKey]) continue;
      if ((b[posKey] - a[posKey]) % (v - a[velKey]) === 0) {
        possibleVels.add(v);
      }
    }
    if (ROCK_VEL[dim].possibleVels.length !== 0) {
      ROCK_VEL[dim].possibleVels = ROCK_VEL[dim].possibleVels.filter((x) =>
        possibleVels.has(x)
      );
    } else {
      ROCK_VEL[dim].possibleVels = [...possibleVels];
    }
  };

  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const a = hailstones[i];
      const b = hailstones[j];

      getPossibleRockVel("x", a, b);
      getPossibleRockVel("y", a, b);
      getPossibleRockVel("z", a, b);
    }
  }

  const rockVx = [...ROCK_VEL.x.possibleVels][0];
  const rockVy = [...ROCK_VEL.y.possibleVels][0];
  const rockVz = [...ROCK_VEL.z.possibleVels][0];

  const [apx, apy, apz, avx, avy, avz] = Object.values(hailstones[0]);
  const [bpx, bpy, bpz, bvx, bvy, bvz] = Object.values(hailstones[1]);

  const ma = (avy - rockVy) / (avx - rockVx);
  const mb = (bvy - rockVy) / (bvx - rockVx);
  const ca = apy - ma * apx;
  const cb = bpy - mb * bpx;

  const x = (cb - ca) / (ma - mb);
  const y = ma * x + ca;

  const time = (x - apx) / (avx - rockVx);
  const z = apz + (avz - rockVz) * time;

  return Math.floor(Math.abs(x) + Math.abs(y) + Math.abs(z));
};

runPart("One", partOne); // 14799 took 9.706200ms, allocated -6.632472MB on the vm-heap.
runPart("Two", partTwo); // 1007148211789625 took 22.115600ms, allocated 9.02392MB on the vm-heap.
