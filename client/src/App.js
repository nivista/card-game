import React, { useState, useEffect } from 'react';
import './App.css';

import Entry from './Entry';
import Game from './Game';
import Lobby from './Lobby';
import { postJoinGame, getGame, getNickname } from './utils/request';

function App() {
  const [gameID, updateGameID] = useState('');
  const [game, updateGame] = useState(null);
  const [player, updatePlayer] = useState(null);
  const [nickname, updateNickname] = useState(null);

  useEffect(() => {
    if (gameID !== '') {
      const interval = setInterval(async () => {
        const res = await getGame(gameID);
        if (res.status === 200 || res.status === 204) {
          const obj = await res.json();
          const stringNewGame = JSON.stringify(obj);
          const stringOldGame = JSON.stringify({ game, player }); //bad because order matters here
          if (stringNewGame !== stringOldGame) {
            updatePlayer(obj.player); //WHY DO THE ORDER OF THESE MATTER
            updateGame(obj.game);
            updateNickname(obj.player.user.nickname);
          }
        } else if (res.status === 400) {
          updateGameIDAndHistory('');
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      (async function () {
        updateNickname(await getNickname());
      })();
    }
  }, [gameID, game, player]);

  useEffect(() => {
    joinGame(window.location.pathname.substring(1));
  }, []);

  const joinGame = async (gameID) => {
    const res = await postJoinGame(gameID);
    if (res.status === 200 || res.status === 204) {
      updateGameID(gameID);
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  const updateGameIDAndHistory = (gameID) => {
    window.history.replaceState(null, '', gameID || '/');
    updateGame(null);
    updateGameID(gameID);
  };

  if (gameID === '') {
    return <Entry updateGameID={updateGameIDAndHistory} nickname={nickname} />;
  } else if (game === null) {
    return <p>Loading...</p>;
  }

  if (!game.battleStart) {
    return <Lobby players={game.players} gameID={game._id} player={player} />;
  } else {
    return <Game game={game} player={player} />;
  }
}

export default App;
