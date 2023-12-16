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

type Dir = keyof typeof DIRS;
type x = number;
type y = number;
type LAZOOR = [x, y, Dir];

const DEFLECTIONMAP: any = {
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

const next = (current: LAZOOR, tile: string): LAZOOR[] => {
  const [x, y, dir] = current;
  let newDirs: Dir[] = [dir];

  const deflections = DEFLECTIONMAP[tile];
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
  const lazers: LAZOOR[] = [lazerEntrypoint];

  while (lazers.length > 0) {
    const [x, y, dir] = lazers.pop();
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
    lazers.push(...next([x, y, dir], tile));
  }

  return Object.keys(energized).length;
};

const bestLaser = () => {
  const results: number[] = [];

  // Left and right
  [
    [0, "E"],
    [grid[0].length - 1, "W"],
  ].forEach(([x, dir]) => {
    for (let y = 0; y < grid.length; y++) {
      results.push(simulateBeam([x, y, dir] as LAZOOR));
    }
  });

  // Top and bottom
  [
    [0, "S"],
    [grid.length - 1, "N"],
  ].forEach(([y, dir]) => {
    for (let x = 0; x < grid[0].length; x++) {
      results.push(simulateBeam([x, y, dir] as LAZOOR));
    }
  });

  return Math.max(...results);
};

runPart("One", () => simulateBeam([0, 0, "E"])); // 7884 took 11.082400ms, allocated -2.411536MB on the vm-heap.
runPart("Two", () => bestLaser()); // 8185 took 1s 19.815200ms, allocated 293.865728MB on the vm-heap.
