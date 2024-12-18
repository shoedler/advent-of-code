
import File
import Math

const nums = File
  .read(cwd() + "/sample.txt")
  .split("\r\n")
  .map(fn (line) -> line.split("   ").map(Int))

const L = nums.map(fn (p) -> p[0]).sort()
const R = nums.map(fn (p) -> p[1]).sort()

log("Part 1:", L.map(fn (l, i) -> Math.abs(l-R[i])).sum()) // Part 1: 1530215
log("Part 2:", L.map(fn (l) -> l * R.sift(fn (r) -> r == l).len).sum() ) // Part 2: 26800609