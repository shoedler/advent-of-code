import * as fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf-8').split('\r\n');
const prios: { [key: string]: number } = {};

'abcdefghijklmnopqrstuvwxyz'.split('').forEach((x,i) => prios[x] = i + 1)
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((x,i) => prios[x] = i + 27)

const intersect = <T>(s: Set<T>[]): T[] => [...s[0]].filter(x => s.slice(1).every(s => s.has(x)))
const sumOfUnique = (s: Set<string>[]): number => intersect(s).reduce((a,b) => a += prios[b], 0)

const groups: string[][] = [];
for (let i = 0; i < input.length; i += 3) 
  groups.push(input.slice(i, i + 3))

console.log("Part One", input
  .map(l => [new Set(l.substring(0, l.length/2)), new Set(l.substring(l.length/2))])
  .reduce((a,b) => a + sumOfUnique(b), 0));

console.log("Part Two", groups
  .map(group => group.map(line => new Set(line)))
  .reduce((a,b) => a + sumOfUnique(b), 0));