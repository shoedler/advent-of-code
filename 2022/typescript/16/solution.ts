import * as fs from 'fs';
type Valve = { 
  id: string,
  flowRate: number, 
  connections: string[],
  state: boolean
};

type ValveNetwork = {
  [key: string] : Valve
}

const valves: ValveNetwork = {};

fs.readFileSync('./input.txt', 'utf-8').split('\r\n')
  .forEach(line => {
    const [ left, right ] = line.split(';');
    const valveMatch = /^Valve ([A-Z]+) has flow rate=(-?\d+)/g.exec(left);
    const id = valveMatch[1];
    const connections = /([A-Z]{2}(,\s)?)+/g.exec(right)[0].split(', ');

    valves[id] = {
      id,
      flowRate: Number(valveMatch[2]),
      connections, 
      state: false
    };
  });

const memoize = (fn: (...args: any) => any) => {
  const results: { [key:string]: any }  = {};
  return (...args: any) => {
    const argsKey = JSON.stringify(args);
    if (!results[argsKey]) {
      results[argsKey] = fn(...args)
    }
    return results[argsKey];
  }
}

const maxRelief = memoize((valve: Valve, opened: string[], minutesLeft: number): number => {
  if (minutesLeft <= 0)
    return 0;

  const outcomes: number[] = [0];

  if (!opened.includes(valve.id) && valve.flowRate > 0) {
    const reliefedPressure = (minutesLeft - 1) * valve.flowRate;
    valve.connections.forEach(nextValveId => {
      outcomes.push(reliefedPressure + maxRelief(valves[nextValveId], opened.concat(valve.id), minutesLeft - 2))
    });
  }

  // Unopened
  valve.connections.forEach(nextValveId => {
    outcomes.push(maxRelief(valves[nextValveId], opened, minutesLeft - 1))
  });

  return Math.max(...outcomes);
});


let t = Date.now();
const maxReliefedPressure = maxRelief(valves['AA'], [], 30);
const maxReliefTimeMs = Date.now() - t;

// Config i7-11800H @ 2.3Ghz, 32GB RAM node v16.13.2
console.log("Part One", maxReliefedPressure, `took ${maxReliefTimeMs}ms`); // 1460 took 142661ms
console.log("Part Two", );