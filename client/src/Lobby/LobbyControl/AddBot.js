import React, { useState } from 'react';
import { postBot } from '../../utils/request';

export default function AddBot(props) {
  const { gameID, isHost } = props;
  const [errorMsg, updateErrorMsg] = useState(null);

  const addBot = async () => {
    const res = await postBot(gameID);
    if (res.status !== 200) {
      updateErrorMsg(await res.text());
    }
  };
  return (
    <div>
      <button id="addBot" disabled={!isHost} onClick={addBot}>
        Add Bot
      </button>
      <span className="error">{errorMsg}</span>
    </div>
  );
}
