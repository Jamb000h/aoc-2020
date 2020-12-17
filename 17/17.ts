import { readLinesToArray } from "../utils";

enum CubeState {
  ACTIVE = "#",
  INACTIVE = ".",
}

const range = (start: number, end: number): number[] => {
  const numbers = [];
  for (let i = start; i <= end; i++) {
    numbers.push(i);
  }
  return numbers;
};

const getNeighborCoordinates = (
  y: number,
  x: number,
  z: number
): number[][] => {
  const yRange = range(y - 1, y + 1);
  const xRange = range(x - 1, x + 1);
  const zRange = range(z - 1, z + 1);
  const coordinates = [];

  for (let ny = yRange[0]; ny <= yRange[yRange.length - 1]; ny++) {
    for (let nx = xRange[0]; nx <= xRange[xRange.length - 1]; nx++) {
      for (let nz = zRange[0]; nz <= zRange[zRange.length - 1]; nz++) {
        if (ny === y && nx === x && nz === z) continue;
        coordinates.push([ny, nx, nz]);
      }
    }
  }

  return coordinates;
};

const getNeighborCoordinates4D = (
  y: number,
  x: number,
  z: number,
  w: number
): number[][] => {
  const yRange = range(y - 1, y + 1);
  const xRange = range(x - 1, x + 1);
  const zRange = range(z - 1, z + 1);
  const wRange = range(w - 1, w + 1);
  const coordinates = [];

  for (let ny = yRange[0]; ny <= yRange[yRange.length - 1]; ny++) {
    for (let nx = xRange[0]; nx <= xRange[xRange.length - 1]; nx++) {
      for (let nz = zRange[0]; nz <= zRange[zRange.length - 1]; nz++) {
        for (let nw = wRange[0]; nw <= wRange[wRange.length - 1]; nw++) {
          if (ny === y && nx === x && nz === z && nw === w) continue;
          coordinates.push([ny, nx, nz, nw]);
        }
      }
    }
  }

  return coordinates;
};

const createPocket = (size: number): CubeState[][][] => {
  const pocket = new Array(size);
  for (let y = 0; y < size; y++) {
    pocket[y] = new Array(size);
    for (let x = 0; x < size; x++) {
      pocket[y][x] = new Array<CubeState>(size).fill(CubeState.INACTIVE);
    }
  }
  return pocket;
};

const createPocket4D = (size: number): CubeState[][][][] => {
  const pocket = new Array(size);
  for (let y = 0; y < size; y++) {
    pocket[y] = new Array(size);
    for (let x = 0; x < size; x++) {
      pocket[y][x] = new Array(size);
      for (let z = 0; z < size; z++) {
        pocket[y][x][z] = new Array<CubeState>(size).fill(CubeState.INACTIVE);
      }
    }
  }
  return pocket;
};

const part1 = (input: string[]): number => {
  let pocket: CubeState[][][] = createPocket(41);
  input.forEach((row, y) => {
    row
      .split("")
      .map((cube) => cube as CubeState)
      .forEach((cube, x) => {
        pocket[y + 19][x + 19][21] = cube;
      });
  });
  let oldPocket = JSON.parse(JSON.stringify(pocket));
  let newPocket = JSON.parse(JSON.stringify(pocket));
  // 6 Rounds
  for (let i = 1; i <= 6; i++) {
    // For all cubes
    for (let y = 1; y < oldPocket.length - 1; y++) {
      for (let x = 1; x < oldPocket[y].length - 1; x++) {
        for (let z = 1; z < oldPocket[y][x].length - 1; z++) {
          const neighborCoordinates = getNeighborCoordinates(y, x, z);
          const activeNeighbors = neighborCoordinates.filter((n) => {
            return oldPocket[n[0]][n[1]][n[2]] === CubeState.ACTIVE;
          }).length;

          if ((oldPocket[y][x][z] as CubeState) === CubeState.ACTIVE) {
            if (activeNeighbors < 2 || activeNeighbors > 3) {
              newPocket[y][x][z] = CubeState.INACTIVE;
            }
          }

          if ((oldPocket[y][x][z] as CubeState) === CubeState.INACTIVE) {
            if (activeNeighbors === 3) {
              newPocket[y][x][z] = CubeState.ACTIVE;
            }
          }
        }
      }
    }
    oldPocket = JSON.parse(JSON.stringify(newPocket));
  }
  let sum = 0;
  for (let y = 0; y < newPocket.length; y++) {
    for (let x = 0; x < newPocket[y].length; x++) {
      for (let z = 0; z < newPocket[y][x].length; z++) {
        if (newPocket[y][x][z] === CubeState.ACTIVE) {
          sum++;
        }
      }
    }
  }

  return sum;
};

const part2 = (input: string[]): number => {
  let pocket: CubeState[][][][] = createPocket4D(41);
  input.forEach((row, y) => {
    row
      .split("")
      .map((cube) => cube as CubeState)
      .forEach((cube, x) => {
        pocket[y + 19][x + 19][21][21] = cube;
      });
  });
  let oldPocket = JSON.parse(JSON.stringify(pocket));
  let newPocket = JSON.parse(JSON.stringify(pocket));
  // 6 Rounds
  for (let i = 1; i <= 6; i++) {
    // For all cubes
    for (let y = 1; y < oldPocket.length - 1; y++) {
      for (let x = 1; x < oldPocket[y].length - 1; x++) {
        for (let z = 1; z < oldPocket[y][x].length - 1; z++) {
          for (let w = 1; w < oldPocket[y][x][z].length - 1; w++) {
            const neighborCoordinates = getNeighborCoordinates4D(y, x, z, w);
            const activeNeighbors = neighborCoordinates.filter((n) => {
              return oldPocket[n[0]][n[1]][n[2]][n[3]] === CubeState.ACTIVE;
            }).length;

            if ((oldPocket[y][x][z][w] as CubeState) === CubeState.ACTIVE) {
              if (activeNeighbors < 2 || activeNeighbors > 3) {
                newPocket[y][x][z][w] = CubeState.INACTIVE;
              }
            }

            if ((oldPocket[y][x][z][w] as CubeState) === CubeState.INACTIVE) {
              if (activeNeighbors === 3) {
                newPocket[y][x][z][w] = CubeState.ACTIVE;
              }
            }
          }
        }
      }
    }
    oldPocket = JSON.parse(JSON.stringify(newPocket));
  }
  let sum = 0;
  for (let y = 0; y < newPocket.length; y++) {
    for (let x = 0; x < newPocket[y].length; x++) {
      for (let z = 0; z < newPocket[y][x].length; z++) {
        for (let w = 0; w < newPocket[y][x][z].length; w++) {
          if (newPocket[y][x][z][w] === CubeState.ACTIVE) {
            sum++;
          }
        }
      }
    }
  }
  return sum;
};

readLinesToArray(__dirname + "/input.txt").then((data) => {
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
});
