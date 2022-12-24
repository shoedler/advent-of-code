export const runPart = (part: 'One' | 'Two', solutionFn: () => any) => {
  const start = Date.now();
  const result = solutionFn();
  const end = Date.now();
  console.log(`Part ${part}`, result, `took ${end - start}ms`);
}

export class Hashmap<K, V> {
  private hashes: { [ key: string ]: V } = {};
  public put = (key: K, value: V) => this.hashes[JSON.stringify(key)] = value;
  public has = (key: K): boolean => this.hashes[JSON.stringify(key)] !== undefined;
  public get = (key: K): V => this.hashes[JSON.stringify(key)];
  public items = (): [K, V][] => Object.entries(this.hashes).map(([k, v]) => [JSON.parse(k), v]);
  public size = (): number => Object.keys(this.hashes).length;
} 

export class Hashset<K> {
  private hashes: { [ key: string ]: true } = {};
  public put = (key: K) => this.hashes[JSON.stringify(key)] = true;
  public has = (key: K): boolean => this.hashes[JSON.stringify(key)] !== undefined;
  public remove = (key: K): boolean => delete this.hashes[JSON.stringify(key)];
  public items = (): K[] => Object.keys(this.hashes).map(e => JSON.parse(e));
  public size = (): number => Object.keys(this.hashes).length;
}

export const range = (from: number, to: number) => new Array(to-from).fill(0).map(_ => from++);