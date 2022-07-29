# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/get-started/)
## Clone Repo

```
git clone https://github.com/mordaKota/nodejs2022Q2-service.git
```

## Install NPM modules

```
npm install
```

## Run App

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Start App with Docker
```
docker-compose up
```

## Generate Migrations
```shell
# 1. Delete volumes to remove the db if exists
docker-compose down --volumes

# 2. Run the DB with Docker
docker-compose up -d postgres

# 3. Generate migrations inside the docker container
docker-compose run main npm run migration:generate
```

## Run Migrations

```shell
# 1. Run the application with Docker
docker-compose up
# 2. Run migrations
docker-compose run main npm run migration:run
```

## Run App without Migrations (DataSource Synchronize)

```shell
# 1. Change DB_SYNCHRONISE=true in the .env file
# 2. Run the application with Docker
docker-compose up
```

## Build Images with DockerHub

```shell
# 1. App Image for DockerHub
docker build . -f docker/application/Dockerfile -t bulatron/task7-application
# 2. DB Image for DockerHub
docker build . -f docker/database/Dockerfile -t bulatron/task7-database
```

## Vulnerability Scanning
```shell
npm run scan:db
npm run scan:app
```

## Images in Docker Hub
https://hub.docker.com/r/bulatron/task7-application

https://hub.docker.com/r/bulatron/task7-database

## Testing

After application running open new terminal and enter:

```shell
# To run all tests without authorization
npm run test
# To run only one of all test suites
npm run test -- <path to suite>
# To run all test with authorization
npm run test:auth
# To run only specific test suite with authorization
npm run test:auth -- <path to suite>
```

## Auto-fix and format

```shell
# Lint
npm run lint
# Format
npm run format
```
