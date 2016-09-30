##About

This API shows a one to many relationship. In this instance, a Fruit represents a list that can contain many locations. Each location has an id to reference to the fruit that it is within and each fruit has an array of locations that each have a reference to the fruit.

#Fruit routes
####################################

##POST request
User provides a valid name to create a Fruit. It will return a Fruit with a name, locations array and id.

##GET request
User needs to provide an id of the Fruit to retrieve out of the database. It will return a fruit with a matching ID.

##PUT request
User needs to provide an Id of the fruit to retrieve out of the database. If the contents are updated, those values will be changed in the database on the Fruit with a matching ID.

##DELETE request
User needs to provide an Id of the Fruit to retrieve and delete out of the database. 

##Location Routes:
#####################################

##POST request:
A user needs to provide a Fruit id to create a new location in the fruit. A aname should be provided to return a new location.

##GET request:
A user needs to provide a location id to retrieve the location. Will return a location with a name, content and fruitID.

##DELETE request:
A user needs to provide a location id to delete a location within a fruit.
