import React from 'react';

export default function LobbyTableRow(props) {
  return (
    <tr>
      <td>{props.user.nickname}</td>
    </tr>
  );
}
