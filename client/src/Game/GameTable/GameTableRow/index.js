import React from 'react';

export default function GameTableRow(props) {
  return (
    <tr>
      <td>props.user</td>
      <td>props.hand</td>
      <td>props.points</td>
    </tr>
  );
}
