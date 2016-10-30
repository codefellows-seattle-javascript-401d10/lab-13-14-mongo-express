### Description:

This is project is a REST API made to keep track of series and the books contained in these series. You will be able to Create, Read, Update and Destroy both Series and Books.

Series have four properties:
  - Title : the name of the series itself. **_e.g. (The Chronicles of Narnia)_**
  - Description : an explanation about the series. **_e.g. (Kids explore another world where time and people are different.)_**
  - Author : the author of the series.  **_e.g. (C.S. Lewis)_**
  - Books : a list of books belonging to the series. **_e.g. (The Magician's Nephew", "The Lion, The Witch and The Wardrobe...")_**

Books have four properties:
  - Published : the year that the book was published. **_e.g. (1953)_**
  - Author : the author of the book. **_e.g. (C.S. Lewis)_**
  - Title : the name of the book. **_e.g. (The Silver Chair)_**
  - Description : an explanation about the book. **_e.g. (The Chair reveals the mystery)_**


### Setting Up:

You want to make sure that you have node, you can download it here: [**Node**](https://nodejs.org/en/)


##### Starting MongoDB
Locate the directory containing the file server.js in the terminal and run MongoDB:
type :
```
mongod --dbpath db
```
and you should have a bunch of text showing that MongoDB is running.
If it exits straight out of MongoDB when you've entered the command, then you might need to type-in :
```
killall mongod
```
or
```
sudo killall mongod
```
in order to stop any currently running MongoDB actions. Then just run the first command again and check that the text comes up.

open a new terminal window in the same directory and run :
```
npm install
```
to install all the dependencies for this REST API and you're ready to go.


### Routes:

#### Series:

  You can Create, Read, Update and Destroy series using various commands.

**Create**

Request type
`POST`

```
/api/series
```

Expected input

```json
{
  "title": "<title>",
  "desc": "<description>",
  "author": "<author>",
}
```

Expected Status `200`

**Find**

 - **All**

Request type
`POST`

```
/api/series
```

Expected input

```json

```

Expected Status `200`


 - **By Id**

Request type
`POST`

```
/api/series/seriesID
```

Expected input

```json

```

Expected Status `200`

**Update**

Request type
`POST`

```
/api/series/seriesID
```

Expected input

```json
{
  "title": "<title>",
  "desc": "<description>",
  "author": "<author>",
}
```

Expected Status `200`

**Destroy**

Request type
`POST`

```
/api/series/seriesID
```

Expected input

```json

```

Expected Status `204`


#### Book:

  You can Create, Read, Update and Destroy books using various commands.

**Create**

Request type
`POST`

```
/api/series/seriesID/book
```

Expected input

```json
{
  "title": "<title>",
  "desc": "<description>",
  "author": "<author>",
}
```

Expected Status `200`

**Find**

 - **By Id**

Request type
`POST`

```
/api/series/seriesID/book/bookID
```

Expected input

```json

```

Expected Status `200`

**Update**

Request type
`POST`

```
/api/series/seriesID/book/bookID
```

Expected input

```json
{
  "title": "<title>",
  "desc": "<description>",
  "author": "<author>",
}
```

Expected Status `200`

**Destroy**

Request type
`POST`

```
/api/series/seriesID/book/bookID
```

Expected input

```json

```

Expected Status `204`
