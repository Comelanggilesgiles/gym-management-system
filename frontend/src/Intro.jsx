import React, { useEffect, useState } from 'react';

const words = ['Are', 'You', 'Ready', 'To', 'Start', 'Your', 'Journey?'];

export default function Intro({ onComplete }) {
  const [phase, setPhase] = useState('title');
  const [wordIndex, setWordIndex] = useState(-1);

  useEffect(() => {
    document.title = 'Olympic Fitness Gym';
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) favicon.href = '/Path/logo.png';

    const introTimers = [];

    introTimers.push(window.setTimeout(() => setPhase('circle'), 1200));
    introTimers.push(window.setTimeout(() => setPhase('video'), 3200));
    introTimers.push(window.setTimeout(() => setPhase('words'), 7200));
    introTimers.push(window.setTimeout(() => setWordIndex(0), 7400));

    return () => {
      introTimers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (wordIndex < 0) return;
    if (wordIndex >= words.length) {
      const doneTimer = window.setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
      return () => window.clearTimeout(doneTimer);
    }

    const nextWordTimer = window.setTimeout(() => {
      setWordIndex((prev) => prev + 1);
    }, 700);

    return () => window.clearTimeout(nextWordTimer);
  }, [wordIndex, onComplete]);

  const circleOpen = phase === 'circle' || phase === 'video' || phase === 'words';
  const showWord = wordIndex >= 0 && wordIndex < words.length;

  return (
    <div className='bg-white overflow-hidden h-screen relative'>
      <h1
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[58px] text-black text-center font-[Impact] z-30 transition-opacity duration-700 ${
          phase === 'title' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        OLYMPIC FITNESS GYM
      </h1>

      <div
        className={`rounded-full bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-[1600ms] ease-in-out z-10 ${
          circleOpen ? 'w-[3000px] h-[3000px]' : 'w-0 h-0'
        }`}
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
          {words[wordIndex]}
        </div>
      )}
    </div>
  );
}
