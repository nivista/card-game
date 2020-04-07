import React from 'react';

import LobbyTableRow from './LobbyTableRow';
export default function LobbyTable(props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nickname</th>
        </tr>
      </thead>
      <tbody>
        {props.players.map((p) => (
          <LobbyTableRow {...p} key={p.user._id} />
        ))}
      </tbody>
    </table>
  );
}
