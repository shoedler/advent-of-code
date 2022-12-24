import * as fs from 'fs';
import { runPart } from '../lib';

type Expr = number | string | { left: string, op: string, right: string };
const lookup: { [key: string] : Expr } = {};

fs.readFileSync('./input.txt', 'utf-8').split('\r\n').forEach(line => {
  let [monkey, expr]: any = line.split(': ');

  if (/\d+/.test(expr))
    lookup[monkey] = Number(expr);
  else {
    expr = expr.split(' ');
    lookup[monkey] = { left: expr[0], op: expr[1], right: expr[2] };
  }
});

const ops: { [key: string]: (a: number, b: number) => number } = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
}

const interpret = (val: Expr): number => {
  return (typeof val === 'number') ? val 
       : (typeof val === 'string') ? interpret(lookup[val])
       : ops[val.op](interpret(val.left), interpret(val.right))
}

const findHumanValue = () => {
  const root = lookup['root'] as { left: string, op: string, right: string };
  const rootBranches: ['left', 'right'] = ['left', 'right'];
  
  // Determine if we're left or right
  const probeLeft = [interpret(root.left) as number];
  const probeRight = [interpret(root.right) as number];

  lookup['humn'] = (lookup['humn'] as number + 1);

  probeLeft.push(interpret(root.left) as number);
  probeRight.push(interpret(root.right) as number);
  
  const humanBranch: 'left' | 'right' = 
      !probeLeft.every(v => v === probeLeft[0]) ? rootBranches.shift() 
    : !probeRight.every(v => v === probeRight[0]) ? rootBranches.pop() 
    : undefined;
  const [ otherBranch ] = rootBranches;

  // Determine which side is larger
  const fn = probeLeft[0] > probeRight[0] ? 
    () => interpret(root[humanBranch]) - interpret(root[otherBranch]) :
    () => interpret(root[otherBranch]) - interpret(root[humanBranch]);
  
  // Binary search
  let low = 0;
  let high = Number.MAX_SAFE_INTEGER;
  
  while (low < high) {
    const mid = (low + high) / 2
  
    lookup['humn'] = mid;
    let score = fn();
    
    if (score > 0) 
      low = mid;
    else if (score === 0)
      return mid;
    else 
      high = mid;
  }
}

// Setup: i7-1065H, 16GB RAM node v17.8.0
runPart("One", () => interpret('root')); // 43699799094202 took 0ms
runPart("Two", () => findHumanValue()); // 3375719472770 took 6ms
