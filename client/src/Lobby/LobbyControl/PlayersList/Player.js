import React, { useState } from 'react';
import { postKickPlayer } from '../../../utils/request';

export default function Player(props) {
  const { id, gameID, isHost, nickname } = props;
  const [kicked, updateKicked] = useState(false);

  const kickPlayer = () => {
    updateKicked(true);
    postKickPlayer(gameID, id);
  };

  const style = { display: kicked ? 'none' : 'flex' };
  return (
    <div className="player" style={style}>
      <div>{nickname}</div>
      {isHost && <button onClick={kickPlayer}>X</button>}
    </div>
  );
}
