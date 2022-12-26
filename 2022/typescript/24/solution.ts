import * as fs from 'fs';
import { Hashmap, Hashset, runPart } from '../lib';

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

const minWallCol = Math.min(...Walls.items().map(([c, _]) => c));
const maxWallCol = Math.max(...Walls.items().map(([c, _]) => c));
const minWallRow = Math.min(...Walls.items().map(([_, r]) => r));
const maxWallRow = Math.max(...Walls.items().map(([_, r]) => r));

const nextBlizzards = (initialBlizzards: typeof Blizzards) => {
  const blizzards = initialBlizzards.items();
  const next = new Hashmap<Vec, Blizzard[]>();

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
      append(next, newPos, blizzard);
    });
  }

  return next;
}

const shortestSafePath = (initialBlizzards: typeof Blizzards, startPos: Vec, targetPos: Vec): { 
  time: number, 
  blizzardsConfig: typeof Blizzards 
} => {
  let pos = startPos;
  let time = 0;
  const queue: [Vec, number][] = [[pos, time]];
  const visited = new Hashset<{pos: Vec, time: number}>();
  const blizzardsHistory = new Hashmap<number, typeof Blizzards>();

  while (queue.length > 0) {
    [pos, time] = queue.shift()!;

    if (visited.has({ pos, time }))
      continue;

    // Retrieve blizzards from history or calculate the next iteration 
    // if we haven't seen this 'time' before
    let blizzards = blizzardsHistory.get(time);
    if (!blizzards && time <= 0) {
      blizzards = initialBlizzards;  // Starting with the provided blizzards at time 0
      blizzardsHistory.put(time, blizzards);
    }
    else if (!blizzards) {
      const prevBlizzards = blizzardsHistory.get(time - 1)!;
      blizzards = nextBlizzards(prevBlizzards);
      blizzardsHistory.put(time, blizzards);
    }

    if (blizzards.has(pos))
      continue;

    visited.put({pos, time});

    if (pos[0] === targetPos[0] && pos[1] === targetPos[1]) 
      return { time, blizzardsConfig: blizzards };
    
    for (const dir of Object.values(Directions)) {
      const newPos = [pos[0] + dir[0], pos[1] + dir[1]] as Vec;
      if (Walls.has(newPos))
        continue;
      if (pos[0] < minWallCol || pos[0] > maxWallCol) 
        continue; // If we're at start or target we don't want to go look outside the map
      queue.push([newPos, time + 1]);
    }
    queue.push([pos, time + 1]); // Wait
  }
}

let startToTarget: any = null;
let backToStart: any = null;
let backToTarget: any = null;

// Setup: i7-1065H, 16GB RAM node v17.8.0
runPart("One", () => {
  startToTarget = shortestSafePath(Blizzards, [0, 1], [maxWallCol, maxWallRow - 1]);
  return startToTarget.time;
}); // 225 took 2836ms

runPart("Two", () => {
  backToStart = shortestSafePath(startToTarget.blizzardsConfig, [maxWallCol, maxWallRow - 1], [0, 1]);
  backToTarget = shortestSafePath(backToStart.blizzardsConfig, [0, 1], [maxWallCol, maxWallRow - 1]);
  return startToTarget.time + backToStart.time + backToTarget.time;
}); // 711 took 5933ms