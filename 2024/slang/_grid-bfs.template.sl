
import File
import Math

const grid = File
  .read(cwd() + "sample.txt")
  .split("\r\n")

const ROWS = grid.len
const COLS = grid[0].len
const DIRS = [ (-1, 0), (0,1), (1,0), (0,-1) ]

for let y = 0; y < ROWS; y++; {
  for let x = 0; x < COLS; x++; {

    const Q = [(y,x)]
    const SEEN = {}
    while Q.len > 0 {
      const pos = Q.yank(0)
      const (y,x) = pos

      if (y,x) in SEEN skip
      SEEN[pos] = true

      DIRS.each(fn(dir) {
        const (dy,dx) = dir
        const ny = y + dy
        const nx = x + dx
        if (ny>=0 and ny<ROWS) and (nx>=0 and nx<COLS) {
          // TODO: In grid bounds
        } else {
          // TODO: Out of bounds
        }
      })
    }
  }
}

log("Part 1:", p1) // Part 1: 
log("Part 2:", p2) // Part 2: 