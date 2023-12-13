import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const maps = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n\r\n")
  .map((map) => map.split("\r\n"));

const findHorizontalReflections = (map: string[]): number => {
  const reflectionCenters = [];
  for (let i = 1; i < map.length; i++) {
    let ptrTop = i - 1;
    let ptrBottom = i;

    let reflects = true;
    while (ptrTop >= 0 && ptrBottom < map.length) {
      if (map[ptrTop] !== map[ptrBottom]) {
        reflects = false;
        break;
      }

      ptrTop--;
      ptrBottom++;
    }

    if (reflects) {
      reflectionCenters.push(i);
    }
  }
  return reflectionCenters.length ? Math.max(...reflectionCenters) : 0;
};

const findVerticalReflections = (map: string[]): number => {
  const reflectionCenters = [];
  for (let i = 1; i < map[0].length; i++) {
    let ptrLeft = i - 1;
    let ptrRight = i;

    let reflects = true;
    while (ptrLeft >= 0 && ptrRight < map[0].length) {
      const leftSlice = map.map((row) => row[ptrLeft]).join("");
      const rightSlice = map.map((row) => row[ptrRight]).join("");
      if (leftSlice !== rightSlice) {
        reflects = false;
        break;
      }

      ptrLeft--;
      ptrRight++;
    }

    if (reflects) {
      reflectionCenters.push(i);
    }
  }
  return reflectionCenters.length ? Math.max(...reflectionCenters) : 0;
};

const partOne = () =>
  maps
    .map((map) => {
      const hRef = findHorizontalReflections(map) * 100;
      const vRef = findVerticalReflections(map);

      return vRef + hRef;
    })
    .reduce((a, b) => a + b);

const partTwo = () =>
  maps
    .map((map) => {
      const hRef = findHorizontalReflections(map) * 100;
      const vRef = findVerticalReflections(map);
      let ohRef = hRef;
      let ovRef = vRef;

      while (ohRef === hRef && ovRef === vRef) {
        for (let y = 0; y < map.length; y++) {
          for (let x = 0; x < map[0].length; x++) {
            let newMap = [...map];
            let line = newMap[y].split("");
            if (line[x] === ".") line[x] = "#";
            else line[x] = ".";
            newMap[y] = line.join("");

            ohRef = findHorizontalReflections(newMap) * 100;
            ovRef = findVerticalReflections(newMap);

            if ((ohRef !== hRef || ovRef !== vRef) && ohRef + ovRef > 0) {
              if (ovRef === vRef) return hRef;
              if (ohRef === hRef) return vRef;
              throw new Error("Something went wrong");
            }
          }
        }
      }

      if (ohRef === 0 && ovRef === 0) {
        throw new Error("Something went wrong");
      }
      return ohRef + ovRef;
    })
    .reduce((a, b) => a + b);

runPart("One", partOne); // 35360 took 1.8321ms, allocated 1.075056MB on the vm-heap.
runPart("Two", partTwo); // 9814 too low 36755
