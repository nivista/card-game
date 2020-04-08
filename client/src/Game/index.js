import React from 'react';
import GameTable from './GameTable';
import Hand from './Hand';
import Middlecard from './Middlecard';
export default function Game(props) {
  return (
    <div>
      <GameTable {...props} />
      <Hand gameID={props._id} cards={props.players.find((p) => p._id === props.playerID).hand} />
      <Middlecard card={props.middlecard} />
    </div>
  );
}
