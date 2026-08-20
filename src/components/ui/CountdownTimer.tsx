import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  weddingDateStr: string;
}

interface TimeDiff {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ weddingDateStr }) => {
  const [timeDiff, setTimeDiff] = useState<TimeDiff>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: true
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(weddingDateStr).getTime();
      const now = new Date().getTime();
      let diff = target - now;
      let isPast = false;

      if (diff < 0) {
        diff = Math.abs(diff);
        isPast = true;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeDiff({ days, hours, minutes, seconds, isPast });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingDateStr]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs uppercase tracking-widest text-amber-300/80 mb-3 font-semibold">
        {timeDiff.isPast ? '💍 Married for' : '⏳ Countdown to Wedding Day'}
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg w-full">
        <div className="glass-card p-3 sm:p-4 rounded-2xl text-center border border-rose-500/20">
          <span className="block font-serif text-2xl sm:text-4xl font-bold gold-gradient-text">
            {timeDiff.days}
          </span>
          <span className="text-[10px] sm:text-xs text-stone-300/70 tracking-wider uppercase">Days</span>
        </div>
        <div className="glass-card p-3 sm:p-4 rounded-2xl text-center border border-rose-500/20">
          <span className="block font-serif text-2xl sm:text-4xl font-bold gold-gradient-text">
            {String(timeDiff.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-stone-300/70 tracking-wider uppercase">Hours</span>
        </div>
        <div className="glass-card p-3 sm:p-4 rounded-2xl text-center border border-rose-500/20">
          <span className="block font-serif text-2xl sm:text-4xl font-bold gold-gradient-text">
            {String(timeDiff.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-stone-300/70 tracking-wider uppercase">Mins</span>
        </div>
        <div className="glass-card p-3 sm:p-4 rounded-2xl text-center border border-rose-500/20">
          <span className="block font-serif text-2xl sm:text-4xl font-bold gold-gradient-text">
            {String(timeDiff.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-stone-300/70 tracking-wider uppercase">Secs</span>
        </div>
      </div>
    </div>
  );
};
