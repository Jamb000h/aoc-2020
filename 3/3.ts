import { readLinesToArray, productOf } from "../utils";
interface Slope {
  x: number;
  y: number;
}

const rowHasTreeInWrappingIndex = (row: string, index: number) => {
  return row.charAt(index % row.length) === "#";
};

const findTreesInSlopes = (input: string[], slopes: Slope[]) => {
  const currentXs = new Array(slopes.length).fill(0);
  const trees = new Array(slopes.length).fill(0);
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < slopes.length; j++) {
      if (i % slopes[j].y === 0) {
        if (rowHasTreeInWrappingIndex(input[i], currentXs[j])) {
          trees[j]++;
        }
        currentXs[j] += slopes[j].x;
      }
    }
  }
  return trees;
};

const part1 = (input: string[]) => {
  const slopes = [{ x: 3, y: 1 }];
  return findTreesInSlopes(input, slopes)[0];
};

const part2 = (input: string[]) => {
  const slopes = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 5, y: 1 },
    { x: 7, y: 1 },
    { x: 1, y: 2 },
  ];
  return productOf(findTreesInSlopes(input, slopes));
};

readLinesToArray(__dirname + "/input.txt").then((inputData) => {
  if (process.argv[2] !== "part2") {
    console.time("part1 duration");
    console.log("part1 solution:", part1(inputData));
    console.timeEnd("part1 duration");
  }

  if (process.argv[2] !== "part1") {
    console.time("part2 duration");
    console.log("part2 solution:", part2(inputData));
    console.timeEnd("part2 duration");
  }
});
