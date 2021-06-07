import csv from "csv-parser";
import fs from "fs";
import iconv from "iconv-lite";

const file = process.argv[2];

const csvOptions = {
  skipLines: 37,
  separator: ";",
  mapHeaders: ({ header }) => header.substring(1).trim(),
};

const printCsv = (data) => {
  console.log(data.map((x) => `"${x}"`).join(";"));
};

const handleData = (data) => {
  if (!data["Tytuł"]) {
    return;
  }

  const [titleWithPlace, transactionDate = data["Data operacji"]] =
    data["Tytuł"].split("DATA TRANSAKCJI:");

  const [title, place = ""] = titleWithPlace.split("/");

  const description = [
    title,
    place,
    data["Opis operacji"],
    data["Nadawca/Odbiorca"],
  ]
    .map((str) => str.trim())
    .filter(Boolean)
    .join(" / ");

  const newData = [
    transactionDate.trim(),
    description,
    data["Kwota"].replaceAll(" ", ""),
    data["Saldo po operacji"].replaceAll(" ", ""),
  ];

  printCsv(newData);
};

printCsv(["Data transakcji", "Opis", "Kwota", "Saldo po operacji"]);

fs.createReadStream(file)
  .pipe(iconv.decodeStream("cp-1250"))
  .pipe(csv(csvOptions))
  .on("data", (data) => handleData(data));
