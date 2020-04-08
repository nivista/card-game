import React from 'react';
import Card from '../../../utils/Card.js';
export default function GameTableRow(props) {
  const style = {
    display: 'flex',
    justifyContent: 'center',
    height: '20px',
    margin: '0 auto',
  };
  console.log(props.collected);
  return (
    <tr>
      <td>{props.user.nickname}</td>
      <td style={style}>
        {props.collected.map((card, i) => (
          <Card key={i}>{card}</Card>
        ))}
      </td>
      <td>{props.points}</td>
    </tr>
  );
}
