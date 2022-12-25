import * as fs from 'fs';
import { Hashmap, runPart } from '../lib';

const Flowrates: { [key: number]: number } = {};
const Tunnels: { [key: number]: number[] } = {};
const ValveIds: { [key: string]: number } = {};

const valveDefs: { [key: string]: { numId: number, flowRate: number, connections: string[] } } = {}
fs.readFileSync('./input.txt', 'utf-8').split('\r\n')
  .forEach((line, index) => {
    const [ left, right ] = line.split(';');
    const valveMatch = /^Valve ([A-Z]+) has flow rate=(-?\d+)/g.exec(left);
    const valveLabel = valveMatch[1];
    const connections = /([A-Z]{2}(,\s)?)+/g.exec(right)[0].split(', ');

    valveDefs[valveLabel] = {
      numId: index,
      flowRate: Number(valveMatch[2]),
      connections, 
    };
  });

Object.entries(valveDefs).forEach(([valveLabel, valve]) => {
  Flowrates[valve.numId] = valve.flowRate;
  Tunnels[valve.numId] = valve.connections.map(connection => valveDefs[connection].numId);
  ValveIds[valveLabel] = valve.numId;
});

const cache: { [k in 'P1' | 'P2']: { [key: string]: number } } = {
  'P1': {},
  'P2': {},
};

const maxRelief = (valve: number, opened: string, minutesLeft: number, type: keyof typeof cache): number => {
  if (minutesLeft <= 0) {
    return type === 'P1' ? 0 : 
      maxRelief(ValveIds['AA'], opened, 26, 'P1');
  }

  const cacheKey = `${valve},${minutesLeft},` + opened;
  if (cache[type][cacheKey] !== undefined)
    return cache[type][cacheKey];

  let maxReliefed = 0;
  
  // Unopened
  if (opened[valve] === '0' && Flowrates[valve] > 0) {
    const valveRelief = (minutesLeft - 1) * Flowrates[valve];
    const newOpened = opened.slice(0, valve) + '1' + opened.slice(valve + 1);
    Tunnels[valve].forEach(nextValve => {
      const reliefed = valveRelief + maxRelief(nextValve, newOpened, minutesLeft - 2, type)
      maxReliefed = reliefed > maxReliefed ? reliefed : maxReliefed;
    });
  }

  // Opened
  Tunnels[valve].forEach(nextValve => {
    const reliefed = maxRelief(nextValve, opened, minutesLeft - 1, type)
    maxReliefed = reliefed > maxReliefed ? reliefed : maxReliefed;
  });

  cache[type][cacheKey] = maxReliefed;
  return maxReliefed;
};

// Config i7-1065H @ 2.3Ghz,  16GB RAM node v17.0.1
runPart("One", () => maxRelief(ValveIds['AA'], "0".repeat(Object.keys(ValveIds).length), 30, 'P1')); // 1460 took 1299ms
runPart("Two", () => maxRelief(ValveIds['AA'], "0".repeat(Object.keys(ValveIds).length), 26, 'P2')); // 2117 took ???ms