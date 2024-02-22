# BScoring

## Install packages for running or testing

Use git clone to copy the library and `yarn` <https://yarnpkg.com/getting-started/install> to install the packages.

```sh
cd c:\Code

git clone https://github.com/michaelfarrelly/bscoring.git

cd bscoring

yarn
```

## Run code

To calculate the final score from a set of rolls, run the game via command line, with the following:

```sh
 yarn ts-node .\src\run.ts "[10,10,10,10,10,10,10,10,10,10,10,10]"
```

## Run tests

Tests are run via `vitest` package see <https://vitest.dev/>

To run all the tests, simply run:

```sh
yarn test
```
