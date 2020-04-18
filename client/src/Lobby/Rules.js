import React from 'react';

export default function Rules(props) {
  return (
    <ul className="rules">
      <li>
        Click on cards from your <em>hand</em> to play them.
      </li>
      <li>
        You'll get to see what everyone else played in the <em>arena</em>, there will be an
        explanation of who won the <em>battle</em> and why.
      </li>
      <li>
        The winner adds both the card they played and the <em>Big Card</em> to their{' '}
        <em>collection</em>. (Visible to everyone)
      </li>
      <li>
        Having a <em>+ count</em> of 5 or greater wins the
        <em>round</em> and a point
      </li>
      <li>
        Having 3 or more of the same card wins the <em>round</em> and a point
      </li>
      <li>First to 5 points wins!</li>
    </ul>
  );
}
