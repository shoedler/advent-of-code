import File
import Math

const nums = File
  .read(cwd() + "/sample.txt")
  .split("\r\n")
  .map(fn (line) -> line.split(" ").map(Int))

const is_safe = fn (rep) {
  const diff = rep.map(fn (e,i) -> i <rep.len-1 ? rep[i+1] - e : nil)
  diff.pop()
  ret diff.every(fn (x) -> x <= -1 and x >= -3) or 
    diff.every(fn (x) -> x >= 1 and x <= 3)
}

const is_safe_tol = fn (rep) {
  const reps = []
  for let i = 0; i < rep.len; i++; {
    const r = rep.concat([])
    r.yank(i)
    reps.push(r)
  }
  ret reps.some(is_safe)
}

log("Part 1", nums.sift(is_safe).len)
log("Part 2", nums.sift(is_safe_tol).len)

