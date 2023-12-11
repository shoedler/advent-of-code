import * as fs from "fs";
import { Hashset, runPart } from "../../../lib";
console.clear();

const universe = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split(""));

console.assert(universe.every((l) => l.length === universe[0].length));

type Vec = [number, number];

const galaxies = new Hashset<Vec>(
  (pos: Vec) => `${pos[0]},${pos[1]}`,
  (hash: string): Vec => hash.split(",").map(Number) as Vec
);

universe.forEach((line, y) =>
  line.forEach((char, x) => {
    if (char === "#") {
      galaxies.put([x, y]);
    }
  })
);

const emptyRows = universe.map((row, y) => {
  row.every((_, x) => !galaxies.has([x, y]));
  return y;
});

const emptyCols = universe[0].map((_, x) => {
  universe.every((_, y) => !galaxies.has([x, y]));
  return x;
});

const calcUniverseExpansion = (expansionRate: number) => {
  let sum = 0;
  const allGalaxies = galaxies.items();

  for (let i = 0; i < allGalaxies.length; i++) {
    const [x1, y1] = allGalaxies[i];
    for (let j = i + 1; j < allGalaxies.length; j++) {
      const [x2, y2] = allGalaxies[j];
      const [minX, maxX] = [x1, x2].sort((a, b) => a - b);
      const [minY, maxY] = [y1, y2].sort((a, b) => a - b);
      const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);

      const yFactor = emptyRows.filter((y) => y > minY && y < maxY).length;
      const xFactor = emptyCols.filter((x) => x > minX && x < maxX).length;

      sum += dist + expansionRate * (xFactor + yFactor);
    }
  }

  return sum;
};

const partOne = () => calcUniverseExpansion(1);
const partTwo = () => calcUniverseExpansion(1_000_000);

runPart("One", partOne); // 10422930 took 25.9983ms, allocated 4.94892MB on the heap.
runPart("Two", partTwo); // 699909723030 took 12.9595ms, allocated 2.395296MB on the heap. 699909023130
