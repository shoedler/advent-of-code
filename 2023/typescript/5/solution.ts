import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const [seedDefs, ...mappingTypeDefs] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n\r\n") as any;

/** seed[] */
const seeds: number[] = seedDefs.split(":")[1].split(" ").map(Number);

/** [dest, source, size][][] */
const mappingTypes: [number, number, number][][] = mappingTypeDefs.map(def => {
  const [_, ...mappingDefs] = def.split("\r\n");
  return mappingDefs.map(
    line => line.split(" ").map(Number) as [number, number, number]
  );
});

const map = (mapping: [number, number, number][], input: number): number => {
  for (const [dest, source, size] of mapping) {
    if (source <= input && input < source + size) {
      return input + dest - source;
    }
  }
  return input;
};

const mapRange = (
  mapping: [number, number, number][],
  inputRanges: [number, number][]
): [number, number][] => {
  const outputRanges = [];
  let ranges = inputRanges;

  for (const [argDest, argStart, argSize] of mapping) {
    const argEnd = argStart + argSize;
    const newRanges = [];

    while (ranges.length) {
      const [inStart, inEnd] = ranges.pop();

      // Intersect
      const pre = [inStart, Math.min(inEnd, argStart)];
      const inside = [Math.max(inStart, argStart), Math.min(argEnd, inEnd)];
      const post = [Math.max(argEnd, inStart), inEnd];

      // Case 1
      // █████████████       <- input
      //      ██████████████ <- arg
      // ──────────────────────────────────────
      // ░░░░░               <- pre
      //      ▓▓▓▓▓▓▓▓       <- inside
      //              ▒▒▒▒▒▒ <- post (reversed)

      // Case 2
      //      ██████████████ <- input
      // █████████████       <- arg
      // ──────────────────────────────────────
      // ░░░░░               <- pre (reversed)
      //      ▓▓▓▓▓▓▓▓       <- inside
      //              ▒▒▒▒▒▒ <- post

      // Case 3
      //              ██████ <- input
      // ██████              <- arg
      // ──────────────────────────────────────
      // ░░░░░░░░░░░░░       <- pre (reversed)
      //       ▓▓▓▓▓▓▓       <- inside (reversed)
      //              ▒▒▒▒▒▒ <- post

      // Case 4
      // ██████              <- input
      //               █████ <- arg
      // ──────────────────────────────────────
      // ░░░░░░              <- pre
      //       ▓▓▓▓▓▓▓▓      <- inside (reversed)
      //       ▒▒▒▒▒▒▒▒▒▒▒▒▒ <- post (reversed)

      if (pre[1] > pre[0]) {
        newRanges.push(pre);
      }

      if (post[1] > post[0]) {
        newRanges.push(post);
      }

      if (inside[1] > inside[0]) {
        outputRanges.push([
          inside[0] - argStart + argDest,
          inside[1] - argStart + argDest,
        ]);
      }
    }

    ranges = newRanges;
  }

  return [...outputRanges, ...ranges];
};

// Part 1
const locations = [];
for (const seed of seeds) {
  let value = seed;
  for (const mappingType of mappingTypes) {
    value = map(mappingType, value);
  }
  locations.push(value);
}

console.log(Math.min(...locations)); // 662197086

const seedPairs: [number, number][] = []; // [start, size][]
for (let i = 1; i < seeds.length; i += 2) {
  seedPairs.push([seeds[i], seeds[i + 1]]);
}

// Part 2
const ranges: [number, number][] = []; // [start, end][]
for (const [start, size] of seedPairs) {
  let range: [number, number][] = [[start, start + size]]; // [start, end][]
  for (const mappingType of mappingTypes) {
    range = mapRange(mappingType, range);
  }
  let smallest = range.sort((a, b) => a[0] - b[0]);
  ranges.push(smallest[0]);
}

let min = ranges.sort((a, b) => a[0] - b[0]);
console.log(min[0][0]); // 52510809
