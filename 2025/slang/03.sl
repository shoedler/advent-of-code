import File

fn max_jolts(bank, bat_len) {
  let jolts = ""
  while jolts.len < bat_len {
    let highest = bank[..(bank.len - (bat_len - jolts.len - 1))].sort().flip()[0] // TODO: Should add Listlike.max()
    jolts += highest.to_str()
    bank = bank[bank.pos(highest) + 1..]
  }
  ret Int(jolts)
}

const (p1,p2) = File
  .read(cwd() + "/input.txt")
  .split("\r\n")
  .map(fn(line) {
    line = line.split("").map(Int)
    ret (max_jolts(line, 2), max_jolts(line, 12))
  })
  .fold((0,0), fn(acc, c) -> (acc[0]+c[0], acc[1]+c[1]))

print "Part 1: " + p1 // Part 1: 17405
print "Part 2: " + p2 // Part 2: 171990312704598