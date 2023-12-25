import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const components: { [key: string]: number } = {};
const connections: [number, number][] = [];
const size = (obj: object) => Object.keys(obj).length;

fs.readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => {
    const [component, ...list] = line.split(/[\s:]+/);
    if (components[component] === undefined) {
      components[component] = size(components);
    }
    list.forEach((connectedComponent) => {
      if (components[connectedComponent] === undefined) {
        components[connectedComponent] = size(components);
      }
      connections.push([components[component], components[connectedComponent]]);
    });
  });

const shuffle = <T>(arr: T[]) => {
  for (let i = 0; i < arr.length; ++i) {
    let idx = Math.floor(Math.random() * i + 1);
    [arr[i], arr[idx]] = [arr[idx], arr[i]];
  }
  return arr;
};

// Not my idea, but I liked it.
const unionFind = (componentCount, connections, desiredCuts) => {
  connections = shuffle(connections);

  const parents = [-1];
  const groups = new Uint16Array(componentCount);
  const promotions = [-1];

  const union = (a: number, b: number) => {
    if (!groups[a] && !groups[b]) {
      const group = parents.length;
      parents.push(group);
      promotions.push(1);
      groups[a] = group;
      groups[b] = group;
    } else if (!groups[a]) {
      const g = (groups[b] = parent(b));
      ++promotions[g];
      groups[a] = g;
    } else if (!groups[b]) {
      const g = (groups[a] = parent(a));
      ++promotions[g];
      groups[b] = g;
    } else {
      let g1 = parent(a);
      let g2 = parent(b);

      if (g1 !== g2) {
        if (promotions[g1] > promotions[g2]) {
          [g2, g1] = [g1, g2];
        }

        promotions[g2] += promotions[g1] + 1;
        parents[g1] = g2;
        groups[a] = g2;
        groups[b] = g2;
      } else {
        return false;
      }
    }

    return true;
  };

  const parent = (component: number) => {
    if (groups[component] === 0) {
      return -1;
    }

    let group = groups[component];
    while (group !== parents[group]) {
      group = parents[group];
    }

    return group;
  };

  let edgeIdx = 0;
  while (componentCount > 2) {
    let [a, b] = connections[edgeIdx++];

    if (union(a, b)) {
      --componentCount;
    }
  }

  let removedEdges = 0;
  for (let [v1, v2] of connections) {
    if ((groups[v1] = parent(v1)) !== (groups[v2] = parent(v2))) {
      ++removedEdges;
    }
  }

  if (removedEdges === desiredCuts) {
    return groups;
  }

  return null;
};

const partOne = () => {
  while (true) {
    let groups = unionFind(size(components), connections, 3);
    if (groups !== null) {
      let group1Count = groups.filter((x) => x === groups[0]).length;
      return group1Count * (size(components) - group1Count);
    }
  }
};

runPart("One", partOne); // 556467 took 22.784600ms, allocated 4.50632MB on the vm-heap.
