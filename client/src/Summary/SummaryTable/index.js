import React from 'react';
import SummaryRow from './SummaryRow';

export default function SummaryTable(props) {
  //returns a table with data about each players nickname and points
  return (
    <table>
      <tr>
        <th>Nickname</th>
        <th>Points</th>
      </tr>
      {props.players.map((player) => (
        <SummaryRow {...player} />
      ))}
    </table>
  );
}
