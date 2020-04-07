import React from 'react';

export default function SummaryRow(props) {
  return (
    <tr>
      <td>props.user</td>
      <td>props.points</td>
    </tr>
  );
}
