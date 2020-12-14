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

const canBeOccupied2 = (grid: any, square: any): boolean => {
  let canBeOccupied = true;
  square.visibleNodes.forEach((node) => {
    if (grid[node.y][node.x].value === SquareState.OCCUPIED) {
      canBeOccupied = false;
    }
  });

  return canBeOccupied;
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

const cannotBeOccupiedAnymore2 = (grid: any, square: any): boolean => {
  let occupiedAround = 0;
  square.visibleNodes.forEach((node) => {
    if (grid[node.y][node.x].value === SquareState.OCCUPIED) {
      occupiedAround++;
    }
  });

  return occupiedAround >= 5;
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

const addNearestVisibleSeats = (grid: any) => {
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      const visibleNodes = [];
      const diagonalDifference = row - column;
      const antidiagonalSum = row + column;
      // diagonal before
      let diagonalBefore = undefined;
      grid.slice(0, row).forEach((innerRow, innerRowIndex) => {
        innerRow.forEach((innerColumn, innerColumnIndex) => {
          let innerDiagonalDifference = innerRowIndex - innerColumnIndex;
          if (innerDiagonalDifference === diagonalDifference) {
            if (innerRow[innerColumnIndex].value !== SquareState.FLOOR) {
              diagonalBefore = { x: innerColumnIndex, y: innerRowIndex };
            }
          }
        });
      });
      if (diagonalBefore) visibleNodes.push(diagonalBefore);
      // diagonal after
      let diagonalAfter = undefined;
      grid.slice(row + 1).forEach((innerRow, innerRowIndex) => {
        innerRow.forEach((innerColumn, innerColumnIndex) => {
          if (diagonalAfter) return;
          let innerDiagonalDifference =
            innerRowIndex + row + 1 - innerColumnIndex;
          if (innerDiagonalDifference === diagonalDifference) {
            if (innerRow[innerColumnIndex].value !== SquareState.FLOOR) {
              diagonalAfter = {
                x: innerColumnIndex,
                y: innerRowIndex + row + 1,
              };
            }
          }
        });
      });
      if (diagonalAfter) visibleNodes.push(diagonalAfter);
      // antidiagonal before
      let antidiagonalBefore = undefined;
      grid.slice(0, row).forEach((innerRow, innerRowIndex) => {
        innerRow.forEach((innerColumn, innerColumnIndex) => {
          let innerAntidiagonalSum = innerRowIndex + innerColumnIndex;
          if (innerAntidiagonalSum === antidiagonalSum) {
            if (innerRow[innerColumnIndex].value !== SquareState.FLOOR) {
              antidiagonalBefore = { x: innerColumnIndex, y: innerRowIndex };
            }
          }
        });
      });
      if (antidiagonalBefore) visibleNodes.push(antidiagonalBefore);
      // antidiagonal after
      let antidiagonalAfter = undefined;
      grid.slice(row + 1).forEach((innerRow, innerRowIndex) => {
        innerRow.forEach((innerColumn, innerColumnIndex) => {
          if (antidiagonalAfter) return;
          let innerAntidiagonalSum = innerRowIndex + row + 1 + innerColumnIndex;
          if (innerAntidiagonalSum === antidiagonalSum) {
            if (innerRow[innerColumnIndex].value !== SquareState.FLOOR) {
              antidiagonalAfter = {
                x: innerColumnIndex,
                y: innerRowIndex + row + 1,
              };
            }
          }
        });
      });
      if (antidiagonalAfter) visibleNodes.push(antidiagonalAfter);
      // column before
      let columnBefore = undefined;
      grid.slice(0, row).forEach((innerRow, index) => {
        if (innerRow[column].value !== SquareState.FLOOR) {
          columnBefore = { x: column, y: index };
        }
      });
      if (columnBefore) visibleNodes.push(columnBefore);
      // column after
      let columnAfter = undefined;
      grid.slice(row + 1).forEach((innerRow, index) => {
        if (!columnAfter && innerRow[column].value !== SquareState.FLOOR) {
          columnAfter = { x: column, y: index + row + 1 };
        }
      });
      if (columnAfter) visibleNodes.push(columnAfter);
      // row before
      let rowBefore = undefined;
      grid[row].slice(0, column).forEach((square, index) => {
        if (square.value !== SquareState.FLOOR) {
          rowBefore = { x: index, y: row };
        }
      });
      if (rowBefore) visibleNodes.push(rowBefore);
      // row after
      let rowAfter = undefined;
      grid[row].slice(column + 1).forEach((square, index) => {
        if (!rowAfter && square.value !== SquareState.FLOOR) {
          rowAfter = { x: column + index + 1, y: row };
        }
      });
      visibleNodes.push(rowAfter);

      grid[row][column].visibleNodes = visibleNodes.filter(
        (node) => node !== undefined
      );
    }
  }
};

const gameOfSeats2 = (grid: any): any => {
  const gridClone = grid.map((row) =>
    row
      .slice()
      .map((x) => ({ value: x.value, visibleNodes: [...x.visibleNodes] }))
  );
  let changed = false;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      const square = grid[row][column];
      if (square.value === SquareState.FLOOR) {
        continue;
      }

      if (square.value === SquareState.EMPTY) {
        if (canBeOccupied2(grid, square)) {
          gridClone[row][column].value = SquareState.OCCUPIED;
          changed = true;
        }
      }

      if (square.value === SquareState.OCCUPIED) {
        if (cannotBeOccupiedAnymore2(grid, square)) {
          gridClone[row][column].value = SquareState.EMPTY;
          changed = true;
        }
      }
    }
  }
  if (changed) {
    return gameOfSeats2(gridClone);
  }
  return grid;
};

const part1 = (input: string[]): number => {
  const grid = inputToGrid(input);
  const finalGrid = gameOfSeats(grid);
  const result = countOccupied(finalGrid);
  return result;
};

const part2 = (input: string[]) => {
  const grid = inputToGrid(input).map((x) => x.map((r) => ({ value: r })));
  addNearestVisibleSeats(grid);
  const result = gameOfSeats2(grid);
  const occupied = result
    .reduce((prev, cur) => [...prev, ...cur], [])
    .filter((x) => x.value === SquareState.OCCUPIED);
  return occupied.length;
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
