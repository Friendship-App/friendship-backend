# backend-kit

[![Greenkeeper badge](https://badges.greenkeeper.io/FruitieX/backend-kit.svg)](https://greenkeeper.io/)

## Documentation

- [Setup](/docs/SETUP.md)
- [Deployment](/docs/DEPLOYMENT.md)
- [Architecture](/docs/ARCHITECTURE.md)
- [TODO](/docs/TODO.md)
- Live route documentation after running the project at /docs

## Tech stack

This is a sample Node.js backend to get you started with the following stack quickly:

* [hapi.js](https://hapijs.com/), a server framework for Node.js
* [knex](http://knexjs.org/), SQL query builder

### Misc

* [lodash](https://lodash.com/), various useful JavaScript utils

### Tools

* [babel](https://babeljs.io/), transpile ES6 syntax into ES5
* [eslint](http://eslint.org/), make sure your code is remotely sane, using [Airbnb's JS style guide](https://github.com/airbnb/javascript)
* [jest](https://facebook.github.io/jest/), painless JavaScript testing

### Docker 

#### For initial build(wipe db and populate it and launch server) :
    docker-compose build
    docker-compose up

#### For launching server without wiping db:
    
 
#### When shutting down server use:
    docker-compose down   

### DB
yarn db:init
