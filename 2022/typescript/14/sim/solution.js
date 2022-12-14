const caveScan = input.split('\n')
  .map(scanLine => scanLine.split(' -> ')
    .map(coord => coord.split(',')
      .map(Number)));

const minmax = (a, b) => [Math.min(a, b), Math.max(a, b)];
const equals = (v1, v2) => v1[0] === v2[0] && v1[1] === v2[1];
const absDx = (v1, v2) => Math.abs(v1[0] - v2[0])
const absDy = (v1, v2) => Math.abs(v1[1] - v2[1])

const caveWalls = new Set();
const caveWallsArray = [];
const grainsOfSand = new Set();

const sandSource = [0, 500];

const yS = caveScan.map((scanLine) => scanLine.map(([_, y]) => y)).flat();
const xS = caveScan.map((scanLine) => scanLine.map(([x, _]) => x)).flat();
const maxY = Math.max(...yS);
const maxX = Math.max(...xS);
const minX = Math.min(...xS);

caveScan.forEach(lineScan => {
  for(let i = 0; i < lineScan.length - 1; i++) {
    const [prevX, prevY] = lineScan[i]; 
    const [currX, currY] = lineScan[i + 1];

    const dX = absDx([prevX, prevY], [currX, currY]);
    const dY = absDy([prevX, prevY], [currX, currY]);
    console.assert([dY, dX].some(v => v === 0), 'Not a straight line');

    const [y1, y2] = minmax(prevY, currY);
    const [x1, x2] = minmax(prevX, currX);

    if (dX === 0) {
      for (let y = y1; y <= y2; y++) {
        caveWalls.add(`${y},${prevX}`);
        caveWallsArray.push([y, prevX]);
      }
    }      
    else {
      for (let x = x1; x <= x2; x++) {
        caveWalls.add(`${prevY},${x}`);
        caveWallsArray.push([prevY, x]);
      }
    }
  }
});

const dropOnce = (type) => {
  let [y, x] = sandSource;

  const below = () => {
    const np = `${y + 1},${x}` 
    return !caveWalls.has(np) && !grainsOfSand.has(np) && y < maxY + 1; // Zero-indexed, so it's actually Two more.
  }
  const belowLeft = () => {
    const np = `${y + 1},${x - 1}` 
    return !caveWalls.has(np) && !grainsOfSand.has(np) && y < maxY + 1; // Zero-indexed, so it's actually Two more.
  }
  const belowRight = () => {
    const np = `${y + 1},${x + 1}`
    return !caveWalls.has(np) && !grainsOfSand.has(np) && y < maxY + 1; // Zero-indexed, so it's actually Two more.
  }
  
  while (true) {
    if (below()) 
      [y, x] = [y + 1, x];
    else if (belowLeft()) 
      [y, x] = [y + 1, x - 1];
    else if (belowRight()) 
      [y, x] = [y + 1, x + 1];
    else {
      if (type === 'Part 1') {
        if (y >= maxY) // Fell into the abyss
          return [false, [y, x]];
        grainsOfSand.add(`${y},${x}`);
        return [true, [y, x]];
      }
      else {
        grainsOfSand.add(`${y},${x}`);
        if (equals([y, x], sandSource))
          return [false, [y, x]];
        return [true, [y, x]]
      }
    }
  }
}