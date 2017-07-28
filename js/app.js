'use strict';

// Global variables
// Radio button input value (ISBN, author, title).
let radioValue = '';
// User search text.
let searchTerm = '';
// Image poster path from getMovieConfig.
let posterPath = '';
// Image backdrop path from getMovieConfig.
let backdropPath = '';
// Current title of the book(s).
let bookTitle = '';
// Current author.
let bookAuthor = '';
// bookAuthorId for movie search.
let bookAuthorId = '';
// Hold all the ajax results of calls.
let allItems = [];
// Hold clean items.
let allItemsCleaned = [];


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
    let posterSize = data.images.poster_sizes[4];
    let backdropSize = data.images.backdrop_sizes[2];
    posterPath = baseUrl + posterSize;
    backdropPath = baseUrl + backdropSize;
  });
  return getRadioValue();
}

/*
Check the value of the radioValue.
- If author: send to searchByPerson function.
- If title: search the movie API with the title of the movie.
- If ISBN: remove the hypens and replace the searchTerm value. Search the books
  API with the ISBN and get the author and title. Then search the movie API for
  the author as the writer of a movie, and if the title is found display it.
*/
function getRadioValue() {
  if (radioValue === 'isbn') {
    // Remove hypens from numbers (per API call for ISBN numbers).
    let cleanSearchTerm = searchTerm.replace(/-/g, "");
    searchTerm = 'isbn:' + cleanSearchTerm;
    searchBookIsbn();
  } else if (radioValue === 'author') {
    searchByPerson();
  } else {
    searchByTitle();
  }
}

// If the search input are ISBN numbers, make a call to books API and search by
// the ISBN. If there are results, get the bookTitle and mutate searchTerm to the
// bookTitle. Get the first author from the results and assign it to bookAuthor.
// From here searchIsbnByTitle.
function searchBookIsbn() {
  let apiQuery = {
    q: searchTerm,
    key: 'AIzaSyD7XwCHKgHcFqBw4S0EGu4RQi4lMcJjrrc'
  }
  $.getJSON("https://www.googleapis.com/books/v1/volumes", apiQuery, function(data) {
    let getData = data.items;
    if (getData != undefined) {
      return getData.map(function(data) {
        bookTitle = data.volumeInfo.title;
        searchTerm = bookTitle;
        bookAuthor = data.volumeInfo.authors[0];
        searchIsbnByTitle();
      });
    } else {
      $('.js-danger').fadeIn('slow').delay(1000).fadeOut('slow');
    }
  });
}

// Search movie API against the bookTitle. If results found, push the results
// into the allItems array. Then renderIsbnResults.
function searchIsbnByTitle() {
  let apiQuery = {
    query: searchTerm,
    api_key: '768e86dde3174110a0fbfe80aa8bbb75'
  }
  $.getJSON('https://api.themoviedb.org/3/search/movie', apiQuery, function(data) {
    let getData = data.items;
    let getResults = data.total_results;
    if (getResults != 0) {
      let getData = data.results;
      allItems.push(getData);
      renderIsbnResults();
    } else {
      $('.js-danger').fadeIn('slow').delay(1000).fadeOut('slow');
    }
  });
}

// From allItems array get the first movie, and from there get the movie title,
// movie overview, backdrop image path, poster image path. Combine the backdrop
// and poster partial paths from earlier call in getMovieConfig to make full paths.
function renderIsbnResults() {
  let getMovie = allItems[0][0];
  let movieTitle = getMovie.title;
  let movieOverview = getMovie.overview;
  let getBackdropPath = getMovie.backdrop_path;
  let getPosterPath = getMovie.poster_path;
  let posterImagePath = posterPath + getPosterPath;
  let backdropImagePath = backdropPath + getBackdropPath;
  if (getPosterPath != null) {
    $('.js-results').html(
      '<div class="hero-section">' +
        '<div class="hero-section-text">' +
          '<img src="' + posterImagePath + '">' +
          '<h1>' + movieTitle + '</h1>' +
          '<h2>' + 'Written by: ' + bookAuthor + '</h2>' +
          '<p>' + movieOverview + '</p>' +
        '</div>' +
      '</div>'
    );
    // Background is made using inline code because of backdropImagePath value needed.
    $('.hero-section').css("background", "linear-gradient(rgba(35, 92, 153, 0.75) 5%, rgba(242, 236, 233, 1)) 0%, url(" + backdropImagePath + ") 50% no-repeat");
    $('.hero-section').css("background-size", "cover");
    $('.js-results').fadeIn('slow');
  } else {
    $('.js-results').html(
      '<div class="hero-section">' +
        '<div class="hero-section-text">' +
          '<h1>' + movieTitle + '</h1>' +
          '<h2>' + 'Written by: ' + bookAuthor + '</h2>' +
          '<p>' + movieOverview + '</p>' +
        '</div>'
    );
    $('.hero-section').css("background-color", "white");
    $('.js-results').fadeIn('slow');
  }
}

