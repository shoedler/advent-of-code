import * as fs from 'fs';

type Monkey = {
  id: number;
  startingItems: number[];
  operation: (old: number) => number;
  test: (value: number) => boolean;
  throwToIfTrue: number;
  throwToIfFalse: number;
  
  inspections: number;
}

const play = (type: 'P1' | 'P2', rounds: number) => {
  const monkeys = fs.readFileSync('input.txt', 'utf-8').split('\r\n\r\n')
    .map((monkeyDef, id) => {
      const [_, itemsDef, opDef, testDef, truthyDef, falsyDef] = monkeyDef.split('\r\n').map(line => line.trim());
      const startingItems = itemsDef.substring(itemsDef.indexOf(':') + 1).split(', ').map(Number);
      const operation = eval(`(old => ${opDef.substring(opDef.indexOf('=') + 2)})`);
      const test = eval(`(value => value % ${testDef.substring(testDef.indexOf('by') + 3)} === 0)`);
      const throwToIfTrue = Number(truthyDef.substring(truthyDef.indexOf('monkey') + 7));
      const throwToIfFalse = Number(falsyDef.substring(falsyDef.indexOf('monkey') + 7));
      return <Monkey>{ id, startingItems, operation, test, throwToIfTrue, throwToIfFalse, inspections: 0 };
    });

  for (let i = 0; i < rounds; i++) {    
    monkeys.forEach(monkey => {
      monkey.startingItems.forEach(item => {
        let worry = monkey.operation(item);
        worry = type === 'P1' ? Math.floor(worry / 3) : worry;
        
        const throwTarget = monkey.test(worry) ? monkey.throwToIfTrue : monkey.throwToIfFalse;
        monkeys[throwTarget].startingItems.push(worry);
        monkey.inspections++;
      });

      monkey.startingItems = [];
    });
  }

  const inspections = monkeys.map(monkey => monkey.inspections).sort((a, b) => b - a);
  const monkeyBusiness = inspections[0] * inspections[1];
  return monkeyBusiness;
}

console.log("Part One", play('P1', 20));
console.log("Part Two", play('P2', 10000));