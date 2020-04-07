import React, { useState } from 'react';
import url from 'url';
import { SERVER_URL } from '../utils/constants';
export default function (props) {
  //props joinGame - param gameID
  //props startGame - return gameID
  const [gameIDForm, setGameIDForm] = useState('');
  const [createdGameID, setCreatedGameID] = useState('');

  const newGame = async () => {
    const resp = await fetch(url.resolve(SERVER_URL, 'game/new'), {
      method: 'POST',
      credentials: 'include',
    });
    let gameID = await resp.text();
    gameID = gameID.slice(1, -1);
    setCreatedGameID(gameID);
  };

  const joinGame = async () => {
    const res = await fetch(url.resolve(SERVER_URL, 'game/join/'), {
      method: 'POST',
      credentials: 'include',
      body: gameIDForm,
    });
    if (res.status != 400) {
      props.updateGameID(gameIDForm);
    } else {
      //TODO:: ERROR
    }
  };

  return (
    <>
      <p>Someone sent me an ID and I want to join a game! (Or rejoin)</p>
      <input value={gameIDForm} onChange={(e) => setGameIDForm(e.target.value)}></input>
      <button onClick={joinGame}>Join Game</button>
      <p>Let's make a new game!</p>
      <button onClick={newGame}>Create Game</button>
      {createdGameID && (
        <>
          <p>Created Game ID: {createdGameID}</p>
          <button onClick={() => props.updateGameID(createdGameID)}>Join Created Game</button>
        </>
      )}
    </>
  );
}
