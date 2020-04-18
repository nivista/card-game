import React, { useState } from 'react';
import { postStartGame } from '../../utils/request';

export default function StartGame(props) {
  const { isHost, gameID } = props;

  const [errorMsg, updateErrorMsg] = useState(null);

  const startGame = async (gameID) => {
    const res = await postStartGame(gameID);
    if (res.status !== 200) {
      updateErrorMsg(await res.text());
    }
  };
  return (
    <div>
      <button id="startGame" onClick={() => startGame(gameID)} disabled={!isHost}>
        Start Game
      </button>
      <span className="error">{errorMsg}</span>
    </div>
  );
}
