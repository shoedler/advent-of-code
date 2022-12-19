#include <iostream>
#include <fstream>
#include <sstream>
#include <regex>
#include <map>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <chrono>
#include <numeric>
#include <tuple>

using namespace std;

struct Price {
  uint16_t ore;
  uint16_t clay;
  uint16_t obsidian;
};

struct Blueprint {
  uint16_t id;
  Price ore_miner_cost;
  Price clay_miner_cost;
  Price obsidian_miner_cost;
  Price geode_cracker_cost;
};

vector<Blueprint> read_blueprints(const string& fileName) {
  vector<Blueprint> blueprints;

  ifstream input(fileName);
  string line;

  while (getline(input, line)) {
    smatch matches;
    regex pattern("Blueprint (\\d+): Each ore robot costs (\\d+) ore. Each clay robot costs (\\d+) ore. Each obsidian robot costs (\\d+) ore and (\\d+) clay. Each geode robot costs (\\d+) ore and (\\d+) obsidian.");
    regex_match(line, matches, pattern);
    if (matches.size() > 0) {
      Blueprint blueprint;
      blueprint.id = stoi(matches[1]);
      blueprint.ore_miner_cost.ore = stoi(matches[2]);
      blueprint.clay_miner_cost.ore = stoi(matches[3]);
      blueprint.obsidian_miner_cost.ore = stoi(matches[4]);
      blueprint.obsidian_miner_cost.clay = stoi(matches[5]);
      blueprint.geode_cracker_cost.ore = stoi(matches[6]);
      blueprint.geode_cracker_cost.obsidian = stoi(matches[7]);

      blueprints.push_back(blueprint);
    }
  }
  
  return blueprints;
}

map<tuple<uint16_t, uint16_t, uint16_t, uint16_t, uint16_t, uint16_t, uint16_t, uint16_t, uint16_t, uint16_t>, int> cache;

int run_blueprint(
  const Blueprint& blueprint, 
  uint16_t minutes, 
  uint16_t ore, 
  uint16_t clay,
  uint16_t obsidian,
  uint16_t geodes,
  uint16_t ore_miners,
  uint16_t clay_miners,
  uint16_t obsidian_miners,
  uint16_t geode_crackers
) {
  if (minutes <= 0) {
    return geodes;
  }

  const auto ore_costs = { blueprint.ore_miner_cost.ore, blueprint.clay_miner_cost.ore, blueprint.obsidian_miner_cost.ore, blueprint.geode_cracker_cost.ore };
  const auto max_ore_cost = max(ore_costs);

  // What's the point in having more ore-miners than any recipie requires? This will only bloat-up our cache
  if (ore_miners >= max_ore_cost) {
    ore_miners = max_ore_cost;
  }

  // Same for clay-miners
  if (clay_miners >= blueprint.obsidian_miner_cost.clay) {
    clay_miners = blueprint.obsidian_miner_cost.clay;
  }

  // And for obsidian-miners
  if (obsidian_miners >= blueprint.geode_cracker_cost.obsidian) {
    obsidian_miners = blueprint.geode_cracker_cost.obsidian;
  }

  // What's the point in hoarding more than we'll ever need? Clamp resources so we don't bloat up our cache
  const auto ore_cap = minutes * max_ore_cost - ore_miners * (minutes - 1);
  const auto clay_cap = minutes * blueprint.obsidian_miner_cost.clay - clay_miners * (minutes - 1);
  const auto obsidian_cap = minutes * blueprint.geode_cracker_cost.obsidian - obsidian_miners * (minutes - 1);

  if (ore >= ore_cap) {
    ore = ore_cap;
  }

  if (clay >= clay_cap) {
    clay = clay_cap;
  }

  if (obsidian >= obsidian_cap) {
    obsidian = obsidian_cap;
  }

  // Cache, or read from cache
  const auto cacheKey = make_tuple(blueprint.id, minutes, ore, clay, obsidian, geodes, ore_miners, clay_miners, obsidian_miners, geode_crackers);
  if (cache.size() % 1000000 == 0) {
    cout << ".";
  }

  if (cache.count(cacheKey) > 0) {
    return cache[cacheKey];
  }

  cache[cacheKey] = geodes;

  // Simulate
  auto most_geodes = 0;

  const auto can_buy_ore_miner = ore >= blueprint.ore_miner_cost.ore;
  const auto can_buy_clay_miner = ore >= blueprint.clay_miner_cost.ore;
  const auto can_buy_obsidian_miner = (ore >= blueprint.obsidian_miner_cost.ore && clay >= blueprint.obsidian_miner_cost.clay);
  const auto can_buy_geode_miner = (ore >= blueprint.geode_cracker_cost.ore && obsidian >= blueprint.geode_cracker_cost.obsidian);

  // Base case: Buy nothing -- only i we've currently not got enough reosources to buy any miner.
  auto q = 0;
  if (!(can_buy_clay_miner && can_buy_ore_miner && can_buy_obsidian_miner && can_buy_geode_miner)) {
    q = run_blueprint(blueprint,
      minutes - 1,
      ore + ore_miners,
      clay + clay_miners,
      obsidian + obsidian_miners,
      geodes + geode_crackers,
      ore_miners,
      clay_miners,
      obsidian_miners,
      geode_crackers);
    most_geodes = q > most_geodes ? q : most_geodes;
  }
  

  if (can_buy_geode_miner) {
    q = run_blueprint(blueprint,
      minutes - 1,
      ore - blueprint.geode_cracker_cost.ore + ore_miners,
      clay + clay_miners,
      obsidian - blueprint.geode_cracker_cost.obsidian + obsidian_miners,
      geodes + geode_crackers,
      ore_miners,
      clay_miners,
      obsidian_miners,
      geode_crackers + 1);
    most_geodes = q > most_geodes ? q : most_geodes;
  }

  if (can_buy_obsidian_miner) {
    q = run_blueprint(blueprint,
      minutes - 1,
      ore - blueprint.obsidian_miner_cost.ore + ore_miners,
      clay - blueprint.obsidian_miner_cost.clay + clay_miners,
      obsidian + obsidian_miners,
      geodes + geode_crackers,
      ore_miners,
      clay_miners,
      obsidian_miners + 1,
      geode_crackers);
    most_geodes = q > most_geodes ? q : most_geodes;
  }

  if (can_buy_clay_miner) {
    q = run_blueprint(blueprint,
      minutes - 1,
      ore - blueprint.clay_miner_cost.ore + ore_miners,
      clay + clay_miners,
      obsidian + obsidian_miners,
      geodes + geode_crackers,
      ore_miners,
      clay_miners + 1,
      obsidian_miners,
      geode_crackers);
    most_geodes = q > most_geodes ? q : most_geodes;
  }

  if (can_buy_ore_miner) {
    q = run_blueprint(blueprint,
      minutes - 1,
      ore - blueprint.ore_miner_cost.ore + ore_miners,
      clay + clay_miners,
      obsidian + obsidian_miners,
      geodes + geode_crackers,
      ore_miners + 1,
      clay_miners,
      obsidian_miners,
      geode_crackers);
    most_geodes = q > most_geodes ? q : most_geodes;
  }

  return most_geodes;
}

