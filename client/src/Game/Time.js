import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { TURN_TIME } from '../utils/constants';

export default function Time(props) {
  const { gameover } = props;

  const [timeLeft, updateTimeLeft] = useState(0);
  useEffect(() => {
    const int = setInterval(() => {
      const timeElapsed = Math.floor(moment().diff(moment(props.battleStart), 'seconds'));
      let newTimeLeft = TURN_TIME - timeElapsed;
      newTimeLeft = Math.floor(newTimeLeft);
      if (newTimeLeft <= 0) {
        newTimeLeft = 0;
      }
      if (newTimeLeft !== timeLeft) {
        updateTimeLeft(newTimeLeft);
      }
    }, 200);
    return () => clearInterval(int);
  }, [props.battleStart, timeLeft]);

  let displayTime = gameover ? '--' : `:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
  return <div id="time">{displayTime}</div>;
}
