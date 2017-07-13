'use strict';

// API usage:
// - MediaWiki API
// - Google Books API

// Global variables
// Variable to hold the radio button input value (ISBN, author, title).
let radioValue = '';
// Variable to hold the user search input.
let searchTerm = '';
// Variable to hold the image path from getMovieConfig.
let imagePath = '';
// Variable to hold the current title of the book(s).
let bookTitle = '';
// Variable to hold the current author.
let bookAuthor = '';

// Variable to hold the current movie titles.
let movieTitle = [];


/*
Create URL path from API to get the baseUrl and fileSize (image dimensions).
This will be put into the imagePath variable to call later and append the path
to the image file of the movie poster.
*/
function getMovieConfig() {
  let apiQuery = {
    api_key: '768e86dde3174110a0fbfe80aa8bbb75'
  }
  $.getJSON("https://api.themoviedb.org/3/configuration", apiQuery, function(data) {
    let baseUrl = data.images.base_url;
    let fileSize = data.images.logo_sizes[4];
    imagePath = baseUrl + fileSize;
  });
}

/*
From the form submission, pull in the radioValue and searchTerm.
Depending on the value of the radio input (title, author, isbn):
- ISBN: search Google Books API, get the bookTitle and the bookAuthor, and
store them in the global variable. Call searchByIsbn function.
*/
function getSearchInput() {
  if (radioValue === 'isbn') {
    searchByIsbn();
  }
}

// function searchByAuthor() {
// }
//
// function searchByTitle() {
// }

// Search by ISBN. If 0 results show them a message or try again. If there is a
// result, send it to the getIsbnSearchResult function.
function searchByIsbn() {
  let apiQuery = {
    q: 'isbn:' + searchTerm,
    key: 'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc'
  }
  $.getJSON("https://www.googleapis.com/books/v1/volumes", apiQuery, function(data) {
    let totalItems = data.totalItems;
    if (totalItems === 0) {
      console.log("nothing found, try again.")
    } else {
    let getData = data.items;
    getIsbnSearchResult(getData);
  }
});
}

// Get the result from searchByIsbn and store the bookTitle and bookAuthor
// in the global variables.
function getIsbnSearchResult(getData) {
  console.log(getData)
  return getData.map(function(item) {
    bookTitle = item.volumeInfo.title;
    bookAuthor = item.volumeInfo.authors[0];
    searchMovieApi();
  });
}

/*
Depending on the result, get the results.
ISBN: search the movie API with the bookAuthor. For this need the person ID
from the API. Then search by crew.

*/
function searchMovieApi() {
  console.log(bookTitle, bookAuthor)
  let apiQuery = {
    query: bookAuthor,
    api_key: '768e86dde3174110a0fbfe80aa8bbb75'
  }
  $.getJSON("https://api.themoviedb.org/3/search/person", apiQuery, function(data) {
    console.log(data)
    // return data.map(function(item) {
    //   let getFilmsWritten = item.filmography.writer;
    //   console.log(getFilmsWritten)
    //   getFilmsWritten.forEach(function callback(currentValue) {
    //     console.log(currentValue.title === bookTitle);
    //   });
    // });
  });
}

// Event listener for the submit button.
$('.js-form').submit(function(event) {
  event.preventDefault();
  // Get the value of the radio button name (title, author, isbn) and store it
  // in the global variable.
  radioValue = $("input[name='option']:checked").val();
  // Get the value of the user input and store it in the global variable.
  searchTerm = $('.js-input').val();
  // Pass on the radioValue and searchTerm to getSearchInput.
  getMovieConfig();
  getSearchInput();
});

// Search by author.
// function searchByAuthor(searchTerm) {
//   let apiQuery = {
//     q: 'inauthor:' + searchTerm,
//     key: 'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc',
//     fields: 'items(volumeInfo(title))',
//     maxResults: 20
//   }
//   $.getJSON("https://www.googleapis.com/books/v1/volumes", apiQuery, bookResults);
// }

// Search by book title.
// function searchByTitle(searchTerm) {
//   let apiQuery = {
//     q: 'intitle:' + searchTerm,
//     key: 'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc',
//     fields: 'items(volumeInfo(title))',
//     maxResults: 20
//   }
//   $.getJSON("https://www.googleapis.com/books/v1/volumes", apiQuery, bookResults);
// }

