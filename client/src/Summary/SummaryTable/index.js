import React from 'react';
import SummaryRow from './SummaryRow';

export default function SummaryTable(props) {
  //returns a table with data about each players nickname and points
  return (
    <table>
      <thead>
        <tr>
          <th>Nickname</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {props.players.map((player) => (
          <SummaryRow {...player} key={player._id} />
        ))}
      </tbody>
    </table>
  );
}
