import React from 'react';
import GameTable from './GameTable';
import Hand from './Hand';
import Middlecard from './Middlecard';
import GameTimer from './GameTimer';
export default function Game(props) {
  return (
    <div>
      <GameTable {...props} />
      <Hand gameID={props._id} player={props.player} battleStart={props.battleStart} />
      <Middlecard card={props.middlecard} />
      <GameTimer battleStart={props.battleStart} />
    </div>
  );
}
