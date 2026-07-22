import React, { useEffect, useState } from 'react';
import Intro from './Intro';
import Homepage from './homepage';
import Auth from './auth';
import Forgot from './forgot';
import Sign from './sign';
import Dashboard from './Dashboard';

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return localStorage.getItem('introSeen') !== 'true';
    } catch (err) {
      return true;
    }
  });
  const [screen, setScreen] = useState('home');
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('coachAuth');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      return null;
    }
  });

  useEffect(() => {
    document.title = 'Olympic Fitness Gym';
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) favicon.href = '/Path/logo.png';
  }, []);

  useEffect(() => {
    if (auth && screen === 'home') {
      setScreen('dashboard');
    }
  }, [auth, screen]);

  const handleIntroComplete = () => {
    localStorage.setItem('introSeen', 'true');
    setShowIntro(false);
    setScreen('home');
  };

  const openLogin = () => setScreen('auth');
  const openForgot = () => setScreen('forgot');
  const openSignUp = () => setScreen('signup');
  const closeLogin = () => setScreen('home');

  const handleSignupComplete = (userData) => {
    setAuth(userData);
    localStorage.setItem('coachAuth', JSON.stringify(userData));
    setScreen('dashboard');
  };

  const handleLogin = (userData) => {
    setAuth(userData);
    localStorage.setItem('coachAuth', JSON.stringify(userData));
    setScreen('dashboard');
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('coachAuth');
    setScreen('home');
  };

  return (
    <div className='App'>
      {showIntro ? (
        <Intro onComplete={handleIntroComplete} />
      ) : auth ? (
        <Dashboard auth={auth} onLogout={handleLogout} />
      ) : screen === 'auth' ? (
        <Auth onClose={closeLogin} onForgot={openForgot} onSignUp={openSignUp} onLogin={handleLogin} />
      ) : screen === 'forgot' ? (
        <Forgot onBack={openLogin} onSignUp={openSignUp} />
      ) : screen === 'signup' ? (
        <Sign onBack={openLogin} onSignupComplete={handleSignupComplete} onSignupSuccess={openLogin} />
      ) : (
        <Homepage onLogin={openLogin} />
      )}
    </div>
  );
}

export default App;