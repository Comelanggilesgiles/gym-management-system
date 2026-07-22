import React, { useState } from 'react';
import bgVideo from '../Path/gym.mp4';
import logo from '../Path/logo.png';
import gmailLogo from '../Path/gmail.png';

const API_URL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:5000`
  : 'http://localhost:5000';

export default function Auth({ onClose, onForgot, onSignUp, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed.');
        return;
      }

      onLogin({
        token: data.token,
        email: data.email,
        name: data.name,
        role: data.role,
      });
    } catch (err) {
      setError('Unable to connect to the server. Please make sure the backend is running on port 5000.');
    }
  };

  return (
    <div className='relative h-screen overflow-hidden bg-slate-950 text-slate-900 animate-slide-in-right'>
      <div className='absolute inset-0 bg-slate-950' />
      <div className='absolute inset-0'>
        <video
          className='h-full w-full object-cover'
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className='absolute inset-0 bg-slate-950/70' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_30%)]' />
      </div>

      <div className='relative z-10 flex h-screen w-full justify-between overflow-hidden'>
        <button
          type='button'
          onClick={onClose}
          className='absolute left-6 top-6 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 text-white shadow-lg backdrop-blur transition hover:bg-slate-950'
          aria-label='Go back to homepage'
        >
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
        </button>
        <div className='hidden md:flex md:w-[66%] min-w-0 items-center justify-center px-12'>
          <div className='max-w-[620px] text-center text-white'>
            <p className='text-sm uppercase tracking-[0.35em] text-white/70'>Join the grind</p>
            <h1 className='mt-6 text-5xl font-semibold leading-tight text-white sm:text-6xl'>Transform Your Body, Elevate Your Strength.</h1>
            <p className='mt-6 text-base leading-8 text-slate-200/85'>Join monthly sessions, build consistency, and push every workout toward real progress.</p>
          </div>
        </div>

        <div className='relative flex w-full flex-col justify-center bg-white px-8 py-8 md:w-[34%] xl:w-[30%] md:pl-14 md:pr-10 md:py-10 h-full max-h-screen min-w-[360px] md:min-w-[420px] lg:min-w-[460px] overflow-y-auto'>
          <div className='relative mx-auto flex w-full max-w-[360px] flex-col justify-between gap-5 h-full'>
            <div className='flex items-center gap-3'>
              <img src={logo} alt='Olympic Fitness Gym logo' className='h-11 w-11 rounded-2xl object-cover' />
              <div>
                <p className='text-xs uppercase tracking-[0.35em] text-slate-400'>Olympic Fitness Gym</p>
              </div>
            </div>
            <div className='space-y-4'>
              <p className='text-sm uppercase tracking-[0.35em] text-[#091F5B]'>Welcome Back</p>
              <h2 className='text-4xl font-semibold tracking-tight text-[#091F5B]'>Welcome Back</h2>
              <p className='text-sm leading-7 text-slate-500'>Sign in to continue to your workout dashboard and performance insights.</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                className='h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-emerald-300/30'
              />

              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Password'
                  className='h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-5 pr-14 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-emerald-300/30'
                />
                <button
                  type='button'
                  onClick={handleTogglePassword}
                  className='absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-10 items-center justify-center rounded-full bg-slate-100 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-200'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <label className='inline-flex items-center gap-3 text-sm text-slate-600'>
                  <input
                    type='checkbox'
                    checked={remember}
                    onChange={() => setRemember((prev) => !prev)}
                    className='h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500'
                  />
                  Remember me
                </label>
                <button type='button' onClick={onForgot} className='text-sm font-medium text-slate-900 transition hover:text-emerald-600'>Forgot Password?</button>
              </div>

              {error && <p className='text-sm text-red-600'>{error}</p>}

              <button
                type='submit'
                className='w-full rounded-xl bg-[#091F5B] px-5 py-3 text-sm font-semibold text-white shadow-lg transition transform duration-150 hover:bg-[#081a4f] hover:shadow-md active:scale-95'
              >
                Sign In
              </button>
            </form>

            <div className='my-5 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-400'>
              <span className='h-px flex-1 bg-slate-200' />
              <span>OR</span>
              <span className='h-px flex-1 bg-slate-200' />
            </div>

            <div className='space-y-3'>
              <button
                type='button'
                className='flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100'
              >
                <img src={gmailLogo} alt='Gmail logo' className='h-6 w-6 rounded-full object-cover' />
                <span>Continue with Gmail</span>
              </button>
              <button
                type='button'
                className='flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-slate-950 px-4 text-sm font-semibold leading-none text-white transition hover:bg-black'
              >
                <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white'>
                  <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.17h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.506 0-1.798.716-1.798 1.766v2.316h3.596l-.468 3.536h-3.128V24h6.127C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z' />
                  </svg>
                </span>
                <span>Continue with Facebook</span>
              </button>
              <button
                type='button'
                className='flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold leading-none text-slate-700 transition hover:bg-slate-100'
              >
                <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-700'>
                  <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M6.62 10.79a15.72 15.72 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.36 11.36 0 0 0 3.56.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A18 18 0 0 1 3 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.56 1 1 0 0 1-.24 1.01l-2.2 2.2z' />
                  </svg>
                </span>
                <span>Continue with Mobile Number</span>
              </button>
            </div>

            <div className='mt-5 text-center text-sm text-slate-500'>
              New here?{' '}
              <button type='button' onClick={onSignUp} className='font-semibold text-slate-900 transition hover:text-emerald-600'>Create account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
