import React, { useState, useEffect } from 'react';
import url from 'url';
import CARDS from '../../utils/cards';
import { SERVER_URL } from '../../utils/constants';

export default function Hand(props) {
  const [played, updatePlayed] = useState(null);
  useEffect(() => {
    updatePlayed(props.played);
  }, [props.played]);

  const getOnClick = (cardNumber) => {
    return () => {
      updatePlayed(cardNumber);
      fetch(url.resolve(SERVER_URL, 'game/move'), {
        credentials: 'include',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/JSON',
        },
        body: JSON.stringify({
          gameID: props.gameID,
          card: cardNumber,
        }),
      });
    };
  };

  return (
    <div class="hand">
      {props.hand.map((card) => (
        <img
          src={CARDS[card]}
          className={card === played ? 'played' : undefined}
          onClick={getOnClick(card)}
        />
      ))}
    </div>
  );
}
