import React, { useState } from 'react';
import Login from './login/login';
import Signup from './signup/signup';

function Toggle() {
  const [toggle, settoggle] = useState(true);

  const handleSwitch = (screen) => {
    settoggle(screen === 'login');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden px-4">
      
      {/* Animated floating circles background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <span className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -left-20 animate-pulse-slow"></span>
        <span className="absolute w-60 h-60 bg-white/10 rounded-full -bottom-10 -right-10 animate-pulse-slower"></span>
      </div>

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 sm:p-10 transition-all duration-500 ease-in-out">
        {toggle ? (
          <Login onswitch={handleSwitch} />
        ) : (
          <Signup onswitch={handleSwitch} />
        )}
      </div>
    </div>
  );
}

export default Toggle;
