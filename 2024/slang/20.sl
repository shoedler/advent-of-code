
import File
import Math

const grid = File
  .read(cwd() + "sample.txt")
  .split("\r\n")
  .map(fn (r) -> r.split(""))

const ROWS = grid.len
const COLS = grid[0].len
const DIRS = [ (-1, 0), (0,1), (1,0), (0,-1) ]

fn inside(pos) -> (pos[0]>=0 and pos[0]<ROWS) and (pos[1]>=0 and pos[1]<COLS)
fn at(pos) -> grid[pos[0]][pos[1]]

fn add(a,b) -> (a[0]+b[0], a[1]+b[1])
fn manhattan(a,b) -> Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1])

fn is_start(r) -> "S" in r
fn is_end(r) -> "E" in r
fn not_nil(x) -> x != nil
const start = (grid.pos(is_start), grid.map(fn (r) -> r.pos(is_start)).first(not_nil))
const end = (grid.pos(is_end), grid.map(fn (r) -> r.pos(is_end)).first(not_nil))

const DIST = {}
const Q = [(0, start)]
while Q.len > 0 {
  const (dist, pos) = Q.yank(0)
  if pos in DIST skip
  DIST[pos] = dist
  if pos == end skip

  DIRS.each(fn(dir) {
    const npos = add(pos, dir)
    if inside(npos) and (at(npos) != "#") Q.push((dist+1, npos))
  })
}

let p1 = 0
let p2 = 0

const dists = DIST.entries()
const n = dists.len 

// Try every combination of pathtiles. Does n(n-1)/2 iterations. n=9457 in my case, so 44'712'696 iterations total.
for let i=0; i<n-1; i++; {
  for let j=i+1; j<n; j++; {
    const [pos1, path_dist1] = dists[i]
    const [pos2, path_dist2] = dists[j]
    const cheat_dist = manhattan(pos1, pos2)
    const path_dist = Math.abs(path_dist2-path_dist1) 
    if path_dist >= cheat_dist+100 {
      if cheat_dist <= 20 p2++
      if cheat_dist <= 2 p1++
    }
  }
}

log("Part 1:", p1) // Part 1: 1502
log("Part 2:", p2) // Part 2: 1028136