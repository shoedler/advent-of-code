import * as fs from "fs";
import { Hashmap, runPart } from "../../../lib";
console.clear();

type Record = {
  springs: string;
  groups: number[];
};

const records: Record[] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map(record => {
    const [springs, groups] = record.split(" ");
    return {
      springs,
      groups: groups.split(",").map(Number),
    };
  });

const CACHE = new Hashmap<string, number>(
  key => key,
  key => key
);

const findAllArrangements = (
  rec: Record,
  springIndex: number,
  groupIndex: number,
  variations: number
): number => {
  const { springs, groups } = rec;

  const cacheKey = `${springIndex},${groupIndex},${variations}`;
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }

  // Guard - we've reached the end of the springs
  if (springIndex === springs.length) {
    if (groupIndex === groups.length && variations === 0) {
      return 1; // Valid
    } else if (
      groupIndex === groups.length - 1 &&
      groups[groupIndex] === variations
    ) {
      return 1; // Last group is valid
    }
    return 0;
  }

  const isOperational = springs[springIndex] === ".";
  const isDamaged = springs[springIndex] === "#";
  const isUnknown = springs[springIndex] === "?";

  let vars = 0;
  // If it's a operational or unknown and we currently have no variations,
  // -> move to the next spring.
  if ((isOperational || isUnknown) && variations === 0) {
    vars += findAllArrangements(rec, springIndex + 1, groupIndex, variations);
  }

  // If it's operational or unknown and the current group is satisfied,
  // -> move to the next spring, next group AND reset the variations(!).
  if (
    (isOperational || isUnknown) &&
    variations > 0 &&
    groupIndex < groups.length &&
    groups[groupIndex] === variations
  ) {
    vars += findAllArrangements(rec, springIndex + 1, groupIndex + 1, 0);
  }

  // If it's damaged or unknown
  // -> move to the next spring AND increment the variations.
  if (isDamaged || isUnknown) {
    vars += findAllArrangements(
      rec,
      springIndex + 1,
      groupIndex,
      variations + 1
    );
  }

  CACHE.put(cacheKey, vars);
  return vars;
};

const partOne = () =>
  records
    .map(record => {
      const result = findAllArrangements(record, 0, 0, 0);
      CACHE.clear();
      return result;
    })
    .reduce((a, b) => a + b);

const partTwo = () =>
  records
    .map(rec => {
      const { springs, groups } = rec;
      const record = {
        springs: [springs, springs, springs, springs, springs].join("?"),
        groups: [...groups, ...groups, ...groups, ...groups, ...groups],
      };
      const result = findAllArrangements(record, 0, 0, 0);
      CACHE.clear();
      return result;
    })
    .reduce((a, b) => a + b);

runPart("One", partOne); // 7622 took 6.4203ms, allocated 4.700504MB on the vm-heap.
runPart("Two", partTwo); // 4964259839627 took 525.8401ms, allocated 19.916608MB on the vm-heap.
