/*
BookWatch
BookWatch is a web application for searching for movies, which are based-off
of books. Search by author, title, or ISBN.
*/

/*
Low Level
- On submit, capture value of radio button selected, and value of the input field.
- Make a function which passes in the searchTerm and getRadioValue and checks to searchTerm
which radio value has been chosen. Depending on that, add the needed API parameter here from
Google Books (isbn:, inauthor:, intitle:) and pass that plus the searchTerm into the next function.
- The next function needs to have a way to take in the searchTerm and get the search data. So if
e.g. Stephen King was entered, from Google Books get the author to match Stephen King.
- How do I handle a non space? Give instructions on the screen depending on what radio choice they select
in the beginning, so if they choose ISBN, give them an example and then have the search bar below the example.
So if ISBN radio is chosen "Enter the ISBN number of the book. Should be 9 or 13 numbers. (e.g. 3939484930)".
If author, "Enter author name to search by (e.g. stephen king). Make sure to put spaces." IF title then just
"Enter title to search by." Later if possible try to restrict the input field based on the radio button which is selected.
So if ISBN is selected before the user types anything to search, set the field to have no more then the max numbers
an ISBN has, and only allow numbers at that point. IF title or author, then no numbers allowed, no maximum.
- If nothing is found due to user error or result, show something on the page like no results found, please try again
or search by another option.
*/

'use strict';

// Watch for submit.
function userInput() {
  $('.js-form').submit(function(event) {
    event.preventDefault();
    searchInput();
  });
}

// From the form submission, pull in the getRadioValue (isbn, author, title) and
// their searchTerm. Depending on the value, send the searchTerm along with anonymous
// API parameters to the runSearch function.
// function searchInput(getRadioValue, searchTerm) {
//   let radioValue = $("input[name='option']:checked").val();
//   console.log(radioValue);
//   // if (getRadioValue === 'isbn') {
//   //   runSearch("isbn:" + searchTerm);
//   // } else if (getRadioValue === 'author') {
//   //   runSearch("inauthor:" + searchTerm);
//   // } else if (getRadioValue === 'title') {
//   //   runSearch("intitle:" + searchTerm);
//   // }
// }

// This function will take the searchTerm, endPoint, apiKey, apiQuery as arguments.
// The last three arguments are needed for the $.getJSON() method to execute.
// This way we can call the function as needed using either of the movie or book api.
// function runSearch(searchTerm, endPoint, apiKey) {
//   console.log(searchTerm)
//   let apiQuery = {
//     q: searchTerm,
//     key: apiKey
//   }
//   $.getJSON(endPoint, apiQuery, getResults);
// }
//
// function getResults() {
// }

// After everything is done, this will run the web app calling all other functions.
// function () {
//
// }

// let x = runSearch(searchTerm, 'https://www.googleapis.com/books/v1/volumes', 'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc')


// From the results, this function will check if any results came back or not.
  // Get the total number of items returned
  // let totalResults = data.totalItems;
  // console.log(totalResults)
  // If there is none, show the user an error message or none found.
  // if (totalResults === 0) {
  //   console.log("nothing found")
  // } else {
  //   console.log("found")
    // let titleOfBook = data.items.map(function(obj) {
    // return obj.volumeInfo.title;
  // }
  // console.log(titleOfBook)
// }

// function resultsByAuthor(data) {
//   runSearch({
//     q: 'stephen king',
//     'https://www.googleapis.com/books/v1/volumes',
//     'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc'
//   })
// }
// let x = runSearch('stephen king', 'https://www.googleapis.com/books/v1/volumes', 'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc')

// Receive the data from the API call, depending on author, title, ISBN.
// function getResults(data) {
//   console.log(data)
//   // Get the total number of items returned
//   let totalResults = data.totalItems;
//   // If there is none, show the user an error message or none found.
//   if (totalResults === 0) {
//     console.log("nothing found")
//   } else {
//     console.log("found")
//     let titleOfBook = data.items.map(function(obj) {
//       return obj.volumeInfo.title;
//     });
//     console.log(titleOfBook)
//   }
//   // var x = data.items[0].volumeInfo.title;
//   // console.log(x)
//   // for (var i = 0; i < data.length; i++) {
//   //   dataArray.push(i);
//   //   return dataArray;
//   // }
// }


// If searched by Author
// let newResults = function() {
//   let x = runSearch('stephen king', 'https://www.googleapis.com/books/v1/volumes', 'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc')
// };



