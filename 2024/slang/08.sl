import Math
import File

const grid = File
  .read(cwd() + "/sample.txt")
  .split("\r\n")
  .map(fn(row) -> row.split(""))

let p = {}
grid.each(fn(row, y) -> 
  row.each(fn(freq, x) -> 
    p[freq] ? p[freq].push((y,x)) : (p[freq] = [(y,x)])))

const rows = grid.len
const cols = grid[0].len
const points = p.values()

const A = {}
const B = {}

for let y = 0; y < rows; y++; {
  for let x = 0; x < cols; x++; {
    for let p = 0; p < points.len; p++; {
      for let p1 = 0; p1 < points[p].len; p1++; {
        for let p2 = 0; p2 < points[p].len; p2++; {
          if points[p][p1] == points[p][p2]
            skip

          const y1 = points[p][p1][0]
          const x1 = points[p][p1][1]
          const y2 = points[p][p2][0]
          const x2 = points[p][p2][1]

          const d1 = Math.abs(y-y1) + Math.abs(x-x1) // Manhattan distance
          const d2 = Math.abs(y-y2) + Math.abs(x-x2)
            
          const dy1 = y-y1 // Slope components
          const dy2 = y-y2
          const dx1 = x-x1
          const dx2 = x-x2

          const slopes_match = dy1*dx2 == dy2*dx1

          if ((d1==2*d2) or (d2*2==d1)) and slopes_match // Ratio 2:1
            A[(y,x)] = true
          if slopes_match // Ratio 1:1 e.g. collinear
            B[(y,x)] = true
        }
      }
    }
  }
}

log("Part 1:", A.len) // Part 1: 305
log("Part 2:", B.len) // Part 2: 1150