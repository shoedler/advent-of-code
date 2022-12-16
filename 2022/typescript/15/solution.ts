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

    const isDistressBeacon = (vec: Vec): bigint | false => {
      const { x, y } = vec;

      if (x < 0 || x > 4e6 || y < 0 || y > 4e6)
        return false;

      if (isValidBeaconPosition(vec)) {
        return BigInt(x) * 4_000_000n + BigInt(y);
      }
    }

    let dy = ySensor;
    // left -> bottom (exclusive)
    for (let dx = (xSensor - nearestBeacon - 1); dx < xSensor; dx++) {
      var result = isDistressBeacon({ x: dx, y: dy-- });
      if (result)
        return result;
    }

    // left -> top (exclusive)
    dy = ySensor;
    for (let dx = (xSensor - nearestBeacon - 1); dx < xSensor; dx++) {
      var result = isDistressBeacon({ x: dx, y: dy++ });
      if (result)
        return result;
    }

    // right -> bottom (inclusive)
    dy = ySensor;
    for (let dx = (xSensor + nearestBeacon + 1); dx >= xSensor; dx--) {
      var result = isDistressBeacon({ x: dx, y: dy-- });
      if (result)
        return result;
    }

    // right -> top (inclusive)
    dy = ySensor;
    for (let dx = (xSensor + nearestBeacon + 1); dx >= xSensor; dx--) {
      var result = isDistressBeacon({ x: dx, y: dy++ });
      if (result)
        return result;
    }
  }
};

let t = Date.now();
const invalidPositions = invalidPositionsAtRow(2e6);
const invalidPoistionsTimeMs = Date.now() - t;

t = Date.now();
const freq = freqOfDistressBeacon();
const freqTimeMs =  Date.now() - t;

// Config i7-11800H @ 2.3Ghz, 32GB RAM node v16.13.2
console.log("Part One", invalidPositions, `took ${invalidPoistionsTimeMs}ms`); // 5125700 took 494ms
console.log("Part Two", freq, `took ${freqTimeMs}ms`); // 11379394658764n took 248ms