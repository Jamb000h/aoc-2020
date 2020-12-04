import { readLinesToArray } from "../utils";

const requiredKeys = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

enum IECL {
  amb = "amb",
  blu = "blu",
  brn = "brn",
  gry = "gry",
  grn = "grn",
  hzl = "hzl",
  oth = "oth",
}

type Passport = {
  byr: any; // (Birth Year) - four digits; at least 1920 and at most 2002.
  iyr: any; // (Issue Year) - four digits; at least 2010 and at most 2020.
  eyr: any; // (Expiration Year) - four digits; at least 2020 and at most 2030.
  hgt: any; // (Height) - a number followed by either cm or in:
  // If cm, the number must be at least 150 and at most 193.
  // If in, the number must be at least 59 and at most 76.
  hcl: any; // (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
  ecl: any; // - exactly one of: amb blu brn gry grn hzl oth.
  pid: any; // (Passport ID) - a nine-digit number, including leading zeroes.
  cid?: any; // (Country ID) - ignored, missing or not.
};

const isValidBYR = (byr: string) => {
  const nBYR = Number(byr);
  return nBYR >= 1920 && nBYR <= 2002;
};

const isValidIYR = (iyr: string) => {
  const nIYR = Number(iyr);
  return nIYR >= 2010 && nIYR <= 2020;
};

const isValidEYR = (eyr: string) => {
  const nEYR = Number(eyr);
  return nEYR >= 2020 && nEYR <= 2030;
};

const isValidHGT = (hgt: string) => {
  const [hgtValue, hgtUnit] = hgt.split(/(cm|in)/);
  const nHGT = Number(hgtValue);
  if (hgtUnit === "cm") {
    return nHGT >= 150 && nHGT <= 193;
  }
  return nHGT >= 59 && nHGT <= 76;
};

const isValidHCL = (hcl: string) => {
  return hcl.trim().match(/^#[a-f0-9]{6}$/) !== null;
};

const isValidECL = (ecl: string) => {
  return ecl in IECL;
};

const isValidPID = (pid: string) => {
  return pid.trim().match(/^[0-9]{9}$/) !== null;
};

const isPassport = (obj: any): obj is Passport => {
  return requiredKeys.every((key) => obj[key] !== undefined);
};

const isValidPassport = (obj: any) => {
  if (isPassport(obj)) {
    return (
      isValidBYR(obj.byr) &&
      isValidIYR(obj.iyr) &&
      isValidEYR(obj.eyr) &&
      isValidHGT(obj.hgt) &&
      isValidHCL(obj.hcl) &&
      isValidECL(obj.ecl) &&
      isValidPID(obj.pid)
    );
  }

  return false;
};

const parseInputIntoOneLiners = (input: string[]): string[] => {
  let passportsStrings = [];
  let currentPassportString = "";
  // Parse passport paragraphs into one-liners => "aaa:bbb ccc:ddd ..."
  for (let i = 0; i < input.length; i++) {
    currentPassportString += input[i] + " ";
    if (input[i].indexOf(":") === -1 || i === input.length - 1) {
      passportsStrings.push(currentPassportString);
      currentPassportString = "";
      continue;
    }
  }
  return passportsStrings;
};

const parseLineIntoObject = (input: string): Object =>
  input
    .trim()
    .split(" ")
    .map((keyValueString: string) => keyValueString.split(":"))
    .reduce(
      (prev, keyValuePair: [string, string]) => ({
        ...prev,
        [keyValuePair[0]]: keyValuePair[1],
      }),
      {}
    );

const parseInputIntoObjects = (input: string[]): Object[] =>
  // Parse passport one-liners into actual objects
  parseInputIntoOneLiners(input).map((passport) =>
    parseLineIntoObject(passport)
  );

const part1 = (input: string[]) => {
  const parsedPassports = parseInputIntoObjects(input);
  return parsedPassports.filter((passport) => isPassport(passport)).length;
};

const part2 = (input: string[]) => {
  const parsedPassports = parseInputIntoObjects(input);
  return parsedPassports.filter((passport) => isValidPassport(passport)).length;
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
