import React, { useState } from 'react';
import Login from './login/login';
import Signup from './signup/signup';

function Toggle() {
  const [toggle, settoggle] = useState(true);

  const handleSwitch = (screen) => {
    settoggle(screen === 'login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      {toggle ? (
        <Login onswitch={handleSwitch} />
      ) : (
        <Signup onswitch={handleSwitch} />
      )}
    </div>
  );
}

export default Toggle
