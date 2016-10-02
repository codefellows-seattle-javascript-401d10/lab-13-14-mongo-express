# Project Overview

The purpose of this project is to create a RESTful API with persistent storage for creating, reading, updating and deleting fowls, each of which may have associated ducks.

Fowls are models that may have many types of fowls that relate to them, while the fowls themselves (ducks, mallards, etc.) may only relate to one specified fowl collection, and never to each other.

## Fowl collection properties
  * Fowls have the following properties:
    * `Name` Every fowl has a name--typically a collection name for the fowls that will be associated with it. e.g. `Fowls1`
    * `Timestamp` The time that the specific fowl was created.
    * `ducks` An array of the IDs of the type of fowl that is associated to this specific fowl collection.
    * `Id` Every fowl is given a random id number that also corresponds to its filename in the persistent database.

## Duck properties
  * Ducks have the following properties:
    * `Name` Every duck has a name.
    * `Color` Ducks are all a color, and not always yellow.
    * `Feathers` Refers to the # of feathers, represented as a string.
    * `Id` Every duck is given a random id number that also corresponds to its filename in the persistent database.
    * `fowlID` The fowl collection that the duck corresponds to.

## How to Install the Project

Check out the [package.json] (https://github.com/broxsonl/lab-13-14-mongo-express/blob/master/lab-lee/package.json) file for the project to see the specific Dependencies required to run this project or develop for it.

## How to Start the Server

To start the database, go to the root directory of the project and run the following mongo command in an additional terminal instance:

        $ mongod --dbpath="./db"

That should start the mongo database up.

You'll also want to be sure your server is running in an instance of your terminal:

        $ node server.js

## The Fowl API's Routes

This API has at least one route for each CRUD request. You'll need to be using a third terminal instance to run the below commands, and keep in mind, [PORT] represents where the port number should be passed in.:

        * `$ http get localhost:[PORT]/api/fowl/[Id]` Retrieves a corresponding fowl from the database if an existing fowl Id is entered in place of [Id]. This will also retrieve along with it the ducks array that is a property on the fowl, which will be populated with any duck IDs if they currently exist.

        * `$ http delete localhost:[PORT]/api/fowl/[Id]` Deletes a corresponding fowl from the database if an existing fowl Id is entered in place of [Id].

 You can PUT and POST new fowls from JSON files by running the following commands, where [filepath] is the filepath to the json file being used:

        *  `$ cat [filepath] | http post localhost:[PORT]/api/fowl` Creates a new fowl from the json file specified in [filepath].

        * `$ cat [filepath] | http put localhost:[PORT]/api/fowl/[Id]` Finds a corresponding fowl by its ID if one already exists and updates the fowl's properties with the new information. Will return errors if the information being sent is incorrectly formatted or the ID is not found.


## The Duck API's Routes

This API has at least one route for each CRUD request. You'll need to be using a third terminal instance to run the below commands, and keep in mind, [PORT] represents where the port number should be passed in.:

        * `$ http get localhost:[PORT]/api/duck/[Id]` Retrieves a corresponding duck from the database if an existing duck Id is entered in place of [Id]. Keep in mind that the duck will have a `fowlID` property that will represent the fowls collection it is associated with.

        * `$ http delete localhost:[PORT]/api/duck/[Id]` Deletes a corresponding duck from the database if an existing duck Id is entered in place of [Id]. It will also remove that duck's id reference in its corresponding fowl's ducks array.

 You can PUT and POST new ducks from JSON files by running the following commands, where [filepath] is the filepath to the json file being used:

        *  `$ cat [filepath] | http post localhost:[PORT]/api/duck` Creates a new duck from the json object specified in the [filepath].

        * `$ cat [filepath] | http put localhost:[PORT]/api/duck/[Id]` Finds a corresponding duck by its ID if one already exists and updates the duck's properties with the new information. Will return errors if the information being sent is incorrectly formatted or the ID is not found.

## How to Test this Project

This project's paths were created with test-driven development. With the dependencies properly installed according to the above package.json file, you can run the following command in the project's root directory to test all viable routes for the project's api:

        $ gulp

That's it! The default actions for the 'gulp' command is to both check its scripts against the project's linter and to run all of the tests in the test folder. You'll have to manually `control + C` to exit out after the command has executed.
