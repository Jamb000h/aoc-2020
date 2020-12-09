import { readLinesToArray } from "../utils";

const preambleLength = 25;

const isPairOfPrevious = (previous: number[], n: number) => {
  for (let i = 0; i < previous.length; i++) {
    for (let j = 0; j < previous.length; j++) {
      if (previous[i] + previous[j] === n) {
        return true;
      }
    }
  }

  return false;
};

const invalidNumber = (previous: number[], remaining: number[]) => {
  if (!isPairOfPrevious(previous, remaining[0])) {
    return remaining[0];
  }

  return invalidNumber(
    [...previous.slice(1, 25), remaining[0]],
    remaining.slice(1)
  );
};

const weakness = (input: number[], weakness: number) => {
  let sum = input[0];
  let lowerBound = 0;
  let upperBound = 0;
  while (true) {
    if (sum === weakness) {
      return input.slice(lowerBound, upperBound + 1);
    }

    if (sum < weakness) {
      upperBound++;
      sum += input[upperBound];
      continue;
    }

    sum -= input[lowerBound];
    lowerBound++;
  }
};

const part1 = (input: string[]) => {
  const preamble = input.slice(0, preambleLength);
  return invalidNumber(
    preamble.map(Number),
    input.slice(preambleLength).map(Number)
  );
};

const part2 = (input: string[]) => {
  const preamble = input.slice(0, preambleLength);
  const invalid = invalidNumber(
    preamble.map(Number),
    input.slice(preambleLength).map(Number)
  );
  const weaknessRange = weakness(input.map(Number), invalid);
  const weaknessMin = Math.min(...weaknessRange);
  const weaknessMax = Math.max(...weaknessRange);

  return weaknessMin + weaknessMax;
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
