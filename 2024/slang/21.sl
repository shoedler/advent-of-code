
import File
import Math

const codes = File
  .read(cwd() + "sample.txt")
  .split("\r\n")

const NUM_KEYS = [
  "789",
  "456",
  "123",
  " 0A"
]

const DIR_KEYS = [
  " ^A",
  "<v>",
]

const DIRS = { "^": (0,-1), ">": (1,0), "v": (0,1), "<": (-1,0) }

// Map each key to its position on the keypad. E.g. "1" -> (0,2)
fn make_pad(pad) {
  const map = {}
  pad.each(fn(line, y) {
    line.split("").each(fn(key, x) {
      if key != " "
        map[key] = (x, y)
    })
  })
  ret map
}

const num_keypad = make_pad(NUM_KEYS)
const dir_keypad = make_pad(DIR_KEYS)

// Repeat a string n times
fn reps(str, n) {
  let res = ""
  for ; res.len < n; res += str; {}
  ret res
}

// Generate all unique permutations of a string
fn unique_perms(str) {
  if str.len == 0 ret [(,)]
  if str.len == 1 ret [(str,)]

  const perms = []
  const chars = str.split("")
  fn swap(i, j) {
    const tmp = chars[i]
    chars[i] = chars[j]
    chars[j] = tmp
  }

  fn permute(n) {
    if n == 1 ret perms.push(Tuple(chars))
    for let i = 0; i < n; i++; {
      swap(i, n-1)
      permute(n-1)
      swap(i, n-1)
    }
  }

  permute(chars.len)
  ret perms
}

const DP = {}
fn calc_presses(seq, depth, dirkey, cur) {
  const DP_KEY = (seq, depth, dirkey, cur)
  if DP_KEY in DP ret DP[DP_KEY]

  const keypad = dirkey? dir_keypad : num_keypad

  // Base cases
  if seq.len == 0 ret 0
  if cur==nil cur = keypad["A"]

  // Calc distance to the next key
  const (cx, cy) = cur
  const (px, py) = keypad[seq[0]]
  const dx = px-cx
  const dy = py-cy

  // Generate the moves to get to the next key
  let moves = ""
  if dx > 0 or dx < 0 moves += reps(dx > 0 ? ">" : "<", Math.abs(dx))
  if dy > 0 or dy < 0 moves += reps(dy > 0 ? "v" : "^", Math.abs(dy))

  let min_len = moves.len + 1
  if depth > 0 {
    // Try all permutations of the moves to find the shortest path
    min_len = unique_perms(moves).map(fn(perm) {
      let (cx, cy) = cur
      const every = perm.every(fn(move) {
        const (mdx, mdy) = DIRS[move]
        cx += mdx
        cy += mdy
        ret (cx, cy) in keypad.values() // Valid, if the new position is on the keypad
      })
      ret valid ? calc_presses(perm.join("") + "A", depth-1, true, nil) : nil  // Recurse on the direction keypad
    }).sift(fn(p) -> p != nil).sort()[0]
  }

  const res = min_len + calc_presses(seq[1..], depth, dirkey, (px, py))
  DP[DP_KEY] = res
  ret res
}
  
log("Part 1", codes.map(fn(code) -> Int(code[..-1]) * calc_presses(code, 2, false, nil)).sum()) // Part 1: 215374
log("Part 2", codes.map(fn(code) -> Int(code[..-1]) * calc_presses(code, 25, false, nil)).sum()) // Part 2: 260586897262600
