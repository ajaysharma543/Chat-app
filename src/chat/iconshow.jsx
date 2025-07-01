import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authslice';
import authservice from '../components/appwrite/auth';

const Iconshow = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

     const handleLogout = async () => {
    try {
      await authservice.logout();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

    return(
 <div className="absolute top-10 left-0 w-48 cursor-pointer bg-white  shadow-lg flex flex-col  z-50">
    <button
    onClick={() => navigate("/edit")}
     className="w-full text-left border-1 cursor-pointer border-gray-500 text-gray-800 hover:bg-blue-100 px-4 py-2 transition">
      Edit Profile
    </button>
    <button onClick={handleLogout} className="w-full text-left border-1 cursor-pointer border-gray-500 text-red-600 hover:bg-red-100 px-4 py-2 transition">
      Logout
    </button>
  </div>
    )
 
};

export default Iconshow;
