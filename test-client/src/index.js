const url = require('url');
const SERVER_URL = 'http://localhost:3000/';

const root = document.getElementById('root');

document.getElementById('getNickname').addEventListener('click', () => {
  fetch(url.resolve(SERVER_URL, 'name'), { credentials: 'include' })
    .then((res) => res.text())
    .then((text) => (document.getElementById('nickname').innerText = text))
    .catch(console.log);
});

document.getElementById('newGame').addEventListener('click', () => {
  fetch(url.resolve(SERVER_URL, 'game/new'), {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.text())
    .then((text) => (document.getElementById('gameID').innerText = text.slice(1, -1)))
    .catch(console.log);
});

document.getElementById('getGame').addEventListener('click', () => {
  fetch(url.resolve(SERVER_URL, 'game/' + document.getElementById('getGameID').value), {
    credentials: 'include',
  })
    .then((res) => {
      if (res.status !== 204) return res.json();
      else return 'Got 204';
    })
    .then((json) => (document.getElementById('getGameResponse').innerText = JSON.stringify(json)))
    .catch(console.log);
});

document.getElementById('joinGame').addEventListener('click', () => {
  fetch(url.resolve(SERVER_URL, 'game/join'), {
    credentials: 'include',
    method: 'POST',
    body: document.getElementById('joinGameID').value,
  })
    .then((res) => res.text())
    .then((text) => (document.getElementById('joinGameResponse').innerText = text))
    .catch(console.log);
});

document.getElementById('startGame').addEventListener('click', () => {
  fetch(url.resolve(SERVER_URL, 'game/start'), {
    credentials: 'include',
    method: 'POST',
    body: document.getElementById('startGameID').value,
  })
    .then((res) => res.text())
    .then((text) => (document.getElementById('startGameResponse').innerText = text))
    .catch(console.log);
});

document.getElementById('move').addEventListener('click', () => {
  fetch(url.resolve(SERVER_URL, 'game/move'), {
    credentials: 'include',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/JSON',
    },
    body: JSON.stringify({
      gameID: document.getElementById('moveGame').value,
      card: document.getElementById('moveCard').value,
    }),
  })
    .then((res) => res.text())
    .then((text) => (document.getElementById('moveResponse').innerText = text))
    .catch(console.log);
});
