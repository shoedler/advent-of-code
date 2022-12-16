import * as fs from 'fs';

type Valve = { 
  id: string,
  flowRate: number, 
  connections: string[],
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
    };
  });


const memoizeMaxRel = (fn: (valve: Valve, opened: string[], minutesLeft: number, type: 'P1' | 'P2') => any) => {
  const results: { [key:string]: any }  = {};
  return (valve: Valve, opened: string[], minutesLeft: number, type: 'P1' | 'P2') => {
    
    let valveStr = valve.connections.join()
    valveStr += valve.flowRate
    valveStr += valve.id
    let openedStr = opened.join();
    
    const argsKey = valveStr + openedStr + minutesLeft //+ type;

    if (!results[argsKey]) {
      results[argsKey] = fn(valve, opened, minutesLeft, type)
    }
    return results[argsKey];
  }
}

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

const maxRelief = memoizeMaxRel((valve: Valve, opened: string[], minutesLeft: number, type: 'P1' | 'P2'): number => {
  if (minutesLeft <= 0) {
    return type === 'P1' ? 0 : maxRelief(valves['AA'], opened, 30-4, 'P1');
  }

  const outcomes: number[] = [0];

  if (!opened.includes(valve.id) && valve.flowRate > 0) {
    const reliefedPressure = (minutesLeft - 1) * valve.flowRate;
    valve.connections.forEach(nextValveId => {
      outcomes.push(reliefedPressure + maxRelief(valves[nextValveId], opened.concat(valve.id), minutesLeft - 2, type))
    });
  }

  // Unopened
  valve.connections.forEach(nextValveId => {
    outcomes.push(maxRelief(valves[nextValveId], opened, minutesLeft - 1, type))
  });

  return Math.max(...outcomes);
});

let t = Date.now();
const maxReliefedPressure = maxRelief(valves['AA'], [], 30, 'P1');
const maxReliefTimeMs = Date.now() - t;

t = Date.now();
const maxReliefedPressureWithElephant = maxRelief(valves['AA'], [], 30, 'P2');
const maxReliefWithElephantTimeMs = Date.now() - t;

// Config i7-11800H @ 2.3Ghz, 32GB RAM node v16.13.2
console.log("Part One", maxReliefedPressure, `took ${maxReliefTimeMs}ms`); // 1460 took 142661ms
console.log("Part Two", maxReliefedPressureWithElephant, `took ${maxReliefWithElephantTimeMs}ms`); // 2117