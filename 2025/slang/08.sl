import File
import Math

fn dist(a,b) -> Math.sqrt(
  Math.pow((a[0]-b[0]),2) + 
  Math.pow((a[1]-b[1]),2) + 
  Math.pow((a[2]-b[2]),2))

const JUNCTIONS = File
  .read("/home/shoedler/Projects/slang/input.txt")
  .split(File.newl)
  .map(fn(line) -> Tuple(line.ints()))[..-1]

const DIST_TABLE = JUNCTIONS
  .fold([], fn(acc, a, i) {
    JUNCTIONS.each(fn(b, j) -> i>j ? acc.push((dist(a,b),i,j)) : nil)
    ret acc
  })
  .order(fn(a,b) -> a[0]-b[0])

const UNION = JUNCTIONS
  .fold({}, fn(acc, _, i) -> (acc[i]=i or true) and acc)

fn find(x) {
  if x==UNION[x] ret x
  UNION[x] = find(UNION[x])
  ret UNION[x]
}

fn union(x,y) -> UNION[find(x)] = find(y)

DIST_TABLE
  .fold(0, fn(cons, item, t) {
    const (_, i, j) = item
    if t == 1000 {
      print "Part 1: " + JUNCTIONS
        .map(fn(_,i) -> find(i))
        .fold({}, fn(acc, c) -> (acc[c] = c in acc? acc[c] + 1 : 1) and acc)
        .values()
        .sort()[-3..]
        .fold(1, fn(acc, c) -> acc*c)
    }
    if find(i) != find(j) {
      ++cons
      if cons == JUNCTIONS.len-1 {
        print "Part 2: " + [JUNCTIONS[i], JUNCTIONS[j]]
          .map(fn(j) -> j[0])
          .fold(1, fn(acc, c) -> acc*c)
      }
      union(i,j)
    }
    ret cons
  })

// Part 1: 163548
// Part 2: 772452514
