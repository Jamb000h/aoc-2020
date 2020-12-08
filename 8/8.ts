import { readLinesToArray } from "../utils";

enum Command {
  ACC = "acc",
  JMP = "jmp",
  NOP = "nop",
}

type Instruction = {
  command: string;
  value: number;
};

const parseInstruction = (instruction: string): Instruction => {
  const [command, value] = instruction.split(" ");
  return {
    command,
    value: Number(value),
  };
};

const toggleCommand = ({ command, value }: Instruction): Instruction => {
  const toggledCommand = command === Command.NOP ? "jmp" : "nop";
  return {
    command: toggledCommand,
    value,
  };
};

const part1 = (input: Instruction[]) => {
  let accumulator = 0;
  let pointer = 0;
  let visitedInstructionIndices = {};
  while (true) {
    if (visitedInstructionIndices[pointer]) {
      break;
    }
    if (pointer === input.length) {
      return { accumulator, pointer };
    }
    visitedInstructionIndices[pointer] = true;
    const { command, value } = input[pointer];
    switch (command) {
      case Command.NOP:
        pointer++;
        break;
      case Command.JMP:
        pointer += value;
        break;
      case Command.ACC:
        pointer++;
        accumulator += value;
        break;
      default:
        throw new Error("Invalid command");
    }
  }
  return { accumulator, pointer };
};

const part2 = (input: Instruction[]) => {
  let stackPointer = 0;
  while (true) {
    if (stackPointer === input.length) {
      return -1;
    }
    const { command, value } = input[stackPointer];
    switch (command) {
      case Command.NOP: {
        const inputClone = [...input];
        inputClone[stackPointer] = toggleCommand(input[stackPointer]);
        const { pointer, accumulator } = part1(inputClone);
        if (pointer === input.length) {
          return accumulator;
        }
        break;
      }
      case Command.JMP: {
        const inputClone = [...input];
        inputClone[stackPointer] = toggleCommand(input[stackPointer]);
        const { pointer, accumulator } = part1(inputClone);
        if (pointer === input.length) {
          return accumulator;
        }
        break;
      }
      case Command.ACC:
        break;
      default:
        throw new Error("Invalid command");
    }
    stackPointer++;
  }
};

readLinesToArray(__dirname + "/input.txt").then((inputData) => {
  if (process.argv[2] !== "part2") {
    console.time("part1 duration");
    console.log(
      "part1 solution:",
      part1(inputData.map(parseInstruction)).accumulator
    );
    console.timeEnd("part1 duration");
  }

  if (process.argv[2] !== "part1") {
    console.time("part2 duration");
    console.log("part2 solution:", part2(inputData.map(parseInstruction)));
    console.timeEnd("part2 duration");
  }
});
