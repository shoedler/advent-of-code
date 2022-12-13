import * as fs from 'fs';

const packetPairs = fs.readFileSync('./input.txt', 'utf-8').split('\r\n\r\n')
  .map(pckg => pckg.split('\r\n')
    .map(str => eval(str)))


const comparePkgPair = (left: any, right: any): number => {
  if (typeof left === 'number' && typeof right === 'number') {
    return left < right ? -1 
         : left === right ? 0 
         : 1;
  }
  else if (typeof left === 'number' && Array.isArray(right)) {
    return comparePkgPair([left], right)
  }
  else if (Array.isArray(left) && Array.isArray(right)) {
    let i = 0; 
    while (i < left.length && i < right.length) {
      const result = comparePkgPair(left[i], right[i]);
      if (result === 1 || result === -1)
        return result;
      i++;
    }
    return (i === left.length &&  i < right.length) ? -1
         : (i === right.length && i < left.length) ? 1
         : 0;
  }
  else {
    return comparePkgPair(left, [right])
  }
}

// Part 1
const correctIndices = packetPairs.map((pair, i) => 
  comparePkgPair(pair[0], pair[1]) === -1 ? i + 1 : 0);
const sumOfCorrectIndices = correctIndices.reduce((a, b) => a + b, 0)

// Part 2
const dividerPackets = [[[2]], [[6]]]

const packets = packetPairs.flat()
packets.push(...dividerPackets)

const sorted = packets.sort(comparePkgPair);
const dividerIndex = 
  (sorted.findIndex(pkg => dividerPackets[0] === pkg) + 1) *
  (sorted.findIndex(pkg => dividerPackets[1] === pkg) + 1);

console.log("Part One", sumOfCorrectIndices);
console.log("Part Two", dividerIndex)
