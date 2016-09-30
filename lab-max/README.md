# Double Resource API w/ MongoDB & Express

This is a double resource API, built using MongoDB for our persistence layer and Express as the framework, which is compatible with CRUD operations. For this API, you can GET, POST, PUT, and DELETE a 'store' or 'item'.

- Each store object must have: name, year, storeType.
- Each item object must have: name, itemType, price.
- An Id and timestamp will be automatically generated upon valid POST's. If an item is posted, an ID referencing its store will be created. An ID referencing the item will also be created and added to its specific store.

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

#Store Routes

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

A DELETE request resulting in a 404 status error will return if there was a bad request. Meaning no id was found.

```
http DELETE localhost:3000/api/store/11111
```

#Item Routes

#GET

A valid GET request should look like this, and result in a 200 status code:

```
http localhost:3000/api/store/(storeID)/item/(itemID)
```

and that will return a single item.

A GET request resulting in a 404 status error will return if an item at a specified id isn't found.

```
http localhost:3000/api/store/(storeID)/item/11111
```

#POST

(To POST a new item, there must already by a Store to post to).

A valid POST request should look like this, and result in a 200 status code:

```
echo '{"name": "soccer shoes", "itemType": "shoes", "price": 10}' | http localhost:3000/api/store/(storeID)/item
```

A POST request resulting in a 400 status error will return if there was a bad request. Meaning invalid body or no body was sent.

```
echo '{"name": "", "itemType": 2000, "price": ""}' | http localhost:3000/api/store/(storeID)/item
```

A POST request resulting in a 404 status error will return if there was an invalid storeID.

```
echo '{"name": "soccer shoes", "itemType": "shoes", "price": 10}' | http localhost:3000/api/store/111111/item
```

#PUT

A valid PUT request should look like this, and result in a 200 status code:

```
echo '{"name": "soccer jersey", "itemType": "apparel", "price": 20}' | http PUT localhost:3000/api/store/(storeID)/item/(itemID)
```

A PUT request resulting in a 400 status error will return if there was a bad request. Meaning invalid or no body was sent.

```
echo '{"notName": "jersey", "itemType": 1, "price": "house"}' | http PUT localhost:3000/api/store/(storeID)/item/(itemID)
```

A PUT request resulting in a 404 status error will return if there was an invalid Id or Id not found.

```
echo '{"name": "soccer jersey", "itemType": "apparel", "price": 20}' | http PUT localhost:3000/api/store/(storeID)/item/111111
```

#DELETE

A valid DELETE request should look like this, and result in a 204 status code:

```
http DELETE localhost:3000/api/store/(storeID)/item/(itemID)
```

A DELETE request resulting in a 404 status error will return if there was a bad request. Meaning no id was found.

```
http DELETE localhost:3000/api/store/(storeID)/item/111111
```
