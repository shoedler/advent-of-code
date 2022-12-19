import collections as c, itertools, re, functools

r = r'Valve (\w+) .*=(\d*); .* valves? (.*)'

VALVES = set() 
FLOW_RATES = dict()
APSP = c.defaultdict(lambda: 1000)

for valve, f, connections_str in re.findall(r, open('input.txt').read()): 
  VALVES.add(valve)

  if f != '0': 
    FLOW_RATES[valve] = int(f)

  for connection in connections_str.split(', '): 
    APSP[connection, valve] = 1

# Build APSP (Floyd-Warshall Algorithm)
for k in VALVES:
  for i in VALVES:
    for j in VALVES:
      APSP[i, j] = min(APSP[i, j], APSP[i, k] + APSP[k, j])

@functools.lru_cache(None)
def search(time, u = 'AA', flow_rates_ = frozenset(FLOW_RATES), e = False):
  max_flow_rate = 0

  # Iterate over all nodes in flow_rates_
  for v in flow_rates_:
    if APSP[u, v] < time:
      flow_rate = FLOW_RATES[v] * (time - APSP[u, v] - 1)
      flow_rate += search(time - APSP[u, v] - 1, v, flow_rates_ - {v}, e)
      max_flow_rate = max(max_flow_rate, flow_rate)

  if e:
    max_flow_rate = max(max_flow_rate, search(26, flow_rates_ = flow_rates_))
  else:
    max_flow_rate = max(max_flow_rate, 0)
  
  return max_flow_rate


print(str(search(30))) # 1460
print(str(search(26, e = True))) # 2117
