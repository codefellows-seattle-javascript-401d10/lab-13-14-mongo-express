This is a simple RESTful API using MongoDB.

To run your tests, type 'npm test' in your terminal.

Explanation of Routes


List Routes
In the list route, we have post, get, put, and delete methods.

listrouter.post
This takes three arguments: endpoint of '/api/list', the jsonParser method we required at the top of the module, and a callback function that takes the request, response, and next as params.

We use the timestamp property of req.body and instantiate the a new Date() object.

We instantiate a new List object that takes req.body as its contents and we save it.

We convert that new list to json and send it as a response.

if there is an error, the catch block will move on that error, which will either be a 400 or 500, as demonstrated in lib/error-middleware.js.

listrouter.get
This takes the endpoint of 'api/list/:id' and a callback function of three params of req, res, and next.

We invoke our List.findById method that takes an argument of the ID.

We chain Mongoose's populate method to this, which populates the 'persons' property of our List constructor with people.

listrouter.delete
This takes the endpoint of '/api/list/:id' as a parameter, with a callback function using request, response, and next as parameters.

We invoke List.findByIdAndRemove, which takes the list ID as an argument. If there is success, we will send a status 204 as a response. If the ID is invalid, we send an error message with a status 404.

listrouter.put
This takes the endpoint of '/api/list/:id' as a parameter, with a callback function using request, response, and next as parameters.

We invoke the List.findByIdAndUpdate function that takes in an argument of the request's ID and body. We also set 'new' to 'true' so that a newly updated object will be returned.

We pass that returned in the 'then' block, convert it to JSON, and send it as a response. If there is an error, we will either return a 400 or 404, depending on if we sent a bad ID or if we sent invalid JSON as a response.

Person Routes
TBD
