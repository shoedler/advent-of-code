import File
import Math

const nums = File
  .read(cwd() + "/sample.txt")
  .split("\r\n")
  .map(fn (line) -> line.split("   ").map(Int))

const L = nums.map(fn (p) -> p[0]).sort()
const R = nums.map(fn (p) -> p[1]).sort()

const p1 = L
  .map(fn (l, i) -> Math.abs(l-R[i]))
  .fold(0, fn (acc, x) -> acc + x)

log("Part 1:", p1) // Part 1: 1530215

const p2 = L
  .map(fn (l) -> l * R.sift(fn (r) -> r == l).len)
  .fold(0, fn (acc, x) -> acc + x) 

log("Part 2:", p2) // Part 2: 26800609