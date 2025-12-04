import { ChevronDown, Edit } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Middlechats from './middle-chats';
import { useNavigate } from 'react-router-dom';
import Iconshow from './iconshow';

function Chatmiddle() {
  const user = useSelector((state) => state.auth.user);
  const [msz , setmsz] = useState(false)
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full h-[10%] flex items-end bg-black justify-between px-6 py-3">
        <div className="flex items-start space-x-2 cursor-pointer relative" onClick={() => setmsz(prev => !prev)}>
          <span className="text-white text-2xl font-medium">
            {user?.name || 'Guest'}
          </span>
          <ChevronDown className="w-6 h-6 text-white mt-2 pl-0" />
            {msz && <Iconshow/>}
        </div>
              
        <button
          type="button"
          className="text-white hover:text-blue-400 transition duration-200"
        >
          <Edit className="w-6 h-6 cursor-pointer" onClick={() => navigate("/edit")} />
        </button>
      </div>

   <div className="w-full px-6 py-4 flex flex-col gap-4">
  <div className="flex items-start gap-4">
    <img
      src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${user?.imageurl}/download?project=684296e5003206790aa0`}
      alt="avatar"
      className="w-16 h-16 rounded-full object-cover shadow-sm"
    />
    <div className="text-white text-sm">
      <p className="font-semibold mb-1">Your Note:</p>
      <p className="whitespace-pre-line">{user?.description || 'No description provided.'}</p>
    </div>
  </div>
</div>

      <Middlechats />
    </>
  );
}

export default Chatmiddle;
