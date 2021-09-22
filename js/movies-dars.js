const genres = [];

const elMovieSearchForm = document.querySelector('.js-movie-search-form');
const elMovieSearchInput = elMovieSearchForm.querySelector('.js-movie-search-input');
const elGenresSelect = elMovieSearchForm.querySelector('select');
const elFromYear = elMovieSearchForm.querySelector('.js-from-year');
const elToYear = elMovieSearchForm.querySelector('.js-to-year');
const elSearchRating = elMovieSearchForm.querySelector('.js-search-rating');
const elMoviesList = document.querySelector('.movies__list');

const elMoviesItemTemplate = document.querySelector('#movies-item-template').content;


// MODAL
const elMovieInfoModal = document.querySelector('.movie-info-modal');
const elMovieInfoModalTitle = elMovieInfoModal.querySelector('.movie-info-modal__title');
const elMovieInfoModalRating = elMovieInfoModal.querySelector('.movie-info-modal__rating');
const elMovieInfoModalYear = elMovieInfoModal.querySelector('.movie-info-modal__year');
const elMovieInfoModalDuration = elMovieInfoModal.querySelector('.movie-info-modal__duration');
const elMovieInfoModalIFrame = elMovieInfoModal.querySelector('.movie-info-modal__iframe');
const elMovieInfoModalCategories = elMovieInfoModal.querySelector('.movie-info-modal__categories');
const elMovieInfoModalSummary = elMovieInfoModal.querySelector('.movie-info-modal__summary');
const elMovieInfoModalImdbLink = elMovieInfoModal.querySelector('.movie-info-modal__imdb-link');


function getUniqueGenres () {
  movies.forEach(movie => {
    movie.categories.forEach(category => {
      if (!genres.includes(category)) {
        genres.push(category);
      }
    });
  });
  genres.sort();
}

function showGenreOptions() {
  const elGenresFragment = document.createDocumentFragment();
  genres.forEach(genre => {
    const elGenreOption = document.createElement('option');
    elGenreOption.textContent = genre;
    elGenreOption.value = genre;
    elGenresFragment.appendChild(elGenreOption);
  });
  elGenresSelect.appendChild(elGenresFragment);
}

function getHoursStringFromMinutes (minutes) {
  return `${Math.floor(minutes / 60)} hrs ${minutes % 60} mins`;
}

function showMovies (movies) {
  elMoviesList.innerHTML = '';
  const elMoviesFragment = document.createDocumentFragment();

  for (let movie of movies) {
    const elNewMoviesItem = elMoviesItemTemplate.cloneNode(true);
    elNewMoviesItem.querySelector('.movie__img').src = movie.youtubePoster;
    elNewMoviesItem.querySelector('.movie__img').alt = `${movie.title} poster`;
    elNewMoviesItem.querySelector('.movie__title').textContent = movie.title;
    elNewMoviesItem.querySelector('.movie__rating').textContent = movie.imdbRating;
    elNewMoviesItem.querySelector('.movie__year').textContent = movie.year;
    elNewMoviesItem.querySelector('.movie__duration').textContent = getHoursStringFromMinutes(movie.runtime);
    elNewMoviesItem.querySelector('.movie__categories').textContent = movie.categories.join(', ');
    elNewMoviesItem.querySelector('.js-more-info-button').dataset.imdbId = movie.imdbId;

    elMoviesFragment.appendChild(elNewMoviesItem);
  }

  elMoviesList.appendChild(elMoviesFragment);
}

function updateMovieInfoModal (imdbId) {
  const movie = movies.find(movie => movie.imdbId === imdbId);

  elMovieInfoModalTitle.textContent = movie.title;
  elMovieInfoModalRating.textContent = movie.imdbRating;
  elMovieInfoModalYear.textContent = movie.year;
  elMovieInfoModalDuration.textContent = getHoursStringFromMinutes(movie.runtime);
  elMovieInfoModalIFrame.src = `https://www.youtube-nocookie.com/embed/${movie.youtubeId}`;
  elMovieInfoModalCategories.textContent = movie.categories.join(', ');
  elMovieInfoModalSummary.textContent = movie.summary;
  elMovieInfoModalImdbLink.href = `https://www.imdb.com/title/${movie.imdbId}`;
}


elMoviesList.addEventListener('click', evt => {
  if (evt.target.matches('.js-more-info-button')) {
    updateMovieInfoModal(evt.target.dataset.imdbId);
  }
});

elMovieInfoModal.addEventListener('hidden.bs.modal', () => {
  elMovieInfoModalIFrame.src = '';
});

let elSelectGenre = document.querySelector('.js-select-genre');
function findMovies (titleRegex) {
  return movies.filter(movie => movie.title.match(titleRegex) && elSelectGenre.value === 'All' || movie.categories.includes(elSelectGenre.value) && movie.year >= (Number(elFromYear.value) || 2000) && movie.year <= (Number(elToYear.value) || 2019) && movie.imdbRating >= Number(elSearchRating.value)
  );
}

