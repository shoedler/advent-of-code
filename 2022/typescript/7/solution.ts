import * as fs from 'fs';

type File = [number, string];

class Dir {
  constructor (
    public name: string,
    public parent: Dir,
    public files: File[] = [],
    public dirs: Dir[] = []
  ) {}

  public addDir = (name: string) => {
    this.dirs.push(new Dir(name, this))
  }

  public size = (): number => 
    this.files.reduce((sum, b) => sum + b[0], 0) +
    this.dirs.reduce((sum, b) => sum + b.size(), 0);

  public dfpt = (fn: (dir: Dir) => void) => {
    fn(this);
    this.dirs.forEach(dir => dir.dfpt(fn))
  }

  public prettyPrint = (indent: number = 0) => {
    console.log(`${' '.repeat(indent)}📁 ${this.name}` )
    this.files.forEach(file => {
      console.log(`${' '.repeat(indent + 1)}📰 ${file[1]} size ${file[0]}` )
    })
    this.dirs.forEach(dir => dir.prettyPrint(indent + 2))
  }
}

const parse = (prog: string[]) => {
  const root = new Dir('/', null as unknown as Dir)
  let currentDir = root;
  let inLsCommand = false;

  prog.forEach(line => {
    if (line.startsWith('$ ls')) {
      inLsCommand = true;
    }
    else if (line.startsWith('$ cd')) {
      inLsCommand = false;
      const dirName = line.split(' ')[2];

      currentDir = 
        dirName === '..' ? currentDir.parent :
        dirName === '/' ? root :
        currentDir.dirs.filter(dir => dir.name === dirName)[0]
    }
    else if (inLsCommand) {
      if (line.startsWith('dir')) {
        const dir = line.split(' ')
        currentDir.addDir(dir[1])
      }
      else if (/^\d+/.test(line)) {
        const file = line.split(' ');
        currentDir.files.push([parseInt(file[0], 10), file[1]])
      }
      else {
        throw new Error(`Unsupported data in Ls Command: ${line}`)
      }
    }
    else {
      throw new Error(`Unsupported Command: ${line}`)
    }
  })

  return root;
}

const getDirsOfMaxSize = (entry: Dir, size: number) => {
  const result: Dir[] = [];

  entry.dfpt(dir => {
    if (dir.size() <= size)
      result.push(dir)
  })

  return result;
}

const getBestDirToDelete = (entry: Dir, requiredSpace: number) => {
  const availableSpace = 70000000;
  const unusedSpace = availableSpace - entry.size();
  const diffMap: [number, Dir][] = [];

  entry.dfpt(dir => {
    if ((unusedSpace + dir.size()) > requiredSpace) {
      diffMap.push([dir.size(), dir]);
    }
  })
  
  diffMap.sort((a, b) => a[0] - b[0]);
  return diffMap[0][1];
}

const program = fs.readFileSync('./input.txt', 'utf-8').split('\r\n');
const root = parse(program);

root.prettyPrint(0);

console.log("Part One", getDirsOfMaxSize(root, 1e5).reduce((sum, b) => sum + b.size(), 0));
console.log("Part Two", getBestDirToDelete(root, 3e7).size());