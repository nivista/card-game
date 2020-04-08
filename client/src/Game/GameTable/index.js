import React from 'react';
import GameTableRow from './GameTableRow';
import './style.css';
export default function GameTable(props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nickname</th>
          <th>Collection</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {props.players.map((p) => (
          <GameTableRow {...p} key={p._id} />
        ))}
      </tbody>
    </table>
  );
}
