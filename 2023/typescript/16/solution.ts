import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const grid = fs.readFileSync("./input.txt", "utf8").split("\r\n");

const DIRS = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
};

const DEFLECTIONS: any = {
  "/": {
    N: ["E"],
    S: ["W"],
    E: ["N"],
    W: ["S"],
  },
  "\\": {
    N: ["W"],
    S: ["E"],
    E: ["S"],
    W: ["N"],
  },
  "-": {
    N: ["E", "W"],
    S: ["E", "W"],
  },
  "|": {
    E: ["N", "S"],
    W: ["N", "S"],
  },
  ".": {},
};

type Dir = keyof typeof DIRS;
type X = number;
type Y = number;
type LAZOOR = [X, Y, Dir];

const nextBeamPos = (current: LAZOOR, tile: string): LAZOOR[] => {
  const [x, y, dir] = current;
  let newDirs: Dir[] = [dir];

  const deflections = DEFLECTIONS[tile];
  if (dir in deflections) {
    newDirs = deflections[dir];
  }

  return newDirs.map((newDir) => {
    const [dx, dy] = DIRS[newDir];
    return [x + dx, y + dy, newDir];
  });
};

const simulateBeam = (lazerEntrypoint: LAZOOR) => {
  const energized: { [key: `${number},${number}`]: Dir[] } = {};
  const beams: LAZOOR[] = [lazerEntrypoint];

  while (beams.length > 0) {
    const [x, y, dir] = beams.pop();
    const key = `${x},${y}`;

    const wasThere = energized[key];
    if (wasThere && wasThere.some((d) => d === dir)) {
      continue;
    }
    if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) {
      continue;
    }

    if (wasThere) {
      energized[key].push(dir);
    } else {
      energized[key] = [dir];
    }

    const tile = grid[y][x];
    beams.push(...nextBeamPos([x, y, dir], tile));
  }

  return Object.keys(energized).length;
};

const maxEnergized = () => {
  const results: number[] = [];

  const leftEntryPoint = (y: number) => [0, y, "E"] as LAZOOR;
  const rightEntryPoint = (y: number) => [grid[0].length - 1, y, "W"] as LAZOOR;
  for (let y = 0; y < grid.length; y++) {
    results.push(simulateBeam(leftEntryPoint(y)));
    results.push(simulateBeam(rightEntryPoint(y)));
  }

  const topEntryPoint = (x: number) => [x, 0, "S"] as LAZOOR;
  const bottomEntryPoint = (x: number) => [x, grid.length - 1, "N"] as LAZOOR;
  for (let x = 0; x < grid[0].length; x++) {
    results.push(simulateBeam(topEntryPoint(x)));
    results.push(simulateBeam(bottomEntryPoint(x)));
  }

  return Math.max(...results);
};

runPart("One", () => simulateBeam([0, 0, "E"])); // 7884 took 11.082400ms, allocated -2.411536MB on the vm-heap.
runPart("Two", () => maxEnergized()); // 8185 took 1s 19.815200ms, allocated 293.865728MB on the vm-heap.
