/**
 * This is our API. It is essentially the server application which listens
 * for HTTP requests and decides what to do about them, returns responses, etc.
 *
 * The API focuses on HTTP interactions, built on top of Express and Node.js. All
 * HTTP-specific stuff is contained in this module and isolated from the rest.
 *
 * Note that the API needs to include the model and the Data Access Object, and
 * it interacts with both of them to implement functionality
 *
 * @author aeh21, cx8, mg256, ad298, ahl6
 * @date Apr 2018
 * @module js/api
 */

(function() {

    const express = require('express');
    const bodyParser = require('body-parser');
    const model = require('./model_Database.js');
    const cookieParser = require('cookie-parser');
    const session = require("express-session");
    const dao = require('./dao.js');
    const Twit = require('twit');
    const passport=require('passport');
    const LocalStrategy=require('passport-local').Strategy;
    const flash = require('express-flash');
    /**
      * Our current Port. Is defined within the runApp() function and set to 3010
      *The port our application will listen on. Must be greater than 1024 and
      * not in use (otherwise we will get an error)
      *
      * @type {number}
      */
    let thePort;
    /**
      * Our current max ID. Our IDs are obtained by simply counting up
      *
      * @type {number}
      */
    let maxID;
    /**
      * Our current user ID. user IDs are obtained by simply counting up
      *
      * @type {number}
      */

    let userID;

    function setID(value) {
        maxID = value;
    }

    module.exports = {
      /**
        * Runs the application
        * @function
        * @returns {Object}    The newly created Express app
        */
        runApp,

      /**
       * Configure the app processing pipeline. Call directly instead of runApp() for
       * testing etc.
       * @function
       */
        configureApp,
    };
    /**
     * Run the app on the default port 3010. Makes use of configureApp to set up the
     * processing pipeline.
     *
     * @returns {Object} The newly created Express app
     */
    function runApp() {
        //maxID = 5;
        thePort = 3010;
        let app = express();
        dao.init( setID );
        configureApp(app);
        console.log("Listening on port " + thePort);
        return app.listen(thePort);
    }
    /**
     * Configure the app processing pipeline. Call directly instead of runApp() for
     * testing etc.
     */
    function configureApp(app) {
        app.use(bodyParser.json({
            limit: '5mb'
        }));

        app.use(cookieParser());
        app.use('/', express.static('static'));

        app.use(session({ secret: 'a secret' , cookie: { maxAge: 60000 }}));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());

        app.get("/getItems", getItems);
        app.get("/getUser", getUser);
        app.get("/getTweets", getTweets);

        app.post("/addItem", postItem);
        app.post("/addUser", postUser);

        // app.delete("/deleteItem/:id", deleteItem);

        app.post('/login',
            passport.authenticate('local'),
            function(req, res) {
                let currentUser={
                  username: req.user.username
                }
                 console.log("currentUser line 74: "+currentUser.username);
                 res.status(200).end(JSON.stringify(currentUser));
            });

        app.use('/', express.static('static'));
        }

    passport.use(new LocalStrategy(
          function(username, password, done) {
                dao.getUser(function(items) {
                    for(item of items) {
                    if (item.username === username) {
                      if (item.password === password) {
                        return done(null, item);
                      }
                      return done(null, false, {message: 'Incorrect password.'})
                    }
                  }
                  return done(null, false, {message: 'Incorrect username.'});
                });
          }
        ));

    passport.serializeUser(function(user, done) {
      done(null, user.username);
    });

    passport.deserializeUser(function(id, done) {
        done(null, id);
    });

    var getItems = function(req,res,next) {
        dao.getItems( function(items) {
	    let result = { 'allitems': [] };
            for(item of items) {
                result.allitems.push(JSON.parse(item.toJSON()));
            }
            res.status(200).end(JSON.stringify(result));
            //get maxid of all posts
            // console.log(result);
            maxID=result.allitems.length+1;
        });
    }
    /**
      * Handler for /addItem resource. It will receive a JSON object as the body
      * of the request, create a new Item from this JSON object and then ask
      * the Data Access Object to store this item in the database
      *
      * Returns the JSON object corresponsing to the newly created database object
      * as the body of the HTTP response
      */
    var postItem = function(req,res,next) {
        // Generate a new ID because this is a POST request
        let id = maxID++;
        // console.log('This is what I got: ' + JSON.stringify(req.body));
        jsonobj = req.body;
        jsonobj.id = id;
        console.log("current id"+id);
        let item = new model.ForumPosts();
        item.fromJSON(jsonobj);
	    // console.log("api got: "+item);
        dao.addItem(item, function(retitem) {
		// console.log("Got: " +retitem);
        res.status(201).end(JSON.stringify(retitem));
        });
    }

    /**
      * Handler for /deleteItem/:id resource. It will receive a numerical ID as
      * part of the HTTP URL. It will then ask the
      * Data Access Object to delete the object with this ID from the database
      *
      */
    // var deleteItem = function(req,res,next) {
    //     let id = req.params.id;
    //
    //     // This part is new. We will ask the DAO to delete the item, and then finish
    //     // the handler  in the callback
    //     dao.removeItem(id, function() {
    //         res.status(204).end();
    //     });
    // }
    /**
      * Handler for /getUser resource.

      * Returns the JSON object corresponsing to the newly created database object
      * as the body of the HTTP response
      */
    var getUser = function(req,res,next) {
        dao.getUser( function(items) {
	    let result = { 'allusers': [] };
            for(item of items) {
                result.allusers.push(JSON.parse(item.toJSON()));
            }

            res.status(200).end(JSON.stringify(result));
            console.log(result);
            userID=result.allusers.length+1;
        });
    }
    /**
      * Handler for /addItem resource.
      *
      * It will receive a JSON object as the body
      * of the request, create a new Post from this JSON object and then ask
      * the Data Access Object to store this item in the database
      *
      * Returns the JSON object corresponsing to the newly created database object
      * as the body of the HTTP response
      */
    var postUser = function(req,res,next) {
        // Generate a new ID because this is a POST request
        let id = userID++;
        console.log('This is what I got for user: ' + JSON.stringify(req.body));
        jsonobj = req.body;
        console.log(jsonobj);
        jsonobj.uId = id;
        console.log("current user id "+id);
        let item = new model.UserDetails();
        item.fromJSON(jsonobj);
	       console.log("user api"+item);
        dao.addUser(item, function(retitem) {
		        console.log("Got user: " +retitem);
        res.status(201).end(JSON.stringify(retitem));
        });
    }
    /**
      * Handler for /getTweets resource.
      *
      * Returns the current titles of tweets from the user_id as the body of the HTTP response
      *
      */

    var getTweets = function(req, res, next){
    var T = new Twit({
      consumer_key:         '1PVsR34edaaf2fwXBdGAyuYIi',
      consumer_secret:      '2dJktxtqLPmgny5uxrfYBmtUQd2sbSc75hpqj4hWG1sfxI3Iix',
      access_token:         '3292975552-dHQ1AnsmWRKGzmlIc9OpMN8ODYTlrnCnAbuwkBo',
      access_token_secret:  'CGKxW5UarLyVqLwQswDzRyjDmYz5eOwYbMOhYJ0P0L6JL',
      timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    });

    T.get('statuses/user_timeline', {user_id: '109242421', count: 10 }, function(err, data, response) {

    res.status(200).end(JSON.stringify(data));

    })
    }



})();
