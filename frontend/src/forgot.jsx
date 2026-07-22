import React, { useState } from 'react';
import bgVideo from '../Path/cinematic.mp4';
import logoImg from '../Path/logo.png';

const API_URL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:5000`
  : 'http://localhost:5000';

export default function Forgot({ onBack, onSignUp }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message || 'If the email exists, a reset link was sent.');
    } catch (err) {
      setError('Unable to send reset link.');
    }
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950'>
      <div className='absolute inset-0'>
        <video
          className='h-full w-full object-cover'
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className='absolute inset-0 bg-slate-950/65' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(9,31,91,0.65),16%,transparent_45%),radial-gradient(circle_at_bottom_right,rgba(237,240,245,0.35),15%,transparent_50%)]' />
      </div>
      <div className='relative z-10 flex min-h-screen items-center justify-center px-4 py-8 animate-fade-in-up'>
        <div className='absolute left-6 top-6 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 text-white shadow-lg backdrop-blur transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-950 active:scale-[0.98]' onClick={onBack}>
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
        </div>
        <div className='w-full max-w-[520px] overflow-hidden rounded-[16px] bg-white/15 backdrop-blur-xl shadow-[0_40px_120px_rgba(15,23,42,0.2)] border border-white/20 transition duration-500 ease-out hover:-translate-y-0.5'>
          <div className='px-6 py-8 sm:px-8 sm:py-10'>
            <div className='text-center'>
              <img src={logoImg} alt='Olympic Fitness Gym' className='mx-auto mb-6 h-24 w-24 rounded-[28px] object-cover shadow-xl shadow-slate-950/20' />
              <h3 className='text-3xl font-bold text-white'>Olympic Fitness Gym</h3>
              <p className='mt-3 text-sm text-slate-300'>Reset your password and get back to your workout.</p>
            </div>

            <div className='mt-8 space-y-4'>
              <p className='text-center text-sm text-slate-200'>Enter your email below and we’ll send you a secure reset link.</p>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type='email'
                  placeholder='Email address'
                  className='w-full h-[50px] rounded-[8px] border border-white/20 bg-white/10 px-5 text-white outline-none placeholder:text-slate-400 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20'
                />
                <button
                  type='submit'
                  className='w-full h-[50px] rounded-[24px] bg-[#091F5B] text-white font-semibold shadow-[0_18px_45px_rgba(9,31,91,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#081a4f]'
                >
                  Send reset link
                </button>
              </form>
              {message && <p className='text-sm text-emerald-300'>{message}</p>}
              {error && <p className='text-sm text-red-400'>{error}</p>}

              <div className='mt-5 space-y-3 text-center text-sm text-slate-300'>
                <button
                  type='button'
                  onClick={onBack}
                  className='block w-full rounded-none px-0 py-2 text-slate-200 transition duration-300 hover:text-white'
                >
                  Back to Sign In
                </button>
                <button
                  type='button'
                  onClick={onSignUp}
                  className='block w-full rounded-none px-0 py-2 text-slate-200 transition duration-300 hover:text-white'
                >
                  Need a new account? Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
