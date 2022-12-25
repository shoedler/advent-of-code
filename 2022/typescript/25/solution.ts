import { assert, log, table } from 'console';
import * as fs from 'fs';
import { runPart } from '../lib';

const SNAFUDigits = { 
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2,
};

const parseSNAFU = (snafu: string): number => {
  let result = 0;
  for(let i = 0; i < snafu.length; i++) {
    const digit = SNAFUDigits[snafu[i] as keyof typeof SNAFUDigits];
    if (digit === undefined)
      throw new Error(`Invalid digit: ${snafu[i]} at position ${i}`);
    
    result += Math.pow(5, snafu.length - 1 - i) * digit;
  }
  return result;
}

const intToSNAFU = (n: number): string => {
  if (n === 0)
    return '0';
  
  let result = '';
  while (n !== 0) {
    const remainder = n % 5;
    if (remainder <= 2)
      result = Object.keys(SNAFUDigits)[remainder] + result;
    else {
      const symbol = Object.values(SNAFUDigits).findIndex(i => i === (remainder - 5));
      result = Object.keys(SNAFUDigits)[symbol] + result;
      n += 5;
    }
    n = Math.floor(n / 5);
  }
  return result;
}

const fuelRequirements = fs.readFileSync('./input.txt', 'utf-8').split('\r\n').map(parseSNAFU);
const fuelRequirementsSum = fuelRequirements.reduce((a, b) => a + b, 0);

runPart("One", () => intToSNAFU(fuelRequirementsSum)); // 2-0-0=1-0=2====20=-2 took 0ms