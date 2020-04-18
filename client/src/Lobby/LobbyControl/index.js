import React from 'react';
import AddBot from './AddBot';
import PlayersList from './PlayersList';
import StartGame from './StartGame';
import './style.css';

export default function LobbyControl(props) {
  const { isHost, gameID } = props;

  return (
    <div className="lobbyControl">
      <div>Here's who's playing:</div>
      <PlayersList {...props} />
      <div>Send the URL in the address bar to friends for them to join! (Up to 5 players)</div>
      <div>Only the host has access to these controls</div>
      <StartGame isHost={isHost} gameID={gameID} />
      <AddBot isHost={isHost} gameID={gameID} />
    </div>
  );
}
