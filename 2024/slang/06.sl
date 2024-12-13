import File
import { Set } from "/modules/std"

const grid = File
  .read(cwd() + "/sample.txt")
  .split("\r\n")
  .map(fn(l) -> l.split(""))

const ROWS = grid.len
const COLS = grid[0].len

fn start_i(r) -> "^" in r
fn not_nil(x) -> x != nil
const start = (
  grid.pos(start_i), 
  grid.map(fn (r) -> r.pos(start_i)).first(not_nil)
)

const DIRS = [ (-1, 0), (0,1), (1,0), (0,-1) ]

// Returns 'true' if a loop is found, otherwise the number of cells visited
fn trace(oy, ox) {
  const loop = {}
  const seen = {}

  let [y,x] = start
  let d = 0 // up

  while true {
    if (y,x,d) in loop
      ret true
    
    loop[(y,x,d)] = true
    seen[(y,x)] = true

    const (dy, dx) = DIRS[d]
    const ny = y + dy
    const nx = x + dx
    
    if ny < 0 or ny >= ROWS or nx < 0 or nx >= COLS
      ret seen.len
    
    if grid[ny][nx] == "#" or (oy == ny and ox == nx) {
      d = (d + 1) % 4 // Turn 90 deg CW
    } else {
      y = ny
      x = nx
    }
  }
}

log("Part 1", trace(nil, nil)) // Part 1 5239

let loops = 0
// Just try all cells as obstacles ('#')
for let oy = 0; oy < ROWS; oy++; {
  for let ox = 0; ox < COLS; ox++; {
    if grid[oy][ox] == "#" 
      skip
    if trace(oy, ox) == true
      loops++
  }
}
log("Part 2", loops) // Part 2 1753