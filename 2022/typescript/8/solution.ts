import * as fs from 'fs';

const grid = fs.readFileSync('./input.txt', 'utf-8')
  .split('\r\n')
  .map(line => line.split('')
    .map(char => parseInt(char, 10)));

const colSlice = (col: number, start: number, end: number) => grid
  .map(row => row[col])
  .filter((_, i) => i >= start && i <= end)

const rowSlice = (row: number, start: number, end: number) => grid[row]
  .filter((_, i) => i >= start && i <= end)

const stripOverhead = (arr: number[], lowerBound: number) => {
  let limit = arr.find(x => x >= lowerBound) 
  if (limit === undefined) 
    return arr;
  return arr.slice(0, arr.indexOf(limit)+1);
}

const visibilityMap = grid
  .map((row, y) => row
    .map((height, x) => [
      Math.max(...rowSlice(y, 0, x-1)) < height, // left
      Math.max(...rowSlice(y, x+1, row.length-1)) < height, // right
      Math.max(...colSlice(x, 0, y-1)) < height, // up
      Math.max(...colSlice(x, y+1, grid.length-1)) < height, // down
    ].some(x => x)));

const scenicScoreMap = grid
  .map((row, y) => row
    .map((height, x) => [
      stripOverhead( rowSlice(y, 0, x-1).reverse(),   height), // left
      stripOverhead( rowSlice(y, x+1, row.length-1),  height), // right
      stripOverhead( colSlice(x, 0, y-1).reverse(),   height), // up
      stripOverhead( colSlice(x, y+1, grid.length-1), height), // down
    ].reduce((sum, b) => sum *= b.length, 1)))

const visibleTrees = visibilityMap.reduce((sum, row) => sum += row.filter(x => x).length, 0);
const maxScenicScore = Math.max(...scenicScoreMap.map(row => Math.max(...row)))

console.log("Part One", visibleTrees);
console.log("Part Two", maxScenicScore);

// Just out of interest
const visibilityMapString = visibilityMap
  .reduce((str, row) => str += row
    .map(x => x ? '♣' : ' ')
    .join('') + '\r\n', "");

fs.writeFileSync('./out.txt', visibilityMapString)
