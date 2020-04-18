import React from 'react';
import Name from '../utils/Name';
import { postNewGame } from '../utils/request';

export default function Entry(props) {
  const { nickname, updateGameID } = props;

  const startGame = async () => {
    const res = await postNewGame();
    const gameID = (await res.text()).slice(1, -1);
    updateGameID(gameID);
  };
  return (
    <div className="container" id="entry">
      <div>
        <Name nickname={nickname || ''} />!
      </div>
      <div>Welcome!</div>
      <button onClick={startGame}>Click me to start a game!</button>
    </div>
  );
}
