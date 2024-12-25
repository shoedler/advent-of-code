
import File
import Math

const [inputs, wires] = File
  .read(cwd() + "sample.txt")
  .split("\r\n\r\n")

const REGS = {}
const FNS = {}

inputs.split("\r\n").each(fn(line) {
  const [name, val] = line.split(": ")
  REGS[name] = val == "1" ? true : false
})

wires.split("\r\n").each(fn(line) {
  const [lhs, op, rhs, _, out] = line.split(" ")
  FNS[out] = (lhs, op, rhs)
})

const OPS = {
  "OR": fn(a,b) -> a or b,
  "AND": fn(a,b) -> a and b,
  "XOR": fn(a,b) -> (a or b) and !(a and b),
}

// Repeat a string n times
fn reps(str, n) {
  let res = ""
  for ; res.len < n; res += str; {}
  ret res
}

fn eval(name) {
  if name in REGS ret REGS[name]
  const (lhs, op, rhs) = FNS[name]
  REGS[name] = OPS[op](eval(lhs), eval(rhs))
  ret REGS[name]
}

const Z = []
let i = 0
while true {
  let key = "z" + reps("0", 2 - i.to_str().len) + i.to_str()
  if !(key in FNS) break
  Z.push(eval(key))
  i++
}

print Int("0b"+Z.flip().map(fn(x) -> x ? "1" : "0").join(""))
