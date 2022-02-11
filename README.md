# PartTimeDev-Backend

Frontend Repo: https://github.com/leolazz/parttimedev-frontend

Built with Nestjs and puppeteer.

PartTimeDev is a job board website made specifcally to help developers and other fields find part time work opportunities
within the technology sector.

# Live Deployment: https://parttimedev.lazz.tech/
![screenshot](/parttimedev.png)

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

## Docker

```
$ docker-compose up

```

## Kubernetes

```

# Create entry in your host file with the url on line 84 of dev.yaml
# If you do not have a postgres instance in your cluster apply the
# entire k8s folder to your cluster and configure the password on line 42 of dev.yaml

$ kubectl apply -f k8s/dev.yaml

```
