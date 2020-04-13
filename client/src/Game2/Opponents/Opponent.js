import React from 'react';
import CARDS from '../../utils/cards';

export default function Opponent(props) {
  return (
    <div>
      <div className="nickname">{props.user.nickname}</div>
      <div className="points">Points: {props.points}</div>
      <div className="collection">
        {props.collected.map((card, i) => (
          <img src={CARDS[card]} key={i} alt={card} />
        ))}
      </div>
    </div>
  );
}
