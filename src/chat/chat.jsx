import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authservice from '../components/appwrite/auth';
import { logout } from '../store/authslice';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Chatheader from './chat-header';
import Chatleft from './chat-left';
import Chatmiddle from './chat-middle';
import Chatright from './chat-right';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.auth.status);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
      // console.log("login user data" , user);
    }
    else{
      navigate("/toggle")
    }
  }, [isLoggedIn, navigate]);

 

  return (
    <>
       {/* <Chatheader /> */}
<div className="w-full h-screen flex bg-black text-gray-900">
  {/* Left Sidebar */}
  <div className="w-[5%] border-r border-gray-700 bg-black overflow-y-auto scrollbar-none">
    <Chatleft />
  </div>

  {/* Middle Messages */}
  <div className="w-[25%] border-r border-gray-700 bg-black flex flex-col h-screen">
    <div className="px-4 py-2 border-b border-gray-800">
      <h2 className="text-white font-semibold">Messages</h2>
    </div>

    {/* Middle scrollable area */}
    <div className="flex-1 overflow-y-auto scrollbar-none">
      <Chatmiddle />
    </div>
  </div>

  {/* Right Side - fixed height, no scroll */}
  <div className="w-[70%] bg-black h-screen flex flex-col">
    <Chatright />
  </div>
</div>

    </>
  );
};

export default Navbar;
