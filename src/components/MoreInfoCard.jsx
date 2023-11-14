import React, { useState, useEffect } from 'react';
import { fetchCredits, findDirector , findMoviesByDirector , filterMoviesForJobType} from '../utilities/APIfunctions.js';
import CardButton from './CardButton';
import MovieList from './MovieList';
import AddToFavourites from './AddToFavourites';
import RemoveFavourites from './RemoveFavourites';

const MoreInfo = (props) => {
    const [director, setDirector] = useState('');  // Initialize the state

    useEffect(() => {
        async function fetchData() {
            try {
                const credits = await fetchCredits(props.movieID); // Await the promise to resolve
                const director = findDirector(credits);
                setDirector(director);  // Set the state with the fetched data
            } catch (error) {
                console.error('Error fetching credits:', error);
            }
        }

        fetchData();
    }, [props.movieID]);  // Run this effect when props.movieID changes

    // console.log(director.id)
    // const finder = async () => {
    //     const dIsInCast = await findMoviesByDirector(director.id)
    //     console.log(dIsInCast);
    //     const moviesByD = filterMoviesForJobType(dIsInCast);
    //     console.log(moviesByD);
    // }

    async function fetchMoviesWhereDIsInCast() {
        try {
            const dIsInCast = await findMoviesByDirector(director.id); // Await the promise to resolve
            const moviesByD = await filterMoviesForJobType(dIsInCast);
            props.sendMoviesToParent(moviesByD);

        } catch (error) {
            console.error('Error fetching credits:', error);
        }
    }

    const addFavouriteMovie = (movie) => {
        console.log(movie)
    };




    return (
        <>
            {(props.version === 'director' && director) ? (
                <>
                    {director.name}
                    <img src={`https://image.tmdb.org/t/p/w300/${director.profile_path}`} alt='director image'></img> {/* See https://developer.themoviedb.org/docs/image-basics for how to build an image URL */ }
                    <div className="overlayContainer">
						<CardButton overlayCard={true} btnText='Movies by Director' cardBtnClick={() => {fetchMoviesWhereDIsInCast(); console.log('huh')}}/> {/* Why is this on click not working? */ }
						<CardButton overlayCard={true} btnText='Add to Favourites (use correct method later' />
					</div>

                    {/* {directorMovies && (
                    <div className='image-container' style={{ gridRow: '3 / 4'}}>
                        <div className="row">
                            <MovieList
                                movies={directorMovies}
                                favouriteComponent={AddToFavourites}
                                handleFavouritesClick={addFavouriteMovie}
                            />
                        </div>
				    </div>)} */}
                </>
                
            ) : (
                <div className='tempName'>
                    aaa
                </div>
            )}
        </>
    );
};

export default MoreInfo;
