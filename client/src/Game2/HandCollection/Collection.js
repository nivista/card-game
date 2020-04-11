import React from 'react';
import CARDS from '../../utils/cards';

export default function Collection(props) {
  return (
    <div className="collection">
      {props.collection.map((card) => (
        <img src={CARDS[card]} />
      ))}
    </div>
  );
}
