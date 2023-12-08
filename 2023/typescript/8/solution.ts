import { log } from "console";
import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

class n {
  [key: string]: string;
  constructor(public L: string, public R: string, public id: string) {}
}

const [cmdStr, nodesStr] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n\r\n");

const cmds = cmdStr.split("");

const nLookup: { [key: string]: n } = {};

nodesStr.split("\r\n").forEach((line) => {
  const [_, id, L, R] = line.match(
    /([A-Z]+)\s+=\s+\(([A-Z]+),\s+([A-Z]+)\)/
  ) as string[];
  const node = new n(L, R, id);
  nLookup[id] = node;
});

const runCommands = () => {
  let current = nLookup["AAA"];
  let steps = 0;

  while (current.id !== "ZZZ") {
    for (const cmd of cmds) {
      if (current.id === "ZZZ") {
        return steps;
      }

      current = nLookup[current[cmd] as string]; // TODO: Inlined
      steps++;
    }
  }

  return steps;
};

const runGhostNode = (n: n) => {
  const targets = [];
  const dists = [];
  const diffs = [];

  let current = n;
  let steps = 0;

  const done = () => current.id.endsWith("Z");
  while (targets.length < 3) {
    for (const cmd of cmds) {
      if (done()) {
        targets.push(current);
        diffs.push(steps - (dists[dists.length - 1] || 0));
        dists.push(steps);
      }

      current = nLookup[current[cmd] as string];
      steps++;
    }
  }

  return {
    targets,
    dists,
    diffs,
  };
};

const runCommands_GhostEdition = () => {
  let currents = Object.keys(nLookup)
    .filter((id) => id.endsWith("A"))
    .map((id) => nLookup[id]);

  const iter = currents.map((c) => ({
    n: c,
    ...runGhostNode(c),
  }));

  log(iter);

  const nums = iter.map((i) => i.dists[0]);
  const gcd = (a: number, b: number) => (b ? gcd(b, a % b) : a);
  const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

  return nums.reduce(lcm);
};

const partOne = () => runCommands();

const partTwo = () => runCommands_GhostEdition();

runPart("One", partOne); // 12643 took 0.9417ms, allocated 0.512168MB on the heap.
runPart("Two", partTwo); // 13133452426987 took 11.2664ms, allocated 5.501632MB on the heap.
