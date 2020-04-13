import React from 'react';
import { SERVER_URL } from '../utils/constants';

export default function LeaveGame(props) {
  const leaveGame = async () => {
    const res = await fetch(SERVER_URL + 'game/leave', {
      credentials: 'include',
      method: 'POST',
      body: props.gameID,
    });
    window.history.replaceState(null, '', '');
    console.log(await res.text());
  };
  return (
    <button id="leaveGame" onClick={leaveGame}>
      Leave Game
    </button>
  );
}
