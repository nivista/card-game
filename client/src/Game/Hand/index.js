import React from 'react';

export default function Hand(props) {
  return props.hand.map((card) => <p>{card}</p>);
}
