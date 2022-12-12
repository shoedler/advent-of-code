import * as fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf8');

const calories = data
  .split('\r\n')
  .map(line => parseInt(line, 10))
  .reduce((calories, value) => { 
    value ? calories[calories.length - 1] += value : calories.push(0); 
    return calories 
  }, [] as number[])

const maxCalories = Math.max(...calories);

const sumOfTopThree = calories
.sort((a,b) => a - b)
  .reverse()
  .slice(0, 3)
  .reduce((a,b) => a + b, 0);
 
console.log("Part One", maxCalories);
console.log("Part Two", sumOfTopThree);