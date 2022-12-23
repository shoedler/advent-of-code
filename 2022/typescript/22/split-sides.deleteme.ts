import * as fs from 'fs';

let inputType: any = "txt";
const [ mapDef, pathDef ] = fs.readFileSync(`./input.${inputType}`, 'utf-8').split('\r\n\r\n')

// Balance line lengths
let mapLines = mapDef.split('\r\n')
const longestLine = Math.max(...mapLines.map(line => line.length));
mapLines = mapLines.map(line => line.padEnd(longestLine, " "));

const cubeRollup: string[][][][] = [];

const CUBE_DIM = inputType === 'ext' ? 4 : 50;
const CUBE_DEF_ROW_LEN = mapLines.length / CUBE_DIM;
const CUBE_DEF_COL_LEN = mapLines[0].length / CUBE_DIM;

// Build cube sides
for (let i = 0; i < CUBE_DEF_COL_LEN; i++) {
  const cubeSideRow: string[][][] = [];
  for (let j = 0; j < CUBE_DEF_ROW_LEN; j++) {
    const cubeSide: string[][] = [];
    for (let ci = i*CUBE_DIM; ci < i*CUBE_DIM+CUBE_DIM; ci++) {
      const cubeSideRowRow: string[] = [];
      const line = mapLines[ci];
      for (let cj = j*CUBE_DIM; cj < j*CUBE_DIM+CUBE_DIM; cj++) {
        cubeSideRowRow.push(line[cj])
      }
      cubeSide.push(cubeSideRowRow);
    }
    cubeSideRow.push(cubeSide)
  }
  cubeRollup.push(cubeSideRow);
}

console.log(cubeRollup);

const rotateCw = (arr: any[][]) => {
  arr = JSON.parse(JSON.stringify(arr))
  
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr[i].length; j++) {
      [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];
    }
  }

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length / 2; j++) {
      [arr[i][j], arr[i][arr[i].length - 1 - j]] = [arr[i][arr[i].length - 1 - j], arr[i][j]];
    }
  }
  
  return arr;
}

const rotateCcw = (arr: any[][]) => {
  arr = JSON.parse(JSON.stringify(arr))

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr[i].length; j++) {
      [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];
    }
  }

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length / 2; j++) {
      [arr[i][j], arr[i][arr[i].length - 1 - j]] = [arr[i][arr[i].length - 1 - j], arr[i][j]];
    }
  }
  
  return arr;
}

// const c = cubeSides.map(
//   cubeSideRow => {
//     let line = ""
//     for (let i = 0; i < CUBE_DIM; i++) {
//       for (let j = 0; j < cubeSideRow.length; j++) {
//         line += cubeSideRow[j][i].join('')
//       }
//       line += '\n'
//     }
//     return line;
//   }).join('');

// console.log(c);

const path = pathDef.split(/([A-Z])/g).map(char => /\d+/.test(char) ? Number(char) : char) as (number | 'L' | 'R')[];

const dirs = [
  [0, 1], // R
  [1, 0], // D
  [0,-1], // L
  [-1,0], // U
]

let currentDirIndex = 0;
const pos = [0, 0];
const turn = {
  'R': () => currentDirIndex = (currentDirIndex + 1) % dirs.length,
  'L': () => currentDirIndex = (currentDirIndex - 1) < 0 ? dirs.length - 1 : --currentDirIndex
};

const getPos = (ofs: number[] = [0,0]) => {
  const row = mapLines[pos[0] + ofs[0]]
  if (row === undefined) return undefined
  return row[pos[1] + ofs[1]];
}

// Starting Pos
pos[1] = mapLines[0].indexOf('.');

path.forEach(cmd => {  
  if (typeof cmd === 'number') {
    let dir = dirs[currentDirIndex];
    
    let i = 0;
    while (i < cmd) {
      if (getPos(dir) === '#') {
        break;
      }
      
      pos[0] += dir[0];
      pos[1] += dir[1];

      i++;
    }

  }
  else {
    console.assert(/[A-Z]/.test(cmd as string));
    turn[cmd]();
  }
})

console.log(1000 * (pos[0] + 1) + 4 * (pos[1] + 1) + currentDirIndex); // 189140 too low

// Setup: i7-1065H, 16GB RAM node v17.8.0
let t = Date.now();
let rootValue = 0
let duration = Date.now() - t;
console.log("Part One", rootValue, `took ${duration}ms`); // 43699799094202 took 0ms

t = Date.now();
const humanValue = 0
duration = Date.now() - t;
console.log("Part Two", humanValue, `took ${duration}ms`); // 3375719472770 took 6ms
