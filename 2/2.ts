import { readLinesToArray } from "../utils";

interface IPasswordWithPolicy {
  policyMin: number;
  policyMax: number;
  policyLetter: string;
  password: string;
}

const parsePasswordAndPolicy = (
  passwordAndPolicy: string
): IPasswordWithPolicy => {
  const [policy, password] = passwordAndPolicy.split(":");
  const [policyBoundaries, policyLetter] = policy.split(" ");
  const [policyMin, policyMax] = policyBoundaries.split("-");

  return {
    policyMin: Number(policyMin),
    policyMax: Number(policyMax),
    policyLetter,
    password: password.trim(),
  };
};

const validatePasswordForSledRental = (
  passwordWithPolicy: IPasswordWithPolicy
) => {
  const policyLetterInPasswordTimes = passwordWithPolicy.password
    .split("")
    .filter((c) => c === passwordWithPolicy.policyLetter).length;

  return (
    policyLetterInPasswordTimes >= passwordWithPolicy.policyMin &&
    policyLetterInPasswordTimes <= passwordWithPolicy.policyMax
  );
};

const validatePasswordForNorthPoleTobogganRentalShop = (
  passwordWithPolicy: IPasswordWithPolicy
) => {
  let letterFoundTimes = 0;

  if (
    passwordWithPolicy.password.charAt(passwordWithPolicy.policyMin - 1) ===
    passwordWithPolicy.policyLetter
  ) {
    letterFoundTimes++;
  }

  if (
    passwordWithPolicy.password.charAt(passwordWithPolicy.policyMax - 1) ===
    passwordWithPolicy.policyLetter
  ) {
    letterFoundTimes++;
  }

  return letterFoundTimes === 1;
};

const part1 = (input: string[]) => {
  const passwordsWithPolicies = input.map(parsePasswordAndPolicy);
  const validPasswords = passwordsWithPolicies.filter(
    validatePasswordForSledRental
  );
  return validPasswords.length;
};

const part2 = (input: string[]) => {
  const passwordsWithPolicies = input.map(parsePasswordAndPolicy);
  const validPasswords = passwordsWithPolicies.filter(
    validatePasswordForNorthPoleTobogganRentalShop
  );
  return validPasswords.length;
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
