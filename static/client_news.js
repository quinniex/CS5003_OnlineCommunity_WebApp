window.onload(getNews('Scotland Weather'))

function getNews(keyWord) {

  // this gets the current date
  let today = new Date()
  // this sets the date to three days earlier, error handling has to be introduced later
  let dateThreeDaysAgo = new Date(today);
  dateThreeDaysAgo.setDate(today.getDate() - 3);

  // newsAPI uses dates differently than used on the site (JAN = 0 vs JAN = 1), therefore the month is corrected
  let correctMonth = dateThreeDaysAgo.getMonth() + 1
  // transofrms the Date object into a string which is used for fetching
  let newsDate = dateThreeDaysAgo.getFullYear() + '-' + correctMonth + '-' + dateThreeDaysAgo.getDate()
  // creates the relevant url
  var url = 'https://newsapi.org/v2/everything?' +
    'q=' + keyWord + '&' +
    'from=' + newsDate + '&' +
    'language=en&' +
    'sortBy=relevancy&' +
    'apiKey=e6d3b665bd5d442b9c64a490490a1ea5';

  var req = new Request(url);
  // fetches the headlines and appends them to the dic
  fetch(req)
    .then(resp => resp.json())
    .then(resp => appendTopHeadline(resp))
    .catch(err => console.log(err));
}

// creates div with the headline, picture related to the article as well as a button which leads to the website the news are from
function appendTopHeadline(resp) {

  let info = resp
  let anchor = $('#headlineFeed')
  console.log(info)
  for (i = 0; i <= 10; i++) {
    // retrieves the information form the passed object
    let headline = info.articles[i].title
    let link = info.articles[i].url
    let picture = info.articles[i].urlToImage


    // cerates HTML elemts which are then appended to the news page
    let content = document.createElement('tr')
    let buttonToNews = document.createElement('button')
    let headlineItem = document.createElement('h4')
    let pictureFile = document.createElement('img')

    pictureFile.setAttribute('src', picture)
    pictureFile.setAttribute('class', 'newsImage')
    pictureFile.setAttribute('alt', '')

    
    content.setAttribute('id', 'newsNr' + i)
    headlineItem.innerHTML = headline
    headlineItem.setAttribute('class', 'headline')

    buttonToNews.innerHTML = 'Read more'
    buttonToNews.setAttribute('onclick', 'location.href=' + '"' + link + '"')
    buttonToNews.setAttribute('class', 'btn btn-link')
    $('#headlineFeed').append(content)
    $('#newsNr' + i).append(pictureFile)
    $('#newsNr' + i).append(headlineItem)
    $('#newsNr' + i).append(buttonToNews)
  }
}
