import { readFile } from "../utils";

const part1 = (input: string): number => {
  const rounds = 2020;
  const numbers = input.split(",").map(Number);
  const numbersSaid = numbers.reduce((prev, cur, index) => {
    return { ...prev, [cur]: { last: index + 1, times: 1 } };
  }, {});
  let previousNumber = numbers[numbers.length - 1];
  for (let i = numbers.length + 1; i <= rounds; i++) {
    if (!numbersSaid[previousNumber]) {
      numbersSaid[previousNumber] = { last: i - 1, times: 1 };
      previousNumber = 0;
    } else {
      const difference = i - 1 - numbersSaid[previousNumber].last;
      numbersSaid[previousNumber].last = i - 1;
      previousNumber = difference;
    }
  }
  return previousNumber;
};

const part2 = (input: string): number => {
  return;
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