// function userInput() {
//   $('.js-form').submit(function(event) {
//     event.preventDefault();
//     alert("hi")
//     // Get the value of the radio button checked: isbn, author, or title.
//     // if (!$('input[name=option]:checked').length > 0) {
//     //   alert("hi")
//     // }
//     // Get the value of the user search input.
//     // let searchTerm = $('.js-input').val();
//     // Check if the required fields are selected before submitting.
//     // let checkInputs = function checkInputs() {
//     //   if (getRadioValue.length > 0) {
//     //     alert("fill it in")
//     //   }
//     // };
//
//
//
//     // Run the function to searchBy passing in the two variables.
//     // searchInput(getRadioValue, searchTerm);
//     // Run the getData function with the search term and the successCall.
//     // getSearch(searchTerm, getResults)
//     // $("#photos").empty().append("");
//   });
// }




// Create function to get results by ISBN.
// function searchByAuthor(searchTerm) {
//   // Endpoint URL for volumes search for books.
//   let getEndpoint = 'https://www.googleapis.com/books/v1/volumes';
//   // Create query to pass to the url.
//   var apiQuery = {
//     q: "isbn:" + searchTerm,
//     key: 'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc'
//   };
//   $.getJSON(getEndpoint, apiQuery, getResults);
// }

// Create function to get results by ISBN.
// function searchByIsbn(searchTerm, myEndPoint) {
//   // Endpoint URL for volumes search for books.
//   let getEndpoint = 'https://www.googleapis.com/books/v1/volumes';
//   // Create query to pass to the url.
//   var apiQuery = {
//     q: "isbn:" + searchTerm,
//     key: 'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc'
//   };
//   $.getJSON(getEndpoint, apiQuery, getResults);
// }










// Create a function to get the data. Pass two parameters, one for the searchTerm
// and one for the callback.
// var getData = function(searchTerm, callback) {
//   // Get the image of the movie search query.
//   var getImageUrl = 'https://api.themoviedb.org/3/search/movie';
//   var movieApiQuery = {
//     api_key: '768e86dde3174110a0fbfe80aa8bbb75',
//     query: "the grapes of wrath"
//   };
//   // Call the jQuery $.getJSON to make the ajax call.
//   $.getJSON(getImageUrl, movieApiQuery, successCall);
// };

// TMDB endpoint for configuration, this is needed as per the API:
// "In order to generate a fully working image URL, you'll need 3 pieces of data.
// Those pieces are a base_url, a file_size and a file_path."

// Get the base_url and file_size from /configuration endpoint.
// var getBaseUrl = function getBaseUrl(obj) {
//   let baseUrl = obj.image.base_url;
//   console.log(baseUrl)
//   let fileSize = obj.images.still_sizes[2];
//   console.log(fileSize)
//   return baseUrl + fileSize;
// };

// Get image from TMDB.
// function successCall(obj) {
//   var imageUrl = 'https://image.tmdb.org/t/p/w300';
//   var imagePath = obj.results[0].poster_path;
//   var imageFullUrl = imageUrl + imagePath;
//     // imageFullUrl: imageUrl + imagePath
//   console.log(imageUrl)
//   console.log(imagePath)
//   console.log(imageFullUrl)
// }

// Create a function to pass into the $.getJSON function to show the results.
// function successCall(data) {
//   return data.items.map(function(item, index) {
//     // From the returned call, get variables for image thumbnail, page Id, and append them into the page.
//     // This will append images into the #photos and show the image thumbnail with a link to the page
//     // of the video.
//     var imageBaseUrl = item.images.base_url;
//     console.log(imageBaseUrl)
//   });
// }




/*
You'll notice that movie, TV and person objects contain references to different
file paths. In order to generate a fully working image URL, you'll need 3 pieces
of data. Those pieces are a base_url, a file_size and a file_path.

The first two pieces can be retrieved by calling the /configuration API and
the third is the file path you're wishing to grab on a particular media object.
Here's what a full image URL looks like if the poster_path
of /kqjL17yufvn9OVLyXYpvtyrFfak.jpg was returned for a movie, and you were looking
for the w500 size:

https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
*/














// // Revealing Module Pattern
// var bookWatch = function () {
//   var apiObj = {
//     q: searchTerm,
//     part: 'snippet',
//     key: 'AIzaSyBMm-e7xij-SURbVFOzlT8sKPWPhxxoUSU',
//     url: 'https://www.googleapis.com/youtube/v3',
//     maxResults: 5
//   }
//   $.getJSON(apiUrl, query, successCall);
//
//   return {
//     bookWatch: bookWatch
//   };
// }();
