# Single Resource API w/ MongoDB & Express

This is a single resource API, built using MongoDB for our persistence layer and Express as the framework, which is compatible with CRUD operations. For this API, you can GET, POST, PUT, and DELETE a 'store'.

- Each store object must have: name, year, storeType.
- An Id and timestamp will be automatically generated upon valid POST's.

To start, run:

```
npm i
```

This will install all dependencies for this project, including:

- bluebird
- body-parser
- debug
- express
- http-errors
- mongoose
- morgan
- cors
- chai
- gulp
- gulp-eslint
- gulp-mocha
- mocha
- superagent

Once all dependencies are installed you must first boot up mongoDB.

To do this open up another tab in your shell in the same home directory, and run:

```
mongod --dbpath=db
```

Then in another tab in the home directory, run:

```
npm run start
```

which will start our server.

#GET

A valid GET request should look like this, and result in a 200 status code:

```
http localhost:3000/api/store/(some id in database)
```

and that will return the object with properties: id, timestamp, name, year, storeType.

A GET request resulting in a 404 status error will return if a store at a specified id isn't found.

```
http localhost:3000/api/store/99999
```

#POST

A valid POST request should look like this, and result in a 200 status code:

```
echo '{"name": "nordstrom", "year": 1955, "storeType": "clothing/department"}' | http localhost:3000/api/store
```

A POST request resulting in a 400 status error will return if there was a bad request. Meaning invalid body or no body was sent.

```
echo '{"name": "", "notYear": 2000, "storeType": 1}' | http localhost:3000/api/store
```

#PUT

A valid PUT request should look like this, and result in a 200 status code:

```
echo '{"name": "adidas", "year": 1977, "storeType": "sporting goods"}' | http PUT localhost:3000/api/store/(some id in database)
```

A PUT request resulting in a 400 status error will return if there was a bad request. Meaning invalid or no body was sent.

```
echo '{"notName": "red", "notYear": "year", "storeType": "house"}' | http PUT localhost:3000/api/store/(some id in database)
```

A PUT request resulting in a 404 status error will return if there was an invalid Id or Id not found.

```
echo '{"name": "adidas", "year": 1977, "storeType": "sporting goods"}' | http PUT localhost:3000/api/store
```

#DELETE

A valid DELETE request should look like this, and result in a 204 status code:

```
http DELETE localhost:3000/api/store/(some id in database)
```

A DELETE request resulting in a 400 status error will return if there was a bad request. Meaning no id query was passed.

```
http DELETE localhost:3000/api/store
```
