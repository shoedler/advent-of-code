import * as fs from 'fs';

const packetPairs = fs.readFileSync('./input.txt', 'utf-8').split('\r\n\r\n')
  .map(pckg => pckg.split('\r\n')
    .map(str => eval(str)))


const comparePkgPair = (left: any, right: any): number => {
  if (typeof left === 'number' && typeof right === 'number') {
    return left < right ? -1 :
           left === right ? 0 :
           1;
  }
  else if (typeof left === 'number' && Array.isArray(right)) {
    return comparePkgPair([left], right)
  }
  else if (Array.isArray(left) && Array.isArray(right)) {
    let i = 0; 
    while (i < left.length && i < right.length) {
      const c = comparePkgPair(left[i], right[i]);
      if (c === 1 || c === -1)
        return c;
      i++;
    }
    if (i === left.length && i < right.length)
      return -1;
    else if (i === right.length && i < left.length) {
      return 1;
    }
    else
      return 0;
  }
  else {
    return comparePkgPair(left, [right])
  }
}

// Part 1
const indicies = packetPairs.map((pair, i) => comparePkgPair(pair[0], pair[1]) === -1 ? i + 1 : 0);

console.log("Part One", indicies.reduce((a, b) => a + b, 0));

// Part 2
const dividerPackets = [[[2]], [[6]]]
const packets = packetPairs.flat()
packets.push(...dividerPackets)

const sorted = packets.sort(comparePkgPair);
const dividerIndex = 
  (sorted.findIndex(pkg => dividerPackets[0] === pkg) + 1) *
  (sorted.findIndex(pkg => dividerPackets[1] === pkg) + 1);

  console.log("Part Two", dividerIndex)
