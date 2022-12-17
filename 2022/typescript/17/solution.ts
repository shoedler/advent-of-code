import * as fs from 'fs';

const commands: ('>'|'<')[] = [];

fs.readFileSync('./input.txt', 'utf-8').split('\r\n')
  .forEach(line => {
    commands.push(...line.split('') as ('>'|'<')[]);
  });

const WIDTH = 7;
const SHAPE_PAD = 3;

const MASK_ALL = parseInt('1'.repeat(WIDTH), 2);
const MASK_LEFTMOST = parseInt('1' + '0'.repeat(WIDTH-1), 2);

const SHAPE_LINE =  0b0011110;
const SHAPE_PLUS = (0b0001000 << 14) + 
                   (0b0011100 << 7) + 
                    0b0001000;
const SHAPE_L =    (0b0000100 << 14) +
                   (0b0000100 << 7) +
                    0b0011100;
const SHAPE_I =    (0b0010000 << 21) +
                   (0b0010000 << 14) +
                   (0b0010000 << 7) +
                    0b0010000;
const SHAPE_SQ =   (0b0011000 << 7) +
                    0b0011000;

const shapes = [SHAPE_LINE, SHAPE_PLUS, SHAPE_L, SHAPE_I, SHAPE_SQ];

const getShapeSlice = (shape: number, slice: number): number => 
  slice > 3 ? 0 : 
  (shape >> (slice * 7)) & MASK_ALL;

const getShapeSize = (shape: number): number => 
  shape <= MASK_ALL ? 1 :
  shape <= (MASK_ALL << 7) ? 2 :
  shape <= (MASK_ALL << 14) ? 3 :
  shape <= (MASK_ALL << 21) ? 4 :
  undefined;

const printShape = (shape: number) => {
  let sliceIndex = 0;
  let slice = 0;
  while ((slice = getShapeSlice(shape, sliceIndex++)) > 0) {
    console.log(slice.toString(2).padStart(WIDTH, '0').split('').map(c => c === '1' ? '#' : '.').join(''));
  }
}

const nudgeRight = (shape: number): number => {
  let sliceIndex = 0;
  let slice = 0;
  let nudgedSlice = 0;

  while ((slice = getShapeSlice(shape, sliceIndex)) > 0) {
    if ((slice & 0b1) !== 0) 
      return shape; // If any slice has its rightmost bit set, we can't nudge right

    nudgedSlice |= (slice >> 1) << (sliceIndex * 7);
    sliceIndex++;
  }

  return nudgedSlice;
}

const setCharAt = (str: string, index: number, char: string): string => {
  if (index > str.length-1)
    return str;
  return str.substring(0,index) + char + str.substring(index+1);
}

const nudgeLeft = (shape: number): number => {
  let sliceIndex = 0;
  let slice = 0;
  let nudgedSlice = 0;

  while ((slice = getShapeSlice(shape, sliceIndex)) > 0) {
    if ((slice & MASK_LEFTMOST) !== 0)  
      return shape; // If any slice has its leftmost bit set, we can't nudge left

    nudgedSlice |= (slice << 1) << (sliceIndex * 7);
    sliceIndex++;
  }

  return nudgedSlice;
}

const collides = (shape: number, chamberIndex: number, chamber: string) => {
  const shapeSize = getShapeSize(shape);
  for (let i = chamberIndex; i < (chamberIndex + shapeSize); i++) {
    const shapeSlice = getShapeSlice(shape, i - chamberIndex);
    const chamberSlice = chamber.charCodeAt(i);
    
    if (i > chamber.length - 1)
      return false;
    if ((shapeSlice & chamberSlice) != 0)
      return true;
  }
  return false;
}

const merge = (shape: number, chamberIndex: number, chamber: string): string => {
  const shapeSize = getShapeSize(shape);

  for (let i = chamberIndex; i < (chamberIndex + shapeSize); i++) {
    const shapeSlice = getShapeSlice(shape, i - chamberIndex);
    
    if (chamber[i] === undefined) {
      chamber += String.fromCharCode(shapeSlice);
    }
    else 
      chamber = setCharAt(chamber, i, String.fromCharCode(shapeSlice | chamber.charCodeAt(i)));
  }

  return chamber;
}

let chamber: string = '';
const simulate = (iterations: number) => {
  let count = 0;
  let cmdPtr = 0;

  const nextCommand = () => commands[cmdPtr++ % commands.length];
  
  while (count < iterations) {
    let shape = shapes[count++ % 5];
  
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
        chamber = merge(shape, y+1, chamber);
        break;
      }
    }
  }

}

// Config i7-11800H @ 2.3Ghz, 32GB RAM node v16.13.2
let t = Date.now();
chamber = '';
simulate(2022);
const chamber2022ItersTimeMs = Date.now() - t;

console.log("Part One", chamber.length, `took ${chamber2022ItersTimeMs}ms`); // 3098 took 20ms, 2ms after running it 10 times consecutively

t = Date.now();
chamber = '';
simulate(1_000_000_000_000);
const chamber1e12ItersTimeMs = Date.now() - t;

console.log("Part Two", chamber.length, `took ${chamber1e12ItersTimeMs}ms`); // approx. 11 days 