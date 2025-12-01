import File

const p1 = fn(acc, cmd) {
    let (dial, zeros) = acc
    const [dir,...dist] = cmd
    dial = dir == "L" ? dial - Int(dist) : dial + Int(dist)
    dial = dial < 0 ? (100 + dial) % 100 : dial >= 100 ? dial % 100 : dial
    if dial == 0 zeros++
    ret (dial, zeros)
}

const p2 = fn(acc, cmd) {
    let (dial, zeros) = acc
    const [dir, ...d] = cmd
    let dist = Int(d)

    for ; dist > 0; dist--; {
      if dir == "L" {
        dial--
        if dial < 0 dial = 99
      } else {
        dial++
        if dial >= 100 dial = 0
      }

      if dial == 0 zeros++
    }
    ret (dial, zeros)
}

print "Part 1: " + File
  .read(cwd() + "/input.txt")
  .split("\r\n")
  .fold((50,0), p1)[1]

print "Part 2: " + File
  .read(cwd() + "/input.txt")
  .split("\r\n")
  .fold((50,0), p2)[1]

// Part 1: 980
// Part 2: 5961