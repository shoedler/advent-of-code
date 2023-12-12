import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

type Record = {
  plan: string;
  groups: number[];
};

const records: Record[] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((record) => {
    const [plan, groups] = record.split(" ");
    return {
      plan,
      groups: groups.split(",").map(Number),
    };
  });

const findAllArrangements = (
  rec: Record,
  planIndex: number,
  groupIndex: number,
  variations: number
): number => {
  const { plan, groups } = rec;

  // Guard - we've reached the end of the plan
  if (planIndex === plan.length) {
    if (groupIndex === groups.length && variations === 0) {
      return 1; // Valid
    } else if (
      groupIndex === groups.length - 1 &&
      groups[groupIndex] === variations
    ) {
      return 1; // Last group is valid, means all groups are valid
    }
    return 0;
  }

  let vars = 0;

  for (const option of [".", "#"]) {
    // plan[pi] === '.' || '#' and plan[pi] !== '?'
    if (plan[planIndex] !== "?") {
      if (plan[planIndex] !== option) continue;
    }
    // Here, plan[pi] === '?'

    if (option === "." && variations === 0) {
      vars += findAllArrangements(rec, planIndex + 1, groupIndex, variations);
      continue;
    }

    if (
      option === "." &&
      variations > 0 &&
      groupIndex < groups.length &&
      groups[groupIndex] === variations
    ) {
      vars += findAllArrangements(rec, planIndex + 1, groupIndex + 1, 0);
      continue;
    }

    if (option === "#") {
      vars += findAllArrangements(
        rec,
        planIndex + 1,
        groupIndex,
        variations + 1
      );
      continue;
    }
  }

  // if (plan[planIndex] !== "?") {
  //   return vars;
  // }

  // if (plan[planIndex] === "." && variations === 0) {
  //   vars += findAllArrangements(rec, planIndex + 1, groupIndex, variations);
  // }
  // if (variations === 0) {
  //   vars += findAllArrangements(rec, planIndex + 1, groupIndex, variations);
  // }
  // if (
  //   plan[planIndex] === "." &&
  //   variations > 0 &&
  //   groupIndex < groups.length &&
  //   groups[groupIndex] === variations
  // ) {
  //   vars += findAllArrangements(rec, planIndex + 1, groupIndex + 1, 0);
  // }

  // if (plan[planIndex] === "#") {
  //   vars += findAllArrangements(rec, planIndex + 1, groupIndex, variations + 1);
  // }

  return vars;
};

const partOne = () =>
  records
    .map((rec) => findAllArrangements(rec, 0, 0, 0))
    .reduce((a, b) => a + b);
const partTwo = () => 2;

runPart("One", partOne); // 7622 took 6.4203ms, allocated 4.700504MB on the vm-heap.
runPart("Two", partTwo); //
