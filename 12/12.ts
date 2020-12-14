import { readLinesToArray } from "../utils";

interface State {
  x: number;
  y: number;
  dir: number;
}

interface StateWithWaypoint {
  shipX: number;
  shipY: number;
  wpX: number;
  wpY: number;
}

enum Command {
  N = "N",
  S = "S",
  E = "E",
  W = "W",
  L = "L",
  R = "R",
  F = "F",
}

const changeDir = (state, command, value): void => {
  if (command === Command.L) {
    state.dir = state.dir - value;
    if (state.dir < 0) {
      state.dir = 360 - (Math.abs(state.dir) % 360);
    }
  }

  if (command === Command.R) {
    state.dir = (state.dir + value) % 360;
    if (state.dir >= 360) {
      state.dir = state.dir % 360;
    }
  }
};

const moveForward = (state, value) => {
  switch (state.dir) {
    case 0:
      state.y = state.y + value;
      break;
    case 90:
      state.x = state.x + value;
      break;
    case 180:
      state.y = state.y - value;
      break;
    case 270:
      state.x = state.x - value;
      break;
    default:
      break;
  }
};

const moveQuadrantClockwise = (state: StateWithWaypoint): void => {
  const { wpX, wpY } = state;
  state.wpX = wpY;
  state.wpY = -1 * wpX;
};

const moveQuadrantCounterClockwise = (state: StateWithWaypoint): void => {
  const { wpX, wpY } = state;
  state.wpY = wpX;
  state.wpX = -1 * wpY;
};

const rotateWaypoint = (
  state: StateWithWaypoint,
  command: Command,
  value: number
): void => {
  const rotations = value / 90;
  for (let i = 0; i < rotations; i++) {
    if (command === Command.L) {
      moveQuadrantCounterClockwise(state);
    }

    if (command === Command.R) {
      moveQuadrantClockwise(state);
    }
  }
};

const moveTowardsWaypoint = (state: StateWithWaypoint, value): void => {
  state.shipX = state.shipX + value * state.wpX;
  state.shipY = state.shipY + value * state.wpY;
};

const moveWithWaypoint = (
  state: StateWithWaypoint,
  command: Command,
  value: number
): void => {
  switch (command) {
    case Command.N:
      state.wpY = state.wpY + value;
      break;
    case Command.S:
      state.wpY = state.wpY - value;
      break;
    case Command.E:
      state.wpX = state.wpX + value;
      break;
    case Command.W:
      state.wpX = state.wpX - value;
      break;
    case Command.L:
    case Command.R:
      rotateWaypoint(state, command, value);
      break;
    case Command.F:
      moveTowardsWaypoint(state, value);
      break;
    default:
      break;
  }
};

const move = (state: State, command: Command, value: number): void => {
  switch (command) {
    case Command.N:
      state.y = state.y + value;
      break;
    case Command.S:
      state.y = state.y - value;
      break;
    case Command.E:
      state.x = state.x + value;
      break;
    case Command.W:
      state.x = state.x - value;
      break;
    case Command.L:
    case Command.R:
      changeDir(state, command, value);
      break;
    case Command.F:
      moveForward(state, value);
      break;
    default:
      break;
  }
};

const parseInstruction = (instruction: string): [Command, number] => {
  const command = instruction.charAt(0) as Command;
  const value = Number(instruction.slice(1));

  return [command, value];
};

const part1 = (input: string[]): number => {
  const state = { x: 0, y: 0, dir: 90 };
  input.forEach((instruction, index) => {
    const [command, value] = parseInstruction(instruction);
    move(state, command, value);
  });
  return Math.abs(state.x) + Math.abs(state.y);
};

const part2 = (input: string[]) => {
  const state = { shipX: 0, shipY: 0, wpX: 10, wpY: 1 };
  input.forEach((instruction, index) => {
    const [command, value] = parseInstruction(instruction);
    moveWithWaypoint(state, command, value);
  });
  return Math.abs(state.shipX) + Math.abs(state.shipY);
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
