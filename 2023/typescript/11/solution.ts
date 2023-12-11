import * as fs from "fs";
import { Hashset, runPart } from "../../../lib";
console.clear();

const universe = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map(line => line.split(""));

console.assert(universe.every(l => l.length === universe[0].length));

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

const emptyRows = universe
  .map((row, y) => (row.every((_, x) => !galaxies.has([x, y])) ? y : undefined))
  .filter(Boolean);

const emptyCols = universe[0]
  .map((_, x) =>
    universe.every((_, y) => !galaxies.has([x, y])) ? x : undefined
  )
  .filter(Boolean);

const allGalaxies = galaxies.items();

const calcUniverseExpansion = (expansionRate: number) => {
  let sum = 0;

  for (let i = 0; i < allGalaxies.length; i++) {
    const [x1, y1] = allGalaxies[i];
    for (let j = i + 1; j < allGalaxies.length; j++) {
      const [x2, y2] = allGalaxies[j];

      const [minX, maxX] = [x1, x2].sort((a, b) => a - b);
      const [minY, maxY] = [y1, y2].sort((a, b) => a - b);

      const spaces =
        emptyRows.filter(y => y > minY && y < maxY).length +
        emptyCols.filter(x => x > minX && x < maxX).length;

      const manhattan = Math.abs(x1 - x2) + Math.abs(y1 - y2);

      sum += manhattan - spaces + expansionRate * spaces;
    }
  }

  return sum;
};

runPart("One", () => calcUniverseExpansion(2)); // 10422930 took 25.9983ms, allocated 4.94892MB on the heap.
runPart("Two", () => calcUniverseExpansion(1e6)); // 699909023130 took 12.9595ms, allocated 2.395296MB on the heap.
