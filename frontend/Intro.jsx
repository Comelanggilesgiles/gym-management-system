import React, { useEffect, useRef, useState } from 'react';

const words = ['Are', 'You', 'Ready', 'To', 'Start', 'Your', 'Journey?'];

export default function Intro({ onComplete }) {
  const [phase, setPhase] = useState('title');
  const [showWord, setShowWord] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const timeoutRefs = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    document.title = 'Olympic Fitness Gym';
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) favicon.href = '/logo.png';

    timeoutRefs.current.push(window.setTimeout(() => setPhase('circle'), 1000));
    timeoutRefs.current.push(window.setTimeout(() => setPhase('video'), 4000));
    timeoutRefs.current.push(window.setTimeout(() => setPhase('words'), 9000));

    return () => {
      timeoutRefs.current.forEach((timer) => window.clearTimeout(timer));
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== 'words') return;

    let index = 0;
    setCurrentWord(words[index]);
    setShowWord(true);
    timeoutRefs.current.push(window.setTimeout(() => setShowWord(false), 500));

    intervalRef.current = window.setInterval(() => {
      index += 1;
      if (index >= words.length) {
        window.clearInterval(intervalRef.current);
        timeoutRefs.current.push(
          window.setTimeout(() => {
            if (onComplete) onComplete();
          }, 600)
        );
        return;
      }

      setCurrentWord(words[index]);
      setShowWord(true);
      timeoutRefs.current.push(window.setTimeout(() => setShowWord(false), 500));
    }, 700);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [phase, onComplete]);

  const circleOpen = phase === 'circle' || phase === 'video' || phase === 'words';

  return (
    <div className='bg-white overflow-hidden h-screen relative'>
      <h1
        className={bsolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[58px] text-black text-center font-[Impact] z-30 transition-opacity duration-500 }
      >
        OLYMPIC FITNESS GYM
      </h1>

      <div
        className={ounded-full bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-[2000ms] ease-in-out z-10 }
      />

      {phase === 'video' && (
        <div className='absolute inset-0 z-20'>
          <video className='w-full h-full object-cover' autoPlay muted playsInline>
            <source src='Path/gym.mp4' type='video/mp4' />
          </video>
        </div>
      )}

      {phase === 'words' && showWord && (
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[Impact] text-[70px] text-white text-center z-30'>
          {currentWord}
        </div>
      )}
    </div>
  );
}
