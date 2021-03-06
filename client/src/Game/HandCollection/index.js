import React from 'react';
import Hand from './Hand';
import Collection from './Collection';
import './style.css';

export default function HandCollection(props) {
  const { hand, collection, played, battleStart } = props;
  return (
    <div id="handCollection">
      <label id="handLabel">Hand:</label>
      <Hand hand={hand} played={played} gameID={props.gameID} battleStart={battleStart} />
      <label id="collectionLabel">Collection</label>
      <Collection collection={collection} />
    </div>
  );
}
