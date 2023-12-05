import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const chunks = fs.readFileSync("./input.txt", "utf8").split("\r\n\r\n");

chunks.tap(console.log);

const partOne = () => 1;
const partTwo = () => 1;

runPart("One", partOne); // Part One: 17803 took 1.0833ms, allocated 0.337112MB on the heap.
runPart("Two", partTwo); // Part Two: 5554894 took 1.2138ms, allocated 0.276792MB on the heap.
