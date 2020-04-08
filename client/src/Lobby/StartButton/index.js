import React, { useState } from 'react';
import url from 'url';

import { SERVER_URL } from '../../utils/constants';

export default function StartButton(props) {
  const [errorText, setErrorText] = useState(null);
  const startGame = async () => {
    const res = await fetch(url.resolve(SERVER_URL, 'game/start'), {
      credentials: 'include',
      method: 'POST',
      body: props.gameID,
    });

    if (res.status != 200) {
      const text = await res.text();
      setErrorText(text);
    }
  };

  return (
    <>
      <button onClick={startGame}>Start</button>
      <p>{errorText}</p>
    </>
  );
}
