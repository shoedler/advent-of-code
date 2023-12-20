import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

class Module {
  constructor(
    public readonly type: string,
    public readonly outputs: Module[],
    public readonly inputs: Module[]
  ) {}
}

const modules: { [key: string]: Module } = {};

const data = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => {
    const [prefixedName, destinations] = line.split(" -> ");
    const isConjunction = prefixedName.startsWith("&");
    const isFlipFlop = prefixedName.startsWith("%");
  });

const partOne = () => 1;
const partTwo = () => 2;

runPart("One", partOne); //
runPart("Two", partTwo); //
