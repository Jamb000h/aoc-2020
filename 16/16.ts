import { readFile, sumOf } from "../utils";

interface Range {
  name: string;
  ranges: number[][];
  columns?: number[];
  column?: number;
}

const parseAllowedRanges = (input: string): Range[] => {
  return input.match(/[a-z]+.*:.*\-\d*/gm).map((range) => {
    return {
      name: range.split(":")[0],
      ranges: range
        .split(": ")[1]
        .split(" or ")
        .map((r) => r.split("-").map(Number)),
    };
  });
};

const parseTickets = (input: string): number[][] => {
  return input.match(/^\d.*/gm).map((ticket) => ticket.split(",").map(Number));
};

const calculateErrorRate = (tickets: number[][], ranges: Range[]): number => {
  return tickets.slice(1).reduce((errorRate, ticket) => {
    const invalidValues = ticket.filter((value) =>
      ranges.every((range) =>
        range.ranges.every((r) => value < r[0] || value > r[1])
      )
    );
    return errorRate + sumOf(invalidValues);
  }, 0);
};

const getValidTickets = (tickets: number[][], ranges: Range[]): number[][] => {
  return [
    tickets[0],
    ...tickets.slice(1).filter((ticket) => {
      return ticket.every((value) =>
        ranges.some((range) =>
          range.ranges.some((r) => value >= r[0] && value <= r[1])
        )
      );
    }),
  ];
};

const getPotentialColumns = (tickets: number[][], ranges: Range[]): Range[] => {
  return ranges.reduce((rangesWithColumns, range) => {
    const potentialColumns = [];
    for (let i = 0; i < tickets[0].length; i++) {
      if (
        tickets.every((ticket) =>
          range.ranges.some((r) => ticket[i] >= r[0] && ticket[i] <= r[1])
        )
      ) {
        potentialColumns.push(i);
      }
    }
    const rangeWithColumns = {
      name: range.name,
      ranges: JSON.parse(JSON.stringify(range.ranges)),
      columns: potentialColumns,
    };
    return [...rangesWithColumns, rangeWithColumns];
  }, []);
};

const getProperColumns = (ranges: Range[]): Range[] => {
  const usedColumns = {};
  ranges
    .sort((a, b) => a.columns.length - b.columns.length)
    .forEach((range) => {
      range.column = range.columns.find((column) => !usedColumns[column]);
      usedColumns[range.column] = true;
    });
  return ranges;
};

const part1 = (input: string): number => {
  const ranges = parseAllowedRanges(input);
  const tickets = parseTickets(input);
  const errorRate = calculateErrorRate(tickets, ranges);
  return errorRate;
};

const part2 = (input: string): number => {
  const ranges = parseAllowedRanges(input);
  const tickets = parseTickets(input);
  const validTickets = getValidTickets(tickets, ranges);
  const rangesWithPotentialTicketColumns = getPotentialColumns(
    validTickets,
    ranges
  );
  const rangesWithProperColumns = getProperColumns(
    rangesWithPotentialTicketColumns
  );
  const departureRanges = rangesWithProperColumns
    .filter((range) => range.name.includes("departure"))
    .map((range) => range.column);
  const ticketValue = departureRanges.reduce(
    (prev, departure) => prev * tickets[0][departure],
    1
  );

  return ticketValue;
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
