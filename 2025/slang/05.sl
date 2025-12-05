import File

let [ranges, avail] = File
  .read(cwd() + "/input.txt")
  .split("\r\n\r\n")

ranges = ranges
  .split("\r\n")
  .map(fn(l) -> l.split("-").map(Int))

const p1 = avail
  .split("\r\n")
  .map(Int)
  .sift(fn(id) -> ranges.some(fn(rng) -> id>=rng[0] and id<=rng[1])).len

let cur = -1
let p2 = 0
ranges
  .order(fn(a,b) -> (a[0]<b[0])?-1:1)
  .each(fn(range) {
    let [low,hi] = range
    low = cur>=low? cur+1    :low
    p2 += low<=hi?  hi-low+1 :0
    cur = hi>cur?   hi       :cur
  })

print "Part 1: " + p1 // Part 1: 679
print "Part 2: " + p2 // Part 2: 358155203664116
