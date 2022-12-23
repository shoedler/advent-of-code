import * as fs from 'fs';
import { range } from '../lib';

const simulate = (execCommand: (stacks: string[][]) => (cmd: [number, number, number]) => void) => { 
  const [stacksDef, programText] = fs.readFileSync('./input.txt', 'utf-8').split('\r\n\r\n')
    .map(chunks => chunks
      .split('\r\n'));

  const stackNums = stacksDef.pop()?.trim().split(/\s+/)
    .map(char => parseInt(char, 10))!

  const stackLen = stackNums[stackNums.length - 1];

  const stacks = stacksDef
    .reverse()
    .map(line => range(0, stackLen).map(num => line[1 + num * 4]))
    .reduce((stacks, row) => 
      stacks.length ? 
        stacks.map((stack, i) => /\s+/.test(row[i]) ? stack : [...stack, row[i]]) : 
        row.map(char => [char]),
      [] as string[][]);

  const commands = programText
    .map(line => line
      .match(/\d+/g)!
      .map((num, i) => i > 0 ? parseInt(num, 10) - 1 : parseInt(num, 10))) as [number, number, number][];
  
  commands.forEach(execCommand(stacks));

  return stacks
    .map(stack => stack[stack.length-1])
    .join('');
}

const manually = simulate(stacks => 
  ([quantity, from, to]) => {
    while (quantity-- > 0)
      stacks[to].push(stacks[from].pop()!)
  }
);

const withCrateMover9001 = simulate(stacks =>
  ([quantity, from, to]) => {
    const amount = stacks[from].length - quantity
    stacks[to] = [...stacks[to], ...stacks[from].slice(amount >= 0 ? amount : 0)];
    stacks[from] = stacks[from].slice(0, amount);
  }
);

console.log("Part One", manually);
console.log("Part Two", withCrateMover9001);