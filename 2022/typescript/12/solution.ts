import * as fs from 'fs';

let end: [number, number];
let start: [number, number];

const coordCompare = (a: [number, number], b: [number, number]) => a[0] === b[0] && a[1] === b[1]
const heightOf = (l: string) => l.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

// Build height map
const map = fs.readFileSync('./input.txt', 'utf-8')
  .split('\r\n')
  .map((row, y) => row.split('')
    .map((char, x) => {
      if (char === 'E') {
        end = [y, x];
        return heightOf('z')
      } 
      if (char == 'S') {
        start = [y, x];
        return heightOf('a');
      }
      
      return heightOf(char);
    }));

const breadthFirstSearch = (type: 'P1' | 'P2') => {
  const linTree: [number, number, number][] = [];

  // Add starting tiles
  map.forEach((row, y) => 
    row.forEach((_, x) => {
      if (type == 'P1' && coordCompare([y,x], start) ||
        (type == 'P2' && map[y][x] === 1)) {
          linTree.push([y, x, 0]);
        }
    })
  );
    
  const visited = new Set<string>();

  // bfs
  while (linTree.length > 0) {
    const [y, x, d] = linTree.shift()!;

    if (visited.has(`${y} ${x}`))
      continue;
  

    visited.add(`${y} ${x}`);

    if (coordCompare([y, x], end)) 
      return d;

    dirs.forEach(([dy, dx]) => {     
      const ydy = y + dy;
      const xdx = x + dx;

      // Append tiles which we're allowed to go to
      if (0 <= xdx && xdx < map[0].length && 
          0 <= ydy && ydy < map.length && 
          map[ydy][xdx] <= map[y][x] + 1) {
        linTree.push([ydy, xdx, d+1]);
      }
    });
  }
}

console.log(breadthFirstSearch('P1'))
console.log(breadthFirstSearch('P2'))