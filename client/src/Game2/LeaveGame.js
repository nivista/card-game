import React from 'react';
import { SERVER_URL } from '../utils/constants';

export default function LeaveGame(props) {
  const leaveGame = () => {
    fetch(SERVER_URL + 'game/leave', {
      credentials: 'include',
      method: 'POST',
      body: props.gameID,
    });
  };
  return (
    <button id="leaveGame" onClick={leaveGame}>
      Leave Game
    </button>
  );
}
