import * as fs from "fs";
import { runPart } from "../../../lib";
import { assert, log } from "console";
console.clear();

type Module = {
  name: string;
  destinations: string[];
  isConjunction: boolean;
  isFlipFlop: boolean;
  flipFlopState: boolean;
  conjunctionMemory: { [key: string]: boolean };
};

type Pulse = [boolean, Module, string];

const modules: { [key: string]: Module } = {};
let hiPulses = 0;
let loPulses = 0;

fs.readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map(line => {
    const [prefixedName, destinations] = line.split(" -> ");
    const isConjunction = prefixedName.startsWith("&");
    const isFlipFlop = prefixedName.startsWith("%");
    const name = prefixedName.split(/\b/).slice(-1)[0] as string;
    const module: Module = {
      name,
      destinations: destinations.split(", "),
      isConjunction,
      isFlipFlop,
      flipFlopState: false,
      conjunctionMemory: {},
    };

    modules[name] = module;
  });

const resetState = () => {
  // Initialize conjunction modules
  const cons = Object.values(modules).filter(module => module.isConjunction);
  cons.forEach(conjunction => {
    const sources = Object.values(modules).filter(module =>
      module.destinations.includes(conjunction.name)
    );

    sources.forEach(source => {
      conjunction.conjunctionMemory[source.name] = false;
    });
  });

  // Initialize flipflop modules
  Object.values(modules)
    .filter(module => module.isFlipFlop)
    .forEach(flipflop => {
      flipflop.flipFlopState = false;
    });

  hiPulses = 0;
  loPulses = 0;
};

const pulse = (p: Pulse): Pulse[] => {
  const [pulse, sender, moduleName] = p;
  pulse ? hiPulses++ : loPulses++;

  const self = modules[moduleName];
  if (!self) {
    return [];
  }

  if (self.isFlipFlop) {
    if (pulse) {
      return [];
    }
    self.flipFlopState = !self.flipFlopState;
    const next = self.destinations.map(
      destination => [self.flipFlopState, self, destination] as Pulse
    );

    return next;
  }

  if (self.isConjunction) {
    self.conjunctionMemory[sender.name] = pulse;
    const send = Object.values(self.conjunctionMemory).every(Boolean);
    return self.destinations.map(
      destination => [!send, self, destination] as Pulse
    );
  }

  if (self.name === "broadcaster") {
    return self.destinations.map(
      destination => [pulse, self, destination] as Pulse
    );
  }

  throw new Error("There's someone out there who loves you.");
};

const partOne = () => {
  resetState();

  for (let i = 0; i < 1000; i++) {
    const queue: Pulse[] = [];
    const start: Pulse = [false, null, "broadcaster"];
    queue.push(start);

    while (queue.length > 0) {
      queue.push(...pulse(queue.shift()));
    }
  }

  return loPulses * hiPulses;
};

const partTwo = () => {
  resetState();

  // Find who sets rx
  const rxSetters = Object.values(modules).filter(module =>
    module.destinations.includes("rx")
  );

  assert(rxSetters.length === 1);
  const rxSetter = rxSetters[0];
  assert(rxSetter.isConjunction);

  const rxSetterSources = Object.keys(rxSetter.conjunctionMemory);
  const rxSetterCycles: { [key: string]: number[] } = {};
  rxSetterSources.forEach(source => (rxSetterCycles[source] = []));

  let buttonPresses = 0;

  while (true) {
    buttonPresses++;

    const queue: Pulse[] = [];
    const start: Pulse = [false, null, "broadcaster"];
    queue.push(start);

    while (queue.length > 0) {
      const current = queue.shift();
      const [pulse_, sender] = current;

      // Magic sauce
      if (rxSetterSources.includes(sender?.name) && pulse_ === true) {
        if (rxSetterCycles[sender.name].length < 2) {
          rxSetterCycles[sender.name].push(buttonPresses);
        }

        if (Object.values(rxSetterCycles).every(cycle => cycle.length >= 2)) {
          const values = Object.values(rxSetterCycles).map(
            ([cyLow, cyHi]) => cyHi - cyLow
          );
          const gcd = (a: number, b: number) => (b ? gcd(b, a % b) : a);
          const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
          const rx = values.reduce(lcm);
          return rx;
        }
      }

      const next = pulse(current);
      queue.push(...next);
    }
  }
};

runPart("One", partOne); // 886347020 took 15.333700ms, allocated 4.588024MB on the vm-heap.
runPart("Two", partTwo); // 233283622908263 took 84.008000ms, allocated -0.530192MB on the vm-heap.
