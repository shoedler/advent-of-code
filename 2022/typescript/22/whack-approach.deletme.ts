import * as fs from 'fs';

const inputType: any = "txt"
const [ mapDef, pathDef ] = fs.readFileSync(`./input.${inputType}`, 'utf-8').split('\r\n\r\n')

const map = mapDef.split('\r\n');
const path = pathDef.split(/([A-Z])/g).map(char => /\d+/.test(char) ? Number(char) : char) as (number | 'L' | 'R')[];

const CUBE_DEF_WIDTH = 3
const CUBE_DEF_HEIGHT = 4
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
    let dir = dirs[currentDir];
    
    let i = 0;
    while (i < move) {
      if (getPos(dir) === '#') {
        break;
      }
      
      const inSideCol = pos[0] % CUBE_DIM;
      const inSideRow = pos[1] % CUBE_DIM;
      const currentCubeSideIndexCol = Math.floor(pos[0] / CUBE_DIM);
      const currentCubeSideIndexRow = Math.floor(pos[1] / CUBE_DIM);
      
      //   0 1 2
      // 0 ..#### Top, Right
      // 1 ..##   Front
      // 2 ####   Left, Bottom
      // 3 ##     Behind

      const isTop = currentCubeSideIndexCol === 0 && currentCubeSideIndexRow === 1
      const isLeft = currentCubeSideIndexCol === 2 && currentCubeSideIndexRow === 0
      const isRight = currentCubeSideIndexCol === 0 && currentCubeSideIndexRow === 2
      const isFront = currentCubeSideIndexCol === 1 && currentCubeSideIndexRow === 1
      const isBehind = currentCubeSideIndexCol === 3 && currentCubeSideIndexRow === 0
      const isBottom = currentCubeSideIndexCol === 2 && currentCubeSideIndexRow === 1
      
      // Move
      pos[0] += dir[0];
      pos[1] += dir[1];

      const nextInSideCol = inSideCol + dir[0];
      const nextInSideRow = inSideRow + dir[1];

      let nextIsTop = isRight && (nextInSideRow < 0) ||
        isFront && (nextInSideCol < 0) ||
        isLeft && (nextInSideRow < 0)  ||
        isBehind && (nextInSideRow < 0);

      let nextIsLeft = isTop && (nextInSideRow < 0) ||
        isFront && (nextInSideRow < 0) ||
        isBottom && (nextInSideRow < 0) ||
        isBehind && (nextInSideCol < 0);

      let nextIsRight = isTop && (nextInSideRow >= CUBE_DIM) ||
        isFront && (nextInSideRow >= CUBE_DIM) ||
        isBottom && (nextInSideRow >= CUBE_DIM) ||
        isBehind && (nextInSideCol >= CUBE_DIM);

      let nextIsFront = isTop && (nextInSideCol >= CUBE_DIM) ||
        isRight && (nextInSideCol >= CUBE_DIM) ||
        isBottom && (nextInSideCol < 0) ||
        isLeft && (nextInSideCol < 0);
      
      let nextIsBehind = isTop && (nextInSideCol < 0) ||
        isRight && (nextInSideCol < 0) ||
        isBottom && (nextInSideCol >= CUBE_DIM) ||
        isLeft && (nextInSideCol >= CUBE_DIM);

      let nextIsBottom = isRight && (nextInSideRow >= CUBE_DIM) ||
        isFront && (nextInSideCol >= CUBE_DIM) ||
        isLeft && (nextInSideRow >= CUBE_DIM) ||
        isBehind && (nextInSideRow >= CUBE_DIM);

      const states = [nextIsTop,
        nextIsLeft,
        nextIsRight,
        nextIsFront,
        nextIsBehind,
        nextIsBottom];

      if(states.filter(x => x).length > 1) {
        console.log({nextIsTop,
          nextIsLeft,
          nextIsRight,
          nextIsFront,
          nextIsBehind,
          nextIsBottom});
      
          throw new Error("Logic")
      }

      const nextColStart = 
        nextIsTop ? 0 * CUBE_DIM :
        nextIsLeft ? 2 * CUBE_DIM :
        nextIsRight ? 0 * CUBE_DIM :
        nextIsFront ? 1 * CUBE_DIM :
        nextIsBehind ? 3 * CUBE_DIM :
        nextIsBottom ? 2 * CUBE_DIM : undefined;

      const nextRowStart = 
        nextIsTop ? 1 * CUBE_DIM :
        nextIsLeft ? 0 * CUBE_DIM :
        nextIsRight ? 2 * CUBE_DIM :
        nextIsFront ? 1 * CUBE_DIM :
        nextIsBehind ? 0 * CUBE_DIM :
        nextIsBottom ? 1 * CUBE_DIM : undefined;


      if (isTop && (nextIsRight || nextIsFront)) { /* nothing */ }
      else if (isTop && (nextIsLeft || nextIsBehind)) {
        dir = dirs[0]; // right
        pos[0] = nextColStart + (CUBE_DIM - inSideCol - 1);
        pos[1] = nextRowStart;
      }
      else if (isRight && nextIsTop) { /* nothing */ }
      else if (isRight && nextIsFront) {
        dir = dirs[2]; // left
        pos[0] = nextColStart + inSideRow;
        pos[1] = nextRowStart + (CUBE_DIM - 1);
      }
      else if (isRight && nextIsBehind) {
        dir = dir; // ignore
        pos[0] = nextColStart + (CUBE_DIM - 1);
        pos[1] = nextRowStart + inSideRow;
      }
      else if (isRight && nextIsBottom) {
        dir = dirs[2]; // left
        pos[0] = nextColStart + (CUBE_DIM - inSideCol - 1);
        pos[1] = nextRowStart + (CUBE_DIM - inSideRow - 1);
      }
      else if (isFront && (nextIsTop || nextIsBottom)) { /* nothing */ }
      else if (isFront && nextIsLeft) {
        dir = dirs[1]; // down
        pos[0] = nextColStart;
        pos[1] = nextRowStart + inSideCol;
      }
      else if (isFront && nextIsRight) {
        dir = dirs[3]; // up
        pos[0] = nextColStart + (CUBE_DIM - 1);
        pos[1] = nextRowStart + inSideCol;
      }
      else if (isBottom && (nextIsFront || nextIsLeft)) { /* nothing */ }
      else if (isBottom && nextIsBehind) {
        dir = dirs[2]; // left
        pos[0] = nextColStart + inSideRow;
        pos[1] = nextRowStart + (CUBE_DIM - 1);
      }
      else if (isBottom && nextIsRight) {
        dir = dirs[2]; // left
        pos[0] = nextColStart + (CUBE_DIM - inSideCol - 1);
        pos[1] = nextRowStart + (CUBE_DIM - inSideRow - 1);
      }
      else if (isLeft && (nextIsBottom || nextIsBehind)) { /* nothing */ }
      else if (isLeft && nextIsTop) {
        dir = dirs[0]; // right
        pos[0] = nextColStart + (CUBE_DIM - inSideCol - 1);
        pos[1] = nextRowStart;
      }
      else if (isLeft && nextIsFront) {
        dir = dirs[0]; // right
        pos[0] = nextColStart + inSideCol;
        pos[1] = nextRowStart;
      }
      else if (isBehind && nextIsLeft) { /* nothing */ }
      else if (isBehind && nextIsBottom) {
        dir = dirs[3]; // up
        pos[0] = nextColStart + (CUBE_DIM - 1);
        pos[1] = nextRowStart + inSideCol;
      }
      else if (isBehind && nextIsTop) {
        dir = dirs[1]; // down
        pos[0] = nextColStart;
        pos[1] = nextRowStart + inSideCol;
      }
      else if (isBehind && nextIsRight) {
        dir = dir; // ignore
        pos[0] = nextColStart;
        pos[1] = nextRowStart + inSideRow;
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

// p2
// 37156 too low
// 74300 too low
// 117063 too high
