![cf](https://i.imgur.com/7v5ASc8.png) lab 14 double resource express/mongo api
======

# To Submit this Assignment
  * continue working in your lab 13 fork
  * push to your repository
  * submit a pull request to this repository
  * submit a link to your PR in canvas
  * write a question and observation on canvas
  * write how long you spent on this assignment on canvas

# Directions
* Create a second **Model** using `mongoose.Schema` and `mongoose.model`
 * The model can represent whatever data you choose. _e.g. note, blog post, store items_
 * It must have a relationship of many to one with the resource from from lab-13
 * one of its properties must be of type `mongoose.Schema.ObjectId` and reference an ObjectId for a resource from lab-13
* add an array of type `mongoose.Schema.ObjectId` with a `ref` to your new-model on your model from lab-13
* use populate in your routes that return your model from lab-13
* use the `body-parser` express middleware on `POST` and `PUT` routes
* use the npm `debug` module to log the functions being executed in your app
* using the express `Router` create a route for doing **RESTFUL CRUD** operations on your second **Model**
 * thoughfuly name your routes, and be consistent

## Server Endpoints
* make three routes that operate on your second  model

## Tests
* test each new route for `200`, `204`, `400`, and `404` whenever applicable.
