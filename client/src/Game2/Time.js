import React, { useEffect, useState } from 'react';
import moment from 'moment';

export default function Time(props) {
  const [timeLeft, updateTimeLeft] = useState(0);
  useEffect(() => {
    const int = setInterval(() => {
      const timeElapsed = Math.floor(moment().diff(moment(props.battleStart), 'seconds'));
      let newTimeLeft = 10 - timeElapsed;
      newTimeLeft = Math.floor(newTimeLeft);
      if (newTimeLeft <= 0) {
        newTimeLeft = 0;
      }
      if (newTimeLeft !== timeLeft) {
        updateTimeLeft(newTimeLeft);
      }
    }, 400);
    return () => clearInterval(int);
  }, [props.battleStart]);

  let displayTime = `:${timeLeft < 10 && '0'}${timeLeft}`;
  return <div id="time" value={displayTime}></div>;
}
