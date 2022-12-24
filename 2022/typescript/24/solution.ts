import { assert, log } from 'console';
import * as fs from 'fs';
import { Hashmap, Hashset } from '../lib';

type Vec = [number, number];
type Blizzard = '^' | 'v' | '<' | '>';

const Walls = new Hashset<Vec>();
let Blizzards = new Hashmap<Vec, Blizzard[]>();

const Directions: { [k in Blizzard]: Vec } = { 
  '^': [-1, 0], 
  'v': [ 1, 0], 
  '<': [ 0,-1], 
  '>': [ 0, 1]
};

const append = <K, V>(map: Hashmap<K, V[]>, pos: K, value: V) =>
  map.has(pos) ? map.get(pos).push(value) : map.put(pos, [value]);

fs.readFileSync('./input.txt', 'utf-8').split('\r\n')
  .forEach((line, col) =>
    line.split('').forEach((char, row) => {
      if (char === '#')
        Walls.put([col, row]);
      else if (char in Directions)
        append(Blizzards, [col, row], char as Blizzard);
    }));

// const printMap = () => {
//   const colMin = Math.min(...Walls.items().map(([c, _]) => c), ...Blizzards.items().map(([[c, _], __]) => c));
//   const colMax = Math.max(...Walls.items().map(([c, _]) => c), ...Blizzards.items().map(([[c, _], __]) => c)) + 1;
//   const rowMin = Math.min(...Walls.items().map(([_, r]) => r), ...Blizzards.items().map(([[_, r], __]) => r));
//   const rowMax = Math.max(...Walls.items().map(([_, r]) => r), ...Blizzards.items().map(([[_, r], __]) => r)) + 1;

//   for (let c = colMin; c < colMax; c++) {
//     let line = '';
    
//     for (let r = rowMin; r < rowMax; r++) {
//       let char = (Walls.has([c, r])) ? '#' : '.'
//       const blizzards = Blizzards.get([c, r]);

//       if (blizzards && blizzards.length > 0) {
//         char = (blizzards.length === 1) ? blizzards[0] : 
//           (blizzards.length < 10) ? blizzards.length.toString() :
//           (blizzards.length >= 10) ? '!' : 
//           char;
//       }
//       line += char;
//     }
//     log(line);
//   }
// }

const minWallCol = Math.min(...Walls.items().map(([c, _]) => c));
const maxWallCol = Math.max(...Walls.items().map(([c, _]) => c));
const minWallRow = Math.min(...Walls.items().map(([_, r]) => r));
const maxWallRow = Math.max(...Walls.items().map(([_, r]) => r));

const moveBlizzardsOnce = (blizzards_: typeof Blizzards) => {
  const blizzards = blizzards_.items();
  const nextBlizzards = new Hashmap<Vec, Blizzard[]>();

  for (const [[c, r], blzzs] of blizzards) {
    blzzs.forEach(blizzard => {
      const [dc, dr] = Directions[blizzard];
      let newPos = [c + dc, r + dr] as Vec;
      if (Walls.has(newPos)) {
        // Make a new one on the other side
        if (newPos[0] <= minWallCol) newPos[0] = maxWallCol - 1;
        if (newPos[0] >= maxWallCol) newPos[0] = minWallCol + 1;
        if (newPos[1] <= minWallRow) newPos[1] = maxWallRow - 1;
        if (newPos[1] >= maxWallRow) newPos[1] = minWallRow + 1;
      }
      append(nextBlizzards, newPos, blizzard);
    });
  }

  return nextBlizzards;
}

let pos = [0, 1] as Vec;
let time = 0;
const queue: [Vec, number][] = [[pos, time]];
const visited = new Hashset<{pos: Vec, time: number}>();
const blizzardsConfigs = new Hashmap<number, typeof Blizzards>();
const isTarget = (pos: Vec): boolean => pos[0] === maxWallCol && !Walls.has(pos);

while (queue.length > 0) {
  [pos, time] = queue.shift()!;

  if (visited.has({ pos, time }))
    continue;

  let blizzards = blizzardsConfigs.get(time);
  if (!blizzards && time <=0) { // First time
    blizzards = moveBlizzardsOnce(Blizzards);
    blizzardsConfigs.put(time, blizzards);
  }
  else if (!blizzards) {
    const prevBlizzards = blizzardsConfigs.get(time - 1)!;
    blizzards = moveBlizzardsOnce(prevBlizzards);
    blizzardsConfigs.put(time, blizzards);
  }

  if (blizzards.has(pos))
    continue;

  visited.put({pos, time});

  if (isTarget(pos)) {
    log('Part One:', time + 1);
    break;
  }
  
  for (const dir of Object.values(Directions)) {
    const newPos = [pos[0] + dir[0], pos[1] + dir[1]] as Vec;
    if (Walls.has(newPos))
      continue;
    if (pos[0] < minWallCol) 
      continue;
    queue.push([newPos, time + 1]);
  }
  queue.push([pos, time + 1]); // Wait
}

// for (let i = 0; i < 10; i++) {
//   printMap();
//   log('--------------');
//   moveBlizzards();
// }
// printMap();
// log('--------------');
// Setup: i7-1065H, 16GB RAM node v17.8.0