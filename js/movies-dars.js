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
  return movies.filter(movie => movie.title.match(titleRegex) && elSelectGenre.value === 'All' || movie.categories.includes(elSelectGenre.value) && movie.year >= (Number(elFromYear.value) || 1990) && movie.year <= (Number(elToYear.value) || 2020) && movie.imdbRating >= Number(elSearchRating.value)
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

getUniqueGenres();
showGenreOptions();
showMovies(movies.slice(0, 51));

