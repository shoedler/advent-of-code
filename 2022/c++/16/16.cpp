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

map<uint64_t, int8_t> flow_rates;
map<uint64_t, uint64_t> tunnels;
map<string, uint64_t> valve_ids;

void read_valves(const string& fileName) {
  ifstream input(fileName);
  string line;
  auto valve_ctr = 1ull;

  struct valvedef {
    string id;
    int8_t flow_rate;
	  vector<string> tunnels;
    uint64_t id_bitmask;
  };

  vector<valvedef> valve_defs;
	
  while (getline(input, line)) {
    smatch matches;
    regex pattern("Valve ([A-Z]+) has flow rate=(\\d+); tunnels? leads? to valves? ([A-Z, ]+)");
    regex_match(line, matches, pattern);

    if (matches.size() > 0) {
      auto valve_id = matches[1].str();
      auto flow_rate = (int8_t)stoi(matches[2].str());
      auto tunnel_ids = matches[3].str();

      istringstream tunnel_idss(tunnel_ids);
      vector<string> tunnels;
        
      string tunnel_id;
      while (getline(tunnel_idss, tunnel_id, ',')) {
        // trim the tunnel_id
        tunnel_id.erase(remove_if(tunnel_id.begin(), tunnel_id.end(), ::isspace), tunnel_id.end());
        tunnels.push_back(tunnel_id);
      }

      valve_ids[valve_id] = valve_ctr;
      valve_defs.push_back({ valve_id, flow_rate, tunnels, valve_ctr });
      valve_ctr <<= 1;
      }
    }
    
    for (const auto& v : valve_defs) {
    flow_rates[v.id_bitmask] = v.flow_rate;

    auto valve_tunnes = 0ull;
    for (const auto& t : v.tunnels) {
      valve_tunnes |= valve_ids[t];
	  }

    tunnels[v.id_bitmask] = valve_tunnes;
  }

#ifdef _DEBUG
  for (const auto& v : valve_defs) {
    cout << "Valve " << v.id << " should have tunnels: ";
    for (const auto& t : v.tunnels) {
      cout << t << " ";
    }
    
    cout << endl;
    cout << "Tunnels from bitmask:         ";
    auto valve_tunnels = tunnels[v.id_bitmask];
    
    for (auto i = 0; i < 64; i++) {
      const auto tunnel = 1ull << i;
      if ((valve_tunnels & tunnel) != 0) {
        for (const auto& v : valve_defs) {
          if (v.id_bitmask == tunnel) {
            cout << v.id << " ";
          }
        }
      }
    }

    cout << endl;
  }
#endif
}

map<tuple<uint64_t, uint64_t, int8_t, uint8_t>, int64_t> cache;

int64_t max_relief(uint64_t valve, uint64_t opened_valves, int8_t minutes, uint8_t type) {
  if (minutes <= 0) {
    return type == 1 ? 0 : max_relief(valve, opened_valves, 26, 1);
  }

  const auto cache_key = make_tuple(valve, opened_valves, minutes, type);
  if (cache.find(cache_key) != cache.end()) {
    return cache[cache_key];
  }

  auto max_reliefed = 0ull;
  const auto valve_tunnels = tunnels[valve];
  const auto valve_flowrate = flow_rates[valve];
  
  if (valve_flowrate > 0 && (opened_valves & valve) == 0) {
    const auto valve_relief = valve_flowrate * (minutes - 1);
    opened_valves |= valve;

    for (auto i = 0; i < 64; i++) {
      const auto tunnel = 1ull << i;
      if ((valve_tunnels & tunnel) != 0) {
        const auto reliefed = valve_relief + max_relief(tunnel, opened_valves, minutes - 2, type);
        max_reliefed = reliefed > max_reliefed ? reliefed : max_reliefed;
      }
    }
  }
  
  for (auto i = 0; i < 64; i++) {
    const auto tunnel = 1ull << i;
    if ((valve_tunnels & tunnel) != 0) {
      const auto reliefed = max_relief(tunnel, opened_valves, minutes - 1, type);
      max_reliefed = reliefed > max_reliefed ? reliefed : max_reliefed;
    }
  }

  cache[cache_key] = max_reliefed;
  return max_reliefed;
}

void part_one() {
  auto t1 = chrono::high_resolution_clock::now();
  const auto max_reliefed_pressure = max_relief(valve_ids["AA"], {}, 30, 1);
  auto t2 = chrono::high_resolution_clock::now();
  auto duration = chrono::duration_cast<chrono::milliseconds>(t2 - t1).count();

  cout << "Part One: " << max_reliefed_pressure << " took " << duration << "ms" << endl;
}

void part_two() {
  auto t1 = chrono::high_resolution_clock::now();
  const auto max_reliefed_pressure_with_elephant = max_relief(valve_ids["AA"], {}, 26, 2);
  auto t2 = chrono::high_resolution_clock::now();
  auto duration = chrono::duration_cast<chrono::milliseconds>(t2 - t1).count();

  cout << "Part Two: " << max_reliefed_pressure_with_elephant << " took " << duration << "ms" << endl;
}

int main() {
  read_valves("input.txt");

  part_one(); // 1460 took 727ms
  part_two(); // 2348 took 4107ms but it should be 2117.

  return 0;
}
