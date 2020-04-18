import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import './style.css';

export default function Arena(props) {
  const { battleStart, players } = props;
  //state like active: whenever battlestart changes and there's a previous card, render
  const [open, updateOpen] = useState(false);

  const isFirstBattle = players[0].lastPlayed ? false : true;
  useEffect(() => {
    if (!isFirstBattle) {
      updateOpen(true);
    }
  }, [battleStart, isFirstBattle]);

  useEffect(() => {
    window.document.addEventListener('keydown', () => updateOpen(false));
  }, []);

  // bug when unexpectedly not rendering body
  if (open) {
    return ReactDOM.createPortal(
      <div className="modal">
        {<Header />}
        {<Body {...props} />}
        {<Footer />}
      </div>,
      document.getElementById('modal')
    );
  } else return null;
}
