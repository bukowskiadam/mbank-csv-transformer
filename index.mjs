import csv from "csv-parser";
import fs from "fs";
import iconv from "iconv-lite";

import { rules } from "./rules-custom.mjs";

const file = process.argv[2];

const csvOptions = {
  skipLines: 37,
  separator: ";",
  mapHeaders: ({ header }) => header.substring(1).trim(),
};

const printCsv = (data) => {
  console.log(data.map((x) => `"${x}"`).join(";"));
};

const trimWhitespace = (str) => str.trim();

const parseCsvEntry = (data) => {
  const rawTitle = data["Tytuł"];
  if (!rawTitle) {
    return null;
  }

  const [titleWithPlace, transactionDate = data["Data operacji"]] = rawTitle
    .split("DATA TRANSAKCJI:")
    .map(trimWhitespace);

  const [title, place = ""] = titleWithPlace.split("/").map(trimWhitespace);

  const description = data["Opis operacji"].trim();

  const receipient = data["Nadawca/Odbiorca"].trim().replace(/ +/g, " ");

  const combinedDescription = [title, place, description, receipient]
    .map(trimWhitespace)
    .filter(Boolean)
    .join(" / ");

  const amount = data["Kwota"].replaceAll(" ", "");
  const balance = data["Saldo po operacji"].replaceAll(" ", "");

  return {
    combinedDescription,
    title,
    place,
    transactionDate,
    receipient,
    description,
    amount,
    balance,
  };
};

const processRules = (entry) => {
  if (!entry) {
    return null;
  }

  const matchingRule = rules.find((rule) => rule.matches(entry));

  if (matchingRule) {
    return matchingRule.apply(entry);
  }

  return entry;
};

const handleData = (data) => {
  const entry = processRules(parseCsvEntry(data));

  if (!entry) {
    return;
  }

  const newData = [
    entry.transactionDate,
    entry.finalDescription || entry.combinedDescription,
    entry.amount,
    entry.balance,
    entry.transferAccount || "Imbalance-PLN",
  ];

  printCsv(newData);
};

printCsv([
  "Data transakcji",
  "Opis",
  "Kwota",
  "Saldo po operacji",
  "Konto docelowe",
]);

fs.createReadStream(file)
  .pipe(iconv.decodeStream("cp-1250"))
  .pipe(csv(csvOptions))
  .on("data", (data) => handleData(data));
