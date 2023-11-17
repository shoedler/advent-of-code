import * as fs from "fs";
import { runPart } from "../../../lib";

type Node = { value: number };

const origins: { [key: number]: Node } = {};
const input = fs.readFileSync("./input.txt", "utf-8").split("\r\n");

const getNodes = (): Node[] =>
  input.map((n, i) => {
    const value = Number(n);
    const node: Node = { value };
    origins[i] = node; // Overrides or creates the key with a new reference to `node`
    return node;
  });

const findGrove = (nodes: Node[], iters: number) => {
  // Beware, object entries are sorted by their key. This solution only works
  // because we've used the natural order from the input-source as indicies / keys in
  // the origin obj. Alternatively you could use an array.
  const originValues = Object.values(origins);
  for (let i = 0; i < iters; i++) {
    originValues.forEach((node) => {
      const index = nodes.indexOf(node);
      let targetIndex = index + node.value;

      targetIndex =
        targetIndex >= nodes.length
          ? targetIndex % (nodes.length - 1)
          : targetIndex < 0
          ? (targetIndex % (nodes.length - 1)) + nodes.length - 1
          : targetIndex;

      let tmp = nodes.splice(index, 1)[0];
      nodes.splice(targetIndex, 0, tmp);
    });
  }

  const zeroIndex = nodes.findIndex((node) => node.value === 0);
  const groveIndicies = [
    ((1000 % nodes.length) + zeroIndex) % nodes.length,
    ((2000 % nodes.length) + zeroIndex) % nodes.length,
    ((3000 % nodes.length) + zeroIndex) % nodes.length,
  ];

  return groveIndicies
    .map((index) => nodes[index].value)
    .reduce((a, b) => a + b);
};

// Setup: i7-1065H, 16GB RAM node v17.8.0
runPart("One", () => {
  let nodes = getNodes();
  return findGrove(nodes, 1);
}); // 11123 took 34ms

runPart("Two", () => {
  let nodes = getNodes();
  nodes.map((n) => (n.value *= 811589153));
  return findGrove(nodes, 10);
}); // 4248669215955 took 271ms
