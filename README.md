# A-SAFE test app

## Installation instructions

This project uses `pnpm`. You must install it with:

`npm i -g pnpm`

After that you can install dependencies doing `pnpm install`

## Run unit tests

To run the unit tests execute the command `pnpm test`

## Run Cypress tests

To run the cypress tests you need two terminal windows. In one you run `pnpm run dev` to start the project. In the other you run `pnpm run cypress:open` to start the cypress tests. Because you don't have the env.local file with the API key some of the tests may fail.

## This project is deployed in https://cryptotrackerpro.netlify.app
