import React, { useState, useEffect } from 'react';
import { fetchCredits, findDirector , findMoviesByDirector , filterMoviesForJobType , fetchMovieDetails} from '../utilities/APIfunctions.js';

const MoreInfo = (props) => {
    const [director, setDirector] = useState('');  // Initialize the state
    const [credits, setCredits] = useState('');
    const [movieDetails, setMovieDetails] = useState('');
    const [classNames, setClassNames] = useState(null);

    const languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
    console.log(languageNames.of('en'));

    useEffect(() => {
        async function fetchData(movieID) {
            try {
                const credits = await fetchCredits(movieID); // Await the promise to resolve
                const director = findDirector(credits);
                const movieDetails = await fetchMovieDetails(movieID)
                setDirector(director);  // Set the state with the fetched data
                setCredits(credits);
                setMovieDetails(movieDetails);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData(props.movie.movieInfo.id);
    }, []);  // Run this effect when props.movie.id changes

    useEffect(() => {
        let classNamesTemp;
        if (props.movie.index == 0) {
            classNamesTemp = ['leftSameAsTop','','','','rightInfoCard']
        } else if (props.movie.index == 1) {
            classNamesTemp = ['leftInfoCard','middleInfoCard','','','rightInfoCard']
        } else if (props.movie.index >= 2 && props.movie.index <= (props.moviesLength - 1 - 2)) {
            classNamesTemp = ['leftInfoCard','','middleInfoCard','','rightInfoCard']
        } else if ((props.moviesLength - 1) - props.movie.index == 1) {
            classNamesTemp = ['leftInfoCard','','','middleInfoCard','rightInfoCard']
        } else if ((props.moviesLength - 1) - props.movie.index == 0) {
            classNamesTemp = ['leftInfoCard','','','','rightSameAsTop']
        }
        setClassNames(classNamesTemp);
    }, []);

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


    function formatCurrency(number) {
        return number.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
    }
    
    props.movie ? console.log(props.movie.clicked) : console.log('nothing yet');

    const columnSetter = (numbeOfCards) => {
        const columnStarts = [];
        console.log(props.movie.index)
        const nonAdjustedStart = props.movie.index - 2;
        const nonAdjustedEnd = props.movie.index + 2;
        const adjIfAtBeg = 0 - nonAdjustedStart;
        console.log(adjIfAtBeg)
        const adjIfAtEnd = nonAdjustedEnd - (props.moviesLength - 1);


        if (nonAdjustedStart < 0) {
            for (let i = nonAdjustedStart; i <= nonAdjustedStart + 5; i++) {
                columnStarts.push(i + 1 + adjIfAtBeg);
            }
        } else if (nonAdjustedEnd > props.moviesLength - 1) {
            for (let i = nonAdjustedStart; i <= nonAdjustedStart + 5; i++) {
                columnStarts.push(i + 1 - adjIfAtEnd);
            }
        } else {
            for (let i = nonAdjustedStart; i <= nonAdjustedStart + 5; i++) {
                columnStarts.push(i + 1);
            }
        }
        return columnStarts;
    };

    const columnStarts = columnSetter(props.moviesLength);

    console.log(columnStarts)

	return (
		<>
            <div className={`infoCard ${classNames?.[0]}`} style={{ gridColumn: `${columnStarts[0]} / ${columnStarts[1]}`}}>
                <h3>Overview</h3>
                {movieDetails.overview}
            </div>
            <div className={`infoCard ${classNames?.[1]}`} style={{ gridColumn: `${columnStarts[1]} / ${columnStarts[2]}`}}>
                <h3>Info</h3>
                <ul>
                    <li>Release Date: {movieDetails.release_date}</li>
                    <li>Homepage: 
                        <a href={movieDetails.homepage}>{movieDetails.homepage}</a>
                    </li>
                    <li>Genres:
                        {movieDetails.genres?.map((genre, index) => (
                            <span key={index}>{genre.name}{index < movieDetails.genres.length - 1 ? ', ' : ''}</span>
                        ))}
                    </li>
                    <li>Original language: {movieDetails.original_language ? languageNames.of(movieDetails.original_language) : ''}</li>
                    <li>Budget: {movieDetails.budget?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                        })}
                    </li>
                    <li>Revenue: {movieDetails.revenue?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                        })}
                    </li>
                    <li>
                        Runtime: {movieDetails.runtime} minutes
                    </li>
                </ul>
            </div>
            <div className={`infoCard ${classNames?.[2]}`} style={{ gridColumn: `${columnStarts[2]} / ${columnStarts[3]}`}}>
                    <h3>Rating:</h3>
                    {movieDetails.vote_average}
            </div>
            <div className={`infoCard ${classNames?.[3]}`} style={{ gridColumn: `${columnStarts[3]} / ${columnStarts[4]}`}}>
                <h3>Cast</h3>
                <div className='gridForCast'>
                    {credits &&
                            <>
                                {credits.cast.map((castMember, index) => (
                                    <div className='image-container'>
                                        <img src={`https://image.tmdb.org/t/p/w92/${castMember.profile_path}`} alt='cast member image'></img> {/* See https://developer.themoviedb.org/docs/image-basics for how to build an image URL */ }
                                        <div className="overlayContainer" style={{ width: '92px' }} > {/* How can I set the width of this div to 92px with inline style here? */ }
                                            <div className='cardItem overlay castCard'>{castMember.name}</div>
                                        </div>
                                    </div>
                                ))}
                            </>
                    }
                </div>
            </div>
            <div className={`infoCard ${classNames?.    [4]}`} style={{ gridColumn: `${columnStarts[4]} / ${columnStarts[5]}`}}>
                <h3>Director</h3>
                <div>
                    {director &&
                        <div className='image-container'>
                            <img src={`https://image.tmdb.org/t/p/w300/${director.profile_path}`} alt='director image'></img> {/* See https://developer.themoviedb.org/docs/image-basics for how to build an image URL */ }
                            <div className="overlayContainer" style={{ width: '300px' }} > {/* How can I set the width of this div to 92px with inline style here? */ }
                                <div className='cardItem overlay castCard'>{director.name}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
		</>
	);
};

export default MoreInfo;

// note I followed the freecodecamp tuotorial which made this as a .js
// file, not .jsx, I'm no sure if that will lead to any issues.