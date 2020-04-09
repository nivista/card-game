import React, { useState, useEffect } from 'react';
import moment from 'moment';
export default function (props) {
  const [diff, updateDiff] = useState(null);
  useEffect(() => {
    const int = setInterval(
      () => updateDiff(moment().diff(moment(props.battleStart), 'seconds')),
      500
    );
    return () => {
      clearInterval(int);
    };
  }, [props.battleStart]);
  const style = {};
  let timeLeft = 10 - diff;
  if (timeLeft <= 0) {
    timeLeft = 0;
    style.color = 'red';
  }
  return <p style={style}>Time Left: {timeLeft}</p>;
}
