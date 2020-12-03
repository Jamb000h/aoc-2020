import { readLinesToArray, productOf } from "../utils";

const rowHasTreeInRepeatingIndex = (row: string, index: number) => {
  return row.charAt(index % row.length) === "#";
};

const part1 = (input: string[]) => {
  let x = 0;
  let trees = 0;
  for (let i = 0; i < input.length; i += 1) {
    if (rowHasTreeInRepeatingIndex(input[i], x)) {
      trees++;
    }
    x += 1;
  }
  return trees;
};

const part2 = (input: string[]) => {
  const slopeYs = [1, 1, 1, 1, 2];
  const slopeXs = [1, 3, 5, 7, 1];
  const currentXs = [0, 0, 0, 0, 0];
  const trees = [0, 0, 0, 0, 0];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < currentXs.length; j++) {
      if (i % slopeYs[j] === 0) {
        if (rowHasTreeInRepeatingIndex(input[i], currentXs[j])) {
          trees[j]++;
        }
        currentXs[j] += slopeXs[j];
      }
    }
  }
  return productOf(trees);
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
