import * as fs from "fs";
import { range, runPart } from "../../../lib";
console.clear();

const data = fs.readFileSync("./input.txt", "utf8");

const digits = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const partOne = () =>
  data
    .split("\r\n")
    .map((line) =>
      line
        .split("")
        .filter((char) => /[0-9]/.test(char))
        .join("")
    )
    .map((nums) => parseInt(nums[0] + nums[nums.length - 1], 10))
    .reduce((a, b) => a + b, 0);

const partTwo = () =>
  data
    .split("\r\n")
    .map((line) => {
      const chars = line.split("");
      let nums: string[] = [];

      for (let i = 0; i < chars.length; i++) {
        if (/[0-9]/.test(chars[i])) nums.push(chars[i]);
        range(3, 5).some((j) => {
          const slice = chars.slice(i, i + j).join("");
          if (slice in digits) {
            nums.push(digits[slice]);
            return true;
          }
        });
      }

      return nums.join("");
    })
    .map((nums) => parseInt(nums[0] + nums[nums.length - 1], 10))
    .reduce((a, b) => a + b, 0);

runPart("One", partOne); // 54951 took 22.9453ms, allocated 3.864096MB on the heap
runPart("Two", partTwo); // 55218 took 22.13ms, allocated 2.121632MB on the heap.
