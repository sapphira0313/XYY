import { useEffect, useState } from 'react';

interface ClockState {
  time: string;
  date: string;
}

function getClockState(): ClockState {
  const now = new Date();

  return {
    time: now.toLocaleTimeString('zh-CN', { hour12: false }),
    date: now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }),
  };
}

export function ClockDisplay() {
  const [clock, setClock] = useState<ClockState>(() => getClockState());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClock(getClockState());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="clock-container mb-0">
      <div className="time">{clock.time}</div>
      <div className="date">{clock.date}</div>
    </div>
  );
}
