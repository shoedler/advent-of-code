


import File

const sections = File
  .read(cwd() + "input.txt")
  .split(File.newl + File.newl)

const GIFTS = sections[..-1]
const REGIONS = sections[-1]

const S = GIFTS
  .fold({}, fn(acc, gift) {
    const lines = gift.split(File.newl)
    const name = Int(lines[0][..-1])
    acc[name] = lines[1..].map(fn(line) -> line.split("").count("#")).sum()
    ret acc
  })

print "Part 1: " + REGIONS
  .split(File.newl)[..-1]
  .fold(0, fn(acc, region) {
    const [size, nums] = region.split(": ")
    const grid_size = size.split("x").map(Int).fold(1, fn(acc, n) -> acc*n)
    const gift_size = nums.split(" ").map(Int).map(fn(n, i) -> n*S[i]).sum()
    ret gift_size*1.3 < grid_size? acc+1 : acc
  })

// Part 1: 410
