import React from 'react';
import Opponent from './Opponent';
import './style.css';

export default function Opponents(props) {
  return (
    <div id="opponents">
      <Opponent {...props.opponents[0]} key={props.opponents[0]} />{' '}
    </div>
  );
}
