import * as fs from 'fs';

let inputType: any = "txt";
const [mapDef, pathDef] = fs.readFileSync(`./input.${inputType}`, 'utf-8').split('\r\n\r\n')

const path = pathDef.split(/([A-Z])/g)
  .map(char => /\d+/.test(char) ? Number(char) : char) as (number | 'L' | 'R')[];

// Balance line lengths
let mapLines = mapDef.split('\r\n')
const longestLine = Math.max(...mapLines.map(line => line.length));
mapLines = mapLines.map(line => line.padEnd(longestLine, " "));

type CubeSide = string[][];
type CubeSideRow = CubeSide[];
type Cube = CubeSideRow[];
type LeaveDirection = 'leaveTop' | 'leaveLeft' | 'leaveRight' | 'leaveBottom';

const cubeRollup: Cube = [];

const CUBE_DIM = inputType === 'ext' ? 4 : 50;
const CUBE_DEF_ROW_LEN = mapLines.length / CUBE_DIM;
const CUBE_DEF_COL_LEN = mapLines[0].length / CUBE_DIM;

// Build cube sides
for (let i = 0; i < CUBE_DEF_ROW_LEN; i++) {
  const cubeSideRow: CubeSideRow = [];
  for (let j = 0; j < CUBE_DEF_COL_LEN; j++) {
    const cubeSide: CubeSide = [];
    for (let ci = i * CUBE_DIM; ci < i * CUBE_DIM + CUBE_DIM; ci++) {
      const cubeSideRowRow: string[] = [];
      const line = mapLines[ci];
      for (let cj = j * CUBE_DIM; cj < j * CUBE_DIM + CUBE_DIM; cj++) 
        cubeSideRowRow.push(line[cj])
      
      cubeSide.push(cubeSideRowRow);
    }
    cubeSideRow.push(cubeSide)
  }
  cubeRollup.push(cubeSideRow);
}

// const rotCw = <T>(a: T[][]): T[][] => {
//   let arr = JSON.parse(JSON.stringify(a))

//   for (let i = 0; i < arr.length; i++) 
//     for (let j = i + 1; j < arr[i].length; j++) 
//       [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];

//   arr.map((row: T[]) => row.reverse()) // in-place, even tough it's 'map'
//   return arr;
// }

// const rotCcw = <T>(a: T[][]): T[][] => {
//   let arr = JSON.parse(JSON.stringify(a))

//   for (let i = 0; i < arr.length; i++) 
//     for (let j = i + 1; j < arr[i].length; j++) 
//       [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];

//   return arr;
// }

// const flip = <T>(a: T[][]) => {
//   let arr = JSON.parse(JSON.stringify(a))
//   return arr.map((row: T[]) => row.reverse());
// }

const printCubeSide = (cubeSide: CubeSide) => 
  console.log(cubeSide.map(row => row.join('')).join('\n'));

const printCube = (cube: Cube) =>
  console.log(cube.map(
    cubeSideRow => {
      let line = ""
      for (let i = 0; i < CUBE_DIM; i++) {
        for (let j = 0; j < cubeSideRow.length; j++) 
          line += cubeSideRow[j][i].join('')
        
        line += '\n'
      }
      return line;
    }).join(''));


const cube: { [key: string]: { name: keyof typeof cube, data: CubeSide } } = {
  cubeTop: { name: 'cubeTop', data: cubeRollup[0][1] },
  cubeRight: { name: 'cubeRight', data: cubeRollup[0][2] },
  cubeFront: { name: 'cubeFront', data: cubeRollup[1][1] },
  cubeLeft: { name: 'cubeLeft', data: cubeRollup[2][0] },
  cubeUnder: { name: 'cubeUnder', data: cubeRollup[2][1] },
  cubeBack: { name: 'cubeBack', data: cubeRollup[3][0] },
}


const cubeTransitions: { [key: keyof typeof cube ]: {
  [K in LeaveDirection]: { 
    cube: typeof cube[keyof typeof cube], 
    rot: 'cw' | 'ccw' | 'flip' | 'flipHoriz' | 'flipVert',
    dir: 'R' | 'U' | 'L' | 'D';
  }
}} = {
  'cubeTop': {
    'leaveTop': { cube: cube.cubeBack, rot: 'ccw', dir: 'R' }, // U -> R (cw)
    'leaveLeft': { cube: cube.cubeLeft, rot: 'ccw', dir: 'U' }, // L -> U (cw)
    'leaveRight': { cube: cube.cubeRight, rot: 'flipHoriz', dir: 'R' }, // R -> R (flipHoriz)
    'leaveBottom': { cube: cube.cubeFront, rot: 'flipVert', dir: 'D' }, // D -> D (flipVert)
  },
  'cubeRight': {
    'leaveTop': { cube: cube.cubeBack, rot: 'flipVert', dir: 'U' }, // U -> U (flipVert)
    'leaveLeft': { cube: cube.cubeTop, rot: 'flipHoriz', dir: 'L' }, // L -> L (none)
    'leaveRight': { cube: cube.cubeUnder, rot: 'flip', dir: 'L' }, // R -> L (flip)
    'leaveBottom': { cube: cube.cubeFront, rot: 'ccw', dir: 'L' }, // D -> L (cw)
  },
  'cubeFront': {
    'leaveTop': { cube: cube.cubeTop, rot: 'flipVert', dir: 'U' }, // U -> U (flipVert)
    'leaveLeft': { cube: cube.cubeLeft, rot: 'cw', dir: 'D' }, // L -> D (ccw)
    'leaveRight': { cube: cube.cubeRight, rot: 'cw', dir: 'U' }, // R -> U (ccw)
    'leaveBottom': { cube: cube.cubeUnder, rot: 'flipVert', dir: 'D' }, // D -> D (flipVert)
  },
  'cubeUnder': {
    'leaveTop': { cube: cube.cubeFront, rot: 'flipVert', dir: 'U' }, // U -> U (flipVert)
    'leaveLeft': { cube: cube.cubeLeft, rot: 'flipHoriz', dir: 'L' }, // L -> L (flipHoriz)
    'leaveRight': { cube: cube.cubeRight, rot: 'flip', dir: 'L' }, // R -> L (flip)
    'leaveBottom': { cube: cube.cubeBack, rot: 'ccw', dir: 'L' }, // D -> L (cw)
  },
  'cubeLeft': {
    'leaveTop': { cube: cube.cubeFront, rot: 'ccw', dir: 'R' }, // U -> R (cw)
    'leaveLeft': { cube: cube.cubeTop, rot: 'flip', dir: 'R' }, // L -> R (flip)
    'leaveRight': { cube: cube.cubeUnder, rot: 'flipHoriz', dir: 'R' }, // R -> R (flipHoriz)
    'leaveBottom': { cube: cube.cubeBack, rot: 'flipVert', dir: 'D' }, // D -> D (flipVert)
  },
  'cubeBack': {
    'leaveTop': { cube: cube.cubeLeft, rot: 'flipVert', dir: 'U' }, // U -> U (flipVert)
    'leaveLeft': { cube: cube.cubeTop, rot: 'cw', dir: 'D' }, // L -> D (ccw)
    'leaveRight': { cube: cube.cubeUnder, rot: 'cw', dir: 'U' }, // R -> U (ccw)
    'leaveBottom': { cube: cube.cubeRight, rot: 'flipVert', dir: 'D' }, // D -> D (flipVert)
  }
}

