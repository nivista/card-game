import React, { useState, useEffect } from 'react';

import './style.css';
import { postNickname } from './request';

export default function Name(props) {
  const [nickname, updateNickname] = useState(props.nickname);

  useEffect(() => {
    updateNickname(props.nickname);
  }, [props.nickname]);

  const updateNicknameAndPost = (newNickname) => {
    if (newNickname.length > 10) return;
    updateNickname(newNickname);
    postNickname(newNickname);
  };

  return (
    <input
      id="nicknameForm"
      value={nickname}
      onChange={(e) => updateNicknameAndPost(e.target.value)}
    ></input>
  );
}
