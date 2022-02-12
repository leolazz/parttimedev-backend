# PartTimeDev

## [Frontend Repository](https://github.com/leolazz/parttimedev-backend)

# Live Deployment: https://parttimedev.lazz.tech/

![screenshot](/images/parttimedev.png)

# Description:

PartTimeDev is a job board website made specifcally to help developers and related fields find part time work opportunities within the technology sector.

Built using Nestjs and puppeteer.

### Why I made this:

For my first project I used a simple, contrived idea in order to allow me to focus on the actual development process and patterns. Nonetheless, I spent much more time than was nessacary on the front-end design. Therefore, I wanted to tackle a more complex backend domain challenge, and limit myself to a simple front-end design.

- Rapidly learn a entirely new stack
  - TS & JS
  - Nestjs & Node
  - React
  - PostgresSQL
  - Puppeteer
- Focus on a greater backend domain challange
- Created a simple frontend focused soley on the business domain

### Constraints & Challenges:

- Learning to traverse the DOM using a headless browser
- Parsing the legality of scraping different sources
- Learning about device and browser fingerprints in order to:
  - Avoid bot detection, without any paid services
  - Employ preventative measures
- Making a stable, lightweight, and fast CRUD operation for deployment on a limited resource enviroment
- Dockerizing and deploying the backend with an instance of chromemium into a kubernetes cluster
- Complete the project as fast as possible

### Results:

- Learned a new stack and became more capable in it than my original
- Gained a clear enough mental model of the DOM to comfortable traverse a site in a headless enviroment
- Greatly improved my skill level in Dev-Ops technologies like Docker and Kubernetes

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
