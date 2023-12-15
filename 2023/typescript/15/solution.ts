import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const ops: string[] = fs.readFileSync("./input.txt", "utf8").split(",");

const hash = (str: string) =>
  str.split("").reduce((a, c) => ((a + c.charCodeAt(0)) * 17) % 256, 0);

const partOne = () => ops.reduce((acc, curr) => acc + hash(curr), 0);
const partTwo = () => {
  type Slot = [string, number];
  type Box = Slot[];

  const boxes: Box[] = [];
  for (let i = 0; i < 256; i++) boxes.push([]);

  ops.forEach((op) => {
    if (op.endsWith("-")) {
      const label = op.replace("-", "");
      const boxId = hash(label);
      const slot = boxes[boxId].findIndex((box) => box[0] === label);
      if (slot > -1) {
        boxes[boxId].splice(slot, 1);
      }
      return;
    }

    const [label, num] = op.split("=");
    const boxId = hash(label);
    const slot = boxes[boxId].findIndex((box) => box[0] === label);
    if (slot > -1) {
      boxes[boxId][slot] = [label, Number(num)];
    } else {
      boxes[boxId].push([label, Number(num)]);
    }
  });

  let sum = 0;
  for (let i = 0; i < boxes.length; i++) {
    boxes[i]?.forEach(([_, num], j) => {
      sum += (1 + i) * (j + 1) * Number(num);
    });
  }
  return sum;
};

runPart("One", partOne); // 511215 took 1.048100ms, allocated 0.56928MB  on the vm-heap.
runPart("Two", partTwo); // 236057 took 2.151600ms, allocated 1.598112MB on the vm-heap.
