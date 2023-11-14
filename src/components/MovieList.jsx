import React, { useState, useEffect } from 'react';
// import MoreInfoBtn from './MoreInfoBtn';
import CardButton from './CardButton';
// import MoreInfoCard from './MoreInfoCard';
import downArrow from '../assets/down-arrow-svgrepo-com.svg';
import upArrow from '../assets/up-arrow-svgrepo-com.svg';
import RightArrow from './svgIcons/RightArrow';

const MovieList = (props) => {
	const [moreInfoClicked, setMoreInfoClicked] = useState({movieIndex: '', clicked: false});
	const [credits, setCredits] = useState(undefined);
	const [displayedInfo, setDisplayedInfo] = useState('buttons');
	const [rows, setRows] = useState([{type:'MovieCards',content:props.movies}])

    const FavouriteComponent = props.favouriteComponent;

	// const moreInfo = (index) => {
	// 	const newMoreInfo = {movieIndex: index, clicked: true};
	// 	setMoreInfoClicked(newMoreInfo);
	// }

	useEffect(() => {
		const newRows = [{type:'MovieCards',content:props.movies}];
		setRows(newRows);
	}, [props.movies]);

	// useEffect(() => {
	// 	if (moreInfoClicked.clicked) {
	// 		setRows(prevRows => [...prevRows, { type: 'MoreInfo', content: 'na' }]);
	// 	}
	// }, [moreInfoClicked]);
	
	const addRowOfMovies = (movies) => {
		setRows(prevRows => [...prevRows, { type: 'MovieCards', content: movies }]);
	};

	return (
		<>
            {props.movies.map((movie, index) => (
				<div className={`image-container movies ${props.moreInfoMovie.clicked && props.moreInfoMovie.index == index ? 'moreInfoSelected' : ''}`}>
					<img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt='movie'></img> {/* See https://developer.themoviedb.org/docs/image-basics for how to build an image URL */ }
					<div className="overlayContainer">
						<div onClick={() => props.handleFavouritesClick(movie)} className='cardItem overlay'>
							<FavouriteComponent />
						</div>
						<div className='cardItem overlay' onClick={() => props.updateMoreInfoMovieinParent(index,props.favourite)}>
							More Info New
							{props.moreInfoMovie.clicked && props.moreInfoMovie.index == index ? <img src={upArrow} alt="Up Arrow" width={'20px'} /> : <img src={downArrow} alt="Down Arrow" width={'20px'} /> }
						</div> 
					</div>
				</div>
			))}
			{!props.favourite && !props.moviesQuery &&
				<div className={`image-container movies load-more-container`} onClick={() => props.addMoreMoviesInParent(true)}>
				<RightArrow />
				<h3>Load More</h3>
				{/* <div className="overlayContainer">
					<div className='cardItem overlay'>
						Load More
					</div> 
				</div> */}
				</div>
			}

		</>
	);
};

export default MovieList;

// note I followed the freecodecamp tuotorial which made this as a .js
// file, not .jsx, I'm no sure if that will lead to any issues.