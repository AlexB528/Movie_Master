import React, { useState } from 'react';
// import { convertDate } from '../utilities/functions';
// import './MovieFilterForm.css';

function SearchFilterForm(props) {

    const [ratingStart, setRatingStart] = useState(0);
    const [ratingEnd, setRatingEnd] = useState(10);

    const handleSliderChange = (e) => {
        // Convert the range input value back to a float with one decimal
        const newValue = parseFloat(e.target.value) / 10;
        e.target.name == 'ratingStart' ? setRatingStart(newValue) : setRatingEnd(newValue);
        props.updateParametersInParent(e.target.name, newValue); // Call the parent update function
    };

    const fillRange = (start,end) => {
        const range = [];
        for (let i = start; i <= end; i++) {
            range.push(<option key={i} value={i}>{i}</option>);
        }
        return range;
    }

    const yearOptions = fillRange(1900,new Date().getFullYear());
    const ratingOptions = fillRange(1,5);

    // console.log(props.releaseDateEnd.substring(0, 4));

    return (
        <form className='filterForm'>
            <div className="input-group">
                <label>Title:</label>
                <input type="text" name="title" onChange={(e) => props.updateParametersInParent(e.target.name, e.target.value)} />
            </div>

            <div className="input-group">
                <label>Order by:</label>
                <select name="orderBy" onChange={(e) => props.updateParametersInParent(e.target.name, e.target.value)}>
                    <option value="popularity">Popularity</option>
                    <option value="newest published">Newest published</option>
                    <option value="oldest published">Oldest published</option>
                    <option value="title">Title</option>
                    <option value="rating">Rating</option>
                </select>
            </div>

            <div className="input-group">
                <label>Release date:</label>
                <select name="releaseDateStart" onChange={(e) => props.updateParametersInParent(e.target.name, new Date(e.target.value, 0, 1).toISOString().substring(0, 10))}>
                    {yearOptions}
                </select>
                to
                <select name="releaseDateEnd" value={props.releaseDateEnd.substring(0, 4)} onChange={(e) => props.updateParametersInParent(e.target.name, new Date(e.target.value, 11, 31).toISOString().substring(0, 10))}> {/* Why is this new date taking a year and makign the date the last day of the preceeding year? How can I make it stay in the current year?*/}
                    {yearOptions}
                </select>
            </div>

            <div className="input-group">
                <label htmlFor="ratingStart">Rating:</label>

                <div htmlFor="ratingStart">{ratingStart == 0 ? 0 : ratingStart.toFixed(1)} / 10</div>
                <input
                    type="range"
                    name="ratingStart"
                    min="0"
                    max="100" // 10 times larger to include one decimal place
                    value={ratingStart * 10} // Multiply by 10 to match the slider's scale
                    onChange={handleSliderChange}
                />
                {' '}to{' '}
                {/* how can I put a space after the 'to' above? */}
                <label htmlFor="ratingEnd">{ratingEnd == 0 ? 0 : ratingEnd.toFixed(1)} / 10</label>
                <input
                    type="range"
                    name="ratingEnd"
                    min="0"
                    max="100" // 10 times larger to include one decimal place
                    value={ratingEnd * 10} // Multiply by 10 to match the slider's scale
                    onChange={handleSliderChange}
                />

                {/* <label>Rating</label>
                <select name="ratingStart" onChange={(e) => props.updateParametersInParent(e.target.name, (e.target.value))}>
                    {ratingOptions}
                </select>
                to
                <select name="ratingEnd" defaultValue={props.ratingEnd} onChange={(e) => props.updateParametersInParent(e.target.name, (e.target.value))}>
                    {ratingOptions}
                </select> */}
            </div>
        </form>
    );
}

export default SearchFilterForm;
