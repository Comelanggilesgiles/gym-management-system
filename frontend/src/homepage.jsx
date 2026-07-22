import React, { useEffect, useState } from 'react';

export default function Homepage({ onLogin, message }) {
  const [isLoginPressed, setIsLoginPressed] = useState(false);

  useEffect(() => {
    document.title = 'Olympic Fitness Gym - Home';
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) favicon.href = 'Path/logo.png';
  }, []);

  const handleLoginClick = () => {
    setIsLoginPressed(true);
    window.setTimeout(() => {
      setIsLoginPressed(false);
      onLogin();
    }, 120);
  };

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Navigation Bar */}
      <nav className='sticky top-0 left-0 right-0 flex justify-between items-center p-2 bg-[#091F5B]/50 backdrop-blur z-40'>
        <img src='Path/logo.png' alt='Logo' className='h-12 w-auto' />
        <div className='hidden sm:flex space-x-1'>
          <a href='#home' className='text-[#D0E4FF] hover:text-white px-2 py-1 rounded text-sm'>HOME</a>
          <a href='#membership' className='text-[#D0E4FF] hover:text-white px-2 py-1 rounded text-sm'>MEMBERSHIP</a>
          <a href='#about' className='text-[#D0E4FF] hover:text-white px-2 py-1 rounded text-sm'>ABOUT</a>
          <a href='#transformation' className='text-[#D0E4FF] hover:text-white px-2 py-1 rounded text-sm'>TRANSFORMATION</a>
          <a href='#contactus' className='text-[#D0E4FF] hover:text-white px-2 py-1 rounded text-sm'>CONTACT US</a>
        </div>
        <button
          onClick={handleLoginClick}
          className={`bg-blue-600 hover:bg-blue-700 text-[#D0E4FF] px-2 py-1 rounded text-sm transition-transform duration-150 ${isLoginPressed ? 'scale-95' : 'scale-100'}`}
        >
          LOGIN
        </button>
      </nav>

      {message && (
        <div className='mx-auto my-4 max-w-6xl rounded-md bg-emerald-500/95 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-500/20'>
          {message}
        </div>
      )}

      {/* Cinematic Video */}
      <div id='home' className='w-full mt-[80px]'>
        <video
          autoPlay
          muted
          loop
          className='w-full h-auto object-cover'
        >
          <source src="Path/cinematic.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Sections */}
      <section id='membership' className='min-h-screen p-4 md:p-16 bg-slate-950 text-white'>
        <h2 className='text-2xl md:text-4xl text-[#D0E4FF] mb-4'>Membership</h2>
        <p className='max-w-3xl'>
          Choose your plan and join Olympic Fitness Gym. We have flexible options for all goals.
        </p>
      </section>

      <section id='about' className='min-h-screen p-4 md:p-16 bg-slate-900 text-white'>
        <h2 className='text-2xl md:text-4xl text-[#D0E4FF] mb-4'>About</h2>
        <p className='max-w-3xl'>
          Olympic Fitness Gym is dedicated to excellence, strength, and a healthy community.
        </p>
      </section>

      <section id='transformation' className='min-h-screen p-4 md:p-16 bg-slate-950 text-white'>
        <h2 className='text-2xl md:text-4xl text-[#D0E4FF] mb-4'>Transformation</h2>
        <p className='max-w-3xl'>
          Read real stories from people who transformed their body, mind, and habits.
        </p>
      </section>

      <section id='contactus' className='min-h-screen p-4 md:p-16 bg-slate-900 text-white'>
        <h2 className='text-2xl md:text-4xl text-[#D0E4FF] mb-4'>Contact Us</h2>
        <p className='max-w-3xl'>
          Email: support@olympicfitness.com | Phone: 123-456-7890
        </p>
      </section>

      <footer className='relative bg-[#EDF0F5] text-[#1A1A1A] rounded-t-[72px] overflow-hidden px-4 py-20 md:px-16 md:py-24'>
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-10'>
          <div className='flex items-center justify-center w-[180px] h-[180px] rounded-full bg-white shadow-lg overflow-hidden'>
            <img src='Path/logo.png' alt='Leeuwarder Golfclub' className='w-full h-full object-cover' />
          </div>
        </div>

        <div className='mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1fr_1fr_0.5fr] mt-20'>
          <div>
            <p className='text-sm uppercase tracking-[0.35em] text-[#666666] mb-4'>Contact</p>
            <div className='text-sm text-[#666666] space-y-2'>
              <p>Woelwijk 101</p>
              <p>8926 XD Leeuwarden</p>
              <p>0511 - 43 22 99</p>
              <p>info@leeuwardergolfclub.nl</p>
            </div>
          </div>

          <div>
            <p className='text-sm uppercase tracking-[0.35em] text-[#666666] mb-4'>Snel naar</p>
            <div className='grid grid-cols-2 gap-3 text-sm text-[#666666]'>
              <a href='#home' className='hover:text-[#1A1A1A] transition'>Onze club</a>
              <a href='#membership' className='hover:text-[#1A1A1A] transition'>Voor gasten</a>
              <a href='#about' className='hover:text-[#1A1A1A] transition'>Beginnen met Golf</a>
              <a href='#transformation' className='hover:text-[#1A1A1A] transition'>De baan</a>
              <a href='#contactus' className='hover:text-[#1A1A1A] transition'>Onze evenementen</a>
              <a href='#contactus' className='hover:text-[#1A1A1A] transition'>Contact</a>
            </div>
          </div>

          <div className='flex flex-col items-start justify-between rounded-[32px] border border-[#D9D9D9] bg-white p-6 shadow-[0_10px_20px_rgba(0,0,0,0.08)]'>
            <p className='text-sm uppercase tracking-[0.35em] text-[#666666] mb-4'>Leadingcourses score</p>
            <p className='text-5xl font-bold text-[#FFB74D]'>7.0</p>
          </div>
        </div>

        <div className='mt-10 border-t border-[#D9D9D9] pt-6 text-sm text-[#666666]'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-wrap gap-3'>
              <a href='#cookies' className='hover:text-[#1A1A1A] transition'>Cookies policy</a>
              <a href='#privacy' className='hover:text-[#1A1A1A] transition'>Privacy policy</a>
            </div>
            <p>©2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
