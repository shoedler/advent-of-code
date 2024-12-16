
import File
import Math

const grid = File
  .read(cwd() + "sample.txt")
  .split("\r\n")

const ROWS = grid.len
const COLS = grid[0].len
const DIRS = [ (-1, 0), (0,1), (1,0), (0,-1) ]

fn s(r) -> "S" in r
fn e(r) -> "E" in r
fn not_nil(x) -> x != nil
const start = (grid.pos(s), grid.map(fn (r) -> r.split("").pos(s)).first(not_nil))
const end =   (grid.pos(e), grid.map(fn (r) -> r.split("").pos(e)).first(not_nil))

fn at(pos) -> grid[pos[0]][pos[1]]
fn add(a,b) -> (a[0]+b[0], a[1]+b[1])

// First, djikstra to find the shortest path (Basically bfs)
let Q = [(start, 1, 0)] // pos, dir (east), dist
let SEEN = {}
const DIST_START = {}
let best = -1
while Q.len > 0 {
  const (pos, dir, dist) = Q.yank(0)
  const key = (pos, dir)

  if !(key in DIST_START) 
    DIST_START[key] = dist
  if pos == end and best < 0
    best = dist // Keep track of the first time we reach the end, but keep going to get all distances
  if key in SEEN skip
  SEEN[key] = true

  const next = add(pos, DIRS[dir]) // Forward
  if at(next) != "#" {
    Q = [(next, dir, dist+1)].concat(Q) // IQ9000: Approximate priority queue by adding to front of queue
  }

  Q.push((pos, (dir+1)%4, dist+1000)) // Turn right
  Q.push((pos, (dir+3)%4, dist+1000)) // Turn left
}

// Now, do the same thing but backwards, starting from the end 
Q = []
SEEN = {}
const DIST_END = {}
DIRS.each(fn (_,dir) -> Q.push((end, dir, 0))) // ...in all directions
while Q.len > 0 {
  const (pos, dir, dist) = Q.yank(0)
  const key = (pos, dir)

  if !(key in DIST_END) 
    DIST_END[key] = dist
  if key in SEEN skip
  SEEN[key] = true

  const next = add(pos, DIRS[(dir+2)%4]) // Backwards
  if at(next) != "#" {
    Q = [(next, dir, dist+1)].concat(Q) // IQ9000: Approximate priority queue by adding to front of queue
  }

  Q.push((pos, (dir+1)%4, dist+1000)) // Turn right
  Q.push((pos, (dir+3)%4, dist+1000)) // Turn left
}

const optimal = {}
for let y = 0; y<ROWS; y++; {
  for let x = 0; x<COLS; x++; {
    for let dir = 0; dir<DIRS.len; dir++; {
      const key = ((y,x), dir)
      if !(key in DIST_START) or !(key in DIST_END) skip // Not on a path
      if DIST_START[key] + DIST_END[key] == best {
        optimal[(y,x)] = true // On a optimal path
      }
    }
  }
}

log("Part 1:", best) // Part 1: 90460
log("Part 2:", optimal.len) // Part 2: 575
