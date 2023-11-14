import React, { useState, useEffect, useCallback } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';
// import MovieListHeading from './components/MovieListHeading';
// import SearchBox from './components/SearchBox';
import AddToFavourites from './components/AddToFavourites';
import RemoveFavourites from './components/RemoveFavourites';
import SearchFilterForm from './components/SearchFilterForm';
import MoreInfo from './components/MoreInfo';
import Navigation from './components/Navigation';
import { debounce } from 'lodash';
import Cookies from "js-cookie";
import { updateUserFavourites , loadUser , fetchMovieDetails , getMovieRequest } from './utilities/APIfunctions';

const App = () => {
// const [searchValue, setSearchValue] = useState('');

const [parameters, setParameters] = useState(
                                                {
                                                    title: '',
                                                    orderBy: 'popularity',
                                                    releaseDateStart: new Date('1900-01-31').toISOString().substring(0, 10),
                                                    releaseDateEnd: new Date().toISOString().substring(0, 10),
                                                    ratingStart: 0,
                                                    ratingEnd: 10,
                                                }
                                            )
const [movies, setMovies] = useState({lastPage:1,moviesCollection:[]});
const [titleSearchedMovies, setTitleSearchedMovies] = useState([]);
const [favourites, setFavourites] = useState([]);
const [moreInfoMovie, setMoreInfoMovie] = useState({clicked: false});
const [moreInfoFavouriteMovie, setMoreInfoFavouriteMovie] = useState({clicked: false});
const [user, setUser] = useState({favourites:[]});
const [moviesQuery, setMoviesQuery] = useState(false);

const updateUser = async () => {
  if (Cookies.get('user')) {
    try {
      const userCookie = JSON.parse(Cookies.get('user'));
      const userPlaceholder = await loadUser(userCookie);
      setUser(userPlaceholder);
    } catch (error) {
      setUser({favourites:[]})
      console.error('Error:', error);
    }
  } else {
    setUser({favourites:[]})
    console.log('no cookies');
  }
}

useEffect(() => {
  updateUser()
}, []);

const updateMoviesSate = (newValue) => {
  setMovies(prevState => ({
    ...prevState,
    moviesCollection: newValue, // Dynamically update the right key
}));
}

const debouncedGetMovieRequest = useCallback(
  debounce((parameters) => getMovieRequest(parameters,updateMoviesSate), 500),
  [] // Dependency array is empty, so this is only created once
);

useEffect(() => {
  if (parameters.title == '') {
    console.log('case 1');
    filteredMovies(false);
    setMoviesQuery(false);
  } else {
    console.log('case 2')
    if (parameters) {
      setMoviesQuery(true);
      debouncedGetMovieRequest(parameters);

    }
  }
}, [parameters, debouncedGetMovieRequest]);

const filteredMovies = async (largerList) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0M2ExYmEzNzE0NjhkOWQ1Yjg4ZmYwNmEzZjc0MzUwNiIsInN1YiI6IjY1M2MxYjBhYzhhNWFjMDBlM2EwODVhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bvoq71DDsgwSfB_OrB8xVtv9lw3LsthZVsAfdoN0Hy4'
    }
  };

  let page;
  largerList ? page = movies.lastPage + 1 : page = 1; 
  fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_date.gte=${parameters.releaseDateStart}&primary_release_date.lte=${parameters.releaseDateEnd}&sort_by=${parameters.orderBy}.desc&vote_average.gte=${parameters.ratingStart}&vote_average.lte=${parameters.ratingEnd}&with_keywords=${parameters.title}`, options)
    .then(response => response.json())
    .then(response => {
      let moviesTemp; 
      if (largerList) {
        moviesTemp = {lastPage: response.page, moviesCollection: [...movies.moviesCollection, ...response.results]};
      } else {
        moviesTemp = {lastPage: page, moviesCollection: response.results}
      }
      setMovies(moviesTemp);
    })
    .catch(err => console.error(err));
};

// useEffect(() => {
//   filteredMovies(false);
// }, [parameters]);

const saveToLocalStorage = (items) => {
	localStorage.setItem('react-movie-app-favourites', JSON.stringify(items));
};

const addFavouriteMovie = (movie) => {
	const newFavouriteList = [...user.favourites, movie];
  let updatedUser = { ...user, favourites: newFavouriteList };
  setUser(updatedUser);
  updateUserFavourites(updatedUser)
    // saveToLocalStorage(newFavouriteList);
};

const removeFavouriteMovie = (movie) => {
	const newFavouriteList = user.favourites.filter(
		(favourite) => favourite.id !== movie.id
	);
  let updatedUser = { ...user, favourites: newFavouriteList };
  setUser(updatedUser);
  updateUserFavourites(updatedUser)
};


// useEffect(() => {
// 	getMovieRequest(searchValue);
// }, [searchValue]);

useEffect(() => {
	const movieFavourites = JSON.parse(
	localStorage.getItem('react-movie-app-favourites')
	) || [];
	setFavourites(movieFavourites);
}, []);

const updateParameters = (key, newValue) => {
  setParameters(prevState => ({
      ...prevState,
      [key]: newValue, // Dynamically update the right key
  }));
};

const updateMoreInfoMovie = (index,favourite) => {
  let movie;
  let moviesToUse;
  if (favourite) {
    movie = moreInfoFavouriteMovie;
    moviesToUse = user.favourites; //I changed this from just 'favourites' when I was working on adding user
  } else {
    movie = moreInfoMovie;
    moviesToUse = movies.moviesCollection;
  }
  let clickStatus;
  if (!movie.clicked) {
    clickStatus = true;
  } else if (movie.index !== index) {
    clickStatus = true;
  } else {
    clickStatus = false;
  }
  const moreInfoMovieHolder = {movieInfo: moviesToUse[index], index: index , clicked: clickStatus};
  favourite ? setMoreInfoFavouriteMovie(moreInfoMovieHolder) : setMoreInfoMovie(moreInfoMovieHolder);
}

// moreInfoMovie ? console.log(moreInfoMovie) : console.log('first run or whatever');

const grid = document.getElementsByClassName('gridOne')[0];

return (
	<div className='movie-app'>
    <Navigation updateParentUser={updateUser} user={user} />

    {/* <h2>Movie Results</h2> */}
    <SearchFilterForm updateParametersInParent={updateParameters} releaseDateEnd={parameters.releaseDateEnd} ratingEnd={parameters.ratingEnd} />

    <div className='grid gridOne' /*onScroll={(e) => debounced_fun(e.target)}*/>
			{movies.moviesCollection &&
        <MovieList
        favourite={false}
				movies={movies.moviesCollection}
				favouriteComponent={AddToFavourites}
				handleFavouritesClick={addFavouriteMovie}
        updateMoreInfoMovieinParent={updateMoreInfoMovie}
        moreInfoMovie={moreInfoMovie}
        addMoreMoviesInParent={filteredMovies}
        moviesQuery={moviesQuery}
			  />
      }
      {moreInfoMovie.clicked &&
        <MoreInfo
          moviesLength={movies.moviesCollection.length}
          movie={moreInfoMovie}
        />
		  }

		</div>
    <h1>Favourites</h1>
    <div className='grid'>
			<MovieList
        favourite={true}
				movies={user.favourites} // I changed this from just favourites when adding user functionality, not sure if the || thing I'm doing is correct
        favouriteComponent={RemoveFavourites}
        handleFavouritesClick={removeFavouriteMovie}
        updateMoreInfoMovieinParent={updateMoreInfoMovie}
        moreInfoMovie={moreInfoFavouriteMovie}
			/>
      {moreInfoFavouriteMovie.clicked &&
        <MoreInfo
          moviesLength={user.favourites.length || 0} // I changed this from just favourites when adding user functionality, not sure if the || thing I'm doing is correct
          movie={moreInfoFavouriteMovie}
        />
		  }
		</div>
	</div>
	);
};

export default App;