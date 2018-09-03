/**
 * Client Side to pass the user and forum details from the client to the server. 
 * Multiple fetch api get and post requests have been written to get the data from the server and post to increase interactivity between client and database.
 */
(function() {
  $(function() {
    $('#currentUser').hide();

    // refreshList() updates the forum posts for each city as soon as they are posted in the city. 
    $("#standrews, #cupar, #dundee, #newport").click(function () {
      refreshList();
    });

    // addItem() sends the posts from the client to the server which are further gone to the database and displayed using 
    // the showList() function. This also clear's te contents of the forum post seciton on submitting a post.
    $('#submit').click(function() {
      addItem();
      $("#postContent").val("");
      $("#postCategory").val("Weather");
      $("#imageName").val("");
      $("#imageUpload").remove();
    });
    

    // A user is able to login using the login button which checks for null username and password and also calls the authentication function.
    $('#login').click(function(){
      if(($(".username2").val().length === 0) || ($(".password2").val().length === 0))
      {
        alert("Username and Password cannot be left Blank!");
      }
      $('.register').hide();
      $('.signIn').hide();
      authUser();

      $(".username2").val("");
      $(".password2").val("");
    })

    // similar to login function but here the new user's are registered into the database by calling addUser() function. 
    $("#signUp").click(function() {
      if(($(".username1").val().length === 0) || ($(".password1").val().length === 0))
      {
        alert("Username and Password cannot be left Blank!");
      }
      $('.register').hide();
      addUser();

      $(".username1").val("");
      $(".password1").val("");
    });

    $('#tweetButton').click(getTweetsFromApi);
  });

  /**
   * @function authUser() authenticates each user when they attempt to login after registering. 
   */
  function authUser(){
    let json={"username": $(".username2").val(), "password": $(".password2").val() };

    fetch('/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(json)
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(data => {
        $('#currentUser').show();
        $('#currentUserName').text(data.username);

      })
      .catch(err => console.log("Error: " + err));
  }

/**
 * 
 * @param {this function is used to show the Forum Posts for each city, the details for each post are stored in a json object} json 
 */
  function showList(json) {
    // Delete all previous posts before repopulating the forum
    $('.post').remove();
    $('.postedImg').remove();

    let jsonArr = $.map(json, function(value, index) {
      return value;
    });
    console.log("jsonArr "+jsonArr);

    let newjsonArr=[];
    let cityFilter = city;
    for(var i =0; i < jsonArr.length; i++)
    {
      if(jsonArr[i].city === city)
      {
        newjsonArr.push(jsonArr[i]);
      }
    }

    jsonArr = newjsonArr;

    function compare(property) {
      return function(object1, object2) {
        let value1 = object1[property];
        let value2 = object2[property];

        if (value2 < value1) {
          return -1;
        } else if (value2 > value1) {
          return 1;
        } else {
          return 0;
        }
      }
    }
    jsonArr.sort(compare("date"));

    // Add the task to the appropriate day
    for (jsonitem of jsonArr) {
      // Convert the JSON object to an instance of class ForumPosts
      let item = new window.exports.ForumPosts();
      item.fromJSON(jsonitem);

      console.log("item"+item);

      //display posts in html
      let forum = $('#displayPosts');
      let post = $('<div></div>').addClass('row container-fluid post');
      let userIcon = $("<i></i>").addClass("glyphicon glyphicon-user");
      let userNick = $("<span></span>").html(item.author).addClass("userStyle");
      let userText = $("<p></p>").html(item.content);
      let timeStamp = $("<span></span>").addClass("text-muted stampPosition").html(item.date);
      let textCategory = $("<span></span>").addClass("label label-info").html(item.category);
      let imageData = $('<img src="' + item.image + '"/><br>').addClass('postedImg');

      let shareButton = document.createElement('a');
      shareButton.setAttribute('href',"https://twitter.com/intent/tweet?text=" + item.content)
      shareButton.setAttribute('class', 'fa fa-twitter')
      
      // Condition to check and post either only image post or Image and text post in the forum list
      if (item.image.length > 0) {
          post.append(userIcon, userNick, textCategory, shareButton, userText, imageData, timeStamp);
        } else {
          post.append(userIcon, userNick, textCategory, shareButton, userText, timeStamp);
        }

      post.attr('itemID', item.id);
      forum.append(post);
    }
  }

  /**
   * @function refreshList() this function refreshes the list of forum posts once a new post is added and is called in the beginning. 
   */
  function refreshList() {
    fetch('/getItems', {
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then(dat => showList(dat))
      .catch(err => console.log(err));
  }

/**
 * @function addItem() gets the content form the client and sends it to the server via post fetch api request.
 */
  function addItem() {
    let author = $('#currentUserName').html();
    console.log("author： "+ author);

    let content = $.trim($('#postContent').val());
    console.log(content);

    let category = $('#postCategory').val();
    let postCity = city;
    let image = imageUrl;

    let date = new Date();
    date = date.toUTCString();
    console.log(date);

    if (content.length > 0) {
      let item = new window.exports.ForumPosts(-1, content, category, date, image, postCity, author);
      let json = JSON.parse(item.toJSON());

      // This is how to do a post request using the fetch API
      // Simply keep the headers as they are for JSON objects!
      fetch('/addItem', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          credentials: 'same-origin',
          body: JSON.stringify(json)
        })
        .then(res => {
          console.log(res);
          imageUrl = '';
          return res.json()
        })
        .then(data => refreshList())
        .catch(err => console.log("Error: " + err));
    }
  }

/**
 * 
 * @param {similar to showList fucntion, this function is written to populate the list of users, but for this project}
 * {the user's are not displayed in the final submitted version as we can login and we do not want the current user to see all the other logged in users.}} json 
 */
  function showUsers(json) {
    // Delete all todo blocks
    $('.user').remove();

    // Add the task to the appropriate day
    for (jsonuser of json.allusers) {
      // Convert the JSON object to an instance of class ForumPosts
      let item = new window.exports.UserDetails();
      item.fromJSON(jsonuser);
      //display posts in html
      let profile = $('#displayUser');
      let user = $('<div></div>').addClass('user').attr('id', item.uId);
      user.html(item.username);
      user.attr('userID', item.uId);

      profile.append(user);
    }
  }

  /**
   * @function refreshUser() refreshes the list of users to display on the client, but is not in use as we are hiding the list of all users from logged in user.
   */
  function refreshUser() {
    fetch('/getUser', {
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then(dat => showUsers(dat))
      .catch(err => console.log(err));
  }

  /**
   * @function addUser() this function sends new registered user's to the server similar functionality to the addItem(). 
   */
  function addUser() {
    let username = $.trim($('.username1').val());
    console.log(username);
    let password = $.trim($('.password1').val());
    console.log(password);

    if (username.length > 0) {
      let item = new window.exports.UserDetails(-1, username, password);
      let json = JSON.parse(item.toJSON());

      // This is how to do a post request using the fetch API
      // Simply keep the headers as they are for JSON objects!
      fetch('/addUser', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          credentials: 'same-origin',
          body: JSON.stringify(json)
        })
        .then(res => {
          console.log(res);
          return res.json()
        })
        .then(data => refreshUser())
        .catch(err => console.log("Error: " + err));
    }
  }
  //retrieves  the tweet object from the API and adds them to the HTML
  function getTweetsFromApi() {
    fetch('/getTweets')
      .then(response => response.json())
      .then(resp => extractTextFromTweet(resp))
      .catch(err => console.log(err));
      // this function extracts the relevant information and then appends it to the HTML
    function extractTextFromTweet(resp) {
      let info = resp;
      console.log(resp);
      //iterates through the entire array to get individual tweets
      for (i = 0; i < resp.length; i++) {
        let text = resp[i].text
        let tweet = document.createElement('li')
        let buttonToTweet = document.createElement('button');
        tweet.innerHTML = text;
        tweet.setAttribute('class', 'tweet');
        tweet.setAttribute('id', 'tweetNr' + i);
        
        buttonToTweet.innerHTML = "Read More";
        buttonToTweet.setAttribute('onclick', 'location.href=' + '"'+ 'https://twitter.com/metoffice' + '"')
        buttonToTweet.setAttribute('class', 'btn btn-link tweetMore')
        $('#tweetButton').append(tweet)
        $('#tweetNr' + i).append(buttonToTweet)

      }
    }
  }
  getTweetsFromApi();


}());
