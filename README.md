<img src="https://github.com/shoedler/advent-of-code/assets/38029550/f6bd24af-060a-4762-806d-b01d310dee01" style="width: 70%; margin-left:auto; margin-right:auto; display:block;">

> Made with Fooocus!

# advent-of-code

My advent of code solutions

## TypeScript Solutions

### Prerequisites

- `node` ($\ge$ v16.13.1)
- `npm` ($\ge$ 8.1.2)

### Build & Run

- `npm i`
- `npm run start` to run all solutions of all years
- `npm run start -- <year>` to run all solutions of year _<year>_
- `npm run start -- <year> <day>` to run year _<year>_ day _<day>_ in dev-mode (/w hot-reloading). E.g. `$ npm run start -- 2022 1` runs year 2022 day 1 in dev mode

### Hindsight

Some Insights gathered from the 2022 Advent of Code.
Many problems including day 16 and 19 - if implemented in a dynamic-programming kind of way - required a lot of memory and sometimes millions of cache entries.
Js limitations for max sizes of `object`- and `Map` entries were frequently hit. My initial attempt to solve these problems was to use an `object` as a cache and manually hash keys if they needed to be `object`s themselves (Because native Js `object`s cannot take `object`s as keys).

In day 16 for example, this approach was merely enough to solve part one. Part two required a lot more cache entries and I've hit the limit pretty quickly. This was also pretty hard to debug, since
Node.js did not throw any errors, but just silently stopped adding new entries to the cache.
This was the reasons why I decided to implement some custom data structures.

### Data Structures

| Type       | Purpose                                                                                                                                                                                  | Background                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Cachemap` | Inteded to be used as a cache for extremely large amounts of data (> 16'777'216), where the key-type of the data is itself an `object`                                                   | It's based on an array of Js `Map`s. Worst case Time complexity is around linear-time.                                                                                                                                                                                                                                                                                                                                           |
| `Hashmap`  | Inteded to be used as a dictionary / cache for large amounts of data (< 8.3 million) which **needs to be accessed frequently** and where the key-type of the data is itself an `object`. | It uses `JSON.stringify` off the shelf, but you can specify custom hash and unhash functions in the constructor. Since it's based on an `object` it's extremely fast. [Faster even than a Js Map](https://stackoverflow.com/a/54385459). Keep in mind tough that the performance will drop depending on the size of a key and it's corresponding hash function. Worst case Time complexity is between constant- and linear-time. |
| `Hashset`  | Same as `Hashmap`, but without values. The need for this arose in day 23, where I needed a set of `object`s.                                                                             | Same as `Hashmap`.                                                                                                                                                                                                                                                                                                                                                                                                               |

See [lib.ts](https://github.com/shoedler/advent-of-code/blob/master/2022/typescript/lib.ts) for implementation.

## Rust Solutions

### Prerequisites

- `rustup` $\ge$ 1.25.1
- `rustc` $\ge$ 1.65.0
- `cargo` $\ge$ 1.65.0

### Build & Run

- `cd <day>`
- `cargo build`
- `cargo run`
