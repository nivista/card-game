import React from 'react';
import CARDS from '../../../utils/cards.js';
export default function GameTableRow(props) {
  const cardTDStyle = {
    display: 'flex',
    justifyContent: 'center',
    height: '40px',
    margin: '0 auto',
  };

  const cardStyle = {
    height: '100%',
    margin: '0 1%',
  };
  return (
    <tr>
      <td>{props.user.nickname}</td>
      <td style={cardTDStyle}>
        {props.collected.map((card, i) => (
          <img src={CARDS[card]} key={i} style={cardStyle} />
        ))}
      </td>
      <td>{props.points}</td>
    </tr>
  );
}
