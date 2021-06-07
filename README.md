# mBank CSV transformer

Simple transformation to simplify import of transactions from mBank CSV file

1. Decode CP-1250 to UTF-8
2. Extract real transaction date from description
3. Merge several fields into one description field

## Installation

Node >= 15 is required because I used [`String.replaceAll`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll).

```
npm install
```

## Running

```
node index.mjs <input csv file> > <output csv file>
```
