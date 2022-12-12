import * as fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf-8').split('\r\n')
  .map(line => line
    .split(',')
    .map(range => {
      const [a, b] = range.split('-').map(num => parseInt(num,10))
      return Array(b-a+1).fill(0).map((_, i) => a + i)
    }));

const fullyOverlapped = input
  .filter(([a, b]) => 
    a.every(x => b.includes(x)) || 
    b.every(x => a.includes(x)));

const partiallyOverlapped = input
  .filter(([a, b]) => 
    a.some(x => b.includes(x)) || 
    b.some(x => a.includes(x)));

console.log("Part One", fullyOverlapped.length);
console.log("Part Two", partiallyOverlapped.length);