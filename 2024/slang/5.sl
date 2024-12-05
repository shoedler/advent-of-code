
import File
import Math
import Perf
import { Set } from "/modules/std"

const [raw_rules, raw_updates] = File
  .read(cwd() + "/sample.txt")
  .split("\r\n\r\n")
  .map(fn(p) -> p.trim().split("\r\n"))

const rule_pairs = raw_rules.map(fn(r) -> r.split("|").map(Int))
const updates = raw_updates.map(fn(u) -> Tuple(u.split(",").map(Int)))

const rules = {}
rule_pairs.each(fn(rule) {
  const [l, r] = rule
  rules[l] = rules[l] ? rules[l].concat((r,)) : (r,)
})

fn to_middle(kind) {
  const correct_only = kind == "correct-ones-only"
  ret fn (pages) {
    const sorted = pages.order(fn(a,b) -> (b in rules[a]) ? -1 : 1 ) // 🤯
    const is_correct = sorted == pages
    ret correct_only ?
      is_correct ? pages[Math.floor(pages.len/2)] : 0 :
      is_correct ? 0 : sorted[Math.floor(sorted.len/2)]
  }
}

const p1 = updates
  .map(to_middle("correct-ones-only"))
  .sum()

const p2 = updates
  .map(to_middle("incorrect-ones-only"))
  .sum()

log("Part 1", p1) // Part 1 4578
log("Part 2", p2) // Part 2 6179