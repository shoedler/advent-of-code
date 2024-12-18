
import File
import Math
import Perf

fn time_ms(start) -> (Perf.since(start) * 1000).to_str() + "ms"

const digits = "0123456789"

const prg = File
  .read(cwd() + "/sample.txt")

fn run(do_enable) {
  let i = 0
  let res = 0
  let enable = true

  fn is_digit() -> prg[i] in digits

  fn check(str) -> prg[i..i+str.len] == str

  fn match(str) {
    if !check(str) ret false
    i += str.len
    ret true
  }

  fn num() {
    let n = ""
    while (is_digit()) {
      n += prg[i]
      i++
    }
    ret Int(n)
  }

  for ; i < prg.len; i++ ; {
    if do_enable and match("don't()") enable = false
    if do_enable and match("do()") enable = true
    
    if match("mul(") {
      const a = num()
      if !match(",") skip
      const b = num()
      if !check(")") skip
      if enable 
        res += Int(a) * Int(b)
    }
  }
  ret res
}

let start = Perf.now()
log("Part 1", run(false), "took " + time_ms(start)) // Part 1 168539636 took 3.53420001920313ms
start = Perf.now()
log("Part 2", run(true), "took " + time_ms(start)) // Part 2 97529391 took 5.9828000376001ms