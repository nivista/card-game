import React from 'react';
import CARDS from '../../utils/cards';
export default function Middlecard(props) {
  const style = {
    height: '100px',
  };
  return <img style={style} src={CARDS[props.card]} />;
}
