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

  for (const [argDest, argSource, argSize] of mapping) {
    const argEnd = argSource + argSize;
    const newRanges = [];

    while (ranges.length) {
      const [inStart, inEnd] = ranges.pop();

      const pre = [inStart, Math.min(inEnd, argSource)];
      const inside = [Math.max(inStart, argSource), Math.min(argEnd, inEnd)];
      const post = [Math.max(argEnd, inStart), inEnd];

      // If arg interval is not inside the input interval, (or they overlap in some other way) then we have to
      // prcess the trimmings (pre, post) again with the next mapping.
      if (pre[1] > pre[0]) {
        newRanges.push(pre);
      }

      if (post[1] > post[0]) {
        newRanges.push(post);
      }

      if (inside[1] > inside[0]) {
        outputRanges.push([
          inside[0] - argSource + argDest,
          inside[1] - argSource + argDest,
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
