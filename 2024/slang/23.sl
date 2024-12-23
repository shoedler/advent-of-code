
import File
import Math
import Perf

const conns = File
  .read(cwd() + "sample.txt")
  .split("\r\n")
  .fold({}, fn(edges, line) {
    const [l,r] = line.split("-")
    if edges[l] != nil edges[l].push(r) else edges[l] = [r]
    if edges[r] != nil edges[r].push(l) else edges[r] = [l]
    ret edges
  })

const devices = conns.keys()
let p1 = 0

devices.each(fn(a, i) ->
  devices[i+1..].each(fn(b, j) ->
    devices[i+j+2..].each(fn(c) {
      if (a in conns[b]) and (a in conns[c]) and (b in conns[c]) {
        if "t" in [a[0],b[0],c[0]] p1++
      }
    })
  )
)

log("Part 1:", p1) // Part 1: 1378

fn shuffle(arr) {
  const result = arr[..]
  for let i = result.len-1; i > 0; i--; {
    const j = Math.floor((Perf.now() * 1000000) % (i + 1)) // Fisher-Yates
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  ret result
}

fn str_order(a, b) -> a.ascii().fold(0, fn(acc, c, i) -> 
  acc != 0 ? acc : c - b.ascii()[i]
)

fn to_clique(arr) -> arr.fold([], fn(cliq, x) ->
  cliq.every(fn(y) -> x in conns[y]) ? cliq.concat([x]) : cliq
)

let best = nil
for let t=0; t<100; t++; {
  const clique = to_clique(shuffle(devices))
  if (best == nil or clique.len > best.len) 
    best = clique
}

const p2 = best.order(str_order).join(",")

log("Part 2: ", p2) // Part 2: bs,ey,fq,fy,he,ii,lh,ol,tc,uu,wl,xq,xv
