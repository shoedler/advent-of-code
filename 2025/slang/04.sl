import File

const G = File
  .read(cwd() + "/input.txt")
  .split("\r\n")
  .map(fn(line) -> line.split(""))

const DIRS = [-1,0,1]
const (rows, cols) = (G.len, G[0].len)

let (p1,p2) = (0,0)
let first = true
for ;;; {
  let changed = false
  for let r=0; r<rows; ++r; {
    for let c=0; c<cols; ++c; {
      let num = 0
      DIRS.each(fn(dr) ->
        DIRS.each(fn(dc) {
          const (rr, cc) = (r+dr, c+dc)
          if 0<=rr and rr<rows and 
             0<=cc and cc<cols and 
             G[rr][cc]=="@"
            num++
        }))

      if G[r][c]=="@" and num<5 {
        p1++
        changed = true
        if !first {
          p2++
          G[r][c]="."
        }
      }
    }
  }

  if first {
    print "Part 1: " + p1
    first = false
  }
  if !changed {
    break
  }
}

print "Part 2: " + p2

// Part 1: 1460
// Part 2: 9243