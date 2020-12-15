import { readFile } from "../utils";

const calculateNthNumber = (input: number[], rounds: number) => {
  const numbersSaid = new Array(rounds);
  input.forEach((n, i) => {
    numbersSaid[n] = i + 1;
  });
  let previousNumber = 0;
  for (let i = input.length + 2; i <= rounds; i++) {
    if (numbersSaid[previousNumber] === undefined) {
      numbersSaid[previousNumber] = i - 1;
      previousNumber = 0;
    } else {
      const difference = i - 1 - numbersSaid[previousNumber];
      numbersSaid[previousNumber] = i - 1;
      previousNumber = difference;
    }
  }
  return previousNumber;
};

const part1 = (input: string): number => {
  const rounds = 2020;
  const numbers = input.split(",").map(Number);
  return calculateNthNumber(numbers, rounds);
};

const part2 = (input: string): number => {
  const rounds = 30000000;
  const numbers = input.split(",").map(Number);
  return calculateNthNumber(numbers, rounds);
};

const data = readFile(__dirname + "/input.txt");
if (process.argv[2] !== "part2") {
  console.time("part1 duration");
  console.log("part1 solution:", part1(data));
  console.timeEnd("part1 duration");
}

if (process.argv[2] !== "part1") {
  console.time("part2 duration");
  console.log("part2 solution:", part2(data));
  console.timeEnd("part2 duration");
}
