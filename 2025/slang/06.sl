import File

const lines = File
  .read(cwd() + "/input.txt")
  .split("\r\n")

const ops = lines
  .yank(lines.len-1)
  .split("")
  .map(fn(op) -> op.trim())
  .sift(fn(s) -> s.len > 0)

const nums = lines
  .map(fn(line) -> line.ints())

const M = {
 "*": (1, fn(a,b) -> a*b),
 "+": (0, fn(a,b) -> a+b),
}

print "Part 1:" + ops
  .map(fn(op,i) -> nums
    .map(fn(row) -> row[i])
    .fold(M[op][0], M[op][1])
  ).sum()

const cols = []
lines[0]
  .split("")
  .each(fn(_,i) -> lines
    .every(fn(line) -> line[i] == " ") ? 
      cols.push(i) : nil)
cols.push(lines[0].len)

const sums = []
cols
  .fold(0, fn(prev,cur,i) {
    let eq = []
    for ; prev < cur; ++prev; 
      eq.push(Int(lines.map(fn(l) -> l[prev]).join("")))
    sums.push(eq.fold(M[ops[i]][0], M[ops[i]][1]))
    ret cur+1 // Skip gap
  })

print "Part 2:" + sums.sum()

// Part 1: 4771265398012
// Part 2: 10695785245101