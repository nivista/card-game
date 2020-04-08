import React from 'react';
import Card from '../../utils/Card';
import url from 'url';
import { SERVER_URL } from '../../utils/constants';
import './style.css';
export default function Hand(props) {
  const style = {
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
      const res = await fetch(url.resolve(SERVER_URL, 'game/move'), {
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
      const text = await res.text();
    };
  };
  return (
    <div style={style}>
      {props.cards.map((card, i) => (
        <Card key={i} onClick={getOnClick(card)} className="handCard">
          {card}
        </Card>
      ))}
    </div>
  );
}
