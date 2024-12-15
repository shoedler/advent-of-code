import File

const [grid_raw, moves_raw] = File
  .read(cwd() + "/sample.txt")
  .split("\r\n\r\n")

fn simulate(wide_boxes) {
  const grid = []
  grid_raw
    .split("\r\n")
    .each(fn (line) {
      const row = []
      line.split("").each(fn(c) {
        if !wide_boxes row.push(c)
        else c=="#"? row.push("#","#") : c=="O"? row.push("[","]") : c=="@"? row.push("@",".") : row.push(c, ".")
      })
      grid.push(row)
    })

  const moves = moves_raw
    .split("\r\n")
    .join("")

  const BOX = wide_boxes ? "[]" : "O"
  const ROWS = grid.len
  const COLS = grid[0].len
  const DIRS = {"^":(-1, 0), ">":(0,1), "v":(1,0), "<":(0,-1)}

  // grid interaction
  fn add(a,b) -> (a[0]+b[0], a[1]+b[1])
  fn at(pos) -> try grid[pos[0]][pos[1]] else nil
  fn set(pos, val) -> grid[pos[0]][pos[1]] = val

  // start pos
  fn start_i(r) -> "@" in r
  fn not_nil(x) -> x != nil
  let robot = (
    grid.pos(start_i), 
    grid.map(fn (r) -> r.pos(start_i)).first(not_nil)
  )
  set(robot, ".")

  fn build_box_stack_wide(start, move) {
    const stack = []

    const Q = [start]
    while Q.len > 0 {
      let curr = Q.yank(0)
      curr = add(curr, DIRS[move])

      if curr in stack skip
      if at(curr)=="." skip // free
      if at(curr)=="#" ret [] // blocked
      if at(curr)=="[" {
        const other = add(curr, DIRS[">"])
        stack.push((curr, "["))
        stack.push((other, "]"))
        if (move == ">") Q.push(other)
        else if (move == "<") skip
        else {
          Q.push(curr)
          Q.push(other)
        }
      }
      if at(curr)=="]" {
        const other = add(curr, DIRS["<"])
        stack.push((curr, "]"))
        stack.push((other, "["))
        if (move == "<") Q.push(other)
        else if (move == ">") skip
        else {
          Q.push(curr)
          Q.push(other)
        }
      }
    }
  
    ret stack
  }

  fn build_box_stack(start, move) {
    const first = add(start, DIRS[move])
    const stack = [(first, "O")]
    let next = add(first, DIRS[move])
    while at(next)=="O" {
      stack.push((next, "O"))
      next = add(next, DIRS[move])
    }
    if at(next)=="." ret stack
    ret []
  }

  const build_stack = wide_boxes ? build_box_stack_wide : build_box_stack

  for let i = 0; i<moves.len; i++; {
    const move = DIRS[moves[i]]
    const next = add(robot, move)

    if at(next)=="#" skip
    if at(next) in BOX {
      const stack = build_stack(robot, moves[i])
      if (stack.len == 0) skip // some box is blocked
      stack.each(fn (box) -> set(box[0], ".")) // ... or "half"-box
      stack.each(fn (box) -> set(add(box[0], move), box[1]))
    }
    robot = next
  }

  const boxes = []
  grid.each(fn(row,y) {
    row.each(fn(_,x) -> at((y,x))==BOX[0] ? boxes.push((y,x)) : nil)
  })

  ret boxes.map(fn(box) -> box[0]*100+box[1]).sum()
}

log("Part 1:", simulate(false)) // Part 1: 1485257
log("Part 2:", simulate(true)) // Part 2: 1475512