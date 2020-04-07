import React from 'react';
import GameTableRow from './GameTableRow';

export default function GameTable(props) {
  return (
    <table>
      <tr>
        <th>Nickname</th>
        <th>Hand</th>
        <th>Points</th>
      </tr>
      {props.players.map((p) => (
        <GameTableRow {...p} />
      ))}
    </table>
  );
}
