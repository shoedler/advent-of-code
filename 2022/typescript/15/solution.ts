import * as fs from 'fs';
type Vec = { x: number, y: number };
type VecD = Vec & { dist: number };

const report = fs.readFileSync('./input.txt', 'utf-8').split('\r\n')
  .map(line => {
    let [ left, right ] = line.split(': closest beacon is at ');

    const posSensor = /x=(-?\d+),\s+y=(-?\d+)/g.exec(left);
    const posBeacon = /x=(-?\d+),\s+y=(-?\d+)/g.exec(right);
    const beacon: Vec = { x: Number(posBeacon[1]), y: Number(posBeacon[2]) };
    const sensor: VecD = { x: Number(posSensor[1]), y: Number(posSensor[2]), dist: 0 }

    sensor.dist = Math.abs(beacon.x-sensor.x) + Math.abs(beacon.y-sensor.y);

    return { sensor, beacon };
  });

const sensors = report.map(r => r.sensor);
const beacons = report.map(r => r.beacon);

const isBeaconPosition = (testPos: Vec): boolean =>
  beacons.filter(({ x, y }) => x === testPos.x && y === testPos.y ).length > 0;

const isValidBeaconPosition = (testPos: Vec): boolean => {
  const { x, y} = testPos;

  return sensors.every(({ x: xSensor, y: ySensor, dist: nearestBeacon }) => {
    const testDist = Math.abs(x-xSensor) + Math.abs(y-ySensor);
    return (testDist > nearestBeacon); // Because if it's < or ==, it would've been the closest beacon of this sensor in the first place.
  })
}

const invalidPositionsAtRow = (yValue: number) => {
  let invalidPositions = 0;
  for (let x = -1_000_000; x < 5_000_000 * 2; x++) {
    if (!isValidBeaconPosition({ x, y: yValue }) && !isBeaconPosition({ x, y: yValue }))
      invalidPositions += 1;
  }
  return invalidPositions;
}

const freqOfDistressBeacon = (): bigint => {
  for (let i = 0; i < sensors.length; i++) {
    const { x: xSensor, y: ySensor, dist: nearestBeacon } = sensors[i];
  
    const border: Vec[] = [];
    
    let dy = ySensor;
    for (let dx = (xSensor - nearestBeacon - 1); dx < xSensor; dx++)  border.push({ x: dx, y: dy-- }); dy = ySensor; // left -> bottom (exclusive)
    for (let dx = (xSensor - nearestBeacon - 1); dx < xSensor; dx++)  border.push({ x: dx, y: dy++ }); dy = ySensor; // left -> top (exclusive)
    for (let dx = (xSensor + nearestBeacon + 1); dx >= xSensor; dx--) border.push({ x: dx, y: dy-- }); dy = ySensor; // right -> bottom (inclusive)
    for (let dx = (xSensor + nearestBeacon + 1); dx >= xSensor; dx--) border.push({ x: dx, y: dy++ });               // right -> top (inclusive)
  
    for (let j = 0; j < border.length; j++) {
      const { x, y } = border[j];
  
      if (x < 0 || x > 4e6 || y < 0 || y > 4e6) 
        continue;
      
      if (isValidBeaconPosition(border[j])) {
        return BigInt(x) * 4_000_000n + BigInt(y);
      }
    }
  }
};

console.log("Part One", invalidPositionsAtRow(2e6)); // 5125700
console.log("Part Two", freqOfDistressBeacon()); // 11379394658764

// ↓ This was used to find a smart way to build the square-border of a sensor with d+1 -- without luck 😂

// // Test data
// const xSensor = 3;
// const ySensor = 3;
// const nearestBeacon = 1;
// const border: {x: number, y:number}[] = [];

// // // Version 1
// // let dy = ySensor;
// // for (let dx = (xSensor - nearestBeacon - 1); dx < xSensor; dx++) border.push({ x: dx, y: dy-- });
// // dy = ySensor;
// // for (let dx = (xSensor - nearestBeacon - 1); dx < xSensor; dx++) border.push({ x: dx, y: dy++ });
// // dy = ySensor;
// // for (let dx = (xSensor + nearestBeacon + 1); dx >= xSensor; dx--) border.push({ x: dx, y: dy-- });
// // dy = ySensor;
// // for (let dx = (xSensor + nearestBeacon + 1); dx >= xSensor; dx--) border.push({ x: dx, y: dy++ });

// // Version 2
// for (let dx = (xSensor - nearestBeacon - 1); dx < xSensor; dx++) {
//   let dy = (dx - xSensor ) + ySensor;
//   border.push({ x: dx, y: ySensor - dy }, { x: dx, y: ySensor + dy });
// }

// // Version 3
// for (let dx = (xSensor + nearestBeacon + 1); dx >= xSensor; dx--) {
//   let dy = (dx - xSensor) + ySensor;
//   let dy2 = ySensor - (dx - xSensor);
//   border.push({ x: dx, y: dy }, { x: dx, y: dy2 });
// }

// // Print Manhattan Square
// let str = "";
// for (let y = 0; y <= 6; y++) {
//   for (let x = 0; x <= 6; x++) {
//     str += border.findIndex(b => b.x === x && b.y === y) == -1? '--' : '██';
//   }
//   str += '\n';
// }

// console.log(str);

