import { readLinesToArray } from "../utils";

// This approach treats the input as rows of binary numbers instead
// Simpler, faster and probably easier to understand

const seatIds = (input: string[]): number[] => {
  return input.map((seat) => {
    const seatAsBinary = seat.replace(/[FL]/g, "0").replace(/[BR]/g, "1");
    const row = parseInt(seatAsBinary.substring(0, 7), 2);
    const column = parseInt(seatAsBinary.substring(7), 2);

    return row * 8 + column;
  });
};

const part1 = (input: string[]) => {
  return Math.max(...seatIds(input));
};

const part2 = (input: string[]) => {
  const sortedSeatIds = seatIds(input).sort((a, b) => a - b);
  for (let i = 0; i < sortedSeatIds.length; i++) {
    if (sortedSeatIds[i] !== i + 7) return i + 7;
  }
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
