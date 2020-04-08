import React from 'react';
import cardOne from '../resources/cards/1.svg';
import cardTwo from '../resources/cards/2.svg';
import cardThree from '../resources/cards/3.svg';
import cardFour from '../resources/cards/4.svg';
import cardFive from '../resources/cards/5.svg';
import './Card.css';

const cards = [null, cardOne, cardTwo, cardThree, cardFour, cardFive];
export default function Card(props) {
  return (
    <img
      className={`card ${props.className}`}
      src={cards[props.children]}
      onClick={props.onClick}
    />
  );
}
