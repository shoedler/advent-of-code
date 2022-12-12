import * as fs from 'fs';
import { absDx, absDy, diffX, diffY,  IntVec, sameOrNeighbor, sum, } from "./intVec";

const dirs: { [key: string]: IntVec } = { 
  'R': [  1,  0 ],
  'L': [ -1,  0 ],
  'U': [  0, -1 ],
  'D': [  0,  1 ],
}

const commands = fs.readFileSync('./input.txt', 'utf-8')
  .split('\r\n')
  .map(line => line.split(' '))
  .map(cmd => [cmd[0], parseInt(cmd[1], 10)]) as ['R'|'L'|'U'|'D', number][];

const simulate = (knotCount: number = 2) => {
  const knots: IntVec[] = new Array(knotCount).fill(0).map(_ => [0,0])
  const knotTailPositions = new Set<string>();
  
  const storeKnotTail = () => 
    knotTailPositions.add(`${knots[knots.length-1][0]}|${knots[knots.length-1][1]}`)
  
  const moveMany = (d: IntVec) => {
    knots[0] = sum(knots[0], d);
  
    for (let i = 1; i < knots.length; i++) {
      let knotHead = knots[i-1];
      let knotTail = knots[i];
  
      if (!sameOrNeighbor(knotHead, knotTail)) {
        const sX = absDx(knotHead, knotTail) === 0 ? 0 : diffX(knotHead, knotTail) / absDx(knotHead, knotTail);
        const sY = absDy(knotHead, knotTail) === 0 ? 0 : diffY(knotHead, knotTail) / absDy(knotHead, knotTail);
    
        knots[i] = sum(knotTail, [sX, sY]);
      }
    }
  }
  
  storeKnotTail();
  commands.forEach(([dir,val]) => {
    const d: IntVec = [dirs[dir][0], dirs[dir][1]]
  
    for (let i = 0; i < val; i++) {
      moveMany(d)
      storeKnotTail();
    }
  })

  return Array.from(knotTailPositions).length
}

console.log("Part One", simulate(2));
console.log("Part Two", simulate(10));