import File
import Math

const digits = "0123456789"

const prg = File
  .read(cwd() + "/sample.txt")

fn run(do_enable) {
  let i = 0
  let res = 0
  let enable = true

  fn is_digit() -> prg[i] in digits

  fn check(n) -> prg[i] == n

  fn cmd(name) {
    if prg[i..i+name.len] == name {
      i += name.len
      ret true
    }
    ret false
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
    if do_enable and cmd("don't()") {
      enable = false
    }
    if do_enable and cmd("do()") {
      enable = true
    }
    if cmd("mul(") {
      let a = num()
      if !cmd(",") skip
      let b = num()
      if !check(")") skip
      if enable 
        res += Int(a) * Int(b)
    }
  }
  ret res
}

log("Part 1", run(false)) // Part 1 168539636
log("Part 2", run(true)) // Part 2 97529391
