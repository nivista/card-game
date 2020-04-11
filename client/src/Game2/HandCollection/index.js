import React from 'react';
import Hand from './Hand';
import Collection from './Collection';
import './style.css';

export default function HandCollection(props) {
  const { hand, collection, played } = props;
  return (
    <div id="handCollection">
      <label id="handLabel">Hand:</label>
      <Hand hand={hand} played={played} />
      <label id="collectionLabel">Collection</label>
      <Collection collection={collection} />
    </div>
  );
}
