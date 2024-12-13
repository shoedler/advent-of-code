
import File
import Math

const bvs = File
  .read(cwd() + "sample.txt")
  .split("\r\n\r\n")
  .map(fn(bv) -> bv.ints())

fn cheapest(px_ofs, py_ofs) -> bvs
  .map(fn(bv) {
    let [ax,ay,bx,by,px,py] = bv
    px += px_ofs
    py += py_ofs

    // deduced from:
    // prize x = ax*press_a + bx*press_b
    // prize y = ay*press_a + by*press_b
    const press_a = (px*by - py*bx) / (ax*by - ay*bx) 
    const press_b = (px - ax*press_a) / bx 

    if press_a%1 == 0 and press_b%1 == 0 ret Math.floor(press_a * 3 +press_b) 
    ret 0
  })
  .sum()

log("Part 1:", cheapest(0,0)) // Part 1: 29023
log("Part 2:", cheapest(10000000000000,10000000000000)) // Part 2: 96787395375634