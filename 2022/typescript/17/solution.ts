import * as fs from 'fs';

const commands: ('>'|'<')[] = [];

fs.readFileSync('./input.txt', 'utf-8').split('\r\n')
  .forEach(line => {
    commands.push(...line.split('') as ('>'|'<')[]);
  });

const WIDTH = 7;
const SHAPE_PAD = 3;

const nextShape = (shapeIndex: number) => {
  const shape = (shapeIndex === 0) ? [ 
    0b0011110
  ] : (shapeIndex === 1) ? [
    0b0001000,
    0b0011100,
    0b0001000
  ] : (shapeIndex === 2) ? [
    0b0000100,
    0b0000100,
    0b0011100
  ] : (shapeIndex === 3) ? [
    0b0010000,
    0b0010000,
    0b0010000,
    0b0010000,
  ] : (shapeIndex === 4) ? [
    0b0011000,
    0b0011000
  ] : undefined;

  return shape.reverse();
}

const nudgeRight = (shape: number[]): number[] => 
  shape.some(n => (n & 0b1) !== 0) ? shape : shape.map(n => n >> 1);

const nudgeLeft = (shape: number[]): number[] => 
  shape.some(n => (n & parseInt(`1${'0'.repeat(WIDTH-1)}`, 2)) !== 0) ? shape : shape.map(n => n << 1);

const rowToString = (row: number) => 
  row.toString(2).padStart(WIDTH, '0').split('').map(c => c === '1' ? '#' : '.').join('');

const rowsToString = (rows: number[]) => rows.map(rowToString).join('\n');

const collides = (shape: number[], shapeInChamberIndex: number, chamber: number[]) => {
  for (let i = shapeInChamberIndex; i < (shapeInChamberIndex + shape.length); i++) {
    const shapeSlice = shape[i - shapeInChamberIndex];
    const chamberSlice = chamber[i];
    
    if (i > chamber.length - 1)
      return false;
    if ((shapeSlice & chamberSlice) != 0)
      return true;
  }
  return false;
}

const merge = (shape: number[], shapeInChamberIndex: number, chamber: number[]) => {
  for (let i = shapeInChamberIndex; i < (shapeInChamberIndex + shape.length); i++) {
    const shapeSlice = shape[i - shapeInChamberIndex];
    
    if (chamber[i] === undefined)
      chamber[i] = shapeSlice; // Extend the chamber
    else 
      chamber[i] |= shapeSlice;
  }
}

const simulate = (iterations: number, chamber: number[] = []) => {
  let count = 0;
  let cmdPtr = 0;
  const nextCommand = () => commands[cmdPtr++ % commands.length];
  
  while (count < iterations) {
    let shape = nextShape(count++ % 5);
  
    // Simulate the shape moving left and right in the defined void
    for (let i = 0; i < SHAPE_PAD;  i++) {
      shape = nextCommand() === '<' ? nudgeLeft(shape) : nudgeRight(shape);
    }
  
    // Simulate the shape falling in the chamber
    let y = chamber.length;
    while (true) {
  
      if (nextCommand() === '<') {
        const nudge = nudgeLeft(shape);
        if (!collides(nudge, y, chamber) || y === 0) {
          shape = nudge;
        }
      }
      else {
        const nudge = nudgeRight(shape);
        if (!collides(nudge, y, chamber) || y === 0) {
          shape = nudge;
        }
      }
  
      y--;
  
      if (collides(shape, y, chamber) || y < 0) {
        merge(shape, y+1, chamber);
        break;
      }
    }
  }

  return chamber;
}

// Config i7-11800H @ 2.3Ghz, 32GB RAM node v16.13.2
let t = Date.now();
const chamber2022Iters = simulate(2022);
const chamber2022ItersTimeMs = Date.now() - t;

console.log("Part One", chamber2022Iters.length, `took ${chamber2022ItersTimeMs}ms`); // 3098 took 27ms

t = Date.now();
const chamber1e12Iters = simulate(1_000_000_000_000);
const chamber1e12ItersTimeMs = Date.now() - t;

console.log("Part Two", chamber1e12Iters.length, `took ${chamber1e12ItersTimeMs}ms`); // 3098 took 27ms