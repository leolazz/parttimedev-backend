# PartTimeDev

## [Frontend Repository](https://github.com/leolazz/parttimedev-backend)

# Live Deployment: https://parttimedev.lazz.tech/

![screenshot](/images/parttimedev.png)

# Description:

PartTimeDev is a job board website made specifcally to help developers and related fields find part time work opportunities within the technology sector.

Built using Nestjs and puppeteer.

### Why I made this:

For this project I was seeking a more robust and complex backend domain challenge that could actually become usable a product for the target audience, rather than just throw away a project. I aimed to create a front end that felt responsive, streamlined, and focused only on the business domain.

- Immersively & rapidly learn a entirely new stack
  - TS & JS
  - Nestjs & Node
  - React
  - PostgresSQL
  - Puppeteer
- Tackle a more complex backend domain challenge
- Limit myself to simple frontend focused solely on the business domain

### Constraints & Challenges:

- Changing dev environment from PC to Mac and from visual studio to VS code
- Learning to traverse the DOM using a headless browser
- Parsing the legality of scraping different sources
- Learning about device and browser fingerprints in order to:
  - Avoid bot detection, without any paid services
  - Employ preventative measures
- Optimizing the scraping C.R.U.D. operation to be stable, lightweight, and fast in a deployment on a limited resource environment
- Dockerize and deploying the backend with an instance of chromium into a kubernetes cluster

### Results:

In addition to learning a new stack, becoming more capable and comfortable in it than my original, I improved my mental model of the DOM in order to traverse it in a headless environment, and greatly improved my skill level in Dev-Ops technologies like <strong>Docker</strong> and <strong>Kubernetes</strong>.

## Requirements

NestJs Requirement: Node.js (>= 10.13.0, except for v13)

Docker

## Installation

```bash
$ npm install
```

## .env

# create a .env file with the folowing variables

```
DATABASE_USER=postgres
POSTGRES_PASSWORD=pass123
DATABASE_NAME=parttimedev
DATABASE_PORT=5432
DATABASE_HOST=localhost
```

## Running the app

```bash
# ! An instance of PostgresSQL is required !

# Comment out the api portion of docker-compose.yml and start the container for use in development

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

# Create entry in your host file with the url on line 84 of local.yaml
# If you do not have a postgres instance in your cluster apply the
# entire k8s folder to your cluster and configure the password on line 42 of local.yaml

$ kubectl apply -f k8s/local.yaml


```
