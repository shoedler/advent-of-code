
import File
import Math

const bytes = File
  .read(cwd() + "sample.txt")
  .split("\r\n")
  .map(fn(p) -> p.ints())

const SIZE = 71
const DIRS = [ (-1, 0), (0,1), (1,0), (0,-1) ]

const grid = []
for let y=0; y<SIZE; y++; {
  const row = []
  for let x=0; x<SIZE; x++; {
    row.push(".")
  }
  grid.push(row)
}

const end = (SIZE-1, SIZE-1)
const start = (0,0) 

let p1 = 0
let p2 = 0

bytes.some(fn(byte, i) {
  const [x, y] = byte 
  grid[y][x] = "#" // add next byte to grid

  const Q = [(start,0)]
  const SEEN = {}
  let reachable = false

  while Q.len > 0 {
    const (pos, d) = Q.yank(0)

    if pos == end {
      reachable = true 
      if i == 1023 p1 = d
      break
    }

    if pos in SEEN 
      skip
    SEEN[pos] = true
    DIRS.each(fn(dir) {
      const next = (pos[0]+dir[0], pos[1]+dir[1])
      const (ny, nx) = next
      if (ny>=0 and ny<SIZE) and (nx>=0 and nx<SIZE) and grid[ny][nx] != "#" 
        Q.push((next, d+1))
    })
  }

  if !reachable {
    p2 = [x,y].join(",")
    ret true
  }
  ret false
})

log("Part 1: ", p1) // Part 1:  262
log("Part 2: ", p2) // Part 2:  2973


