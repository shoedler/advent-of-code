import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const data = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split(" ").map(Number));

const partOne = () => 1;
const partTwo = () => 2;

runPart("One", partOne); //
runPart("Two", partTwo); //
