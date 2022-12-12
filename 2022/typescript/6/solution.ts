import * as fs from 'fs';

const buf = fs.readFileSync('./input.txt', 'utf-8').split('');

const firstNonUniqueChunkOfSize = (size: number) => 
  buf.findIndex((_, i) => 
    buf.slice(i, i + size)
      .every((char, index, chunk) => 
        chunk.indexOf(char) === index)) + size
        
console.log("Part One", firstNonUniqueChunkOfSize(4));
console.log("Part One", firstNonUniqueChunkOfSize(14));