import { readLinesToArray, productOf, sumOf } from "../utils";

const part1 = (input: string[]): number => {
  const earliestDeparture = Number(input[0]);
  const departures = input[1]
    .split(",")
    .filter((x) => x !== "x")
    .map(Number)
    .map((bus) => {
      return {
        id: bus,
        departure: Math.ceil(earliestDeparture / bus) * bus,
      };
    })
    .sort((a, b) => a.departure - b.departure);
  return (departures[0].departure - earliestDeparture) * departures[0].id;
};

const findReciprocal = (b: bigint, n: bigint, N: bigint): bigint => {
  if (((b * N) / n) % n === 1n) {
    return b;
  }

  return findReciprocal(b + 1n, n, N);
};

const part2 = (input: string[]) => {
  // Thanks https://fi.wikipedia.org/wiki/Kiinalainen_j%C3%A4%C3%A4nn%C3%B6slause
  const buses = input[1].split(",").reduce((prev, bus, index) => {
    if (bus === "x") {
      return prev;
    }
    return [
      ...prev,
      {
        id: BigInt(bus),
        index: BigInt(bus) - BigInt(index),
      },
    ];
  }, []);

  const N: bigint = buses
    .map((bus) => bus.id)
    .reduce((prev, cur) => prev * cur, 1n);

  const b: bigint[] = buses.map((bus) => {
    return findReciprocal(BigInt(1), bus.id, N);
  });

  const x = buses
    .map((bus, i) => {
      return (BigInt(bus.index % bus.id) - 1n) * b[i] * (N / bus.id);
    })
    .reduce((prev, cur) => prev + cur, 1n);

  return x % N;
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
