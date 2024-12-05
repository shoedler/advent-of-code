import File
import Math
import Perf
import { Set } from "/modules/std"

const [raw_rules, raw_updates] = File
  .read(cwd() + "/sample.txt")
  .split("\r\n\r\n")
  .map(fn(p) -> p.trim().split("\r\n"))

const rules = raw_rules.map(fn(r) -> r.split("|").map(Int))
const updates = raw_updates.map(fn(u) -> u.split(",").map(Int))

const RULES_AFTER = {}
const RULES_BEFORE = {}
rules.each(fn(rule) {
  const [l, r] = rule
  if l in RULES_AFTER RULES_AFTER[l].push(r) else RULES_AFTER[l] = [r]
  if r in RULES_BEFORE RULES_BEFORE[r].push(l) else RULES_BEFORE[r] = [l]
})

fn is_correct(upd) {
  for let i = 0; i < upd.len; i++; {
    const page = upd[i] 
    const after = RULES_AFTER[page]
    const rest = upd[i+1..]

    if rest.every(fn(p) -> p in after) skip
    ret false
  }
  ret true
}

fn make_correct(upd) {
  const new_upd = []
  const remaining_deps = {}
  const Q = []

  upd.each(fn(pg) {
    const after = RULES_AFTER[pg]
    const valid_successors = Set(after).intersection(Set(upd)).size()
    remaining_deps[pg] = valid_successors
    if valid_successors == 0 Q.push(pg)
  })

  while Q.len > 0 {
    const page = Q.yank(0)
    new_upd.push(page)
    const before = RULES_BEFORE[page]
    before.each(fn(pg) {
      if pg in remaining_deps {
        remaining_deps[pg]--
        if remaining_deps[pg] == 0 Q.push(pg)
      }
    })
  }
  ret new_upd
}

fn to_middle_item(upd) -> upd[Math.floor(upd.len/2)]

const p1 = updates
  .sift(is_correct)
  .map(to_middle_item)
  .sum()

let p2 = updates
  .sift(fn(u) -> !is_correct(u))
  .map(make_correct)
  .map(to_middle_item)
  .sum()

log("Part 1", p1) // Part 1 4578
log("Part 2", p2) // Part 2 6179
