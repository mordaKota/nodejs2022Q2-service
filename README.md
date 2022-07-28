# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Running application with Docker
```
docker-compose up
```

## Generating Migrations
### 1. Delete volumes to remove the db if exists
```
docker-compose down --volumes
```
### 2. Run the application with Docker
```shell
docker-compose up
```
### 3. Generate migrations inside the docker container
```shell
docker-compose run main npm run migration:generate
```
The migration file should be created. 
### 4. Rebuild the dist folder in the container
```shell
docker-compose run npm run build
```
### 5. Run migrations
```shell
docker-compose run npm run migration:run
```


## Just running migration with the ready-file
```shell
docker-compose run npm run migration:run
```

## Vulnerability scanning for Docker local images
```
npm run scan:db
npm run scan:app
```

## Images in Docker Hub
https://hub.docker.com/r/bulatron/task7-application

https://hub.docker.com/r/bulatron/task7-database

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
