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

const collides = (shape: number, chamberIndex: number, chamber: number[]) => {
  const shapeSize = getShapeSize(shape);
  for (let i = chamberIndex; i < (chamberIndex + shapeSize); i++) {
    const shapeSlice = getShapeSlice(shape, i - chamberIndex);
    const chamberSlice = chamber[i];
    
    if (i > chamber.length - 1)
      return false;
    if ((shapeSlice & chamberSlice) != 0)
      return true;
  }
  return false;
}

const merge = (shape: number, chamberIndex: number, chamber: number[]): number[] => {
  const shapeSize = getShapeSize(shape);

  for (let i = chamberIndex; i < (chamberIndex + shapeSize); i++) {
    const shapeSlice = getShapeSlice(shape, i - chamberIndex);
    
    if (chamber[i] === undefined) {
      chamber[i] = shapeSlice; // Extend the chamber
    }
    else 
      chamber[i] |= shapeSlice;
  }

  return chamber;
}

const getTopView = (chamber: number[]) => {
  const mins = new Array(WIDTH).fill(-Infinity);
  for (let y = chamber.length - 1; y >= 0; y--) {
    const chamberSlice = chamber[y];
    for (let x = 0; x < WIDTH; x++) {
      if ((chamberSlice & (0b1 << x)) !== 0) {
        mins[x] = chamber.length - y;
      }
    }
    if (mins.every(m => m !== -Infinity)) {
      break;
    }
  }
  return mins;
}

const simulate = (targetShapeCount: number) => {
  let shapeCount = 0;
  let cmdCount = 0;
  let chamberPatternMatchExpansion = 0;
  const chamber: number[] = []
  let cache: { [key: string]: { prevShapeCount: number, prevMaxY: number } } = {}

  const nextCommand = () => commands[cmdCount++ % commands.length];
  
  while (shapeCount < targetShapeCount) {
    let shape = shapes[shapeCount++ % shapes.length];
  
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

        if (chamber.length > 2000) {
          const topView = getTopView(chamber);
          const shapePtr = (shapeCount-1) % shapes.length;
          const cmdPtr = (cmdCount-1) % commands.length;
          const cacheKey = shapePtr.toString() + topView.join('') + cmdPtr.toString();

          if (cache[cacheKey]) {
            const { prevShapeCount, prevMaxY } = cache[cacheKey];

            // How many times do I need to multiply the found pattern length to get to the target iteration?
            const quot = ((targetShapeCount - shapeCount) / (shapeCount - prevShapeCount) >> 0); // As integer division

            shapeCount += (quot * (shapeCount - prevShapeCount));

            // At this point shapeCount is close to targetShapeCount, so we store the chamberExpansion
            // and just simulate the remaining few iterations
            const patternLength = chamber.length - prevMaxY;
            chamberPatternMatchExpansion = quot * patternLength;

            cache = {}; // Because we've matched a pattern, we'll match the same pattern again sometime and 
            // it'll grow exponentially. So we clear the cache to avoid that.
          } 
          else {
            cache[cacheKey] = { prevShapeCount: shapeCount, prevMaxY: chamber.length };
          }
        }
        break;
      }
    }
  }
  
  return chamber.length + chamberPatternMatchExpansion;
}

// Setup: i7-1065H, 16GB RAM node v17.8.0

let t = Date.now();
const chamber2022Iters = simulate(2022);
const chamber2022ItersTimeMs = Date.now() - t;

console.log("Part One", chamber2022Iters, `took ${chamber2022ItersTimeMs}ms`); // 3098 took 11ms

t = Date.now();
const chamberTrillionIters = simulate(1_000_000_000_000); // 1e12 is a "Billion" in German.
const chamberTrillionItersTimeMs = Date.now() - t;

console.log("Part Two", chamberTrillionIters, `took ${chamberTrillionItersTimeMs}ms`); // 1525364431487 took 8ms