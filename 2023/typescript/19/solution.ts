import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const [workflowDefs, ratingsDefs] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n\r\n")
  .map((chunk) => chunk.split("\r\n"));

type Op =
  | string
  | {
      category: keyof Rating;
      operator: "<" | ">";
      num: number;
      target: string;
    };
type Workflow = Op[];
type Rating = {
  [key in "x" | "m" | "a" | "s"]: number;
};

const workflows: { [key: string]: Workflow } = {};
workflowDefs.forEach((line) => {
  const [name, values] = line.split(/\{|\}/);
  const operations: Op[] = values.split(",").map((op) => {
    if (op.includes(":")) {
      const [category, operator, num, _, target] = op.split(/\b/);
      return { category, num: Number(num), operator, target } as Op;
    }
    return op;
  });

  workflows[name] = operations;
});

const ratings: Rating[] = ratingsDefs.map((line) => {
  const categories = {} as Rating;
  const [, values] = line.split(/\{|\}/);
  values.split(",").forEach((value) => {
    const [name, rating] = value.split("=");
    categories[name] = Number(rating);
  });

  return categories;
});

const runOp = (op: Op, rating: Rating) => {
  if (op === "A" || op === "R") return op;
  if (typeof op === "string") return runWorkflow(workflows[op], rating);
  if ("category" in op) {
    const { category, operator, num, target } = op;
    if (operator === ">") {
      return rating[category] > num ? runOp(target, rating) : null;
    }
    if (operator === "<") {
      return rating[category] < num ? runOp(target, rating) : null;
    }
  }
};

const runWorkflow = (workflow: Workflow, rating: Rating) => {
  for (let i = 0; i < workflow.length; i++) {
    const result = runOp(workflow[i], rating);
    if (result === "A") return "A";
    if (result === "R") return "R";
  }
  return null;
};

const partOne = () => {
  const accepted = ratings.filter((rating) => {
    return runWorkflow(workflows["in"], rating) === "A";
  });

  return accepted.map((rating) => Object.values(rating).sum()).sum();
};

const partTwo = () => {
  const getRangeFromOperator = (
    operator: ">" | "<",
    num: number,
    low: number,
    high: number
  ): [number, number, number, number] => {
    let restLow = low;
    let restHigh = high;
    if (operator === ">") {
      low = Math.max(low, num + 1);
      restHigh = Math.min(restHigh, num);
    }
    if (operator === "<") {
      high = Math.min(high, num - 1);
      restLow = Math.max(restLow, num);
    }
    return [low, high, restLow, restHigh];
  };

  const makeNewRangeWithRest = (
    category: keyof Rating,
    operator: "<" | ">",
    num: number,
    low: Rating,
    high: Rating
  ): [Rating, Rating, Rating, Rating] => {
    [low, high] = [{ ...low }, { ...high }];
    const [restLow, restHigh] = [{ ...low }, { ...high }];
    [low[category], high[category], restLow[category], restHigh[category]] =
      getRangeFromOperator(operator, num, low[category], high[category]);
    return [low, high, restLow, restHigh];
  };

  let sum = 0;
  const queue = [
    ["in", { x: 1, m: 1, a: 1, s: 1 }, { x: 4000, m: 4000, a: 4000, s: 4000 }],
  ] as [string, Rating, Rating][];
  while (queue.length) {
    let [state, low, high] = queue.shift();

    if (low.x > high.x || low.m > high.m || low.a > high.a || low.s > high.s) {
      continue;
    }

    if (state === "R") {
      continue;
    }

    if (state === "A") {
      sum += "xmas"
        .split("")
        .map((c) => high[c] - low[c] + 1)
        .product();
      continue;
    }

    const workflow = workflows[state];
    for (let i = 0; i < workflow.length; i++) {
      const op = workflow[i];

      if (typeof op === "string") {
        queue.push([op, low, high]);
        break;
      } else {
        const { category, operator, num, target } = op;
        const [newLow, newHigh, restLow, restHigh] = makeNewRangeWithRest(
          category,
          operator,
          num,
          low,
          high
        );

        queue.push([target, newLow, newHigh]);
        [low, high] = [restLow, restHigh];
      }
    }
  }

  return sum;
};

runPart("One", partOne); // 350678 took 2.300200ms, allocated 0.050056MB on the vm-heap.
runPart("Two", partTwo); // 124831893423809 took 2.598100ms, allocated 2.556168MB on the vm-heap.
