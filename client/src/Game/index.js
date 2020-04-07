import React from 'react';
import GameTable from './GameTable';
import Hand from './Hand';
import Middlecard from './Middlecard';
export default function Game(props) {
  return (
    <div>
      <GameTable props />
      <Hand cards={props.players.find((p) => p.userID === props.userID).hand} />
      <Middlecard card={props.middlecard} />
    </div>
  );
}
