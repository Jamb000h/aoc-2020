import { readLinesToArray } from "../utils";

interface MaskBit {
  index: number;
  bit: string;
}

interface Instruction {
  mem: string;
  val: string;
}

const applyMaskToValue = (
  binaryValueStr: string,
  maskBitArray: MaskBit[]
): string => {
  const binaryStrCharArray = binaryValueStr.split("").reverse();
  maskBitArray.forEach((m) => {
    if (m.bit === "X") return;
    binaryStrCharArray[m.index] = m.bit;
  });

  return binaryStrCharArray.reverse().join("");
};

const parseMask = (str: string): string[] => {
  return str.slice(7).split("");
};

const maskToMaskBitArray = (strArray: string[]) => {
  return strArray.reverse().reduce((prev, cur, index) => {
    return [...prev, { index, bit: cur }];
  }, []);
};

const changeBitAtIndex = (
  binary: string,
  bit: string,
  index: number
): string => {
  return [...binary.slice(0, index), bit, ...binary.slice(index + 1)].join("");
};

const generateAddresses = (mask: string[], address: string): string[] => {
  let addresses = [address];
  mask.forEach((m, i) => {
    if (m === "0") return;
    if (m === "1")
      addresses = addresses.map((a) => changeBitAtIndex(a, "1", i));
    if (m === "X")
      addresses = addresses.reduce((prev, cur) => {
        return [
          ...prev,
          changeBitAtIndex(cur, "0", i),
          changeBitAtIndex(cur, "1", i),
        ];
      }, []);
  });

  return addresses;
};

const parseInstruction = (str: string): Instruction => {
  return {
    mem: Number(str.match(/\[(.*)\]/)[1])
      .toString(2)
      .padStart(36, "0"),
    val: Number(str.match(/= (.*)/)[1])
      .toString(2)
      .padStart(36, "0"),
  };
};

const part1 = (input: string[]): number => {
  const memory = {};
  let mask: MaskBit[];

  input.forEach((str) => {
    if (str.includes("mask")) {
      mask = maskToMaskBitArray(parseMask(str));
      return;
    }

    const ins = parseInstruction(str);
    const maskedInsVal = applyMaskToValue(ins.val, mask);
    memory[parseInt(ins.mem.replace("X", "0"), 2)] = maskedInsVal;
  });

  const memorySum = Object.keys(memory).reduce((prev, cur) => {
    return prev + parseInt(memory[cur], 2);
  }, 0);

  return memorySum;
};

const part2 = (input: string[]): number => {
  const memory = {};
  let mask: string[];

  input.forEach((str) => {
    if (str.includes("mask")) {
      mask = parseMask(str);
      return;
    }

    const ins = parseInstruction(str);
    const addresses = generateAddresses(mask, ins.mem);

    addresses.forEach((a) => {
      memory[a] = ins.val;
    });
  });

  const memorySum = Object.keys(memory).reduce((prev, cur) => {
    return prev + parseInt(memory[cur], 2);
  }, 0);

  return memorySum;
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
