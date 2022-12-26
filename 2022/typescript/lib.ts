export const runPart = (part: 'One' | 'Two', solutionFn: () => any) => {
  const start = Date.now();
  const result = solutionFn();
  const end = Date.now();
  console.log(`Part ${part}`, result, `took ${end - start}ms`);
}

/**
 * Arbitrary large dictionary / map implementation which can take up to 16'777'216 * 4'294'967'295 items.
 * Max size of a map in V8 is [2^24](https://stackoverflow.com/a/54466812) (16'777'216).
 * Max size of an array in V8 is [2^32 - 2](https://stackoverflow.com/a/28586666) (4'294'967'295).
 * It can take `object`s as keys natively, (because it's based on js Maps) but it's not recommended because of performance.
 * It's best to specify a key-type of `string` and hash your key manually, 
 * where the simplest - albeit slowest - way is to use `JSON.stringify(key)`.
 * Time complexity of all operations is around linear-time.
 * 
 * @export
 * @class Cachemap
 * @template K - Key type
 * @template V - Value type
 */
export class Cachemap<K, V> {
  private maps: Map<K, V>[] = [new Map()];
  public static readonly MAP_SIZE_LIMIT: number = 14_000_000;
  public has = (key: K) => this.maps.some(map => map.has(key));
  public get = (key: K) => this.maps.find(map => map.has(key))?.get(key);
  public size = () => this.maps.reduce((acc, map) => acc + map.size, 0);
  public put(key: K, value: V) {
    let map = this.maps.find(map => map.has(key));
    if (map) {
      map.set(key, value);
      return this;
    }

    map = this.maps[this.maps.length - 1];
    if (map.size > Cachemap.MAP_SIZE_LIMIT) {
      map = new Map();
      this.maps.push(map);
    }
    map.set(key, value);
    return this;
  }
  public delete = (key: K) => {
    const map = this.maps.find(map => map.has(key));
    if (map) {
      map.delete(key);
      if (map.size === 0) {
        this.maps = this.maps.filter(m => m !== map);
      }
      return true;
    }
    return false;
  }
  public keys = () => [].concat(...this.maps.map(map => [...map.keys()]));
  public values = () => [].concat(...this.maps.map(map => [...map.values()]));
  public items = () => [].concat(...this.maps.map(map => [...map.entries()]));
  public forEach = (callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void => this.maps.forEach(map => map.forEach(callbackfn, thisArg));
  public clear = () => {
    this.maps.forEach(map => map.clear());
    this.maps = [new Map()];
  }
}


/**
 * Dictionary / map implementation which can take up to around [8.3 million](https://stackoverflow.com/a/46051840) key-value pairs.
 * Object-based, which makes it [faster](https://stackoverflow.com/a/54385459) than a Js native Map, but it can only take `string`s as keys.
 * Uses `JSON.stringify` to hash keys by default, but you can specify your own hash / unhash function in the constructor.
 *
 * @export
 * @class Hashmap
 * @template K - Key type
 * @template V - Value type
 */
export class Hashmap<K, V> {
  private hashes: { [ key: string ]: V } = {};
  public constructor(
    private hash: (key: K) => string = JSON.stringify, 
    private unhash: (key: string) => K = JSON.parse)  {  }
  public put = (key: K, value: V) => this.hashes[this.hash(key)] = value;
  public has = (key: K): boolean => this.hashes[this.hash(key)] !== undefined;
  public get = (key: K): V => this.hashes[this.hash(key)];
  public items = (): [K, V][] => Object.entries(this.hashes).map(([k, v]) => [this.unhash(k), v]);
  public size = (): number => Object.keys(this.hashes).length;
} 

/**
 * See Hashmap for more info.
 *
 * @export
 * @class Hashset
 * @template K - Key type
 */
export class Hashset<K> {
  private hashes: { [ key: string ]: true } = {};
  public constructor(
    private hash: (key: K) => string = JSON.stringify,
    private unhash: (key: string) => K = JSON.parse) { }
  public put = (key: K) => this.hashes[this.hash(key)] = true;
  public has = (key: K): boolean => this.hashes[this.hash(key)] !== undefined;
  public remove = (key: K): boolean => delete this.hashes[this.hash(key)];
  public items = (): K[] => Object.keys(this.hashes).map(e => this.unhash(e));
  public size = (): number => Object.keys(this.hashes).length;
}

export const range = (from: number, to: number) => new Array(to-from).fill(0).map(_ => from++);