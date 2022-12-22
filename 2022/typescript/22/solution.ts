import * as fs from 'fs';

const inputType = "ext"
const [ mapDef, pathDef ] = fs.readFileSync(`./input.${inputType}`, 'utf-8').split('\r\n\r\n')

const map = mapDef.split('\r\n');
const path = pathDef.split(/([A-Z])/g).map(char => /\d+/.test(char) ? Number(char) : char) as (number | 'L' | 'R')[];

const CUBE_DIM = inputType === 'ext' ? 4 : 50;
const dirs = [
  [0, 1], // R
  [1, 0], // D
  [0,-1], // L
  [-1,0], // U
]

let currentDir = 0;
const pos = [0, 0];
const rot = {
  'R': () => currentDir = (currentDir + 1) % dirs.length,
  'L': () => currentDir = (currentDir - 1) < 0 ? dirs.length - 1 : --currentDir
};

const getPos = (ofs: number[] = [0,0]) => {
  const row = map[pos[0] + ofs[0]]
  if (row === undefined) return undefined
  return row[pos[1] + ofs[1]];
}

// Starting Pos
pos[1] = map[0].indexOf('.');

const DEBUG = false;

path.forEach(move => {  
  if (typeof move === 'number') {
    const dir = dirs[currentDir];
    
    let i = 0;
    while (i < move) {
      if (getPos(dir) === '#') {
        break;
      }
      
      pos[0] += dir[0];
      pos[1] += dir[1];
      
      if (DEBUG) console.log("Moved", pos, getPos() );

      // Edge case
      if ((getPos() === ' ') || (getPos() === undefined)) {
        if (DEBUG) console.log("Entered Reversing");
        
        const prev0 = pos[0] - dir[0];
        const prev1 = pos[1] - dir[1];

        const revDir0 = dir[0] * -1;
        const revDir1 = dir[1] * -1;

        if (DEBUG) console.log("Pre first", pos, getPos() );
        pos[0] += revDir0
        pos[1] += revDir1
        if (DEBUG) console.log("Post first", pos, getPos() );

        while ((getPos() !== ' ') && (getPos() !== undefined)) {
          pos[0] += revDir0
          pos[1] += revDir1
          if (DEBUG) console.log("Reversing", pos, getPos() );
        }

        pos[0] += dir[0];
        pos[1] += dir[1];

        if (DEBUG) console.log("Done Reversing");

        if (getPos() === '#') {
          pos[0] = prev0;
          pos[1] = prev1;
          if (DEBUG) console.log("Reversed into a Wall, going back to last");
          break;
        }
      }

      i++;
    }

  }
  else {
    console.assert(/[A-Z]/.test(move as string));
    rot[move]();
  }
})

console.log(1000 * (pos[0] + 1) + 4 * (pos[1] + 1) + currentDir); // 189140 too low

// Setup: i7-1065H, 16GB RAM node v17.8.0
let t = Date.now();
let rootValue = 0
let duration = Date.now() - t;
console.log("Part One", rootValue, `took ${duration}ms`); // 43699799094202 took 0ms

t = Date.now();
const humanValue = 0
duration = Date.now() - t;
console.log("Part Two", humanValue, `took ${duration}ms`); // 3375719472770 took 6ms
