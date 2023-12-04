import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const data = fs.readFileSync("./input.txt", "utf8").split("\r\n");

const cards = data.map((line) => {
  let [_, idStr, winningNumsStr, numsStr] = line.split(/Card\s+|:|\|/);
  const id = Number(idStr);
  const winningNums = winningNumsStr.trim().split(/\s+/).map(Number);
  const nums = numsStr.trim().split(/\s+/).map(Number);

  return { id, winningNums, nums };
});

const winningNums = (card: (typeof cards)[0]) =>
  card.winningNums.filter((num) => card.nums.includes(num)).length;

const calcSum = (matches: number) => (matches === 0 ? 0 : 2 ** (matches - 1));

const partOne = () =>
  cards.map((card) => calcSum(winningNums(card))).reduce((a, b) => a + b);

const partTwo = () => {
  const winningCards: { [key: number]: number } = {};

  for (let i = 0; i < cards.length; i++) {
    winningCards[i] = winningCards[i] + 1 || 1;
    for (let j = 0; j < winningNums(cards[i]); j++) {
      winningCards[i + j + 1] = winningCards[i + j + 1] || 0;
      winningCards[i + j + 1] += winningCards[i];
    }
  }

  return Object.values(winningCards).reduce((a, b) => a + b);
};

runPart("One", partOne); // Part One: 17803 took 1.0833ms, allocated 0.337112MB on the heap.
runPart("Two", partTwo); // Part Two: 5554894 took 1.2138ms, allocated 0.276792MB on the heap.
