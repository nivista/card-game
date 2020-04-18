import React from 'react';
import Opponent from './Opponent';
import './style.css';

export default function Opponents(props) {
  return (
    <div id="opponents">
      {props.opponents.map((opponent) => (
        <Opponent {...opponent} key={opponent._id} />
      ))}
    </div>
  );
}
