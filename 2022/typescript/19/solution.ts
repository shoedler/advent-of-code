import * as fs from 'fs';
import { runPart } from '../lib';
const { log } = console;

/* 
  This solution does probably work (for Part 1) but it's way too slow. 🐌 It'll probably take a few
  hours to solve part 1.
  Implemented the same approach with c++ (/2022/c++/19) which solves both parts in about 10s.
  Main issue is caching - it's extremely slow in js because we have to use strings as cache keys
*/

type Blueprint = { 
  id: number,
  oreRobotCost: { ore: number },
  clayRobotCost: { ore: number },
  obsidianRobotCost: { ore: number, clay: number },
  geodeRobotCost: { ore: number, obsidian: number } 
};

const blueprints: Blueprint[] = fs.readFileSync('./input.ext', 'utf-8').split('\r\n')
  .map(line => {
    const matches = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./.exec(line)

    return {
      id: Number(matches[1]),
      oreRobotCost: { ore: Number(matches[2]) },
      clayRobotCost: { ore: Number(matches[3]) },
      obsidianRobotCost: { ore: Number(matches[4]), clay: Number(matches[5]) },
      geodeRobotCost: { ore: Number(matches[6]), obsidian: Number(matches[7]) }
    }
  });

const cache: { [key: string]: number } = {};
const runBlueprint = (
  blueprint: Blueprint, 
  minutes: number, 
  ore: number,
  clay: number,
  obsidian: number,
  geodes: number,
  robotsOre: number,
  robotsClay: number,
  robotsObsidian: number,
  robotsGeodes: number): number => {

  if (minutes <= 0) {
    return geodes;
  };
  
  const maxOreCost = Math.max(...[blueprint.oreRobotCost.ore, blueprint.clayRobotCost.ore, blueprint.obsidianRobotCost.ore, blueprint.geodeRobotCost.ore]);

  // What's the point in having more ore-miners than any recipie requires? This will only bloat-up our cache
  if (robotsOre >= maxOreCost) 
    robotsOre = maxOreCost;

  // Same for clay-miners
  if (robotsClay >= blueprint.obsidianRobotCost.clay) 
    robotsClay = blueprint.obsidianRobotCost.clay;

  // And for obsidian-miners
  if (robotsObsidian >= blueprint.geodeRobotCost.obsidian) 
    robotsObsidian = blueprint.geodeRobotCost.obsidian;
  
  // What's the point in hoarding more than we'll ever need? Clamp resources so we don't bloat up our cache
  const oreCap = minutes * maxOreCost - robotsOre * (minutes - 1);
  const clayCap = minutes * blueprint.obsidianRobotCost.clay - robotsClay * (minutes - 1);
  const obsidianCap = minutes * blueprint.geodeRobotCost.obsidian - robotsObsidian * (minutes - 1);

  if (ore >= oreCap) 
    ore = oreCap;
  
  if (clay >= clayCap) 
    clay = clayCap;
  
  if (obsidian >= obsidianCap) 
    obsidian = obsidianCap;
  
  const cacheKey = `${blueprint.id}|${minutes}|${ore}|${clay}|${obsidian}|${geodes}|${robotsOre}|${robotsClay}|${robotsObsidian}|${robotsGeodes}`

  if (Object.keys(cache).length % 1_000 === 0) 
    log(cacheKey, geodes, Object.keys(cache).length)
  
  if (cache[cacheKey] !== undefined) 
    return cache[cacheKey]

  cache[cacheKey] = geodes

  let maxGeodes = 0;

  const canBuyOreRobot = ore >= blueprint.oreRobotCost.ore;
  const canBuyClayRobot = ore >= blueprint.clayRobotCost.ore;
  const canBuyObsidianRobot = (ore >= blueprint.obsidianRobotCost.ore && clay >= blueprint.obsidianRobotCost.clay);
  const canBuyGeodeRobot = (ore >= blueprint.geodeRobotCost.ore && obsidian >= blueprint.geodeRobotCost.obsidian);

  // Base case: Buy nothing -- skip this if we have enough to buy any robot
  if (!(canBuyOreRobot && canBuyClayRobot && canBuyObsidianRobot && canBuyGeodeRobot)) {
    const g = runBlueprint(blueprint, 
      minutes - 1, 
      ore + robotsOre,
      clay + robotsClay,
      obsidian + robotsObsidian,
      geodes + robotsGeodes,
      robotsOre,
      robotsClay,
      robotsObsidian,
      robotsGeodes);
    maxGeodes = g > maxGeodes ? g : maxGeodes;
  }

  if (canBuyGeodeRobot) {  
    const g = runBlueprint(blueprint, 
      minutes - 1, 
      ore - blueprint.geodeRobotCost.ore + robotsOre, 
      clay + robotsClay,
      obsidian - blueprint.geodeRobotCost.obsidian + robotsObsidian,
      geodes + robotsGeodes,
      robotsOre,
      robotsClay,
      robotsObsidian,
      robotsGeodes + 1);
    maxGeodes = g > maxGeodes ? g : maxGeodes;
  }

  if (canBuyObsidianRobot) {
    const g = runBlueprint(blueprint, 
      minutes - 1, 
      ore - blueprint.obsidianRobotCost.ore + robotsOre, 
      clay - blueprint.obsidianRobotCost.clay + robotsClay,
      obsidian + robotsObsidian,
      geodes + robotsGeodes,
      robotsOre,
      robotsClay,
      robotsObsidian + 1,
      robotsGeodes);
    maxGeodes = g > maxGeodes ? g : maxGeodes;
  }

  if (canBuyClayRobot) {
    const g = runBlueprint(blueprint, 
      minutes - 1, 
      ore - blueprint.clayRobotCost.ore + robotsOre, 
      clay + robotsClay,
      obsidian + robotsObsidian,
      geodes + robotsGeodes,
      robotsOre,
      robotsClay + 1,
      robotsObsidian,
      robotsGeodes);
    maxGeodes = g > maxGeodes ? g : maxGeodes;
  }

  if (canBuyOreRobot) {
    const g = runBlueprint(blueprint, 
      minutes - 1, 
      ore - blueprint.oreRobotCost.ore + robotsOre, 
      clay + robotsClay,
      obsidian + robotsObsidian,
      geodes + robotsGeodes,
      robotsOre + 1,
      robotsClay,
      robotsObsidian,
      robotsGeodes);
    maxGeodes = g > maxGeodes ? g : maxGeodes;
  }

  return maxGeodes;
}

// Setup: i7-1065H, 16GB RAM node v17.8.0
runPart("One", () => {
  const blueprintQualities = blueprints.map(b => runBlueprint(b, 24, 0, 0, 0, 0, 1, 0, 0, 0) * b.id)
  return blueprintQualities.reduce((a,b) => a + b, 0);
});