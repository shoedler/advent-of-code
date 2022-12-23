import { log } from 'console';
import * as fs from 'fs';
import { Hashmap, Hashset } from '../lib';

const Elves: Hashset<[number, number]> = new Hashset();

fs.readFileSync('./input.txt', 'utf-8').split('\r\n')
  .forEach((line, col) => 
    line.split('')
      .forEach((c, row) => {
        if (c === '#') 
          Elves.put([col, row]);
      }));

const printMap = (map: Hashset<[number, number]>) => {
  const content = map.items();
  const r1 = Math.min(...content.map(([r,_]) => r));
  const r2 = Math.max(...content.map(([r,_]) => r)) + 1;
  const c1 = Math.min(...content.map(([_,c]) => c));
  const c2 = Math.max(...content.map(([_,c]) => c)) + 1;
  for (let r = r1; r < r2; r++) {
    let line = '';
    for (let c = c1; c < c2; c++) 
      line += (Elves.has([r, c])) ? '#' : '.'
    log(line);
  }
}

const Directions: { [k in ('N' | 'E' | 'S' | 'W' | 'NE' | 'SE' | 'SW' | 'NW') ]: [number, number] } = {
  'N': [-1, 0],
  'E': [0, 1],
  'S': [1, 0],
  'W': [0, -1],
  'NE': [-1, 1],
  'SE': [1, 1],
  'SW': [1, -1],
  'NW': [-1,-1]
}

const Neighbors = Object.values(Directions);

const Ns = [
  Directions['N'],
  Directions['NE'],
  Directions['NW']
]

const Ss = [
  Directions['S'],
  Directions['SE'],
  Directions['SW']
]

const Ws = [
  Directions['W'],
  Directions['NW'],
  Directions['SW']
]

const Es = [
  Directions['E'],
  Directions['NE'],
  Directions['SE']
]

const Cardinals = [ 'N', 'S', 'W', 'E' ];

const getMovePos = (p: [number, number], dir: [number, number]): [number, number] => [p[0] + dir[0], p[1] + dir[1]];

let t = Date.now();
for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
  const moveProposals = new Hashmap<[number, number], [number, number]>();
  const elves = Elves.items();

  // Round
  for (let i = 0; i < elves.length; i++) {
    const elf = elves[i];

    // Don't do anything if you have no neighbors
    if (!Neighbors.some(neighbor => Elves.has(getMovePos(elf, neighbor))))
      continue;

    // Propose one step
    for (let j = 0; j < Cardinals.length; j++) {
      const cardinal = Cardinals[j];

      if (cardinal === 'N' && !Ns.some(dir => Elves.has(getMovePos(elf, dir)))) {
        moveProposals.put(elf, getMovePos(elf, Directions['N']));
        break;
      }

      if (cardinal === 'S' && !Ss.some(dir => Elves.has(getMovePos(elf, dir)))) {
        moveProposals.put(elf, getMovePos(elf, Directions['S']));
        break;
      }

      if (cardinal === 'W' && !Ws.some(dir => Elves.has(getMovePos(elf, dir)))) {
        moveProposals.put(elf, getMovePos(elf, Directions['W']));
        break;
      }

      if (cardinal === 'E' && !Es.some(dir => Elves.has(getMovePos(elf, dir)))) {
        moveProposals.put(elf, getMovePos(elf, Directions['E']));
        break;
      }
    }
  }

  // Rot directions
  Cardinals.push(Cardinals.shift());

  // Move
  const proposals = moveProposals.items()
  proposals.forEach(([prevPos, targetPos]) => {
    if (proposals.filter(([prev, target]) => target[0] === targetPos[0] && target[1] === targetPos[1]).length === 1) {
      Elves.remove(prevPos);
      Elves.put(targetPos);
    }
  });

  if (proposals.length === 0) {
    log("Part Two", i + 1, `took ${Date.now() - t}ms`); // 984 took 14621ms
    break;
  }

  if (i === 9) {
    const elves = Elves.items();
    const r1 = Math.min(...elves.map(([r,_]) => r));
    const r2 = Math.max(...elves.map(([r,_]) => r)) + 1;
    const c1 = Math.min(...elves.map(([_,c]) => c));
    const c2 = Math.max(...elves.map(([_,c]) => c)) + 1;

    console.clear();

    let groundTiles = 0;
    for (let r = r1; r < r2; r++) {
      for (let c = c1; c < c2; c++) {
        if (!Elves.has([r, c]))
          groundTiles++;
      }
    }

    printMap(Elves);
    console.log("Part One", groundTiles, `took ${Date.now() - t}ms`); // 4116 took 214ms
  }
}

// Setup: i7-1065H, 16GB RAM node v17.8.0