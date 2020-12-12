import { readLinesToArray } from "../utils";

type Grid = SquareState[][];

enum SquareState {
  OCCUPIED = "#",
  EMPTY = "L",
  FLOOR = ".",
}

const inputToGrid = (rows: string[]): Grid => {
  return rows.map((columns): SquareState[] =>
    columns.split("").map(
      (column): SquareState => {
        return column as SquareState;
      }
    )
  );
};

const canBeOccupied = (row: number, column: number, grid: Grid): boolean => {
  const rowBeforeIndex = Math.max(0, row - 1);
  const rowAfterIndex = Math.min(grid.length - 1, row + 1);
  const columnBeforeIndex = Math.max(0, column - 1);
  const columnAfterIndex = Math.min(grid[row].length - 1, column + 1);

  for (
    let rowBefore = rowBeforeIndex;
    rowBefore <= rowAfterIndex;
    rowBefore++
  ) {
    for (
      let columnBefore = columnBeforeIndex;
      columnBefore <= columnAfterIndex;
      columnBefore++
    ) {
      if (rowBefore === row && columnBefore === column) {
        continue;
      }

      if (grid[rowBefore][columnBefore] === SquareState.OCCUPIED) {
        return false;
      }
    }
  }

  return true;
};

const cannotBeOccupiedAnymore = (
  row: number,
  column: number,
  grid: Grid
): boolean => {
  const rowBeforeIndex = Math.max(0, row - 1);
  const rowAfterIndex = Math.min(grid.length - 1, row + 1);
  const columnBeforeIndex = Math.max(0, column - 1);
  const columnAfterIndex = Math.min(grid[row].length - 1, column + 1);

  let occupiedAround = 0;
  for (
    let rowBefore = rowBeforeIndex;
    rowBefore <= rowAfterIndex;
    rowBefore++
  ) {
    for (
      let columnBefore = columnBeforeIndex;
      columnBefore <= columnAfterIndex;
      columnBefore++
    ) {
      if (rowBefore === row && columnBefore === column) {
        continue;
      }

      if (grid[rowBefore][columnBefore] === SquareState.OCCUPIED) {
        occupiedAround++;
      }
    }
  }

  return occupiedAround >= 4;
};

const gameOfSeats = (grid: Grid): Grid => {
  const gridClone = grid.map((row) => row.slice());
  let changed = false;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      const square = grid[row][column];
      if (square === SquareState.FLOOR) {
        continue;
      }

      if (square === SquareState.EMPTY) {
        if (canBeOccupied(row, column, grid)) {
          gridClone[row][column] = SquareState.OCCUPIED;
          changed = true;
        }
      }

      if (square === SquareState.OCCUPIED) {
        if (cannotBeOccupiedAnymore(row, column, grid)) {
          gridClone[row][column] = SquareState.EMPTY;
          changed = true;
        }
      }
    }
  }
  if (changed) {
    return gameOfSeats(gridClone);
  }
  return grid;
};

const countOccupied = (grid: Grid): number => {
  let occupied = 0;
  grid.forEach((row) =>
    row.forEach((column) => {
      if (column === SquareState.OCCUPIED) {
        occupied++;
      }
    })
  );
  return occupied;
};

const part1 = (input: string[]): number => {
  const grid = inputToGrid(input);
  const finalGrid = gameOfSeats(grid);
  const result = countOccupied(finalGrid);
  return result;
};

const part2 = (input: string[]) => {
  return;
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
