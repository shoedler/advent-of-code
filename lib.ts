import "node:process";

/**
 * Runs the specified function and logs its result, execution time, and heap usage to the console.
 *
 * @param {('One' | 'Two')} part - The part of the Advent of Code challenge being solved.
 * @param {Function} fn - The function to run.
 * @param {boolean} [showPerfInfo=false] - Whether to show detailed performance information in addition to the summary log.
 * @returns {void}
 */
export const runPart = (
  part: "One" | "Two",
  fn: () => any | Promise<any>,
  showPerfInfo: boolean = false
) => {
  const startNanoseconds = process.hrtime.bigint();
  const startHeapBytesUsed = process.memoryUsage().heapUsed;
  let value = fn() ?? "None";

  if (!(value instanceof Promise)) {
    value = Promise.resolve(value);
  }

  value.then((result: any) => {
    const endNanoseconds = process.hrtime.bigint();
    const endHeapBytesUsed = process.memoryUsage().heapUsed;

    const nanoseconds = Number(endNanoseconds - startNanoseconds);

    const duration = ((ns: number) => {
      const ms = ns / 1_000_000;

      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);
      const milliseconds = Math.floor(ms % 1000);
      const nanoseconds = ns % 1_000_000;

      return (
        (hours ? `${hours}h:` : "") +
        (minutes || hours ? `${minutes.toString().padStart(2, "0")}m:` : "") +
        (seconds || minutes || hours
          ? `${seconds.toString().padStart(2, "0")}s.`
          : "") +
        `${milliseconds.toString().padStart(3, "0")}ms.` +
        `${nanoseconds.toString().padStart(6, "0")}ns`
      );
    })(Math.floor(nanoseconds));

    const milliseconds = nanoseconds / 1_000_000;

    const heapBytesUsed = endHeapBytesUsed - startHeapBytesUsed;
    const heapMegabytesUsed = heapBytesUsed / 1_000_000;

    console.log(
      `Part ${part}: ${result} took ${milliseconds}ms, allocated ${heapMegabytesUsed}MB on the heap.`
    );

    if (showPerfInfo) {
      console.log({
        milliseconds,
        duration,
        heapBytesUsed,
        heapMegabytesUsed,
      });
    }
  });
};

/**
 * Executes a given function and returns its result, or a fallback value if the function throws an error.
 *
 * @export
 * @template T
 * @param {() => T} fn - The function to execute.
 * @param {T} fallback - The fallback value to return if the function throws an error.
 * @returns {T} The result of the function, or the fallback value if the function throws an error.
 */
export const tryOrDefault = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

/**
 * Creates an array of numbers in the specified range.
 *
 * @param {number} from - The start of the range. If greater than `to`, the range will be in descending order.
 * @param {number} to - The end of the range. If less than `from`, the range will be in descending order.
 * @returns {number[]}
 * @example
 * range(1, 5); // [1, 2, 3, 4, 5]
 * range(5, 1); // [5, 4, 3, 2, 1]
 */
export const range = (from: number, to: number) => {
  if (from > to) return new Array(from + 1 - to).fill(0).map((_) => from--);
  return new Array(to + 1 - from).fill(0).map((_) => from++);
};

/**
 * Array Extensions
 *
 */
declare global {
  interface Array<T> {
    /**
     * Executes the specified function for each element of the array and returns the array.
     * Does not modify the array. In-place.
     *
     * @template T
     * @param {(value: T, index: number, array: T[]) => void} callbackfn - The function to execute for each element.
     * @returns {T[]} The unchanged array.
     */
    tap(callbackfn: (value: T, index: number, array: T[]) => void): T[];

    /**
     * Returns the first `n` elements of the array, if `n>0`.
     * Othwise it returns the last `n` elements, but not in reverse order.
     * If `n` is greater than the length of the array, it returns the whole array.
     *
     * @template T
     * @param {number} n - The number of elements to take.
     * @returns {T[]} The array
     */
    take(n: number): T[];
  }
}

Array.prototype.tap = function <T>(
  callbackfn: (value: T, index: number, array: T[]) => void
): T[] {
  for (let i = 0; i < this.length; i++) {
    callbackfn(this[i], i, this);
  }
  return this;
};

Array.prototype.take = function <T>(n: number): T[] {
  if (n > 0) return this.slice(0, n);
  return this.slice(n);
};

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
  public has = (key: K) => this.maps.some((map) => map.has(key));
  public get = (key: K) => this.maps.find((map) => map.has(key))?.get(key);
  public size = () => this.maps.reduce((acc, map) => acc + map.size, 0);
  public put(key: K, value: V) {
    let map = this.maps.find((map) => map.has(key));
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
    const map = this.maps.find((map) => map.has(key));
    if (map) {
      map.delete(key);
      if (map.size === 0) {
        this.maps = this.maps.filter((m) => m !== map);
      }
      return true;
    }
    return false;
  };
  public keys = () => [].concat(...this.maps.map((map) => [...map.keys()]));
  public values = () => [].concat(...this.maps.map((map) => [...map.values()]));
  public items = () => [].concat(...this.maps.map((map) => [...map.entries()]));
  public forEach = (
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any
  ): void => this.maps.forEach((map) => map.forEach(callbackfn, thisArg));
  public clear = () => {
    this.maps.forEach((map) => map.clear());
    this.maps = [new Map()];
  };
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
  private hashes: { [key: string]: V } = {};
  public constructor(
    private hash: (key: K) => string = JSON.stringify,
    private unhash: (key: string) => K = JSON.parse
  ) {}
  public put = (key: K, value: V) => (this.hashes[this.hash(key)] = value);
  public has = (key: K): boolean => this.hashes[this.hash(key)] !== undefined;
  public get = (key: K): V => this.hashes[this.hash(key)];
  public items = (): [K, V][] =>
    Object.entries(this.hashes).map(([k, v]) => [this.unhash(k), v]);
  public values = (): V[] => Object.values(this.hashes);
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
  private hashes: { [key: string]: true } = {};
  public constructor(
    private hash: (key: K) => string = JSON.stringify,
    private unhash: (key: string) => K = JSON.parse
  ) {}
  public put = (key: K) => (this.hashes[this.hash(key)] = true);
  public has = (key: K): boolean => this.hashes[this.hash(key)] !== undefined;
  public remove = (key: K): boolean => delete this.hashes[this.hash(key)];
  public items = (): K[] => Object.keys(this.hashes).map((e) => this.unhash(e));
  public size = (): number => Object.keys(this.hashes).length;
}
