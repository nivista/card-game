import React, { useState, useEffect } from 'react';
import './App.css';
import url from 'url';

import Entry from './Entry';
import Game from './Game';
import Lobby from './Lobby';
import Summary from './Summary';
import { SERVER_URL } from './utils/constants';

let rerenderCount = 0;
function App() {
  console.log(++rerenderCount);
  // use hooks to intialize state
  const [gameID, updateGameID] = useState('');
  const [game, updateGame] = useState(null);

  const match = document.cookie.match(new RegExp('(^| )connect.sid=([^;]+)'));
  const sessionID = match && match[2];

  //loads gameState
  useEffect(() => {
    if (gameID !== '') {
      const interval = setInterval(async () => {
        const res = await fetch(url.resolve(SERVER_URL, 'game/' + gameID), {
          credentials: 'include',
        });
        console.log(res.status);
        if (res.status === 200) {
          const json = await res.json();
          updateGame(json);
        } else if (res.status === 204) {
          //got 204
        } else if (res.status === 404) {
          updateGameID('');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameID]);

  useEffect(() => {
    updateGameID(window.location.pathname.substring(1)); //TODO WHERE EXACTLY SHOULD I DO THIS:: THIS SAYS DO ONCE
  }, []);

  const updateGameIDAndHistory = (gameID) => {
    window.history.replaceState(null, '', gameID);
    updateGameID(gameID);
  };

  const props = { ...game, sessionID };
  //cases loading, 1-4 screens
  if (gameID === '') {
    return <Entry updateGameID={updateGameIDAndHistory} />;
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
