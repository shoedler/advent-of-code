import File
import Math

const invalid = fn(num, p2) {
  const id = Str(num)
  const match_count = p2 ? id.len : 2
  for let i = 2; i <= match_count; ++i; {
    if id.len%i == 0 {
      let matches = true
      let size = Math.floor(id.len/i)
      let j = 0
      while j < id.len {
        if id[j..j+size] != id[..size] matches = false
        j += size
      }
      if matches ret true
    }
  }
  ret false
}

const [p1, p2] = File
  .read(cwd() + "/input.txt")
  .split(",")
  .map(fn(blk) {
    let [l,r] = blk.split("-").map(Int)
    let res = [0,0]
    for ; l<=r; ++l; { 
      res[0] += invalid(l, false) ? l : 0
      res[1] += invalid(l, true) ? l : 0
    } 
    ret res
  })
  .fold([0,0], fn(acc, x) -> acc=[acc[0]+x[0], acc[1]+x[1]])

print "Part 1: " + p1 // Part 1: 31210613313
print "Part 2: " + p2 // Part 2: 41823587546
