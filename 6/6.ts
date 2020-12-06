import { readFile, sumOf } from "../utils";

const part1 = (input: string) => {
  return sumOf(
    input
      .split("\r\n\r\n")
      .map((group) => group.split("\r\n"))
      .map((group) => group.join(""))
      .map((group) => new Set(group))
      .map((groupSet) => groupSet.size)
  );
};

const part2 = (input: string) => {
  return sumOf(
    input
      .split("\r\n\r\n")
      .map((group) => group.split("\r\n"))
      .map((group) => {
        return group.reduce((commonAnswers, answers) => {
          const regex = new RegExp(`[${answers}]`, "g");
          const matches = commonAnswers.match(regex);
          return matches !== null ? matches.join("") : "";
        }, group[0]);
      })
      .map((commonAnswers) => commonAnswers.split(""))
      .map((commonAnswers) => new Set(commonAnswers))
      .map((commonAnswers) => commonAnswers.size)
  );
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
