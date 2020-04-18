import { SERVER_URL } from './constants';
import url from 'url';

export const getNickname = async () => {
  return await fetch(url.resolve(SERVER_URL, 'name'), {
    credentials: 'include',
  }).then((res) => res.text());
};

export const postNickname = async (nickname) => {
  return await fetch(url.resolve(SERVER_URL, 'name'), {
    credentials: 'include',
    method: 'POST',
    body: nickname,
  });
};

export const postNewGame = async () => {
  return await fetch(url.resolve(SERVER_URL, 'game/new'), {
    method: 'POST',
    credentials: 'include',
  });
};

export const postJoinGame = async (gameID) => {
  return await fetch(url.resolve(SERVER_URL, 'game/join/'), {
    method: 'POST',
    credentials: 'include',
    body: gameID,
  });
};

export const postBot = async (gameID) => {
  return await fetch(SERVER_URL + 'game/addBot', {
    method: 'POST',
    credentials: 'include',
    body: gameID,
  });
};

export const postKickPlayer = async (gameID, playerID) => {
  return await fetch(SERVER_URL + 'game/removePlayer', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ gameID, playerID }),
    headers: {
      'content-type': 'application/json',
      accept: 'application/JSON',
    },
  });
};

export const postStartGame = async (gameID) => {
  return await fetch(url.resolve(SERVER_URL, 'game/start'), {
    credentials: 'include',
    method: 'POST',
    body: gameID,
  });
};

export const getGame = async (gameID) => {
  return await fetch(url.resolve(SERVER_URL, `game/${gameID}`), {
    credentials: 'include',
  });
};

export const postLeaveGame = async (gameID) => {
  window.history.replaceState(null, '', '');
  return await fetch(SERVER_URL + 'game/leave', {
    credentials: 'include',
    method: 'POST',
    body: gameID,
  });
};

export const postMove = async (gameID, card) => {
  return await fetch(url.resolve(SERVER_URL, 'game/move'), {
    credentials: 'include',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/JSON',
    },
    body: JSON.stringify({
      gameID,
      card,
    }),
  });
};
