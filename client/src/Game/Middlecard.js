import React from 'react';
import CARDS from '../utils/cards';

export default function Middlecard(props) {
  return (
    <div id="middlecardContainer">
      <img src={CARDS[props.middlecard]} alt={props.middlecard}></img>
    </div>
  );
}
