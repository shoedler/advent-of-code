import File

const nums = File
  .read(cwd() + "/sample.txt")
  .split("\r\n")
  .map(fn (line) -> line.split("   ").map(Int))

const ls = nums.map(fn (p) -> p[0])
const rs = nums.map(fn (p) -> p[1])

// No sorting yet, so we need to do it manually
fn bubble(arr) {
  let swappped = false
  const n = arr.len

  for let i = 0; i < n-1; i++; {
    swappped = false
    for let j = 0; j < n-i-1; j++; {
      if arr[j] > arr[j+1] {
        const tmp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = tmp
        swappped = true
      }
    }

    if swappped == false 
      skip
  }
}

bubble(ls)
bubble(rs)

const res = ls
  .map(fn (l, i) -> l - rs[i] > 0 ? l - rs[i] : rs[i] - l) // No "abs" either...
  .reduce(0, fn (acc, x) -> acc + x)

log("Part 1:", res) // 1530215

const similarity = ls.map(fn (l) {
  const r = rs.filter(fn (r) -> r == l).len
  ret r*l
}).reduce(0, fn (acc, x) -> acc + x) 

log("Part 2:", similarity) // 26800609