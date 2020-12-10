import { readLinesToArray } from "../utils";

interface Node {
  value: number;
  sumOfParents: number;
  parents: Node[];
}

const inputToSortedNumbersWithZeroAndDevice = (input: string[]): number[] => {
  const sortedInput = input.map(Number).sort((a, b) => a - b);

  return [0, ...sortedInput, sortedInput[sortedInput.length - 1] + 3];
};

const numbersToNodes = (input: number[]): Node[] => {
  return input.map((value) => {
    return {
      value,
      sumOfParents: 0,
      parents: [],
    };
  });
};

const addParentsToNodes = (nodes: Node[]): Node[] => {
  const nodesClone = [...nodes];

  nodesClone.forEach((node, index) => {
    const possibleParents = nodes.slice(Math.max(0, index - 3), index);
    possibleParents.forEach((possibleParent) => {
      if (possibleParent.value >= node.value - 3) {
        node.parents.push(possibleParent);
      }
    });
  });

  return nodesClone;
};

const calculatePossibleRoutes = (nodes: Node[]): Node[] => {
  const nodesClone = [...nodes];
  // Starting node does not have parents set we can reach it
  // only by starting from there
  nodesClone[0].sumOfParents = 1;

  nodesClone.forEach((node) => {
    node.parents.forEach((parentNode) => {
      node.sumOfParents += parentNode.sumOfParents;
    });
  });

  return nodesClone;
};

const part1 = (input: string[]) => {
  const sortedInput = inputToSortedNumbersWithZeroAndDevice(input);
  const differences = sortedInput.reverse().reduce(
    (prev, cur, i) => {
      if (i === sortedInput.length) {
        return prev;
      }
      const difference = Math.abs(sortedInput[i + 1] - cur).toString();
      return {
        ...prev,
        [difference]: prev[difference] + 1,
      };
    },
    { "1": 0, "2": 0, "3": 0 }
  );
  return differences["1"] * differences["3"];
};

const part2 = (input: string[]) => {
  const sortedInput = inputToSortedNumbersWithZeroAndDevice(input);
  const inputNodes = numbersToNodes(sortedInput);
  const nodesWithParents = addParentsToNodes(inputNodes);
  const nodesWithPossibleRoutes = calculatePossibleRoutes(nodesWithParents);
  const lastNode = nodesWithPossibleRoutes[nodesWithPossibleRoutes.length - 1];
  return lastNode.sumOfParents;
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
