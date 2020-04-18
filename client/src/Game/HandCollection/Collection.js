import React from 'react';
import CARDS from '../../utils/cards';

export default function Collection(props) {
  return (
    <div className="collection">
      {props.collection.map((card, i) => (
        <img src={CARDS[card]} key={i} alt={card} />
      ))}
    </div>
  );
}
