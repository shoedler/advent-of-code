import * as fs from 'fs';
import { Cachemap, runPart } from '../lib';

type Blueprint = { 
  id: number,
  oreRobotCost: { ore: number },
  clayRobotCost: { ore: number },
  obsidianRobotCost: { ore: number, clay: number },
  geodeRobotCost: { ore: number, obsidian: number } 
};

const blueprints: Blueprint[] = fs.readFileSync('./input.txt', 'utf-8').split('\r\n')
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

const cache: Cachemap<string, number> = new Cachemap();

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

  if (cache.has(cacheKey)) 
    return cache.get(cacheKey)

  cache.put(cacheKey, geodes);

  let mostGeodes = 0;

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
    mostGeodes = g > mostGeodes ? g : mostGeodes;
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
    mostGeodes = g > mostGeodes ? g : mostGeodes;
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
    mostGeodes = g > mostGeodes ? g : mostGeodes;
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
    mostGeodes = g > mostGeodes ? g : mostGeodes;
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
    mostGeodes = g > mostGeodes ? g : mostGeodes;
  }

  return mostGeodes;
}

// Setup: i7-1065H, 16GB RAM node v17.8.0
runPart("One", () => blueprints.map(b => runBlueprint(b, 24, 0, 0, 0, 0, 1, 0, 0, 0) * b.id).reduce((a, b) => a + b, 0)); // Part One: 960 took 8664ms
runPart("Two", () => blueprints.slice(0, 3).map(b => runBlueprint(b, 32, 0, 0, 0, 0, 1, 0, 0, 0)).reduce((a, b) => a * b, 1)); // Part One: 2160 took 17897ms;