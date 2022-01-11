# PartTimeDev-Backend

Nestjs back end for Partimedev.Work

PartTimeDev is a job board website made specifcally to help developers and other fields find part time work opportunities
within the technology sector.

It is built using puppeteer to scrape relevant jobs listings from California and Washington.

## Requirements

NestJs Requirement: Node.js (>= 10.13.0, except for v13)

Docker

## Installation

```bash
$ npm install
```

## .env

create a .env file with the folowing variables

```
DATABASE_USER=
POSTGRES_PASSWORD=
DATABASE_NAME=
DATABASE_PORT=

// running in a container using the docker-compose.yaml
DATABASE_HOST=db

// local development
DATABASE_HOST=localhost
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

## Docker

```
$ docker-compose up


    build:
      context: .
      target: development
      dockerfile: ./Dockerfile
```

## Kubernetes

```
$ kubectl apply -f /kubernetes

// if localhost:8001 displays 'hello world!' the backend deployment is up.
$ kubectl -n default port-forward svc/parttimedev-backend-service 8001:80

$



```
