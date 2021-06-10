import { simpleDescriptionRule } from "./rules.mjs";

/*

Only first matching rule is applied!

*/

// USING BUILT-IN HELPER

// description includes word "piekarnia"
const piekarnia = simpleDescriptionRule(
  /piekarnia/i,
  "Expenses:Groceries",
  "piekarnia"
);

// description includes x or y - can match transactions from different stores
const lody = simpleDescriptionRule(
  /(lav inwestycje|good lood)/i,
  "Expenses:Junk Food",
  "lody"
);

// description includes both "polecenie", then later "firma" - matching just parts of the description
const polecenie = simpleDescriptionRule(
  /polecenie.*firma/i,
  "Expenses:Phone",
  "firma faktura"
);

// CUSTOM RULE SAMPLE

// if negative amount then make it positive and prepend :wink: to the final description
const customRule = {
  matches: (entry) => entry.amount[0] === "-", // negative amount
  apply: (entry) => ({
    ...entry,
    amount: entry.amount.substring(1), // remove '-' sign
    finalDescription: `:wink: ${entry.combinedDescription}`, // prepend :wink:
  }),
};

export const rules = [piekarnia, lody, polecenie, customRule];
