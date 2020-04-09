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
  const [player, updatePlayer] = useState('');

  //const match = document.cookie.match(new RegExp('(^| )connect.sid=([^;]+)'));
  //const sessionID = match && match[2];

  //loads gameState
  useEffect(() => {
    if (gameID !== '') {
      const interval = setInterval(async () => {
        const res = await fetch(url.resolve(SERVER_URL, `game/${gameID}`), {
          credentials: 'include',
        });
        if (res.status === 200) {
          const obj = await res.json();
          const stringNewGame = JSON.stringify(obj);
          const stringOldGame = JSON.stringify({ game, player }); //bad because order matters here
          if (stringNewGame !== stringOldGame) {
            console.log(game);
            updatePlayer(obj.player); //WHY DO THE ORDER OF THESE MATTER
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

  const props = { ...game, player };
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
