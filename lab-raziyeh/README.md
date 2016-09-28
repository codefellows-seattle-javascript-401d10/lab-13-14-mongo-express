# Mongo-Express
=============
Writing a REST API using Bluebird Promises.
structures :


- lib
    - parse-json.js
    - parse-url.js
    - storage.js
    - router.js
    - response.js : a module for define responses (JSON / TEXT) from server.
- model
    - person.js
- route
    - person-route.js
- test
    - person-route-test.js
- data
    - schemaName (example:person)
        - JSON files - created with POST request
- root 
    - server.js
    - gulpfile.js
    - .gitignore
    - .eslintrc
    - README.md

## Getting Started
- In terminal enter : node server.js 
- also you can run gulp 
- for run tests in terminal enter:
    - gulp  OR
    - mocha


### Prerequisities

- dependencies: 

```
npm install --save node-uuid superagent bluebird mkdirp-bluebird del 

```

- devDependencies: 
  
```
npm install -D gulp-eslint gulp-mocha mocha gulp chai

```

## Running

- In your root server, type in the command **"node server.js"** in your terminal.
- OR in terminal type: gulp


- GET request: 
    ```http localhost:3000/api/person?id=selectedId ```

- POST request: 
    ```echo '{"name":"yourname", "sex":"female/male"}' | http POST localhost:3000/api/person ```

- DELETE request: 
    ```http DELETE localhost:3000/api/person?id=selectedId ```

## Testing:
- we have 6 tests for GET and POST requests :
    - test to ensure that  API returns a status code of 404 for routes that have not been registered
    - tests to ensure that **/api/person** endpoint responds as described for each condition below:
        - GET - test 404, responds with 'not found' for valid request made with an id that was not found
        - GET - test 400, responds with 'bad request' if no id was provided in the request
        - GET - test 200, response body like {<data>} for a request made with a valid id
        - POST - test 400, responds with 'bad request' for if no body provided or invalid body
        - POST - test 200, response body like {<data>} for a post request with a valid body
        - DELETE - test 204

## Built With:
* Nodejs
* JavaScript
* Visual studio code 3 

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## Authors

* **Raziyeh Bazargan** - [Github](https://github.com/RaziyehBazargan)

## License

This project is licensed under the ISC License.

