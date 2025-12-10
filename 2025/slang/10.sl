// I gave in on part 2 as I had no idea on how to go about this. I rewrote kb's solution:
// https://github.com/kevinbrechbuehl/advent-of-code/blob/87599833037950ce88a4ccccec4b1804dd42e792/2025/10/puzzle.ts
// in slang.
// Writing a intprg or solver was no option - maybe next year.

import File
import Math

fn parseInput() ->
  File
    .read(cwd() + "input.txt")
    .split(File.newl)
    .map(fn(line) {
      const parts = line.split(" ")
      const lights = parts[0][1..-1]
      const buttons = parts[1..-1].map(fn(part) -> part[1..-1].split(",").map(Int))
      const joltages = parts[parts.len - 1][1..-1].split(",").map(Int)

      ret { "lights": lights, "buttons": buttons, "joltages": joltages }
    })

fn min_presses_for_lights(target_lights, buttons) {
  const visited = {}
  const initial_lights = ".".reps(target_lights.len)

  fn toggle_lights(lights, btns) {
    const chars = lights.split("")
    btns.each(fn(i) {
      chars[i] = chars[i] == "#" ? "." : "#"
    })

    ret chars.join("")
  }

  const Q = []
  Q.push(initial_lights)

  while Q.len > 0 {
    const cur_lignts = Q.yank(0)
    const cur_presses = cur_lignts in visited ? visited[cur_lignts] : 0

    for let i = 0; i < buttons.len; ++i; {
      const button = buttons[i]
      const toggled = toggle_lights(cur_lignts, button)

      if toggled == target_lights {
        ret cur_presses + 1
      }

      if toggled in visited {
        skip
      }

      visited[toggled] = cur_presses + 1
      Q.push(toggled)
    }
  }
}

fn min_presses_for_joltages(buttons, joltages) {
  const num_rows = joltages.len
  const num_cols = buttons.len

  // 0. Pre-calculate strict upper bounds for each button press.
  // A button cannot be pressed more times than the target value of any counter it increments.
  const bounds = Seq(num_cols).map(fn -> Float.inf)

  for let c = 0; c < num_cols; ++c; {
    let is_active = false

    for let r = 0; r < num_rows; ++r; {
      if r in buttons[c] {
        is_active = true

        // Since coefficient is always 1, max presses = target / 1
        const max_this_row = Math.floor(joltages[r])
        if max_this_row < bounds[c] {
          bounds[c] = max_this_row
        }
      }
    }

    // If button connects to nothing, treat it as having bound 0 (useless)
    if !is_active {
      bounds[c] = 0
    }
  }

  // 1. Build Augmented Matrix [A | b]
  const MAT = []
  for let r = 0; r < num_rows; ++r; {
    const row = Seq(num_cols + 1).map(fn -> 0)
    // Set coefficients (A)
    for let c = 0; c < num_cols; ++c; {
      if buttons[c] and r in buttons[c] {
        row[c] = 1
      }
    }

    // Set target (b)
    row[num_cols] = joltages[r]
    MAT.push(row)
  }

  // 2. Gaussian Elimination to Reduced Row Echelon Form (RREF)
  let pvt_row = 0
  const col_to_pvt_row = Seq(num_cols).map(fn -> -1)

  for let c = 0; c < num_cols and pvt_row < num_rows; ++c; {
    // Find pivot
    let sel = pvt_row
    for let r = pvt_row + 1; r < num_rows; ++r; {
      if Math.abs(MAT[r][c]) > Math.abs(MAT[sel][c]) {
        sel = r
      }
    }

    // Skip if column is all zeros (free variable)
    if Math.abs(MAT[sel][c]) < 0.000000001 {
      skip
    }

    // Swap rows
    if sel != pvt_row {
      const swp = MAT[pvt_row]
      MAT[pvt_row] = MAT[sel]
      MAT[sel] = swp
    }

    // Normalize pivot row
    const div = MAT[pvt_row][c]
    for let j = c; j <= num_cols; ++j; {
      MAT[pvt_row][j] /= div
    }

    // Eliminate column in other rows
    for let r = 0; r < num_rows; ++r; {
      if r != pvt_row {
        const factor = MAT[r][c]
        if Math.abs(factor) > 0.000000001 {
          for let j = c; j <= num_cols; ++j; {
            MAT[r][j] -= factor * MAT[pvt_row][j]
          }
        }
      }
    }

    col_to_pvt_row[c] = pvt_row
    pvt_row++
  }

  // 3. Check for Inconsistency (0 = non-zero)
  for let r = pvt_row; r < num_rows; ++r; {
    if Math.abs(MAT[r][num_cols]) > 0.0001 {
      ret 0
    }
  }

  // 4. Solve for integer variables
  // Identify free variables
  const free_vars = []
  for let c = 0; c < num_cols; ++c; {
    if col_to_pvt_row[c] == -1 {
      free_vars.push(c)
    }
  }

  let min_presses = Float.inf

  // Search through free variable space to find integer solutions
  fn search(idx, cur_solution, cur_sum) {
    // Pruning
    if cur_sum >= min_presses {
      ret
    }

    // All free variables assigned? Calculate pivot variables
    if idx == free_vars.len {
      let valid = true
      let total = cur_sum

      // Solve backwards for pivot variables
      for let c = num_cols - 1; c >= 0; --c; {
        if col_to_pvt_row[c] != -1 {
          const r = col_to_pvt_row[c]
          let val = MAT[r][num_cols]

          // x_pivot = Target - Sum(Coeff * x_known)
          for let j = c + 1; j < num_cols; ++j; {
            val -= MAT[r][j] * cur_solution[j]
          }

          // Integer check (using epsilon for float precision)
          if val < -0.0001 or Math.abs(val - Math.round(val)) > 0.0001 {
            valid = false
            break
          }

          const rounded = Math.round(val)

          // Bounds check
          if rounded > bounds[c] {
            valid = false
            break
          }

          cur_solution[c] = rounded
          total += rounded

          if total >= min_presses {
            valid = false
            break
          }
        }
      }

      if valid {
        min_presses = total
      }

      ret
    }

    const fv = free_vars[idx]
    const limit = bounds[fv] // Use calculated bound

    for let v = 0; v <= limit; ++v; {
      cur_solution[fv] = v
      search(idx + 1, cur_solution, cur_sum + v)
    }
  }

  search(0, Seq(num_cols).map(fn -> 0), 0)

  ret min_presses == Float.inf ? 0 : min_presses
}

print "Part 1: " + parseInput()
  .map(fn(d) -> min_presses_for_lights(d.lights, d.buttons))
  .sift(fn(p) -> p != nil)
  .sum()

print "Part 2: " + parseInput()
  .map(fn(d) -> min_presses_for_joltages(d.buttons, d.joltages))
  .sum()

// Part 1: 517
// Part 2: 21469