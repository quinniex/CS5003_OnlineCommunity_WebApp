/**
 * This is our Data Access Object. It defines functionality for storing information
 * about TodoItems. The rest of our applications only needs to ask the DAO to store
 * something, without caring how it is done.
 *
 * All the database stuff goes in here. This means that only this file needs to contain
 * knowledge about the DB implementation, and it can be easily swapped for another file,
 * using a different database.
 *
 * @author aeh21, cx8, mg256, ad298, ahl6
 * @date Apr 2018
 * @module js/dao
 */


(function() {

    let fs = require('fs');
    let model = require('./model_Database.js');
    let cradle = require('cradle');

    let dbinfo = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    //let db2info = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    // console.log("Database Information" + dbinfo);

    let db = new(cradle.Connection)( dbinfo.url, {auth:dbinfo.auth} ).database(dbinfo.dbname);
   // let db2 = new(cradle.Connection)( db2info.url, {auth:db2info.auth} ).database(db2info.dbname2);

    function init( callback ) {
        db.exists(function (err, exists) {
            if (err) {
                console.log('error', err);
            } else if (exists) {
                console.log('Database found Successfully!');
                db.view('allitems/max', function(err, doc) {
                    // callback(doc[0].value);
                });


                db.view('allusers/max', function(err, doc) {
                    // callback(doc[0].value);
                });
            } else {
                console.log('"ERROR": No Database Found. Refresh browser!');
                db.create();

                db.save('_design/allitems', {
                            all: {
                                map: function (doc) {
                                    if (doc.id) emit(doc.id, doc);
                                }
                            },
                            max: {
                                map: function (doc) {
                                    if(doc.id) emit(1, doc.id);
                                },
                                reduce: function(key,values,rereduce) {
                                    return Math.max.apply(Math, values);
                                }
                            },
                            count: {
                                map: function (doc) {
                                    if(doc.id) emit(doc.type, 1)
                                },
                                reduce: function (key,values,rereduce) {
                                    return sum(values);
                                }
                            }
                        });

                db.save('_design/allusers', {
                    all: {
                        map: function (doc) {
                            if (doc.uId) emit(doc.uId, doc);
                        }
                    },
                    max: {
                        map: function (doc) {
                            if(doc.uId) emit(1, doc.uId);
                        },
                        reduce: function(key,values,rereduce) {
                            return Math.max.apply(Math, values);
                        }
                    },
                    count: {
                        map: function (doc) {
                            if(doc.uId) emit(doc.type, 1)
                        },
                        reduce: function (key,values,rereduce) {
                            return sum(values);
                        }
                    }
                });


            }
        });

    }

    function getItems(callback) {
        db.view('allitems/all', function(err, doc) {
            let items = [];
            if(err) console.log('Error getting all items');
            else if(doc) {
                for(d of doc) {
                    item = new model.ForumPosts();
                    item.fromJSON(d.value);
                    items.push(item);
                }
            }
            callback(items);
        });
    }

    function addItem(item, callback) {

        // console.log("addedItem"+(item.toJSON()));
        db.save( item.id+"post", JSON.parse(item.toJSON()), function(err, res) {

            //console.log("addedItem"+(item.toJSON()));


            callback(item.toJSON());
            //console.log("addedItem"+(item.toJSON()));

            });
    }

    function removeItem(id, callback) {
        db.remove( id+"", function(err, res) {
            callback();
            });
    }



    function getUser(callback) {
        db.view('allusers/all', function(err, doc) {
            let items = [];
            if(err) console.log('Error getting all users');
            else if(doc) {
                for(d of doc) {
                    item = new model.UserDetails();
                    item.fromJSON(d.value);
                    items.push(item);
                }
            }
            callback(items);
        });
    }

    function addUser(item, callback) {
        console.log("added user"+(item.toJSON()));
        db.save( item.uId+"user", JSON.parse(item.toJSON()), function(err, res) {
            callback(item.toJSON());
            });
    }
    
    /**
      * @callback returnMaxID
      * @param {Number} MaxID - largest ID in the database
      */

    /**
      * @callback returnAllItems
      * @param {Object} items - an object containing an array with all the posts in the forum
      */

    /**
      * @callback returnSingleItem
      * @param {Object} item - the object that was created or deleted
      */





    let exports = {
      /**
       * Initialise the DAO. This will check if the the database exists already and open it.
       * If the database does not exist, it will create it and fill it with some initial data.
       *
       * @function
       * @param {returnMaxID} callback - The function to be called when the DB fetch is finished
       */
        init:init,
        /**
         * Returns all items from the database.
         *
         * @function
         * @param {returnAllItems} callback - The function to be called when the DB fetch is finished
         */
        getItems,
        /**
         * Adds an item to the database.
         *
         * @function
         * @param {Item} item - The item to be stored
         * @param {returnSingleItem} callback - The function to be called when the DB fetch is finished
         */
        addItem,
        /**
         * Deletes an item from the database.
         *
         * @function
         * @param {id} id - the id of the item
         * @param {returnSingleItem} callback - The function to be called when the delete is finished
         */
        removeItem,

        // init2:init2,
        /**
         * Returns a user from the database.
         *
         * @function
         * @param {returnSingleItem} callback - The function to be called when the DB fetch is finished
         */

        getUser,
        /**
         * Adds a user to the database.
         *
         * @function
         * @param {Item} item - The item to be stored
         * @param {returnSingleItem} callback - The function to be called when the DB fetch is finished
         */
        addUser
    }

    if(typeof __dirname == 'undefined') {
        window.exports = exports;
    } else {
        module.exports = exports;
    }

})();