function onMovieSearchFormSubmit (evt) {
  evt.preventDefault();

  const titleRegex = new RegExp(elMovieSearchInput.value, 'gi');
  const foundMovies = findMovies(titleRegex);

  if (foundMovies.length > 0) {
    showMovies(foundMovies);
  } else {
    elMoviesList.innerHTML = '<div class="col-12">No film found</div>';
  }
}

if (elMovieSearchForm) {
  elMovieSearchForm.addEventListener('submit', onMovieSearchFormSubmit);
}

// Natijalar soniga ko'ra nechta bet bo'lishini aniqlaymiz
let TOTAL_RESULTS = 200;
let PER_PAGE_COUNT = 10;
let PAGE_LINKS_TO_SHOW = 5; // only odd numbers
let NEIGHBOUR_PAGES_COUNT = Math.floor(PAGE_LINKS_TO_SHOW / 2);
let CURRENT_PAGE = 1;
let PAGES_COUNT = Math.ceil(TOTAL_RESULTS / PER_PAGE_COUNT);


function showPagination() {
  let startPage = CURRENT_PAGE - NEIGHBOUR_PAGES_COUNT;
  let endPage = CURRENT_PAGE + NEIGHBOUR_PAGES_COUNT;

  if (endPage > PAGES_COUNT) {
    startPage -= Math.abs(PAGES_COUNT - endPage);
  }

  for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {
    if (pageIndex < 1) {
      endPage++;
      continue;
    }

    if (pageIndex > PAGES_COUNT) {
      break;
    }

    if (pageIndex === CURRENT_PAGE) {
      console.log(`${pageIndex} active`);
    } else {
      console.log(pageIndex);
    }
  }
}

function goToPage (pageIndex) {
  if (pageIndex > PAGES_COUNT) {
    pageIndex = PAGES_COUNT;
  }

  if (pageIndex < 1) {
    pageIndex = 1;
  }

  CURRENT_PAGE = pageIndex;
  showPagination();
}

function goToPrevPage () {
  goToPage(CURRENT_PAGE - 1);
}

function goToNextPage () {
  goToPage(CURRENT_PAGE + 1);
}

function goToFirstPage () {
  goToPage(1);
}

function goToLastPage () {
  goToPage(PAGES_COUNT);
}

showPagination();

getUniqueGenres();
showGenreOptions();
showMovies(movies.slice(0, 51));







// // GLOBAL VARS
// const genres = [];

// // SEARCH FORM
// const elMovieSearchForm = document.querySelector('.js-movie-search-form');
// const elMovieSearchInput = elMovieSearchForm.querySelector('.js-movie-search-input');
// const elGenresSelect = elMovieSearchForm.querySelector('select');
// const elMinYearInput = elMovieSearchForm.querySelector('.js-start-year-input');
// const elMaxYearInput = elMovieSearchForm.querySelector('.js-end-year-input');
// const elSortSelect = elMovieSearchForm.querySelector('.js-sort-select');

// // RESULT
// const elMoviesList = document.querySelector('.movies__list');

// // TEMPLATE
// const elMoviesItemTemplate = document.querySelector('#movies-item-template').content;

// // MODAL
// const elMovieInfoModal = document.querySelector('.movie-info-modal');
// const elMovieInfoModalTitle = elMovieInfoModal.querySelector('.movie-info-modal__title');
// const elMovieInfoModalRating = elMovieInfoModal.querySelector('.movie-info-modal__rating');
// const elMovieInfoModalYear = elMovieInfoModal.querySelector('.movie-info-modal__year');
// const elMovieInfoModalDuration = elMovieInfoModal.querySelector('.movie-info-modal__duration');
// const elMovieInfoModalIFrame = elMovieInfoModal.querySelector('.movie-info-modal__iframe');
// const elMovieInfoModalCategories = elMovieInfoModal.querySelector('.movie-info-modal__categories');
// const elMovieInfoModalSummary = elMovieInfoModal.querySelector('.movie-info-modal__summary');
// const elMovieInfoModalImdbLink = elMovieInfoModal.querySelector('.movie-info-modal__imdb-link');


// // FUNCTIONS
// function getUniqueGenres () {
//   movies.forEach(movie => {
//     movie.categories.forEach(category => {
//       if (!genres.includes(category)) {
//         genres.push(category);
//       }
//     });
//   });
//   genres.sort();
// }

// function showGenreOptions() {
//   const elGenresFragment = document.createDocumentFragment();
//   genres.forEach(genre => {
//     const elGenreOption = document.createElement('option');
//     elGenreOption.textContent = genre;
//     elGenreOption.value = genre;
//     elGenresFragment.appendChild(elGenreOption);
//   });
//   elGenresSelect.appendChild(elGenresFragment);
// }

// function getHoursStringFromMinutes (minutes) {
//   return `${Math.floor(minutes / 60)} hrs ${minutes % 60} mins`;
// }

// function showMovies (movies) {
//   elMoviesList.innerHTML = '';
//   const elMoviesFragment = document.createDocumentFragment();

