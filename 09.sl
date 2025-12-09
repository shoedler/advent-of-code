import File
import Math

cls Point {
  ctor(x, y) {
    this.x = x
    this.y = y
  }

  fn area(other) -> (Math.abs(this.x-other.x)+1) * (Math.abs(this.y-other.y)+1)
}

cls Edge {
  ctor(p1,p2) {
    this.horizontal = p1.y == p2.y
    this.p1 = this.horizontal ? (p1.x < p2.x ? p1 : p2) : (p1.y < p2.y ? p1 : p2)
    this.p2 = this.horizontal ? (p1.x < p2.x ? p2 : p1) : (p1.y < p2.y ? p2 : p1)
  }

  fn intersects(other) {
    if this.horizontal == other.horizontal 
      ret false

    const horizontal = this.horizontal ? this : other
    const vertical = this.horizontal ? other : this
    ret vertical.p1.x > horizontal.p1.x and vertical.p1.x < horizontal.p2.x and
        horizontal.p1.y > vertical.p1.y and horizontal.p1.y < vertical.p2.y
  }
}

cls Polygon {
  ctor(points) {
    this.edges = points.map(fn(p, i) -> Edge(p, points[(i + 1) % points.len]))
  }

  fn intersects(edge) -> this.edges.some(fn(e) -> e.intersects(edge))
}

const COORDS = File
  .read(cwd() + File.sep + "input.txt")
  .split(File.newl)
  .map(fn(line) {
    const [x,y] = line.ints()
    ret Point(x,y)
   })[..-1]

const P = Polygon(COORDS)
let part1 = 0
let part2 = 0
for let i=0; i<COORDS.len-1; ++i; {
  const p1 = COORDS[i]

  for let j=i+1; j<COORDS.len; ++j; {
    const p2 = COORDS[j]

    const area = p1.area(p2)
    part1 = [part1, area].max()

    const [x1, x2] = [[p1.x, p2.x].min()+0.5, [p1.x, p2.x].max()-0.5]
    const [y1, y2] = [[p1.y, p2.y].min()+0.5, [p1.y, p2.y].max()-0.5]
    const rect = Polygon([Point(x1, y1), Point(x2, y1), Point(x2, y2), Point(x1, y2)])

    if !rect.edges.some(fn(edge) -> P.intersects(edge)) 
      part2 = [part2, area].max()
  }
}

print part1 // Part 1: 4763932976
print part2 // Part 2: 1501292304
