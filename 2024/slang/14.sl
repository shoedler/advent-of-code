
import File
import Math

let robots = File
  .read(cwd() + "sample.txt")
  .split("\r\n")
  .map(fn(l) -> l.ints())

const ROWS = 103
const COLS = 101
const grid = Seq(ROWS).map(fn(y) -> Seq(COLS).map(fn(x) -> 0))
robots.each(fn(r) {
  const [px,py,vx,vy] = r
  grid[py][px]++ // initial position
})

fn move -> robots = robots
  .map(fn(r) {
    const [px,py,vx,vy] = r    
    let nx = (px+vx)%COLS
    let ny = (py+vy)%ROWS
    nx = nx < 0 ? COLS+nx : nx
    ny = ny < 0 ? ROWS+ny : ny

    grid[py][px]-- // leave
    grid[ny][nx]++ // arrive
    ret [nx, ny, vx, vy]
  })

 
let i = 0
for ; i < 100; i++; {
  move()
}

// count quadrants
const left = Math.floor(COLS/2)
const top = Math.floor(ROWS/2)
const qs = [[0,left,0,top],[left+1,COLS,0,top],[0,left,top+1,ROWS],[left+1,COLS,top+1,ROWS]
].map(fn(ranges) {
  const [xf,xt,yf,yt] = ranges
  ret grid[yf..yt].map(fn(row) -> row[xf..xt].sum()).sum()
})

log("Part 1:", qs.fold(1, fn(acc, q) -> acc * q)) // Part 1: 218295000
while true {
  move()
  i++
  if i == 6870 {
    log("Part 2:", i) // Part 2: 6870
    log(grid.map(fn(row) -> row.join("")).join("\r\n"))
    break
  }
}
