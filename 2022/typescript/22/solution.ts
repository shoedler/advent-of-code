import * as fs from "fs";
import { runPart } from "../../../lib";

let inputType: any = "txt";
const [mapDef, pathDef] = fs
  .readFileSync(`./input.${inputType}`, "utf-8")
  .split("\r\n\r\n");

const path = pathDef
  .split(/([A-Z])/g)
  .map((char) => (/\d+/.test(char) ? Number(char) : char)) as (
  | number
  | "L"
  | "R"
)[];

const grid = mapDef.split("\r\n");

const directions = {
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
  U: [-1, 0],
};

const CUBE_DIM = 50;

const cubeSides = {
  top: { colStart: 0, rowStart: CUBE_DIM },
  right: { colStart: 0, rowStart: CUBE_DIM * 2 },
  front: { colStart: CUBE_DIM, rowStart: CUBE_DIM },
  left: { colStart: CUBE_DIM * 2, rowStart: 0 },
  under: { colStart: CUBE_DIM * 2, rowStart: CUBE_DIM },
  back: { colStart: CUBE_DIM * 3, rowStart: 0 },
};

// From -> Exit Direction -> To
const translationTable = {
  top: {
    leaveTop: {
      next: "back",
      nextDir: "R",
      nextPos: (absPos: [number, number]) => {
        return [
          (absPos[1] % CUBE_DIM) + cubeSides.back.colStart,
          cubeSides.back.rowStart,
        ];
      },
    },
    leaveLeft: {
      next: "left",
      nextDir: "R",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.left.colStart + (CUBE_DIM - (absPos[0] % CUBE_DIM) - 1),
          cubeSides.left.rowStart,
        ];
      },
    },
    leaveRight: {
      next: "right",
      nextDir: "R",
      nextPos: (absPos: [number, number]) => absPos,
    },
    leaveBottom: {
      next: "front",
      nextDir: "D",
      nextPos: (absPos: [number, number]) => absPos,
    },
  },
  right: {
    leaveTop: {
      next: "back",
      nextDir: "U",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.back.colStart + CUBE_DIM - 1,
          cubeSides.back.rowStart + (absPos[1] % CUBE_DIM),
        ];
      },
    },
    leaveLeft: {
      next: "top",
      nextDir: "L",
      nextPos: (absPos: [number, number]) => absPos,
    },
    leaveRight: {
      next: "under",
      nextDir: "L",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.under.colStart + (CUBE_DIM - (absPos[0] % CUBE_DIM) - 1),
          cubeSides.under.rowStart + CUBE_DIM - 1,
        ];
      },
    },
    leaveBottom: {
      next: "front",
      nextDir: "L",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.front.colStart + (absPos[1] % CUBE_DIM),
          cubeSides.front.rowStart + CUBE_DIM - 1,
        ];
      },
    },
  },
  front: {
    leaveTop: {
      next: "top",
      nextDir: "U",
      nextPos: (absPos: [number, number]) => absPos,
    },
    leaveLeft: {
      next: "left",
      nextDir: "D",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.left.colStart,
          cubeSides.left.rowStart + (absPos[0] % CUBE_DIM),
        ];
      },
    },
    leaveRight: {
      next: "right",
      nextDir: "U",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.right.colStart + CUBE_DIM - 1,
          cubeSides.right.rowStart + (absPos[0] % CUBE_DIM),
        ];
      },
    },
    leaveBottom: {
      next: "under",
      nextDir: "D",
      nextPos: (absPos: [number, number]) => absPos,
    },
  },
  left: {
    leaveTop: {
      next: "front",
      nextDir: "R",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.front.colStart + (absPos[1] % CUBE_DIM),
          cubeSides.front.rowStart,
        ];
      },
    },
    leaveLeft: {
      next: "top",
      nextDir: "R",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.top.colStart + (CUBE_DIM - (absPos[0] % CUBE_DIM) - 1),
          cubeSides.top.rowStart,
        ];
      },
    },
    leaveRight: {
      next: "under",
      nextDir: "R",
      nextPos: (absPos: [number, number]) => absPos,
    },
    leaveBottom: {
      next: "back",
      nextDir: "D",
      nextPos: (absPos: [number, number]) => absPos,
    },
  },
  under: {
    leaveTop: {
      next: "front",
      nextDir: "U",
      nextPos: (absPos: [number, number]) => absPos,
    },
    leaveLeft: {
      next: "left",
      nextDir: "L",
      nextPos: (absPos: [number, number]) => absPos,
    },
    leaveRight: {
      next: "right",
      nextDir: "L",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.right.colStart + (CUBE_DIM - (absPos[0] % CUBE_DIM) - 1),
          cubeSides.right.rowStart + CUBE_DIM - 1,
        ];
      },
    },
    leaveBottom: {
      next: "back",
      nextDir: "L",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.back.colStart + (absPos[1] % CUBE_DIM),
          cubeSides.back.rowStart + CUBE_DIM - 1,
        ];
      },
    },
  },
  back: {
    leaveTop: {
      next: "left",
      nextDir: "U",
      nextPos: (absPos: [number, number]) => absPos,
    },
    leaveLeft: {
      next: "top",
      nextDir: "D",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.top.colStart,
          cubeSides.top.rowStart + (absPos[0] % CUBE_DIM),
        ];
      },
    },
    leaveRight: {
      next: "under",
      nextDir: "U",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.under.colStart + CUBE_DIM - 1,
          cubeSides.under.rowStart + (absPos[0] % CUBE_DIM),
        ];
      },
    },
    leaveBottom: {
      next: "right",
      nextDir: "D",
      nextPos: (absPos: [number, number]) => {
        return [
          cubeSides.right.colStart,
          cubeSides.right.rowStart + (absPos[1] % CUBE_DIM),
        ];
      },
    },
  },
};