// Search movie API against the bookTitle. If results found, push the results
// into the allItems array. Then clean up the allItems array using cleanAllItems.
function searchByTitle() {
  let apiQuery = {
    query: searchTerm,
    api_key: '768e86dde3174110a0fbfe80aa8bbb75'
  }
  $.getJSON('https://api.themoviedb.org/3/search/movie', apiQuery, function(data) {
    let getData = data.items;
    let getResults = data.total_results;
    if (getResults != 0) {
      let getDataResults = data.results;
      allItems = getDataResults;
      renderTitleResults();
    } else {
      $('.js-danger').fadeIn('slow').delay(1000).fadeOut('slow');
    }
  });
}

// Render title results.
function renderTitleResults() {
  return allItems.map(function(movie) {
    let getPosterPath = movie.poster_path;
    let getBackdropPath = movie.backdrop_path;
    if (getPosterPath != null) {
      let movieTitle = movie.title;
      let movieOverview = movie.overview;
      let backdropImagePath = backdropPath + getBackdropPath;
      let posterImagePath = posterPath + getPosterPath;
      $('.js-results').append(
        '<div class="hero-section">' +
          '<div class="hero-section-text">' +
            '<img src="' + posterImagePath + '">' +
            '<h1>' + movieTitle + '</h1>' +
            '<p>' + movieOverview + '</p>' +
          '</div>' +
        '</div>'
      );
      $('.hero-section').css("background", "linear-gradient(rgba(35, 92, 153, 0.75) 5%, rgba(242, 236, 233, 1)) 0%");
      $('.js-results').fadeIn('slow');
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
    let getResults = data.total_results;
    if (getResults != 0) {
      bookAuthorId = data.results[0].id;
      searchByWriter();
    } else {
      $('.js-danger').fadeIn('slow').delay(1000).fadeOut('slow');
    }
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
    let getCrewData = data.crew;
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
    let movieTitle = movie.title;
    let movieOverview = movie.overview;
    let writingDept = movie.department;
    let getPosterPath = movie.poster_path;
    let posterImagePath = posterPath + getPosterPath;
    if (writingDept === 'Writing' && getPosterPath != null && mediaType === 'movie') {
      $('.js-results').append(
        '<div class="hero-section">' +
          '<div class="hero-section-text">' +
            '<img src="' + posterImagePath + '">' +
            '<h1>' + movieTitle + '</h1>' +
            '<p>' + movieOverview + '</p>' +
          '</div>' +
        '</div>'
      );
      $('.hero-section').css("background", "linear-gradient(rgba(35, 92, 153, 0.75) 5%, rgba(242, 236, 233, 1)) 0%");
      $('.js-results').fadeIn('slow');
    }
  });
}


// Show correct text in call out box depending on the chosen radio button. IIFE
// so the function is started when page is loaded.
(function showCallOut() {
	$("input[type=radio]").click(function(event) {
	let checkedValue = $("input[name='option']:checked").val();
	if (checkedValue === 'title') {
		$('.js-callout').html(
		'<h5>Search by Title of Book</h5>' +
		'<p>Examples: Hidden Figures, Live By Night, The Lost City of Z</p>'
		);
	} else if (checkedValue === 'author') {
		$('.js-callout').html(
		'<h5>Search by Author</h5>' +
		'<p>Examples: Stephen King, J. K. Rowling, Maurice Sendak</p>'
		);
	} else {
		$('.js-callout').html(
		'<h5>Search by ISBN</h5>' +
		'<p>Examples: 9781101946343, 978-0-385-35139-3, 0307588378</p>'
		);
	}
	});
})();

// When user clicks on the input field, clear out the searchTerm.
function clearValues() {
  $("input[type='text']").on("click", function () {
    $(this).select();
    searchTerm = '';
    radioValue = '';
    bookTitle = '';
    bookAuthor = '';
    bookAuthorId = '';
    allItems = [];
  });
}

// Event listener for the submit button.
$('.js-form').submit(function(event) {
  event.preventDefault();
  // If there is existing content, fade it out first.
  $('.js-results').hide();
  $('.js-results').html("");
  // Get the value of the radio button name (title, author, isbn) and store it
  // in the global variable.
  radioValue = $("input[name='option']:checked").val();
  // Get the value of the user input and store it in the global variable.
  searchTerm = $('.js-input').val();
  // Pass on the radioValue and searchTerm to getSearchInput.
  getMovieConfig();
  clearValues();
});

// How to restrict the search to exactly the words 'The Shining' and get all results.
