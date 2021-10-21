# PartTimeDev-Backend
Nestjs back end for Partimedev.Work

PartTimeDev is a job board website made specifcally to help developers other fields find part time work opportunities
within the technology sector. 

It built using puppeteer to scrape relevant jobs listings from California and Washington.

## Requirements

NestJs Requirement: Node.js (>= 10.13.0, except for v13)
Docker

## Installation

```bash
$ npm install
```
Add .env to the project root dir

Copy and past lines 1-5 from docker.env to the .env file

```bash
$ docker compose .
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

