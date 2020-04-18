import React from 'react';
import { postLeaveGame } from './request';

export default function LeaveGame(props) {
  return (
    <button id="leaveGame" onClick={() => postLeaveGame(props.gameID)}>
      Leave Game
    </button>
  );
}
