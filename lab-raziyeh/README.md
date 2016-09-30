# Mongo-Express - double resource express/mongo api
=============

structures :

- lib
    - error-middleware.js
    - page-middleware.js
- model
    - customer.js
    - order.js
- route
    - customer-route.js
    - order-route.js
- test
    - customer-route-test.js
    - order-route-test.js
- db
 
- root 
    - server.js
    - gulpfile.js
    - .gitignore
    - .eslintrc
    - README.md

## Getting Started
- In terminal enter : npm start
- also you can run gulp 
- for run tests in terminal enter:
    - gulp  OR
    - mocha / or  npm test / DEBUG=customer* mocha


### Prerequisities

- dependencies: 

```
npm install --save node-uuid superagent bluebird mkdirp-bluebird del mongoose express

```

- devDependencies: 
  
```
npm install -D gulp-eslint gulp-mocha mocha gulp chai

```

## Running

- In your root server, type in the command **"npm start"** in your terminal.
- OR in terminal type: gulp


- GET request: 
    ```http localhost:3000/api/order?id=selectedId ```
    ```http localhost:3000/api/customer?id=selectedId ```

- POST request: 
    ```echo '{"name":"yourname", "sex":"female/male"}' | http POST localhost:3000/api/person ```

- PUT request: 
    ```echo '{"name":"yourname", "sex":"female/male"}' | http POST localhost:3000/api/person ```

- DELETE request: 
    ```http DELETE localhost:3000/api/person?id=selectedId ```

## Testing: 
we have two models ( customer and order) , so we have tests for both models:

-  GET and POST requests :
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
* express.js
* Mongo / Mongoose
* JavaScript
* Visual studio code 3 

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## Authors

* **Raziyeh Bazargan** - [Github](https://github.com/RaziyehBazargan)

## License

This project is licensed under the ISC License.

