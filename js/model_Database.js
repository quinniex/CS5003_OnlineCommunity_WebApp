/**
 * This is our model. It will define all of our data and how to
 * interact with it. If we do this cleverly, then we can run this
 * javascript both in the browser and on the server side, which
 * will make our program simpler and more consistent.
 *
 *  @author aeh21, cx8, mg256, ad298, ahl6
 * @date April 2018
 * @module js/model
 */


( function() {
    /**
     * class ForumPosts, represents the individual posts within the Forum. It contains the id, content, category, date , image, city and author
     */
    class ForumPosts {
      /**
        *
        *
        * @param {number} id - The ID of the item
        * @param {string} content - The content of the post
        * @param {string} category - the type of category
        * @param {string} date - The date of the post
        * @param {string} image - The image uploaded in a post
        * @param {string} city - The city of the current forum
        * @param {string} author - The Name of the user
        */
        constructor(id, content, category, date, image, city, author) {
            //this._cities = ['St Andrews', 'Cupar', 'Dundee', 'Tayport'];

            // Check if we got all arguments, otherwise initialise to empty/zero
            if(typeof(content) != 'undefined') {

                if(typeof (image) !='undefined'){
                    this._id = id;
                    this._content = content;
                    this._category = category;
                    this._date= date;
                    this._image = image;
                    this._city = city;
                    this._author = author;
                }else{
                    this._id = id;
                    this._content = content;
                    this._category = category;
                    this._date= date;
                    this._image = "";
                    this._city = city;
                    this._author = author;
                }
            } else {
                if(typeof (image) !='undefined'){
                    this._id = id;
                    this._content = "";
                    this._category = category;
                    this._date= date;
                    this._image = image;
                    this._city = city;
                    this._author = author;
                }else{
                    this._id = -1;
                    this._content = "";
                    this._category = "";
                    this._date = "";
                    this._image = "";
                    this._city = "";
                    this._author = "";
                }
            }
        }
        /**
         * The ID of this item
         * @type {number}
         * @readonly
         */
        get id() {  return this._id; }

        /**
          * The content of the post
          * @type {string}
          */
        get content()   { return this._content; }
        set content(d)  { this._content = d;    }
                /**
                 * the type of category
                 * @type {string}
                 */
        get category()        { return this._category;  }
        set category(c)       { this._category = c;     }

                /**
                 * The date of the post
                 * @type {string}
                 */

        get date()        { return this._date;  }
        set date(c)       { this._date = c;     }

                /**
                 * The image uploaded in a post
                 * @type {string}
                 */
        get image()        { return this._image;  }
        set image(i)       { this._image = i;     }

                /**
                 * The city of the current forum
                 * @type {string}
                 */

        get city()        { return this._city;  }
        set city(ci)       { this._city = ci;     }

                /**
                 * The Name of the user
                 * @type {string}
                 */

        get author()        { return this._author;  }
        set author(a)       { this._author = a;     }

        /**
         * Returns the important properties as a JSON object.
         * We can then pass this over a network
         *
         * @returns {Object} The JSON representation
         */
        toJSON() {
            let result = {};
            result.id = this._id;
            result.content = this._content;
            result.category = this._category;
            result.date = this._date;
            result.image = this._image;
            result.city = this._city;
            result.author = this._author;

            return JSON.stringify(result);
        }
        /**
         * Takes a JSON object and reads the properties from it.
         * We might receive such an object over the network and want
         * to create an object that is easier to manipulate
         *
         * @param {Object} json - The JSON representation to initialise from
         */

        fromJSON(json) {
            if (json.hasOwnProperty('id') && typeof (json.id) === 'number' && json.id >= 0)
                this._id = json.id;

            if (json.hasOwnProperty('content') && typeof (json.content) === 'string' && json.content != "")
                this._content = json.content;

            if (json.hasOwnProperty('category') && typeof (json.category) === 'string' && json.category != "")
                this._category = json.category;

            if (json.hasOwnProperty('date') && typeof (json.date) === 'string' && json.date != "")
                this._date = json.date;

            if (json.hasOwnProperty('image') && typeof (json.image) === 'string' && json.image != "")
                this._image = json.image;

            if (json.hasOwnProperty('city') && typeof (json.city) === 'string' && json.city != "")
            this._city = json.city;

            if (json.hasOwnProperty('author') && typeof (json.author) === 'string' && json.author != "")
            this._author = json.author;

        }
    }

    /**
     * Class USERS, represents the users of the website. It contains the uId, username and password
     */
    class UserDetails {
        constructor(uId, username, password) {
          /**
            *
            *
            * @param {number} uId - The ID of the user
            * @param {string} username - The name of the user
            * @param {string} password - The password of the user
            */

            // Check if we got all arguments, otherwise initialise to empty/zero
            if(typeof(password) != 'undefined') {
                this._uId = uId;
                this._username = username;
                this._password = password;
            } else {
                this._uId = 1;
                this._username = "";
                this._password = "";
            }
        }
        /**
         * The ID of this user
         * @type {number}
         * @readonly
         */

        get uId() {  return this._uId; }
        /**
         * The Id of the user
         * @type {string}
         */

        get username()   { return this._username; }
        set username(u)  { this._username = u;    }
        /**
         * The password of the user
         * @type {string}
         */
        get password()        { return this._password;  }
        set password(p)       { this._password = p;     }

        /**
         * Returns the important properties as a JSON object.
         * We can then pass this over a network
         *
         * @returns {Object} The JSON representation
         */

        toJSON() {
            let result = {};
            result.uId = this._uId;
            result.username = this._username;
            result.password = this._password;

            return JSON.stringify(result);
        }
        /**
         * Takes a JSON object and reads the properties from it.
         * We might receive such an object over the network and want
         * to create an object that is easier to manipulate
         *
         * @param {Object} json - The JSON representation to initialise from
         */

        fromJSON(json) {
            if (json.hasOwnProperty('uId') && typeof (json.uId) === 'number' && json.uId >= 0)
                this._uId = json.uId;

            if (json.hasOwnProperty('username') && typeof (json.username) === 'string' && json.username != "")
                this._username = json.username;

            if (json.hasOwnProperty('password') && typeof (json.password) === 'string' && json.password != "")
                this._password = json.password;
        }
    }



    let exports = {
      /**
    	 * Class definition of ForumPosts
    	 */
        ForumPosts,
        /**
      	 * Class definition of UserDetails
      	 */
        UserDetails
    }

    if ( typeof __dirname == 'undefined')       // Running in browser
        window.exports = exports;
    else                                        // Running in node.js
        module.exports = exports;

}())
