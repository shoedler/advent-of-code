import * as fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf8');
const ops: { [key: string]: number } = { "A":1, "B":2, "C":3, "X":1, "Y":2, "Z":3 };

const input = data
  .split('\r\n')
  .map(line => line.split(' ')
  .map(char => ops[char]));

const sumPartOne = input.reduce((sum, [opp, mine]) => sum + mine + (
  opp === mine ? 3 : 
  opp === (mine%3) + 1 ? 0 : 6), 0);

const outcomes = [0, 3, 6]
const sumPartTwo = input
  .map(line => [line[0], outcomes[line[1]-1]])
  .reduce((sum, [opp, mine]) => sum + mine + (
    mine === 0 ? opp - 1 ? 3 : opp - 1 : // "Reverse Modulo" -> 0 becomes 3
    mine === 6 ? (opp%3) + 1 : opp), 0);

console.log("Part One", sumPartOne);
console.log("Part Two", sumPartTwo);