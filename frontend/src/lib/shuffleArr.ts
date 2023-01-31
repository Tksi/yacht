export const shuffleArr = <T>(arr: T[]): T[] =>
  (arr.map((v) => [Math.random(), v]) as [number, T][])
    .sort(([a], [b]) => a - b)
    .map((v) => v[1]);