// Send the results of the title(s) of the books into the bookTitles array.
// function bookResults(data) {
//   console.log(data)
//   let getItems = data.items;
//   console.log(getItems)
//   return getItems.map(function(item) {
//     bookTitles.push(item.volumeInfo.title);
//     return bookTitles;
//   });
// }

// Search the searchTerm against the movie API.
// function searchMovie(bookTitles) {
//   console.log(bookTitles)
//   let apiQuery = {
//     api_key: '768e86dde3174110a0fbfe80aa8bbb75',
//     query: bookTitles
//   }
//   $.getJSON("https://api.themoviedb.org/3/search/movie", apiQuery, movieResults);
// }
//
// function movieResults(data) {
//   console.log(data)
// }



















// Depending on the type of property, call the correct Google Books API call.
// function searchBooksApi(searchTerm) {
//   console.log(searchTerm)
//   let apiQuery = {
//     q: searchTerm,
//     key: 'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc',
//     fields: 'items(volumeInfo)',
//     maxResults: 10
//   }
//   console.log(apiQuery)
//   $.getJSON('https://www.googleapis.com/books/v1/volumes', apiQuery, function(data) {
//     // Check if any results came back. If not show error, if positive send
//     // the data on to getResults.
//     let totalResults = data.totalItems;
//     if (totalResults === 0) {
//       console.log('nothing found')
//     } else {
//       console.log('found')
//       getResults(data);
//     }
//   });
// }

// From the data, depending on title, author, ISBN, send it to the function
// to handle the search and match against the movieAPI.
// function getResults(data) {
//   if (radioValue === 'title') {
//     getTitle(data);
//   } else if (radioValue === 'author') {
//     getAuthor(data);
//   } else {
//     getIsbn(data);
//   }
// }

// ISBN data
// function getIsbn(data) {
//   console.log(data)
// }

// Author data
// function getAuthor(data) {
//   console.log(data)
// }

// Title data
// function getTitle(data) {
//   console.log(data)
//   let getItems = data.items;
//   console.log(getItems)
//   return getItems.map(function(item) {
//     let getBookTitles = item.volumeInfo.title;
//     bookTitles.push(getBookTitles);
//   });
//   return bookTitles;
// }
// console.log(bookTitles)

// Search movie API for movie titles.
// function searchForTitle() {
//   let apiQuery  = {
//     title: searchTerm
//   }
//   console.log(apiQuery)
//   $.getJSON('https://theimdbapi.org/api/find/movie', apiQuery, function(data) {
//     console.log(data)
//   });
// }

// If radioValue is title, search the movie API for a movie title to match.
// function getTitle(data) {
//   console.log(data)
//   let x = data.items;
//   console.log(x)
//   // return data.items.map(function(item) {
//   //   console.log()
//   // });
// }





// How to restrict the search to exactly the words 'The Shining' and get all results.
// How to make a function to pass in if its from ISBN, author, title.

// From the ISBN search, get the title of the book and the author to compare against the movie database
// to see if there is a match.
// function parseResults(data) {
//   console.log(data)
//   return data.items.map(function(item) {
//     console.log(item)
//     let bookTitle = item.volumeInfo.title;
//     console.log(bookTitle)
//     let bookAuthor = item.volumeInfo.authors[0];
//     console.log(bookAuthor)
//     searchMovieApi(bookTitle, bookAuthor);
//   });
// }

// function searchMovieApi(bookTitle, bookAuthor) {
//   console.log(bookTitle, bookAuthor)
// }

// Can I generalize this function for ISBN, author, or title search?

// Pass the bookTitle and bookAuthor values against the movie API to searchMovieApi
// for the bookTitle as movie title, and bookAuthor as the writer of that movie.
// let searchMovieApi = function movieApiSearch(bookTitle, bookAuthor) {
//   console.log(bookAuthor)
//   let apiQuery  = {
//     name: bookAuthor
//   }
//   console.log(apiQuery)
//   $.getJSON('https://theimdbapi.org/api/find/person', apiQuery, getMovieResults);
// }


// How can I generalize the function above so if I search by ISBN, author, or title,
// it will send to the getMovieResults function...as currently I am pulling out the
// searched ISBN number by author and title, and below getting the authors films,
// which he wrote for. I need to check against the bookTitle to see if there is
// a match with any of these titles.

//
// function getMovieResults(data) {
//   console.log(data[0])
//   console.log(data[0].filmography)
//   console.log(data[0].filmography.writer)
//   let x = data[0].filmography.writer;
//   console.log(x)
//   return x.map(function(item) {
//     console.log(item.title)
//   });
// }