void part_one(vector<Blueprint> blueprints) {
  auto t1 = chrono::high_resolution_clock::now();

  vector<int> blueprint_qualitites;

  for (const Blueprint& blueprint : blueprints) {
    const auto geodes = run_blueprint(blueprint, 24, 0, 0, 0, 0, 1, 0, 0, 0);
    blueprint_qualitites.push_back(geodes * blueprint.id);
    cout << "\33[2K\r";
    cout << "Blueprint #" << +blueprint.id << " got " << geodes << " geodes in 24' and quality of " << (geodes * blueprint.id) << ". Current total: " << accumulate(blueprint_qualitites.begin(), blueprint_qualitites.end(), 0) << endl;
    cache.clear();
  }

  auto quality_sum = accumulate(blueprint_qualitites.begin(), blueprint_qualitites.end(), 0);

  auto t2 = chrono::high_resolution_clock::now();

  auto duration = chrono::duration_cast<chrono::milliseconds>(t2 - t1).count();

  cout << "Part One: " << quality_sum << " took " << duration << "ms" << endl;
}

void part_two(vector<Blueprint> blueprints) {
  auto t1 = chrono::high_resolution_clock::now();

  vector<int> blueprint_geodes;

  for (auto i = 0; i < 3; i++) {
    const auto blueprint = blueprints[i];
    const auto geodes = run_blueprint(blueprint, 32, 0, 0, 0, 0, 1, 0, 0, 0);
    blueprint_geodes.push_back(geodes);
    cout << "\33[2K\r";
    cout << "Blueprint #" << +blueprint.id << " got " << geodes << " geodes. Current product: " << accumulate(blueprint_geodes.begin(), blueprint_geodes.end(), 1, multiplies<uint16_t>()) << endl;
    cache.clear();
  }

  auto top_three_product = accumulate(blueprint_geodes.begin(), blueprint_geodes.end(), 1, multiplies<uint16_t>());

  auto t2 = chrono::high_resolution_clock::now();

  auto duration = chrono::duration_cast<chrono::milliseconds>(t2 - t1).count();

  cout << "Part Teo: " << top_three_product << " took " << duration << "ms" << endl;

}

int main() {
  vector<Blueprint> blueprints = read_blueprints("input.txt");

  part_one(blueprints); // Part One: 960 took 2195ms
  part_two(blueprints); // Part Two: 2040 took 9133ms

  return 0;
}