// Noted: rot 'cw' turns the dir 'ccw' and vice versa.
// 'flip' turns the dir 'flip' e.g. 'R' -> 'L', 'U' -> 'D', 'L' -> 'R', 'D' -> 'U'
// 'flipHoriz' does not change the dir
// 'flipVert' does not change the dir

const rotate = (pos: [number, number], rot: 'cw' | 'ccw' | 'flip' | 'flipHoriz' | 'flipVert'): [number, number] => {
  switch (rot) {
    case 'cw': return [CUBE_DIM - 1 - pos[1], pos[0]];
    case 'ccw': return [pos[1], CUBE_DIM - 1 - pos[0]];
    case 'flip': return [CUBE_DIM - 1 - pos[0], CUBE_DIM - 1 - pos[1]]
    case 'flipHoriz': return [pos[0], CUBE_DIM - 1 - pos[1]]
    case 'flipVert': return [CUBE_DIM - 1 - pos[0], pos[1]]
  } 
}

const directions = {
  'R': [0, 1],
  'D': [1, 0],
  'L': [0, -1],
  'U': [-1, 0],
}

let currentDirIndex = 0;
const turn = {
  'R': () => currentDirIndex = (currentDirIndex + 1) % Object.entries(directions).length,
  'L': () => currentDirIndex = (currentDirIndex - 1) < 0 ? Object.entries(directions).length - 1 : --currentDirIndex
};

let pos: [number, number] = [0, 0];
let currentSide = cube['cubeTop'];

path.forEach(cmd => {
  if (typeof cmd === 'number') {
    let dir = Object.values(directions)[currentDirIndex];

    let i = 0;
    while (i < cmd) {
      if (currentSide.data[pos[0]][pos[1]] === '#') {
        break;
      }

      pos[0] += dir[0];
      pos[1] += dir[1];

      // Get leave direction
      if (dir[0] < 0) { 
        const nextTranspose = cubeTransitions[currentSide.name]['leaveTop'];
        currentSide = nextTranspose.cube;
        pos = rotate(pos, nextTranspose.rot);
        dir = directions[nextTranspose.dir];
      }
      else if (dir[0] >= CUBE_DIM) {
        const nextTranspose = cubeTransitions[currentSide.name]['leaveBottom'];
        currentSide = nextTranspose.cube;
        pos = rotate(pos, nextTranspose.rot);
        dir = directions[nextTranspose.dir];
      }
      else if (dir[1] < 0) {
        const nextTranspose = cubeTransitions[currentSide.name]['leaveLeft'];
        currentSide = nextTranspose.cube;
        pos = rotate(pos, nextTranspose.rot);
        dir = directions[nextTranspose.dir];
      }
      else if (dir[1] >= CUBE_DIM) {
        const nextTranspose = cubeTransitions[currentSide.name]['leaveRight'];
        currentSide = nextTranspose.cube;
        pos = rotate(pos, nextTranspose.rot);
        dir = directions[nextTranspose.dir];
      }

      i++;
    }

  }
  else {
    console.assert(/[A-Z]/.test(cmd as string));
    turn[cmd]();
  }
})

console.log(pos); // (.0 + 1) * 1000 + 4 * (.1 + 1) + currentDirIndex // 115063

// printCubeSide(cube.cubeBack.data);
// const lines = fs.readFileSync('input.txt', 'utf8').split('\r\n\r\n')[0].split('\r\n');
// console.log(1000 * (pos[0] + 1) + 4 * (pos[1] + 1) + currentDirIndex); // 189140 too low

// // Setup: i7-1065H, 16GB RAM node v17.8.0
// let t = Date.now();
// let rootValue = 0
// let duration = Date.now() - t;
// console.log("Part One", rootValue, `took ${duration}ms`); // 43699799094202 took 0ms

// t = Date.now();
// const humanValue = 0
// duration = Date.now() - t;
// console.log("Part Two", humanValue, `took ${duration}ms`); // 3375719472770 took 6ms
