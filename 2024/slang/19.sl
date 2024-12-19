
import File
import Math

const [towels, designs] = File
  .read(cwd() + "sample.txt")
  .split("\r\n\r\n")

const TOWELS = towels.split(",").map(fn(x) -> x.trim())
const DESIGNS = designs.split("\r\n").map(fn(x) -> x.trim())

const DP = {}
fn combos(design) {
  if design in DP ret DP[design]
  let ways = design.len == 0 ? 1 : 0

  for let i = 0; i < TOWELS.len; i++; {
    const towel = TOWELS[i]
    const start = design[..towel.len]
    if start == towel 
      ways += combos(design[towel.len..])
  }
  
  DP[design] = ways
  ret ways
}

const ways = DESIGNS.map(fn(d) -> combos(d))
log("Part 1:", ways.sift(fn(c) -> c>0).len) // Part 1: 
log("Part 2:", ways.sum()) // Part 2: 