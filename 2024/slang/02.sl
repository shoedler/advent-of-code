
import File
import Math

const nums = File
  .read(cwd() + "/sample.txt")
  .split("\r\n")
  .map(fn (line) -> line.split(" ").map(Int))

const is_safe = fn (rep) {
  const diff = rep.map(fn (e,i) -> try rep[i+1]-e else nil)[..-1]
  ret diff.every(fn (x) -> x in [-3,-2,-1]) or 
      diff.every(fn (x) -> x in [1,2,3])
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

log("Part 1", nums.sift(is_safe).len) // Part 1 686
log("Part 2", nums.sift(is_safe_tol).len) // Part 2 717