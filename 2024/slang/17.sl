
import File
import Math

const [regs, prg] = File
  .read(cwd() + "sample.txt")
  .split("\r\n\r\n")

const PRG = Tuple(prg.ints())
const REGS = {}
regs.split("\r\n").each(fn(line) {
  let [reg, val] = line.split(": ")
  reg = reg.split(" ")[1]
  REGS[reg] = val.ints()[0]
})

fn dv(a,b) -> Math.floor(a / Math.pow(2, b))

fn interpret() {
  let {A, B, C} = REGS
  let ip = 0
  let out = []

  while ip < PRG.len {
    const cmd = PRG[ip]
    if ip+1 >= PRG.len throw "Unexpected" 
    
    const op = PRG[ip+1]
    const combo = (op>=0 and op<=3) ? op : (op==4) ? A : (op==5) ? B : (op==6) ? C : nil

    if (cmd==0)      A = dv(A,combo)     // adv
    else if (cmd==1) B = Math.xor(B, op) // bxl
    else if (cmd==2) B = combo%8         // bst
    else if (cmd==3) {                   // jnz
      if (A != 0) {
        ip = op
        skip
      }
    }
    else if (cmd==4) B = Math.xor(B, C)  // bxc
    else if (cmd==5) out.push((combo%8)) // out
    else if (cmd==6) B = dv(A,combo)     // bdv
    else if (cmd==7) C = dv(A,combo)     // cdv
    ip+=2
  }

  ret out
}

// Program: 2,4,1,1,7,5,4,4,1,4,0,3,5,5,3,0
// 2,4 -> b = a % 8               |
// 1,1 -> b = b ^ 1               |
// 7,5 -> c = a >> b              |
// 4,4 -> b = b ^ c               |
// 1,4 -> b = b ^ 4               |
// 0,3 -> a = a >> 3              |
// 5,5 -> print(b % 8)
// 3,0 -> if a!=0 then jump to 0

fn calc(target, ans) {
  if target.len == 0 ret ans
  let [a,b,c] = [0,0,0]
  for let t=0; t<8; t++; {
    a = Math.bit_or(Math.shl(ans, 3), t)

    b = a%8
    b = Math.xor(b, 1)
    c = Math.shr(a, b)
    b = Math.xor(b, c)
    b = Math.xor(b, 4)

    if b%8 == target[-1] {
      const sub = calc(target[0..-1], a)
      if sub == nil skip
      ret sub
    }
  }
}

log("Part 1:", interpret().join(",")) // Part 1: 7,4,2,0,5,0,5,3,7
log("Part 2:", calc(PRG, 0)) // Part 2: 202991746427434