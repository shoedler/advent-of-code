import File

const eqs = File
  .read(cwd() + "/sample.txt")
  .split("\r\n")
  .map(fn(l) {
    const [res, rest] = l.split(":")
    const nums = rest
      .trim()
      .split(" ")
      .map(Int)
      
    ret [Int(res), nums]
  })

const ops = [
  fn(a, b) -> a+b,
  fn(a, b) -> a*b,
]

fn combinations(nums) {
  const rs = []

  fn calc(pos, val, rest) -> pos < nums.len-1 ?
    ops.each(fn(op) -> calc(pos+1, op(val, nums[pos+1]), rest)) :
    rs.push(val)

  calc(0, nums[0], nums[1..])
  ret rs
}

fn solve -> eqs
  .map(fn(eq) -> (eq[0] in combinations(eq[1])) ? eq[0] : 0)
  .sum()

log("Part 1:", solve()) // Part 1: 4555081946288
ops.push(fn(a, b) -> Int(a.to_str()+b))
log("Part 2:", solve()) // Part 2: 227921760109726