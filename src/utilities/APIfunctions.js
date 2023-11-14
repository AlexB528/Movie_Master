import Cookies from "js-cookie";

const fetchCredits = async (movieID) => {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0M2ExYmEzNzE0NjhkOWQ1Yjg4ZmYwNmEzZjc0MzUwNiIsInN1YiI6IjY1M2MxYjBhYzhhNWFjMDBlM2EwODVhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bvoq71DDsgwSfB_OrB8xVtv9lw3LsthZVsAfdoN0Hy4'
		}
	};
	
	try {
		const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/credits?language=en-US`, options);
		if (!response.ok) throw new Error(`Error fetching credits: ${response.statusText}`);
		const data = await response.json();
		return data;
	} catch (err) {
		console.error(err);
	}
};

const fetchMovieDetails = async (movieID) => {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0M2ExYmEzNzE0NjhkOWQ1Yjg4ZmYwNmEzZjc0MzUwNiIsInN1YiI6IjY1M2MxYjBhYzhhNWFjMDBlM2EwODVhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bvoq71DDsgwSfB_OrB8xVtv9lw3LsthZVsAfdoN0Hy4'
        }
    };
	
	try {
		const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options);
		if (!response.ok) throw new Error(`Error fetching movie details: ${response.statusText}`);
		const movieDetails = await response.json();
		return movieDetails;
	} catch (err) {
		console.error(err);
	}
};

const findDirector = (credits) => {
	if (credits) {
		const found = credits.crew.find((element) => element.job === 'Director');
		return found;
	} else {
		return null;
	}
};

async function fetchData() {
    try {
        const credits = await fetchCredits(props.movieID); // Await the promise to resolve
        const directorName = findDirector(credits);
        setDirector(directorName);  // Set the state with the fetched data
    } catch (error) {
        console.error('Error fetching credits:', error);
    }
}

const findMovieCredits = (personID) => {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0M2ExYmEzNzE0NjhkOWQ1Yjg4ZmYwNmEzZjc0MzUwNiIsInN1YiI6IjY1M2MxYjBhYzhhNWFjMDBlM2EwODVhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bvoq71DDsgwSfB_OrB8xVtv9lw3LsthZVsAfdoN0Hy4'
        }
    };
      
    fetch(`https://api.themoviedb.org/3/person/${directorID}/movie_credits?language=en-US`, options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
};

const movieListfromMovieCredits = (movieCreditsCast,creditsFn) => {
    const moviesByDirector = [];
    movieCreditsCast.forEach(element => {
        moviesByDirector.push(element.title);
    });
    return moviesByDirector;
}

const findMoviesByDirector = async (personID) => {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0M2ExYmEzNzE0NjhkOWQ1Yjg4ZmYwNmEzZjc0MzUwNiIsInN1YiI6IjY1M2MxYjBhYzhhNWFjMDBlM2EwODVhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bvoq71DDsgwSfB_OrB8xVtv9lw3LsthZVsAfdoN0Hy4'
        }
      };
        
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_crew=${personID}`, options);
        if (!response.ok) throw new Error(`Error fetching credits: ${response.statusText}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}




const filterMoviesForJobType = async (movies) => {
    const moviesByDirector = [];
    for (let movie of movies.results) {
        try {
            const credits = await fetchCredits(movie.id); // I assume each movie object has a movieID property
            const directorName = findDirector(credits);
            if (directorName) {
                moviesByDirector.push(movie);
            }
        } catch (error) {
            console.error('Error fetching credits:', error);
        }
    }
    return moviesByDirector;
}

const saveUser = async (inputs) => {
    let JSONformData = {};

    for (const field in inputs) {
        // console.log(`${field}: ${inputs[field]}`);
        JSONformData[field] = inputs[field]
    }


        const response = await fetch('https://moviemasterbackend-production.up.railway.app/users/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSONformData)
        });

        const json = await response.json();
        // console.log(json);
        return json;
};

const loginUser = async (inputs) => {
    let JSONformData = {};

    for (const field in inputs) {
        JSONformData[field] = inputs[field];
    }

    try {
        const response = await fetch('https://moviemasterbackend-production.up.railway.app/users/loginUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSONformData)
        });

        const json = await response.json();
        if (json.token) {
            const user = {username: inputs.username, token: json.token } //fix the favourites thing to retrieve movies, if any, later
            Cookies.set("user", JSON.stringify(user), {
              expires: 7,
            }); // this is not working, why?
        } else {
            throw new Error('Token not found in response');
        }
    } catch (error) {
        console.error('Error:', error);
        return null; // Return null or handle the error appropriately
    }
}

const updateUserFavourites = async (user) => {
    try {
        const response = await fetch('https://moviemasterbackend-production.up.railway.app/users/retrieveUserFavourites', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const json = await response.json();
        
    } catch (error) {
        console.error('Error:', error);
        return null; // Return null or handle the error appropriately
    }
}

const loadUser = async (user) => {
    try {
        const response = await fetch('https://moviemasterbackend-production.up.railway.app/users/loadUser', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        // Check if the response status indicates an error
        if (!response.ok) {
            // You can throw a new error with the response status
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        json[0].token = user.token;
        return json[0];
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

const getMovieRequest = async (queryandfilters,updateParentMoviesState) => {
  let allMovies = [];
  const title = encodeURIComponent(queryandfilters.title);
  console.log(title);
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0M2ExYmEzNzE0NjhkOWQ1Yjg4ZmYwNmEzZjc0MzUwNiIsInN1YiI6IjY1M2MxYjBhYzhhNWFjMDBlM2EwODVhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bvoq71DDsgwSfB_OrB8xVtv9lw3LsthZVsAfdoN0Hy4'
    }
  };

  try {
    for (let page = 1; page <= 3; page++) { // Loop through pages
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&language=en-US&page=${page}`, options);
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const responseJson = await response.json();
        
        if (responseJson.results) {
          const movieDetailsPromises = responseJson.results.map(result => fetchMovieDetails(result.id));
          const moviesDetails = await Promise.all(movieDetailsPromises);
  
          // Apply any necessary filters
          const filteredMovies = moviesDetails.filter(
            (movie) => {
              return (
                new Date(movie.release_date) >= new Date(queryandfilters.releaseDateStart) &&
                new Date(movie.release_date) <= new Date(queryandfilters.releaseDateEnd) &&
                movie.vote_average >= queryandfilters.ratingStart &&
                movie.vote_average <= queryandfilters.ratingEnd
              );
            }
          );
          allMovies = allMovies.concat(filteredMovies); // Concatenate results from the current page
          updateParentMoviesState(allMovies);
        }
      }
      console.log(allMovies);
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to be caught by the caller
    }


};




export { fetchCredits, findDirector , findMoviesByDirector , filterMoviesForJobType , fetchMovieDetails , saveUser , loginUser , updateUserFavourites , loadUser , getMovieRequest };

