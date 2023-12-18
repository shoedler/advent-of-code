import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const data = fs.readFileSync("./input.txt", "utf8").split("\r\n");

const DIRS = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

const shoeLace = (coords: number[][]) => {
  let surface = 0;
  for (let i = 0; i < coords.length; i++) {
    const [x] = coords[i];
    const [, y1] = coords[i - 1] || [0, 0];
    const [, y2] = coords[(i + 1) % coords.length];
    surface += x * (y1 - y2);
  }

  surface = Math.abs(surface) / 2;
  return surface;
};

const lagoonVolume = () => {
  const coords = [[0, 0]];
  let b = 0;

  data.forEach((line) => {
    const [dir, amount, _] = line.split(" ");

    const [dx, dy] = DIRS[dir];
    const [x, y] = coords[coords.length - 1];

    const n = Number(amount);
    b += n;

    coords.push([x + dx * n, y + dy * n]);
  });

  const surface = shoeLace(coords);
  const i = surface - Math.floor(b / 2) + 1;

  return i + b;
};

const lagoonVolumeFromHex = () => {
  const coords = [[0, 0]];
  let b = 0;

  data.forEach((line) => {
    const [, , hex] = line.split(" ");
    const code = hex.slice(2, -1);
    const dirLetter = "RDLU"[Number(code[code.length - 1])];

    const [dx, dy] = DIRS[dirLetter];
    const [x, y] = coords[coords.length - 1];

    const n = parseInt(code.slice(0, -1), 16);
    b += n;

    coords.push([x + dx * n, y + dy * n]);
  });

  const surface = shoeLace(coords);
  const i = surface - Math.floor(b / 2) + 1;

  return i + b;
};

runPart("One", lagoonVolume); // 108909 took 0.809500ms, allocated 0.780152MB on the vm-heap.
runPart("Two", lagoonVolumeFromHex); // 133125706867777 took 0.797000ms, allocated 1.086176MB on the vm-heap.
