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
  .map(record => {
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

  const isDot = plan[planIndex] === ".";
  const isHash = plan[planIndex] === "#";
  const isQuestion = plan[planIndex] === "?";

  if ((isDot || isQuestion) && variations === 0) {
    vars += findAllArrangements(rec, planIndex + 1, groupIndex, variations);
  }

  if (
    (isDot || isQuestion) &&
    variations > 0 &&
    groupIndex < groups.length &&
    groups[groupIndex] === variations
  ) {
    vars += findAllArrangements(rec, planIndex + 1, groupIndex + 1, 0);
  }

  if (isHash || isQuestion) {
    vars += findAllArrangements(rec, planIndex + 1, groupIndex, variations + 1);
  }

  return vars;
};

const partOne = () =>
  records.map(rec => findAllArrangements(rec, 0, 0, 0)).reduce((a, b) => a + b);
const partTwo = () => 2;

runPart("One", partOne); // 7622 took 6.4203ms, allocated 4.700504MB on the vm-heap.
runPart("Two", partTwo); //
