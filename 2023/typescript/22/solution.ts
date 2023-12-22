import { assert } from "console";
import { readFileSync } from "fs";
import { Hashset, runPart } from "../../../lib";

let bricks: [number, number, number][][] = [];
readFileSync("input.txt", "utf-8")
  .split("\n")
  .forEach((line) => {
    const [st, ed] = line.split("~");
    const [sx, sy, sz] = st.split(",").map(Number);
    const [ex, ey, ez] = ed.split(",").map(Number);

    const brick: [number, number, number][] = [];
    if (sx === ex && sy === ey) {
      assert(sz <= ez);
      for (let z = sz; z <= ez; z++) {
        brick.push([sx, sy, z]);
      }
    } else if (sx === ex && sz === ez) {
      assert(sy <= ey);
      for (let y = sy; y <= ey; y++) {
        brick.push([sx, y, sz]);
      }
    } else if (sy === ey && sz === ez) {
      assert(sx <= ex);
      for (let x = sx; x <= ex; x++) {
        brick.push([x, sy, sz]);
      }
    } else {
      assert(false);
    }
    assert(brick.length >= 1);
    bricks.push(brick);
  });

const partOneAndTwo = () => {
  let visited = new Hashset<[number, number, number]>(
    (key) => `${key[0]},${key[1]},${key[2]}`,
    (hash) => hash.split(",").map(Number) as [number, number, number]
  );
  bricks.forEach((brick) => brick.forEach(visited.put));

  while (true) {
    let anyBrick = false;
    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];
      let ok = true;
      for (const [x, y, z] of brick) {
        if (z === 1) {
          ok = false;
        }
        if (
          visited.has([x, y, z - 1]) &&
          !brick.some(([bx, by, bz]) => bx === x && by === y && bz === z - 1)
        ) {
          ok = false;
        }
      }
      if (ok) {
        anyBrick = true;
        for (const [x, y, z] of brick) {
          assert(visited.has([x, y, z]));
          visited.remove([x, y, z]);
          visited.put([x, y, z - 1]);
        }
        bricks[i] = brick.map(([x, y, z]) => [x, y, z - 1]);
      }
    }
    if (!anyBrick) {
      break;
    }
  }

  const prevVisited = Hashset.from(visited);
  const prevBricks = bricks.map((B) => [...B]);

  let p1 = 0;
  let p2 = 0;

  for (let i = 0; i < bricks.length; i++) {
    visited = Hashset.from(prevVisited);
    bricks = prevBricks.map((B) => [...B]);
    bricks[i].forEach(visited.remove);

    const wouldFall = new Set<number>();
    while (true) {
      let anyBrick = false;
      for (let j = 0; j < bricks.length; j++) {
        if (j === i) {
          continue;
        }

        const current = bricks[j];
        let ok = true;
        for (const [x, y, z] of current) {
          if (z === 1) {
            ok = false;
          }
          if (
            visited.has([x, y, z - 1]) &&
            !current.some(
              ([cx, cy, cz]) => cx === x && cy === y && cz === z - 1
            )
          ) {
            ok = false;
          }
        }
        if (ok) {
          wouldFall.add(j);
          for (const [x, y, z] of current) {
            assert(visited.has([x, y, z]));
            visited.remove([x, y, z]);
            visited.put([x, y, z - 1]);
          }
          bricks[j] = current.map(([x, y, z]) => [x, y, z - 1]);
          anyBrick = true;
        }
      }
      if (!anyBrick) {
        break;
      }
    }
    if (wouldFall.size === 0) {
      p1 += 1;
    }
    p2 += wouldFall.size;
  }
  return [p1, p2];
};

runPart("OneAndTwo", partOneAndTwo);
// 405 took 7s 858.775700ms, allocated 151.682976MB on the vm-heap.
// 61297 took 7s 858.775700ms, allocated 151.682976MB on the vm-heap.
