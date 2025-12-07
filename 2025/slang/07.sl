import File

const G = File
  .read(cwd() + "/input.txt")
  .split("\r\n")
  .map(fn(line) -> line.split(""))

const S = (0, G[0].pos("S"))

fn splits(spos) {  
  let splits = 0
  const C = {}
  const Q = [spos]

  fn enq(pot) {
    if pot not in C {
      Q.push(pot)
      C[pot]=true
    }
  }

  while Q.len > 0 {
    const pos = Q.yank(0)
    let (r,c) = pos

    if r+1==G.len skip
    else if G[r+1][c]=="." enq((r+1,c))
    else {
      ++splits
      enq((r+1,c-1))
      enq((r+1,c+1))
    } 
  }

  ret splits
}

fn timelines(pos) {
  const C = {}
  fn score(pos) {
    if pos in C ret C[pos]
    
    let ans
    const (r,c) = pos
    if r+1==G.len ans=1
    else if G[r+1][c]=="^" ans=score((r+1,c+1)) + score((r+1,c-1))
    else ans=score((r+1,c))

    C[pos]=ans
    ret ans
  }
  ret score(pos)
}

print "Part 1: " + splits(S)    // Part 1: 1550
print "Part 2: " + timelines(S) // Part 2: 9897897326778
