import * as fs from "fs";
import { runPart } from "../../../lib";
console.clear();

const constraints = Object.entries({
  red: 12,
  green: 13,
  blue: 14,
});

const data = fs.readFileSync("./input.txt", "utf8").split("\r\n");

const parsed = data.map((line) => {
  let [rawId, rawGames] = line.split(/:/);

  const id = parseInt(rawId.split(" ")[1], 10);
  const moves = rawGames.split(";").map((strMove) => {
    const showing = {};
    const cubes = strMove.split(",").map((g) => g.trim());

    cubes.forEach((cube) => {
      const [num, color] = cube.split(" ");
      showing[color] = parseInt(num, 10);
    });

    return showing;
  });
  return { id, moves };
});

const partOne = () =>
  parsed
    .filter(({ moves }) => {
      return moves.every((move) => {
        return constraints.every(([color, num]) => {
          if (!move[color]) return true;
          return move[color] <= num;
        });
      });
    })
    .map(({ id }) => id)
    .reduce((acc, id) => acc + id, 0);

const partTwo = () =>
  parsed
    .map(({ id, moves }) => {
      let [red, green, blue] = [0, 0, 0];
      moves.forEach((move) => {
        [red, green, blue] = [
          Math.max(red, move["red"] || 0),
          Math.max(green, move["green"] || 0),
          Math.max(blue, move["blue"] || 0),
        ];
      });
      return { id, power: red * green * blue };
    })
    .map(({ power }) => power)
    .reduce((a, b) => a + b, 0);

runPart("One", partOne); // Part One: 2545 took 0.7215ms, allocated 0.193808MB on the heap.
runPart("Two", partTwo); // Part Two: 78111 took 0.856ms, allocated 0.044048MB on the heap.
