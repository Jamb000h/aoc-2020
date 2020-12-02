import { readLinesToArray, sumOf, productOf } from "../utils";

const targetSum = 2020;

const findSum = (
  numbers: number[],
  parts: number[],
  targetParts: number,
  targetSum: number
) => {
  if (parts.length === targetParts && sumOf(parts) === targetSum) {
    return parts;
  }

  if (parts.length === targetParts) {
    return;
  }

  if (sumOf(parts) >= targetSum) {
    return;
  }

  if (numbers.length === 0) {
    return;
  }

  for (let i = 0; i < numbers.length; i++) {
    const result = findSum(
      numbers.slice(i),
      [...parts, numbers[i]],
      targetParts,
      targetSum
    );
    if (result) {
      return result;
    }
  }
};

const part1 = (input: string[]) => {
  const numbers = [...new Set(input.map(Number))];
  const parts = findSum(numbers, [], 2, targetSum);
  return productOf(parts);
};

const part2 = (input: string[]) => {
  const numbers = [...new Set(input.map(Number))];
  const parts = findSum(numbers, [], 3, targetSum);
  return productOf(parts);
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
