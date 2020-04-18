import React from 'react';
import Name from '../utils/Name';
import LeaveGame from '../utils/LeaveGame';

export default function Header(props) {
  const { nickname, gameID } = props;
  return (
    <div className="header">
      <div>
        <Name nickname={nickname} />!
      </div>
      <div>This is the Lobby!</div>
      <LeaveGame gameID={gameID} />
    </div>
  );
}
