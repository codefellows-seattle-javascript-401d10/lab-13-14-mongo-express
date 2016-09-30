![cf](https://i.imgur.com/7v5ASc8.png) Javascript 401d10 -- Lab 13-14
======

## Express API -- CatAPI 3.0 'Saruman'

CatAPI announces CatAPI 3.0 'Sauruman'! We're not only leapfrogging our competition, we're entering a NEW DIMENSION of API-based cat-action -- or 'Catction' for short.

CatAPI is built using Express, and is tested using SuperAgent.

# What's new in 3.0 'Saruman'

CatAPI will now ape (or 'cat-ape') prevailing Silicon Valley conventions by assigning cutesy, themed codenames to our versions.

CatAPI 3.0 'Saruman' now tracks cat cafes! You will no longer be able to track your own personal cats. Each cat recorded by CatAPI 3.0 must be associated with a cat cafe. All your existing cat records are now associated with a cat cafe, and the cat cafe authorities will arrive soon to collect them for transportation to their new home.

# Install the API

From the home directory, run `npm i` in terminal. All required dependencies will install.

# Start the API

From the home directory, run `npm start` in terminal. A welcome message will be sent and the API is ready to use.

# Test the API

From the home directory, run `npm test` in terminal. A test using Mocha, Chai and Superagent will run. If any tests fail, see `What to do if you encounter a bug` below in this readme.

# API endpoints

CatAPI has two endpoints:

`/api/cafe/:cafeId` for cat-cafe requests. Accepts GET, POST, PUT and DELETE requests. Calling this endpoint with no cafeId returns a list of existing cafe IDs.

`/api/cafe/:cafeId/cat/:catId` for individual cat requests. Accepts GET, POST, PUT and DELETE requests. Calling this endpoint with a valid cafeId but no catId returns a list of cat IDs associated with that cafe.

# Closing the API

From the shell instance running the server, end the server with `^C`.

# What to do if you encounter a bug

* If you are a Codefellows instructor, mark me down and leave me a note and I will fix it.
* If you are a Codefellows student, don't worry, I peek at your repos too. Message me on Slack if I'm not around.
* If you are not from Codefellows, plant an acorn in your yard. You will never sit beneath the spreading boughs of the oak which will grow from that acorn. Think about that! Kind of deep.
