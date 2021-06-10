# mBank CSV transformer

Apply transformations to simplify import of transactions from mBank CSV file

1. Decode CP-1250 to UTF-8
2. Extract real transaction date from description
3. Merge several fields into one description field
4. Apply rules to assign expense category and final description

## Installation

Node >= 15 is required because I used [`String.replaceAll`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll).

```
npm install
```

Copy sample rules file and adjust it to your needs.
```
cp rules-sample.mjs rules-custom.mjs
```

If you don't need rules then just export empty rules array from `rules-custom.mjs` file:
```js
export const rules = [];
```

## Running

```
node index.mjs <input csv file> > <output csv file>
```
