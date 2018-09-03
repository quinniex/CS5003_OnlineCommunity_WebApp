# CS5003_OnlineCommunity_WebApp
Authors - aeh21, cx8, mg256, ad298 and ahl6

## Project Details 

This is a project built for the University of St Andrews, CS5003, Practical 3 by Group 4. 
The aim of the project is to build a Single Page Web Application to show latest weather updates. 
 
## What Technologies We Used

We used a variety of front and back end technologies to build the single-page web application. 

Database:
1. CouchDB: NoSql Database is used to store the details of the users and posts in this project. 
-- Data has been pre-recorded by the author using the webpage into the database to show usage of the Web Page. New data can be easily added. 


Back End: 
1. Node
2. Various Node Pacakges to implement differnet functionalities in the WebPage which are stored in package.json.
-- Our backend was built on api call requests from the client to the server and couchdb using express and cradle to interact and to get and post data.


Front End:
1. JavaScript: The front end has been built on JS majorly to interact with html elements. 
-- The front-end has been split into various client side js pages to distuingish between functionalities such as weather api, new api, etc. 

2. jQuery: DOM manipulation to make the code simpler and easier.
-- Also a lot of jQuery functions have used to show interactivity on the webpage frontend.


## Installation

To run this Project:

//To Install
git clone https://gitlab.cs.st-andrews.ac.uk/cs5003group-p3-4/CS5003-Group4-Practical3
cd checkmate
npm install

(all the modules saved in package.json dependencies will be downloaded)


//To Start
npm start

(the port it is suppose to load on is: 9898)


//On the browser
localhost:3010 or
127.0.0.1:3010


To run the Database:
couchdb-setup
couchdb-start

//On the browser --> http://klovia.cs.st-andrews.ac.uk:20886/_utils/index.html
Credentials --> username:"mg256" , "password":"t49Tzt4b"




