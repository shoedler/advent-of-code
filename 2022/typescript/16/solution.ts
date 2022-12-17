import * as fs from 'fs';

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


const memoize = (fn: (valve: number, opened: number[], minutesLeft: number, type: 'P1' | 'P2') => any) => {
  const cache: { [key:string]: any }  = {};
  return (valve: number, opened: number[], minutesLeft: number, type: 'P1' | 'P2') => {
    const cacheKey = `${valve}|${opened.join('.')}|${minutesLeft}`

    if (!cache[cacheKey]) {
      cache[cacheKey] = fn(valve, opened, minutesLeft, type)
    }
    return cache[cacheKey];
  }
}


const maxRelief = memoize((valve: number, opened: number[], minutesLeft: number, type: 'P1' | 'P2'): number => {
  if (minutesLeft <= 0) {
    return type === 'P1' ? 0 : 
      maxRelief(ValveIds['AA'], opened, 26, 'P1');
  }

  const outcomes: number[] = [0];

  if (!opened.includes(valve) && Flowrates[valve] > 0) {
    const reliefedPressure = (minutesLeft - 1) * Flowrates[valve];
    Tunnels[valve].forEach(nextValve => {
      outcomes.push(reliefedPressure + maxRelief(nextValve, opened.concat(valve), minutesLeft - 2, type))
    });
  }

  // Unopened
  Tunnels[valve].forEach(nextValve => {
    outcomes.push(maxRelief(nextValve, opened, minutesLeft - 1, type))
  });

  return Math.max(...outcomes);
});

let t = Date.now();
const maxReliefedPressure = maxRelief(ValveIds['AA'], [], 30, 'P1');
const maxReliefTimeMs = Date.now() - t;

t = Date.now();
const maxReliefedPressureWithElephant = maxRelief(ValveIds['AA'], [], 26, 'P2');
const maxReliefWithElephantTimeMs = Date.now() - t;

// Config i7-11800H @ 2.3Ghz, 32GB RAM node v16.13.2
console.log("Part One", maxReliefedPressure, `took ${maxReliefTimeMs}ms`); // 1460 took 89'821ms
console.log("Part Two", maxReliefedPressureWithElephant, `took ${maxReliefWithElephantTimeMs}ms`); // 2117