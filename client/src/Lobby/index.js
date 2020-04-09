import React from 'react';
import LobbyTable from './LobbyTable';
import StartButton from './StartButton';

export default function Lobby(props) {
  // needs players, needs to know current user, and also which player is host
  const { player, players } = props;
  //are we the current user
  //userID hostID
  return (
    <div>
      {<LobbyTable {...props} />}
      {player._id === players[0]._id && <StartButton gameID={props._id} />}
    </div>
  );
}
