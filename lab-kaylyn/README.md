## About The Program:
This program is a simple REST API written with Express that keeps track of and regulates portfolios. The specifications on what a valid portfolio entry should include is represented in the model with mandatory properties like name, about, projects, and work. The user can write to and receive information from previously existing portfolio entries as well as write new ones and delete or update old ones. To achieve this functionality a user can implement the following http methods: GET, POST, PUT, or DELETE. Data is stored and accessed via MongoDB.

##User Guide:
It is important to structure your files as follows:
* **lib** dir will contain your middleware 
* **model** dir will contain your object constructor, which should be a simple resource
* **test** dir will contain your program test files
* **route** dir will contain your routes

Run npm install before installing the required dependencies:
```
npm install
```

*See package.json for required dependencies and devdependencies*

Be sure to include in the scripts of your package.json...
```
"start": "DEBUG='portfolio*' node server.js",
"test": "DEBUG='portfolio*' ./node_modules/mocha/bin/mocha"
```
* this will enable you to start your server via the command line with:
```
npm start
```

The following is a guide on how to properly implement all of your CRUD operations via GET, PUT, POST, and DELETE:

##GET
* A valid GET request will result in a status code of 200:
```
http://localhost/3000/api/portfolio/<id>
```
*The id will be automatically generated*
* An invalid GET request will result in a status code of 404 if there's an invalid id or no id provided:
```
http://localhost/3000/api/portfolio/<id that does not exist>
```

##PUT
* A valid PUT request will result in a status code of 200:
```
echo '{"name": "<name>", "about": "<content>", "projects": "<content>", "work": "<content>"}' | http PUT localhost:3000/api/portfolio/<id>
```
* An invalid PUT request will result in a status code of 400 for invalid body or no body provided:
```
echo '{"name": "", "about": "", "projects": "", "work": ""}' | http PUT localhost:3000/api/portfolio/<id>
```
* An invalid PUT request will result in a status code of 404 for an id that was not found:
```
echo '{"name": "", "about": "", "projects": "", "work": ""}' | http PUT localhost:3000/api/portfolio/<invalid id or missing id>
```
*remember: PUT is for updating existing portfolios, if you want to create a new portfolio, use POST*

##POST
* A valid POST request will result in a status code of 200:
```
echo '{"name": "<name>", "about": "<content>", "projects": "<content>", "work": "<content>"}' | http POST localhost:3000/api/portfolio/<id>
```
* An invalid POST request will result in a status code of 400 for invalid body or no body provided:
```
echo '{"name": "", "about": "", "projects": "", "work": ""}' | http POST localhost:3000/api/portfolio/<id>
```

##DELETE
* A valid DELETE request will result in a status code of 204:
```
http DELETE localhost:3000/api/portfolio/<id>
```
* An invalid DELETE request will result in a status code of 404 for an invalid id or id that was not found:
```
http DELETE localhost:3000/api/portfolio/<invalid id or missing id>
```