const travel = (useCubeWrapping = true) => {
  let facing = 0;
  const turn = {
    R: () => (facing = (facing + 1) % Object.entries(directions).length),
    L: () =>
      (facing =
        facing - 1 < 0 ? Object.entries(directions).length - 1 : --facing),
  };

  let pos: [number, number] = [0, 0];
  pos[1] = grid[0].indexOf(".");
  let currentSide: keyof typeof cubeSides = "top";

  const getPos = (ofs: number[] = [0, 0]) => {
    const row = grid[pos[0] + ofs[0]];
    if (row === undefined) return undefined;
    return row[pos[1] + ofs[1]];
  };

  path.forEach((cmd) => {
    if (typeof cmd === "number") {
      let dir = Object.values(directions)[facing];

      let i = 0;
      while (i < cmd) {
        dir = Object.values(directions)[facing];

        if (getPos(dir) === "#") break;

        const prevPos = [...pos];
        const prevFacing = facing;

        pos[0] += dir[0];
        pos[1] += dir[1];

        if (useCubeWrapping) {
          const leave =
            pos[1] > cubeSides[currentSide].rowStart + CUBE_DIM - 1
              ? "leaveRight"
              : pos[1] < cubeSides[currentSide].rowStart
              ? "leaveLeft"
              : pos[0] > cubeSides[currentSide].colStart + CUBE_DIM - 1
              ? "leaveBottom"
              : pos[0] < cubeSides[currentSide].colStart
              ? "leaveTop"
              : "";

          if (leave !== "") {
            const transpose = translationTable[currentSide][leave];
            pos = transpose.nextPos(pos) as [number, number];
            facing = Object.keys(directions).indexOf(transpose.nextDir);

            // Don't transpose if we're about to hit a wall
            if (getPos() === "#") {
              pos = prevPos as [number, number];
              facing = prevFacing;
              break;
            }

            currentSide = transpose.next as keyof typeof cubeSides;
          }
        } else {
          // Edge case - move to the opposite side of the axis where we've moved out of bounds
          if (getPos() === " " || getPos() === undefined) {
            const revDir0 = dir[0] * -1;
            const revDir1 = dir[1] * -1;

            pos[0] += revDir0;
            pos[1] += revDir1;

            while (getPos() !== " " && getPos() !== undefined) {
              pos[0] += revDir0;
              pos[1] += revDir1;
            }

            pos[0] += dir[0];
            pos[1] += dir[1];

            if (getPos() === "#") {
              pos = prevPos as [number, number];
              break;
            }
          }
        }

        i++;
      }
    } else {
      console.assert(/[LR]/.test(cmd as string));
      turn[cmd]();
    }
  });

  return (pos[0] + 1) * 1000 + 4 * (pos[1] + 1) + facing;
};

// Setup: i7-1065H, 16GB RAM node v17.8.0
runPart("One", () => travel(false)); // 189140 took 32ms
runPart("Two", () => travel(true)); // 115063 took 20ms