//   for (let movie of movies) {
//     const elNewMoviesItem = elMoviesItemTemplate.cloneNode(true);
//     elNewMoviesItem.querySelector('.movie__img').src = movie.youtubePoster;
//     elNewMoviesItem.querySelector('.movie__img').alt = `${movie.title} poster`;
//     elNewMoviesItem.querySelector('.movie__title').textContent = movie.title;
//     elNewMoviesItem.querySelector('.movie__rating').textContent = movie.imdbRating;
//     elNewMoviesItem.querySelector('.movie__year').textContent = movie.year;
//     elNewMoviesItem.querySelector('.movie__duration').textContent = getHoursStringFromMinutes(movie.runtime);
//     elNewMoviesItem.querySelector('.movie__categories').textContent = movie.categories.join(', ');
//     elNewMoviesItem.querySelector('.js-more-info-button').dataset.imdbId = movie.imdbId;

//     elMoviesFragment.appendChild(elNewMoviesItem);
//   }

//   elMoviesList.appendChild(elMoviesFragment);
// }

// function updateMovieInfoModal (imdbId) {
//   const movie = movies.find(movie => movie.imdbId === imdbId);

//   elMovieInfoModalTitle.textContent = movie.title;
//   elMovieInfoModalRating.textContent = movie.imdbRating;
//   elMovieInfoModalYear.textContent = movie.year;
//   elMovieInfoModalDuration.textContent = getHoursStringFromMinutes(movie.runtime);
//   elMovieInfoModalIFrame.src = `https://www.youtube-nocookie.com/embed/${movie.youtubeId}`;
//   elMovieInfoModalCategories.textContent = movie.categories.join(', ');
//   elMovieInfoModalSummary.textContent = movie.summary;
//   elMovieInfoModalImdbLink.href = `https://www.imdb.com/title/${movie.imdbId}`;
// }

// function findMovies (titleRegex) {
//   return movies.filter(movie => {
//     const meetsCriteria = movie.title.match(titleRegex) && (elGenresSelect.value === 'All' || movie.categories.includes(elGenresSelect.value)) && (elMinYearInput.value.trim() === '' || movie.year >= Number(elMinYearInput.value)) && (elMaxYearInput.value.trim() === '' || movie.year <= Number(elMaxYearInput.value));
//     return meetsCriteria;
//   });
// }

// // Kinolarni sortlaydigan function yaratdik u movies degan array va selectdan kelgan valueni qabul qilib oladi
// function sortMovies(movies, sortType) {
//   // Agar selectdan kelgan valu 'az' ga teng bolsa
//   if (sortType === 'az') {
//     movies.sort((a, b) => {
//       // a ning titleli b ning titledan kotta bolsa 1 ni return qiladi
//       if (a.title > b.title) return 1;
//       // b ning titleli a ning titledan kotta bolsa -1 ni return qiladi
//       if (a.title < b.title) return -1;
//       // bolmasa 0 ni return qiladi
//       return 0;
//     });
//     // yoki agar selectdan kelgan value 'za' ga teng bolsa
//   } else if (sortType === 'za') {
//     movies.sort((a, b) => {
//       if (a.title < b.title) return 1;
//       if (a.title > b.title) return -1;
//       return 0;
//     });
//     // yoki agar selectdan kelgan value 'rating_asc' ga teng bolsa
//   } else if (sortType === 'rating_asc') {
//     // a ning ratingidan b ning ratingidan ayirib moviesni sortlab beradi
//     movies.sort((a, b) => a.imdbRating - b.imdbRating);
//   } else if (sortType === 'rating_desc') {
//     movies.sort((a, b) => b.imdbRating - a.imdbRating);
//     // yoki agar selectdan kelgan value 'year_asc' ga teng bolsa
//   } else if (sortType === 'year_asc') {
//     // a ning yilidan b ning yilini ayirib moviesni sortlab beradi
//     movies.sort((a, b) => a.year - b.year);
//   } else if (sortType === 'year_desc') {
//     movies.sort((a, b) => b.year - a.year);
//   }
// }

// function onMovieSearchFormSubmit (evt) {
//   evt.preventDefault();

//   const titleRegex = new RegExp(elMovieSearchInput.value.trim(), 'gi');
//   const foundMovies = findMovies(titleRegex);

//   if (foundMovies.length > 0) {
//     sortMovies(foundMovies, elSortSelect.value);
//     showMovies(foundMovies);
//   } else {
//     elMoviesList.innerHTML = '<div class="col-12">No film found</div>';
//   }
// }

// function onMoviesListInfoButtonClick(evt) {
//   if (evt.target.matches('.js-more-info-button')) {
//     updateMovieInfoModal(evt.target.dataset.imdbId);
//   }
// }

// function onMovieInfoModalHidden () {
//   elMovieInfoModalIFrame.src = '';
// }


// // EVENT LISTENERS
// elMoviesList.addEventListener('click', onMoviesListInfoButtonClick);

// // Stop iframe video playback on modal hide
// elMovieInfoModal.addEventListener('hidden.bs.modal', onMovieInfoModalHidden);

// if (elMovieSearchForm) {
//   elMovieSearchForm.addEventListener('submit', onMovieSearchFormSubmit);
// }


// // INITIATION
// getUniqueGenres();
// showGenreOptions();
// showMovies(movies.slice(0, 10));