import React from 'react';

export default function Header(props) {
  return (
    <>
      <div className="title">Arena</div>
      <button className="closeModal" onClick={props.close}>
        Close
      </button>
    </>
  );
}
