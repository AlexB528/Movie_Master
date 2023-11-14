import React from 'react';

const CardButton = (props) => {

    const cardClass = `cardItem ${props.overlayCard ? 'overlay' : ''}`;

	return (
        <div className={cardClass} onClick={props.cardBtnClick} >
            {props.btnText}
        </div>
	);
};

export default CardButton;