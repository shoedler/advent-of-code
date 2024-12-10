import File

const grid = File
  .read(cwd() + "sample.txt")
  .split("\r\n")
  .map(fn(l) -> l.split("").map(Int))

const ROWS = grid.len
const COLS = grid[0].len
const DIRS = [(-1,0),(0,1),(1,0),(0,-1)]

fn each_valid_next(y, x, what) {
  DIRS.each(fn(dir) {
    const (dy, dx) = dir
    const ny = y+dy
    const nx = x+dx
    if ny>=0 and ny<ROWS and nx>=0 and nx<COLS and grid[ny][nx]==grid[y][x]-1 
      what(ny, nx)
  })
}

fn paths(sy, sx) {
  const Q = [(sy, sx)]
  const seen = {}
  let ans = 0

  while Q.len > 0 {
    const pos = Q.yank(0)
    if pos in seen skip
    seen[pos] = true

    const (y, x) = pos
    if grid[y][x]==0 ans++

    each_valid_next(y,x, fn(ny, nx) -> Q.push((ny, nx)))
  }

  ret ans
}

const CACHE = {}
fn distinct_paths(sy, sx) {
  if grid[sy][sx]==0 ret 1

  const pos = (sy, sx)
  if pos in CACHE ret CACHE[pos]

  let ans = 0

  each_valid_next(sy, sx, fn(ny, nx) -> ans += distinct_paths(ny, nx))

  CACHE[pos] = ans
  ret ans
}

let p1 = 0
let p2 = 0
for let y=0; y<ROWS; y++; {
  for let x=0; x<COLS; x++; {
    if (grid[y][x] == 9) {
      p1 += paths(y, x)
      p2 += distinct_paths(y, x)
    }
  }
} 

log("Part 1", p1) // Part 1 517
log("Part 2", p2) // Part 2 1116