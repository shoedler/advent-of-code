
import File
import Math

const source = File
  .read(cwd() + "sample.txt")
  .split(" ")
  .map(Int)

const cache = {}
fn blink(stone, blinks) {
  let ans = 0
  if (stone, blinks) in cache ret cache[(stone, blinks)]

  if blinks == 0 ans = 1
  else if stone == 0 ans = blink(1, blinks-1)
  else if stone.to_str().len %2 == 0 {
    const str = stone.to_str()
    const first = Int(str[0..Int(str.len/2)])
    const second = Int(str[Int(str.len/2)..str.len])
    ans = blink(first, blinks-1) + blink(second, blinks-1)
  }
  else ans = blink(stone * 2024, blinks-1)

  cache[(stone, blinks)] = ans
  ret ans
}

log("Part 1:", source.map(fn(stone) -> blink(stone, 25)).sum()) // Part 1: 193899
log("Part 2:", source.map(fn(stone) -> blink(stone, 75)).sum()) // Part 2: 229682160383225

