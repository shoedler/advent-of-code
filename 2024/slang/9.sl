import File
import Perf
import Gc

const input = File.read(cwd() + "sample.txt")

fn defrag(bulk) {
  const files = []
  const spaces = []

  const final = []
  let curr_pos = 0
  let curr_file_id = 0

  for let index=0; index<input.len; index++; {
    const value = Int(input[index])

    if index%2 == 0 {
      if bulk 
        files.push((curr_pos, value, curr_file_id))

      for let _=0; _<value; _++; {
        final.push(curr_file_id)
        if !bulk
          files.push((curr_pos, 1, curr_file_id))
        curr_pos++
      }
      curr_file_id++
    } else {
      spaces.push((curr_pos, value))
      for let _=0; _<value; _++; {
        final.push(nil)
        curr_pos++
      }
    }
  }

  const files_f = files.flip()
  for let i=0; i<files_f.len; i++; {
    const (file_pos, file_size, file_id) = files_f[i]

    for let j=0; j<spaces.len; j++; {
      const (space_pos, space_size) = spaces[j]

      if space_pos<file_pos and file_size<=space_size {
        for let offset=0; offset<file_size; offset++; {
          final[file_pos+offset] = nil
          final[space_pos+offset] = file_id
        }

        spaces[j] = (space_pos+file_size, space_size-file_size)
        break
      }
    }
  }

  let total = 0
  for let i=0; i<final.len; i++; {
    if final[i] is Int {
      total += i*final[i]
    }
  }

  ret total
}

log("Part 1", defrag(false)) // Part 1 6262891638328
log("Part 2", defrag(true))  // Part 2 6287317016845
