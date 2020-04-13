import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import Header from './Header';
import Body from './Body';
import './style.css';

export default function Arena(props) {
  const { battleStart, players } = props;
  //state like active: whenever battlestart changes and there's a previous card, render
  const [open, updateOpen] = useState(false);

  useEffect(() => {
    if (players[0].lastPlayed) {
      //this isn't the first battle
      updateOpen(true);
    }
  }, [battleStart]);

  const style = {
    display: open ? 'grid' : 'none',
  };
  // bug when unexpectedly not rendering body
  return ReactDOM.createPortal(
    <div style={style} className="modal">
      {open && <Header close={() => updateOpen(false)} />}
      {<Body {...props} />}
    </div>,
    document.getElementById('modal')
  );
}
