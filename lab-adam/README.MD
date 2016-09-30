<title>MEDTRACKER v0.1</title>
<h1>An open API allowing clients to create and modify hospital programs in cities around the USA</h1>

This API allows clients to perform CRUD operations on two types of objects: Cities and Hospitals. They have a one-to-many relationship: a city can have many hospitals, but a hospital can only be in one city.

<h2>Cities </h2>
<h3>Available CRUD Operations</h3>
<strong><em>Route path: /api/city/[:id]</em><strong>
- GET: takes an ID
- POST: takes a body JSON object with the properties listed below
- PUT: takes an ID and body JSON; modifies an existing object with the provided JSON.
- DELETE: takes an ID and deletes the object corresponding to the ID.

<h3>Properties</h3>
<em>All of these properties are required in order to create a city.</em>
- "name", String
- "population", Integer
- "lat", Number
- "lng", Number
- "rating", Integer
<em>Additionally, each city will receive a 'timestamp' and '\_id' property</em>

<h2>Hospitals </h2>
<h3>Available CRUD Operations</h3>
<strong><em>Route path: /api/city/[:cityID]/hospital/[:id] </em><strong>
- GET: takes an ID
- POST: takes a body JSON object with the properties listed below
- PUT: takes an ID and body JSON; modifies an existing object with the provided JSON.
- DELETE: takes an ID and deletes the object corresponding to the ID.

<h3>Properties</h3>
<em>All of these properties are required in order to create a hospital.</em>
- "name", String
- "specialties", String
- "programRank", Number
<em>Additionally, each hospital will receive a 'timestamp' and '\_id' property</em>
