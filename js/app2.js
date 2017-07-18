'use strict';

// Global variables
// Radio button input value (ISBN, author, title).
let radioValue = '';
// User search text.
let searchTerm = '';
// Image path from getMovieConfig.
let imagePath = '';
// Current title of the book(s).
let bookTitle = '';
// Current author.
let bookAuthor = '';
// bookAuthorId for movie search.
let bookAuthorId = '';
// Author's books.
let authorBooks = [];
// Hold all the ajax results of calls.
let allItems = [];
// Modified version of the allItems array (for ISBN).
let allItemsCombined = [];
// Page counter for results of pages from ajax call. Start at
// 1 so page number in query is equal to 1.
let pageCounter = 1;


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
  return getRadioValue();
}

/*
Check the value of the radioValue.
- If author: send to searchByPerson function.
- If title: search the movie API with the title of the movie.
- If ISBN: search the books API with the ISBN and get the author and title. Then
  search the movie API for the author as the writer of a movie, and if the title
  is found display it.
*/
function getRadioValue() {
  if (radioValue === 'isbn') {
    // Remove hypens from numbers (per API call for ISBN numbers).
    let cleanSearchTerm = searchTerm.replace(/-/g, "");
    searchTerm = 'isbn:' + cleanSearchTerm;
    searchBook();
  } else if (radioValue === 'author') {
    searchByPerson();
  } else {
    searchByTitle();
  }
}

// If the search is for ISBN, make a call to books API and search for the ISBN.
// Call the query by getRadioValue function to get the correct search parameter.
function searchBook() {
  let apiQuery = {
    q: searchTerm,
    key: 'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc'
  }
  $.getJSON("https://www.googleapis.com/books/v1/volumes", apiQuery, function(data) {
    let getData = data.items;
    return getData.map(function(data) {
      bookTitle = data.volumeInfo.title;
      searchTerm = bookTitle;
      bookAuthor = data.volumeInfo.authors[0];
      return searchByTitle();
    });
  });
}

// Search movie API against the bookTitle.
function searchByTitle() {
  let apiQuery = {
    query: searchTerm,
    api_key: '768e86dde3174110a0fbfe80aa8bbb75'
  }
  $.getJSON('https://api.themoviedb.org/3/search/movie', apiQuery, function(data) {
    console.log(data)
    if (radioValue === 'isbn') {
      let getData = data.results[0];
      renderIsbnResults(getData);
    } else {
      let getData = data.results;
      renderTitleResults(getData);
    }
  });
}

/*
To search by author, search the movie API against the person. Get the ID and store it.
Then run a search for the person with that ID to get the results.
*/
function searchByPerson() {
  let apiQuery = {
    query: searchTerm,
    api_key: '768e86dde3174110a0fbfe80aa8bbb75'
  }
  $.getJSON("https://api.themoviedb.org/3/search/person", apiQuery, function(data) {
    console.log(data)
    // From the search by author, get the first result and get the bookAuthorId.
    // Trigger the searchByWriter function.
    bookAuthorId = data.results[0].id;
    return searchByWriter();
  });
}

// After obtaining the bookAuthorId, search the movie API against the 'combined_credits'.
// From the search, get the results for 'crew' and push them into allItems array.
// Fire the renderWritingResults function.
function searchByWriter() {
  let getJSONUrl = 'https://api.themoviedb.org/3/person/' + bookAuthorId + '/combined_credits';
  let apiQuery = {
    api_key: '768e86dde3174110a0fbfe80aa8bbb75'
  }
  $.getJSON(getJSONUrl, apiQuery, function(data) {
    console.log(data)
    let getCrewData = data.crew;
    console.log(getCrewData)
    for (var i = 0; i < getCrewData.length; i++) {
      allItems.push(getCrewData[i]);
    }
    return renderWritingResults();
  });
}

