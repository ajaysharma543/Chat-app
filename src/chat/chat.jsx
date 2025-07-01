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
      navigate("/chat");
      console.log("login user data" , user);
    }
    else{
      navigate("/")
    }
  }, [isLoggedIn, navigate]);

 

  return (
    <>
       {/* <Chatheader /> */}
<div className="w-full min-h-screen flex bg-black text-gray-900 relative">
  <div className="w-[5%] border-r border-gray-700 bg-black">
    <Chatleft />
  </div>
  <div className="w-[25%] border-r border-gray-700 bg-black">
    <Chatmiddle />
  </div>
  <div className="w-[70%] bg-black">
    <Chatright />
  </div>
</div>

      {/* {user?.lastseen && (
        //  <p className="text-sm text-black">
        //   Last seen {formatDistanceToNow(new Date(user.lastseen), { addSuffix: true })}
        // </p>
                <p className=" text-sm text-black">
            Last seen {formatLastSeen(user.lastseen)}
          </p>
      )} */}
    </>
  );
};

export default Navbar;
