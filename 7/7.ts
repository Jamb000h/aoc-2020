import { readLinesToArray, sumOf } from "../utils";

interface IContainedBag {
  name: string;
  amount: number;
}

interface IBag {
  name: string;
  contains: IContainedBag[];
}

const parseBag = (input: string): IBag => {
  const parts = input.match(/(.*)contain(.*)\./);
  const otherBags = parts[2];

  if (otherBags.trim() === "no other bags") {
    return {
      name: parts[1].trim(),
      contains: [],
    };
  }

  return {
    name: parts[1].trim(),
    contains: otherBags
      .trim()
      .split(",")
      .map((bag) => {
        return {
          name: bag
            .trim()
            .split(" ")
            .slice(1)
            .join(" ")
            .replace(/bag$/, "bags"),
          amount: Number(bag.trim().split(" ")[0]),
        };
      }),
  };
};

const recursiveCalculateInnerBags = (n: number, bag: IBag, bags: {}) => {
  if (bag.contains.length === 0) {
    return 0;
  }
  return (
    n *
    bag.contains.reduce((bagsTotal, currentBag) => {
      return (
        bagsTotal +
        currentBag.amount +
        recursiveCalculateInnerBags(
          currentBag.amount,
          bags[currentBag.name],
          bags
        )
      );
    }, 0)
  );
};

const part1 = (input: string[]) => {
  const bags = new Map<string, string[]>();
  // Map a bag to a list of its parents
  for (let i = 0; i < input.length; i++) {
    const bag = parseBag(input[i]);
    bag.contains.forEach((containedBag) => {
      if (bags.has(containedBag.name)) {
        bags.set(containedBag.name, [...bags.get(containedBag.name), bag.name]);
      } else {
        bags.set(containedBag.name, [bag.name]);
      }
    });
  }

  let canHoldShinyGoldBags = bags.get("shiny gold bags");
  let parentsToProcess = bags.get("shiny gold bags");
  while (parentsToProcess.length > 0) {
    if (bags.has(parentsToProcess[0])) {
      canHoldShinyGoldBags = [
        ...canHoldShinyGoldBags,
        ...bags.get(parentsToProcess[0]),
      ];
      parentsToProcess = [
        ...parentsToProcess.slice(1),
        ...bags.get(parentsToProcess[0]),
      ];
    } else {
      parentsToProcess = parentsToProcess.slice(1);
    }
  }

  return new Set(canHoldShinyGoldBags).size;
};

const part2 = (input: string[]) => {
  // Create an object bag names mapped to bag contents
  const bags = input.map(parseBag).reduce((currentBags, bag) => {
    return { ...currentBags, [bag.name]: bag };
  }, {});
  const bag = bags["shiny gold bags"];
  return recursiveCalculateInnerBags(1, bag, bags);
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
