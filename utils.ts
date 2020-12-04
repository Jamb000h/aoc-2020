import { createInterface } from "readline";
import { createReadStream } from "fs";

export const readLinesToArray = async (filename: string) => {
  const data: string[] = [];

  const rl = createInterface({
    input: createReadStream(filename),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    data.push(line);
  }

  return data;
};

export const sumOf = (numbers: number[]) => {
  return numbers.reduce((x, y) => x + y, 0);
};

export const productOf = (numbers: number[]) => {
  return numbers.reduce((x, y) => x * y, 1);
};
