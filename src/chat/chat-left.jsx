import { Home, Instagram, MessageCircle, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Searchbox from './searchbox';

function Chatleft() {
      const user = useSelector((state) => state.auth.user);
      const navigate = useNavigate();
      const [search, setsearch] = useState(false);

      const handlesearch = () => {
        setsearch(prev => !prev)
      }

  return (
    <div className="flex flex-col items-center pt-10 space-y-9 h-full ">
      <Instagram onClick={() => navigate("/")} className="w-9 h-9 text-white hover:text-pink-500 transition duration-200 cursor-pointer pb-3" />
      <Home className="w-7 h-8 text-white hover:text-blue-400 transition duration-200 cursor-pointer" onClick={() => navigate("/")}/>
      <Search className="w-7 h-8 text-white hover:text-blue-400 transition duration-200 cursor-pointer" onClick={handlesearch} />
      {search && <Searchbox onClose={() => setsearch(false)}  /> }
<MessageCircle className="w-7 h-8 text-white hover:text-blue-400 transition duration-200" />   

<img
  src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${user?.imageurl}/download?project=684296e5003206790aa0`}
  alt="avatar"
   onClick={() => navigate("/logout") } 
  className="w-8 h-8 rounded-full object-cover border-2 "
/>
 </div>
  );
}

export default Chatleft;
