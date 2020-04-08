import React from 'react';
import Card from '../../utils/Card';
export default function Middlecard(props) {
  const style = {
    height: '100px',
  };
  return (
    <div style={style}>
      <Card>{props.card}</Card>
    </div>
  );
}
