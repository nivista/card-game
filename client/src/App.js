import React, { useState, useEffect } from 'react';
import './App.css';
import url from 'url';
import hash from 'object-hash';

import Entry from './Entry';
import Game from './Game';
import Lobby from './Lobby';
import Summary from './Summary';
import { SERVER_URL } from './utils/constants';

//let rerenderCount = 0;
function App() {
  //console.log(++rerenderCount);
  // use hooks to intialize state
  const [gameID, updateGameID] = useState('');
  const [game, updateGame] = useState(null);
  const [playerID, updatePlayerID] = useState('');

  //const match = document.cookie.match(new RegExp('(^| )connect.sid=([^;]+)'));
  //const sessionID = match && match[2];

  //loads gameState
  useEffect(() => {
    if (gameID !== '') {
      const interval = setInterval(async () => {
        console.log(gameID);
        const res = await fetch(url.resolve(SERVER_URL, `game/${gameID}`), {
          credentials: 'include',
        });
        console.log(res);
        if (res.status === 200) {
          const obj = await res.json();
          console.log(obj);
          const stringNewGame = JSON.stringify(obj.game);
          const stringOldGame = JSON.stringify(game);

          if (stringNewGame !== stringOldGame) {
            updatePlayerID(obj.playerID); //WHY DO THE ORDER OF THESE MATTER
            updateGame(obj.game);
          }
        } else if (res.status === 400) {
          updateGameID('');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameID, game]);

  useEffect(() => {
    updateGameID(window.location.pathname.substring(1)); //TODO WHERE EXACTLY SHOULD I DO THIS:: THIS SAYS DO ONCE
    joinGame(window.location.pathname.substring(1));
  }, []);

  const joinGame = async (gameID) => {
    const res = await fetch(url.resolve(SERVER_URL, 'game/join/'), {
      method: 'POST',
      credentials: 'include',
      body: gameID,
    });
    if (res.status != 400) {
      updateGameID(gameID);
    } else {
      //TODO:: ERROR
    }
  };

  const updateGameIDAndHistory = (gameID) => {
    window.history.replaceState(null, '', gameID);
    updateGameID(gameID);
  };

  const props = { ...game, playerID };
  console.log(game);
  //cases loading, 1-4 screens
  if (gameID === '') {
    return <Entry updateGameID={updateGameIDAndHistory} joinGame={joinGame} />;
  } else if (game === null) {
    return <p>Loading...</p>;
  } else if (game.gameover) {
    return <Summary {...props} />;
  } else if (!game.middlecard) {
    return <Lobby {...props} />;
  } else {
    return <Game {...props} />;
  }
}

export default App;
