export type X = number;
export type Y = number;
export type IntVec = [X, Y];
export const X: X = 0;
export const Y: Y = 1;

/**
 * Calculates the sumvector of two vecs. Returns a new vec.
 * @returns ```js
 * => [ v1[X] + v2[X], v1[Y] + v2[Y] ]
 * ```
 */
export const sum = (v1: IntVec, v2: IntVec): IntVec => [v1[X]+v2[X], v1[Y]+v2[Y]];

/**
 * Absolute difference of X components
 * @returns ```js
 * => Math.abs(v1[X] - v2[X])
 * ```
 */
export const absDx = (v1: IntVec, v2: IntVec) => Math.abs(v1[X] - v2[X])

/**
 * Subtract X components
 * @returns ```js
 * => v1[X] - v2[X]
 * ```
 */
export const diffX = (v1: IntVec, v2: IntVec) => v1[X] - v2[X]

/**
 * Absolute difference of Y components
 * @returns ```js
 * => Math.abs(v1[Y] - v2[Y])
 * ```
 */
export const absDy = (v1: IntVec, v2: IntVec) => Math.abs(v1[Y] - v2[Y])

/**
 * Sub Y components
 * @returns ```js
 * => v1[Y] - v2[Y]
 * ```
 */
export const diffY = (v1: IntVec, v2: IntVec) => v1[Y] - v2[Y]

/**
 * @returns Wether two vecs are on top, or directly next to each other
 */
export const sameOrNeighbor = (v1: IntVec, v2: IntVec) => (absDx(v1,v2) <= 1) && ((absDy(v1,v2)) <= 1);