import File
import Math

print "Part 1: " + File
  .read(cwd() + "/input.txt")
  .split("\r\n")
  .map(fn(line) -> (line[0]=="L" ? -1 : 1) * Int(line[1..]))
  .fold((50, 0), fn(acc, dist) {
    let (dial, zeros) = acc
    dial += dist
    dial = dial < 0 ? (100 + dial) % 100 : dial >= 100 ? dial % 100 : dial
    if dial == 0 zeros++
    ret (dial, zeros)
  })[1]

print "Part 2: " + File
  .read(cwd() + "/input.txt")
  .split("\r\n")
  .map(fn(line) -> (line[0]=="L" ? -1 : 1) * Int(line[1..]))
  .fold((50, 0), fn(acc, dist) {
    let (dial, zeros) = acc
    const L = Math.abs(dist)
    let first = dist > 0 ? (100 - dial) % 100 : dial
    if first == 0 first = 100
    if L >= first zeros += 1 + Math.floor((L - first) / 100)
    dial = ((dial + dist) % 100 + 100) % 100
    ret (dial, zeros)  
})[1]

// Part 1: 980
// Part 2: 5961
