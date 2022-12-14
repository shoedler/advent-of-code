import * as fs from 'fs';
import { absDx, absDy, equals, Vec } from './Vec';

const caveScan = fs.readFileSync('./input.txt', 'utf-8').split('\r\n')
  .map(scanLine => scanLine.split(' -> ')
    .map(coord => coord.split(',')
      .map(Number))) as Vec[][];

const minmax = (a: number, b: number) => [Math.min(a, b), Math.max(a, b)];

const caveWalls = new Set<string>();
const grainsOfSand = new Set<string>();
const sandSource: Vec = [0, 500];

const yS = caveScan.map((scanLine) => scanLine.map(([_, y]) => y)).flat();
const maxY = Math.max(...yS);

// Build caveWalls
caveScan.forEach(lineScan => {
  for(let i = 0; i < lineScan.length - 1; i++) {
    const [prevX, prevY] = lineScan[i]; 
    const [currX, currY] = lineScan[i + 1];

    const dX = absDx([prevX, prevY], [currX, currY]);
    const dY = absDy([prevX, prevY], [currX, currY]);
    console.assert([dY, dX].some(v => v === 0), 'Not a straight line');

    const [y1, y2] = minmax(prevY, currY);
    const [x1, x2] = minmax(prevX, currX);

    if (dX === 0) {
      for (let y = y1; y <= y2; y++) 
        caveWalls.add(`${y},${prevX}`);
    }      
    else {
      for (let x = x1; x <= x2; x++)
        caveWalls.add(`${prevY},${x}`);
    }
  }
});

// Drop one grain of sand
const dropOnce = (type: 'P1' | 'P2') => {
  let [y, x] = sandSource;

  const below = () => {
    const np = `${y + 1},${x}` 
    return !caveWalls.has(np) && !grainsOfSand.has(np) && y < maxY + 1; // Zero-indexed, so it's actually Two more.
  }
  const belowLeft = () => {
    const np = `${y + 1},${x - 1}` 
    return !caveWalls.has(np) && !grainsOfSand.has(np) && y < maxY + 1; // Zero-indexed, so it's actually Two more.
  }
  const belowRight = () => {
    const np = `${y + 1},${x + 1}`
    return !caveWalls.has(np) && !grainsOfSand.has(np) && y < maxY + 1; // Zero-indexed, so it's actually Two more.
  }
  
  while (true) {
    if (below()) 
      [y, x] = [y + 1, x];
    else if (belowLeft()) 
      [y, x] = [y + 1, x - 1];
    else if (belowRight()) 
      [y, x] = [y + 1, x + 1];
    else {
      if (type === 'P1') {
        if (y >= maxY) // Fell into the abyss
          return false;
        grainsOfSand.add(`${y},${x}`);
        return true;
      }
      else {
        grainsOfSand.add(`${y},${x}`);
        if (equals([y, x], sandSource))
          return false;
        return true
      }
    }
  }
}

while (dropOnce('P1')) {}
console.log("Part One", grainsOfSand.size); // 692

grainsOfSand.clear();

while (dropOnce('P2')) {}
console.log("Part Two", grainsOfSand.size); // 31706