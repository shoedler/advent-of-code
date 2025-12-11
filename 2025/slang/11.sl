import File

const NW = {}

File
  .read(cwd() + "input.txt")
  .split(File.newl)[..-1]
  .each(fn(line) {
    const [dev, cons_raw] = line.split(": ")
    const cons = cons_raw.split(" ")
    NW[dev.trim()] = cons.map(fn(c) -> c.trim())
  })

fn p1(x) {
  if x == "out" ret 1
  ret NW[x].map(fn(y) -> p1(y)).sum()
}

const C ={}
fn p2(x, dac, fft) {
  const key = (x,dac,fft)
  let retval = nil
  if key in C ret C[key]
  if x == "out" retval = dac and fft? 1 : 0
  else retval = NW[x].map(fn(y) -> p2(y, dac or y=="dac", fft or y=="fft")).sum()
  C[key] = retval
  ret retval
}

print "Part 1: " + p1("you") // Part 1: 534
print "Part 2: " + p2("svr", false, false) // Part 2: 499645520864100
