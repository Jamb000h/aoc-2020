import { readLinesToArray, averageOf } from "../utils";

const bsp = (input: string, range: [number, number]): number => {
  const takeLowerControlCharacters = ["F", "L"];
  const takeUppercontrolCharacters = ["B", "R"];

  if (input.length === 1) {
    if (takeLowerControlCharacters.includes(input.charAt(0))) {
      return range[0];
    }

    return range[1];
  }

  if (takeLowerControlCharacters.includes(input.charAt(0))) {
    return bsp(input.slice(1), [range[0], averageOf(range, true)]);
  }

  return bsp(input.slice(1), [averageOf(range), range[1]]);
};

const calculateSeats = (input: string[]) => {
  const seats = input.map((seatString) => {
    const row = bsp(seatString.substring(0, 7), [0, 127]);
    const seat = bsp(seatString.substring(7), [0, 7]);

    return {
      row: row,
      column: seat,
    };
  });

  return seats;
};

const calculateSeatId = ({ row, column }) => {
  return row * 8 + column;
};

const part1 = (input: string[]) => {
  return calculateSeats(input).reduce(
    (prev, cur) => Math.max(prev, calculateSeatId(cur)),
    0
  );
};

const part2 = (input: string[]) => {
  const sortedSeatIds = calculateSeats(input)
    .sort((a, b) => calculateSeatId(a) - calculateSeatId(b))
    .map(calculateSeatId);

  for (let i = 0; i < sortedSeatIds.length; i++) {
    if (sortedSeatIds[i] > 7 && sortedSeatIds[i + 1] > sortedSeatIds[i] + 1) {
      return sortedSeatIds[i] + 1;
    }
  }

  return -1;
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
