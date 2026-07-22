import React, { useEffect, useState } from 'react';

const API_URL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:5000`
  : 'http://localhost:5000';

export default function ClientDashboard({ auth, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        const result = await response.json();
        if (!response.ok) {
          setError(result.message || 'Unable to load dashboard.');
          return;
        }
        setData(result);
      } catch (err) {
        setError('Unable to connect to backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [auth.token]);

  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <header className='flex flex-col gap-4 border-b border-slate-800 bg-[#091F5B]/95 px-6 py-5 md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='text-sm uppercase tracking-[0.3em] text-slate-300'>Olympic Fitness Gym</p>
          <h1 className='mt-2 text-3xl font-semibold'>Welcome, {auth.name || auth.email}</h1>
          <p className='mt-1 text-sm text-slate-300'>You are signed in as Client.</p>
        </div>
        <button
          type='button'
          onClick={onLogout}
          className='inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20'
        >
          Logout
        </button>
      </header>

      <main className='mx-auto max-w-6xl space-y-6 px-6 py-8'>
        {loading ? (
          <div className='rounded-3xl bg-slate-900/80 p-8 text-center text-xl text-slate-200'>Loading dashboard...</div>
        ) : error ? (
          <div className='rounded-3xl bg-rose-900/80 p-8 text-center text-xl text-rose-200'>{error}</div>
        ) : (
          <div className='space-y-6'>
            {/* Registration Card */}
            {data?.registration && (
              <section className='rounded-3xl border border-slate-800 bg-slate-900/95 p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <p className='text-sm uppercase tracking-[0.3em] text-slate-400'>Profile Information</p>
                    <div className='mt-4 space-y-2 text-sm'>
                      <p className='text-white'><span className='text-slate-400'>Name:</span> {data.registration.firstName} {data.registration.lastName} {data.registration.middleInitial}</p>
                      <p className='text-white'><span className='text-slate-400'>Age:</span> {data.registration.age}</p>
                      <p className='text-white'><span className='text-slate-400'>Phone:</span> {data.registration.cellPhone}</p>
                      <p className='text-white'><span className='text-slate-400'>Civil Status:</span> {data.registration.civilStatus}</p>
                    </div>
                  </div>
                  <div>
                    <p className='text-sm uppercase tracking-[0.3em] text-slate-400'>Emergency Contact</p>
                    <div className='mt-4 space-y-2 text-sm'>
                      <p className='text-white'><span className='text-slate-400'>Name:</span> {data.registration.emergencyContactName}</p>
                      <p className='text-white'><span className='text-slate-400'>Phone:</span> {data.registration.emergencyContactPhone}</p>
                      <p className='text-white'><span className='text-slate-400'>Address:</span> {data.registration.address}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className='rounded-3xl border border-slate-800 bg-slate-900/95 p-6'>
              <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                  <p className='text-sm uppercase tracking-[0.3em] text-slate-400'>Current plan</p>
                  <h2 className='mt-2 text-3xl font-semibold text-white'>{data.profile.currentPlan}</h2>
                </div>
                <div className='rounded-3xl bg-slate-950/80 px-5 py-4 text-slate-200'>
                  <p className='text-sm uppercase tracking-[0.28em] text-slate-400'>Next workout</p>
                  <p className='mt-2 text-xl font-semibold'>{data.profile.nextWorkout}</p>
                </div>
              </div>
            </section>

            <section className='grid gap-4 md:grid-cols-3'>
              <div className='rounded-3xl border border-slate-800 bg-slate-900/95 p-6'>
                <p className='text-sm uppercase tracking-[0.28em] text-slate-400'>Workouts this week</p>
                <p className='mt-4 text-4xl font-semibold text-white'>{data.profile.workoutsThisWeek}</p>
              </div>
              <div className='rounded-3xl border border-slate-800 bg-slate-900/95 p-6'>
                <p className='text-sm uppercase tracking-[0.28em] text-slate-400'>Goal completion</p>
                <p className='mt-4 text-4xl font-semibold text-white'>{data.profile.goalCompletion}%</p>
              </div>
              <div className='rounded-3xl border border-slate-800 bg-slate-900/95 p-6'>
                <p className='text-sm uppercase tracking-[0.28em] text-slate-400'>Recommended</p>
                <p className='mt-4 text-lg font-semibold text-white'>{data.recommended[0]}</p>
              </div>
            </section>

            <section className='rounded-3xl border border-slate-800 bg-slate-900/95 p-6'>
              <h2 className='text-2xl font-semibold text-white'>Progress focus</h2>
              <ul className='mt-4 space-y-3 text-slate-200'>
                {data.recommended.map((item) => (
                  <li key={item} className='rounded-3xl bg-slate-950/80 px-5 py-4'>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
