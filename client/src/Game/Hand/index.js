import React, { useState, useEffect } from 'react';
import CARDS from '../../utils/cards';
import url from 'url';
import { SERVER_URL } from '../../utils/constants';
import './style.css';
export default function Hand(props) {
  const { player, gameID, battleStart } = props;
  const { hand, played } = player;

  const [selected, updateSelected] = useState(played);
  console.log(played);
  useEffect(() => {
    updateSelected(played);
  }, [played, battleStart]);

  let containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '0px',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '160px',
    margin: '0 auto',
  };

  const getOnClick = (cardNumber) => {
    return async () => {
      updateSelected(cardNumber);
      const res = await fetch(url.resolve(SERVER_URL, 'game/move'), {
        credentials: 'include',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/JSON',
        },
        body: JSON.stringify({
          gameID,
          card: cardNumber,
        }),
      });
      const text = await res.text();
    };
  };
  return (
    <div style={containerStyle}>
      {hand.map((card, i) => (
        <img
          src={CARDS[card]}
          key={i}
          onClick={getOnClick(card)}
          className={`handCard ${selected === card && 'active'}`}
        />
      ))}
    </div>
  );
}
