import { assert } from "console";
import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

type HandAndBid = { hand: string[]; bid: number };
type HandBidAndPower = HandAndBid & { power: number };

const data = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => {
    const [hand, bid] = line.split(" ");
    return {
      hand: hand.split(""),
      bid: Number(bid),
    };
  }) as HandAndBid[];

const CARD_DEF = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
};
const CARD_DEF_LOW_J = { ...CARD_DEF, J: 0 };
const CARDS_WITHOUT_J = Object.keys(CARD_DEF).filter((card) => card !== "J");

const withPower = (g: HandAndBid): HandBidAndPower => ({
  ...g,
  power: calcPower(g.hand),
});

const calcPower = (hand: HandAndBid["hand"]) => {
  const unique = {};

  hand.forEach((card) => {
    if (card in unique) unique[card]++;
    else unique[card] = 1;
    return card;
  });

  const counts = Object.values(unique).sort();

  const eq = (type) => {
    return (
      counts.length === type.length && counts.every((v, i) => v === type[i])
    );
  };

  if (eq([5])) return 10;
  else if (eq([1, 4])) return 9;
  else if (eq([2, 3])) return 8;
  else if (eq([1, 1, 3])) return 7;
  else if (eq([1, 2, 2])) return 6;
  else if (eq([1, 1, 1, 2])) return 5;
  else if (eq([1, 1, 1, 1, 1])) return 4;

  assert(false);
};

const permutationsWithoutJ = (g: HandAndBid): HandAndBid[] => {
  const result = [];

  // Heuristic: If we have 5 J's, we can just make them A's
  if (g.hand.join("") === "JJJJJ") return [{ ...g, hand: "AAAAA".split("") }];

  const perm = (hand: string[]) => {
    if (hand.every((card) => card !== "J")) {
      result.push(hand);
    }

    hand.forEach((card, i) => {
      if (card === "J") {
        CARDS_WITHOUT_J.forEach((otherCard) => {
          const newHand = [...hand];
          newHand[i] = otherCard;
          perm(newHand);
        });
      }
    });
  };

  perm(g.hand);

  return result.map((hand) => ({ ...g, hand }));
};

const createCamelCardsSorter =
  (cardDef: typeof CARD_DEF) => (a: HandBidAndPower, b: HandBidAndPower) => {
    if (a.power !== b.power) {
      return a.power - b.power;
    }

    for (let i = 0; i < a.hand.length; i++) {
      const cardValueA = cardDef[a.hand[i]];
      const cardValueB = cardDef[b.hand[i]];
      if (cardValueA === cardValueB) continue;
      return cardValueA - cardValueB;
    }
  };

const byCamelCardsOrder = createCamelCardsSorter(CARD_DEF);
const byCamelCardsOrderLowJ = createCamelCardsSorter({ ...CARD_DEF, J: 0 });

const bestPermutationWithPower = (g: HandAndBid): HandBidAndPower => {
  const permsWithPower = permutationsWithoutJ(g).map(withPower);
  const best =
    permsWithPower.sort(byCamelCardsOrder)[permsWithPower.length - 1]; // Get the best one by the part 1 rules
  // Put the J's back in the best
  for (let i = 0; i < g.hand.length; i++) {
    if (g.hand[i] === "J") {
      best.hand[i] = "J";
    }
  }
  return best;
};

const partOne = () =>
  data
    .map(withPower)
    .sort(byCamelCardsOrder)
    .reduce((a, b, i) => (a += (i + 1) * b.bid), 0);

const partTwo = () =>
  data
    .map(bestPermutationWithPower)
    .sort(byCamelCardsOrderLowJ)
    .reduce((a, b, i) => (a += (i + 1) * b.bid), 0);

runPart("One", partOne); // 247961593 took 7.2478ms, allocated -2.971048MB on the heap.
runPart("Two", partTwo); // 248750699 took 2.3003ms, allocated 3.888856MB on the heap.