// From the allItems array for each object, get the movie department, and create
// the image url for the poster of the movie and the full path to the image.
// From the results, if the department for the author shows 'writing' AND there is
// a poster image associated with that movie, show them on the page.
function renderWritingResults() {
  return allItems.map(function(movie) {
    let mediaType = movie.media_type;
    let getTitle = movie.title;
    let getOverview = movie.overview;
    let getWritingDept = movie.department;
    let getPosterPath = movie.poster_path;
    let getFullImagePath = imagePath + getPosterPath;
    if (getWritingDept === 'Writing' && getPosterPath != null && mediaType === 'movie') {
      $('.js-results').append(
        '<div class="large-4 column">' +
        '<div class="card-user-profile">' +
          '<img class="card-user-profile-img" src="' + getFullImagePath + '" alt="' + searchTerm + '"/>' +
          '<div class="card-user-profile-content card-section">' +
            '<p class="card-user-profile-name">' + getTitle + '</p>' +
            '<p class="card-user-profile-status">' + bookAuthor + '</p>' +
            '<p class="card-user-profile-info">' + getOverview + '</p>' +
          '</div>' +
        '</div>' +
        '</div>'
      );
      $('.movie-results').fadeIn('slow');
    }
  });
}

// Render title results.
function renderTitleResults(getData) {
  return getData.map(function(movie) {
    let getTitle = movie.title;
    let getOverview = movie.overview;
    let getPosterPath = movie.poster_path;
    let getFullImagePath = imagePath + getPosterPath;
    if (getPosterPath != null) {
      $('.js-results').append(
        '<div class="large-4 column">' +
        '<div class="card-user-profile">' +
          '<img class="card-user-profile-img" src="' + getFullImagePath + '" alt="' + searchTerm + '"/>' +
          '<div class="card-user-profile-content card-section">' +
            '<p class="card-user-profile-name">' + getTitle + '</p>' +
            '<p class="card-user-profile-info">' + getOverview + '</p>' +
          '</div>' +
        '</div>' +
        '</div>'
      );
      $('.movie-results').fadeIn('slow');
    }
  });
}

// Render ISBN results.
function renderIsbnResults(getData) {
  let getTitle = getData.title;
  let getOverview = getData.overview;
  let getPosterPath = getData.poster_path;
  let getFullImagePath = imagePath + getPosterPath;
  if (getPosterPath != null) {
    $('.js-results').append(
      '<div class="large-4 column">' +
      '<div class="card-user-profile">' +
        '<img class="card-user-profile-img" src="' + getFullImagePath + '" alt="' + searchTerm + '"/>' +
        '<div class="card-user-profile-content card-section">' +
          '<p class="card-user-profile-name">' + getTitle + '</p>' +
          '<p class="card-user-profile-status">' + bookAuthor + '</p>' +
          '<p class="card-user-profile-info">' + getOverview + '</p>' +
        '</div>' +
      '</div>' +
      '</div>'
    );
    $('.movie-results').fadeIn('slow');
  }
}

// Get the results from the the movie API. Store the page number, total pages,
// and data in variables.
// function getMoviesResults(data) {
//   let pageNum = data.page;
//   console.log(pageNum)
//   let totalPages = data.total_pages;
//   console.log(totalPages)
//   let getResults = data.results;
//   console.log(getResults)
//   // Run a loop to keep getting the results and storing them into the allItems
//   // array until the amount of pages returned is finished. Every loop, increment
//   // the pageCounter by 1 to keep track. Then run the searchMovies x number of
//   // times of pages returned.
//   // if (pageNum <= totalPages) {
//   //   allItems.push(getResults);
//   //   pageCounter ++;
//   //   searchByTitle();
//   // } else {
//   //   getMovieResults();
//   // }
// }

// Show correct text in call out depending on the chosen radio button.
(function showCallOut() {
	$("input[type=radio]").click(function(event) {
	let checkedValue = $("input[name='option']:checked").val();
	if (checkedValue === 'title') {
		$('.js-callout').text("");
		$('.js-callout').append(
		'<h5>Search by Title of Book</h5>' +
		'<p>Hidden Figures, Live By Night, The Lost City of Z</p>'
		);
	} else if (checkedValue === 'author') {
		$('.js-callout').text("");
		$('.js-callout').append(
		'<h5>Search by Author</h5>' +
		'<p>Stephen King, J. K. Rowling, Maurice Sendak</p>'
		);
	} else {
		$('.js-callout').text("");
		$('.js-callout').append(
		'<h5>Search by ISBN</h5>' +
		'<p>9781101946343, 978-0-385-35139-3, 0307588378</p>'
		);
	}
	});
})();


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
  // searchBook();
  // getSearchInput();
});




// How to restrict the search to exactly the words 'The Shining' and get all results.
// How to make a function to pass in if its from ISBN, author, title.
