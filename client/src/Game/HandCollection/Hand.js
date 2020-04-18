import React, { useState, useEffect } from 'react';
import CARDS from '../../utils/cards';
import { postMove } from '../../utils/request';

export default function Hand(props) {
  const { gameID, played, hand, battleStart } = props;

  const [playedCurrent, updatePlayedCurrent] = useState(null);

  useEffect(() => {
    updatePlayedCurrent(played);
  }, [battleStart, played]);

  const getOnClick = (cardNumber) => {
    return () => {
      postMove(gameID, cardNumber);
      updatePlayedCurrent(cardNumber);
    };
  };

  return (
    <div className="hand">
      {hand.map((card, i) => (
        <img
          src={CARDS[card]}
          className={card === playedCurrent ? 'played' : undefined}
          onClick={getOnClick(card)}
          key={i}
          alt={card}
        />
      ))}
    </div>
  );
}
