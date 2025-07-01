import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import authservice from '../components/appwrite/auth';
import { logout } from '../store/authslice';
import conf from '../config/conf';


function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await authservice.logout();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="w-full h-10 bg-black flex items-center justify-between px-4 shadow-md fixed top-0 z-50">
      <div
        onClick={() => navigate('/chat')}
        className="text-white text-xl font-bold cursor-pointer"
      >
        Chatify
      </div>

      <div className="hidden md:flex items-center w-1/3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-1 rounded bg-white text-black focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
       <div className="flex items-center gap-2">
<img
  src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${user?.imageurl}/download?project=684296e5003206790aa0`}
  alt="avatar"
  className="w-8 h-8 rounded-full object-cover border-2 border-white"
/>

  <span className="text-white font-medium hidden sm:block">
    {user?.name}
  </span>
</div>


        <button
          onClick={handleLogout}
          className="text-white hover:text-red-300 transition font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
