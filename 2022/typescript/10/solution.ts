import * as fs from 'fs';

let x = 1;
const cycles = [x];
const probes = [ 20, 60, 100, 140, 180, 220 ];

const crt = new Array(6).fill(0).map(_ => new Array(40).fill(''));
const crtPtr = { x: 0, y: 0 };

const cylce = () => {
  cycles.push(x);

  if (crtPtr.x > 39) {
    crtPtr.x = 0;
    crtPtr.y++;
  }
  
  let char = [x-1, x, x+1].includes(crtPtr.x) ? '#' : ' ';
  crt[crtPtr.y][crtPtr.x] = char;

  crtPtr.x++;
}

const ops: { [key: string]: (args: number) => void } = {
  addx: (arg: number) => {
    cylce();
    cylce();
    x += arg;
  },
  noop: () => {
    cylce();
  }
}

const program = fs.readFileSync('input.txt', 'utf-8').split('\r\n')
  .map(line => {
    const [op, arg] = line.split(' ')
    return { op, arg: Number(arg) }
  });

program.forEach(({ op, arg }) => {
  ops[op](arg);
})

const signalStrengths = probes.map((probe) => {
  const value = cycles[probe];
  return value * probe;
})

console.log("Part One", signalStrengths.reduce((a, b) => a + b, 0));
console.log("Part Two", '\n' + crt.map(line => line.join('')).join('\n'));

fs.writeFileSync('output.txt', crt.map(line => line.join('')).join('\r\n'));
