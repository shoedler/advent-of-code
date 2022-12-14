export type X = number;
export type Y = number;
export type Vec = [X, Y];
export const X: X = 0;
export const Y: Y = 1;

/**
 * Absolute equality of two vectors
 * @returns ```js
 * => v1[X] === v2[X] && v1[Y] === v2[Y];
 * ```
 */
export const equals = (v1: Vec, v2: Vec) => v1[X] === v2[X] && v1[Y] === v2[Y];

/**
 * Absolute difference of X components
 * @returns ```js
 * => Math.abs(v1[X] - v2[X])
 * ```
 */
export const absDx = (v1: Vec, v2: Vec) => Math.abs(v1[X] - v2[X])

/**
 * Absolute difference of Y components
 * @returns ```js
 * => Math.abs(v1[Y] - v2[Y])
 * ```
 */
export const absDy = (v1: Vec, v2: Vec) => Math.abs(v1[Y] - v2[Y])