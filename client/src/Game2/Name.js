import React, { useState, useEffect } from 'react';
import url from 'url';

import { SERVER_URL } from '../utils/constants';

export default function Name(props) {
  const [nickname, updateNickname] = useState(props.nickname);

  useEffect(() => {
    updateNickname(props.nickname);
  }, [props.nickname]);

  const updateNicknameAndPost = async (newNickname) => {
    if (newNickname.length > 10) return;
    updateNickname(newNickname);
    const res = await fetch(url.resolve(SERVER_URL, 'name'), {
      credentials: 'include',
      method: 'POST',
      body: newNickname,
    });

    console.log(res);
    console.log(await res.text());
  };

  return (
    <input
      id="nicknameForm"
      value={nickname}
      onChange={(e) => updateNicknameAndPost(e.target.value)}
    ></input>
  );
}
