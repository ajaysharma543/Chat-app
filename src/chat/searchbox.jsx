import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import authservice from '../components/appwrite/auth';
import { setSelectedUser } from '../store/authslice';

function Searchbox({ onClose }) {

  const [othersusers,setOtherUsers] = useState([])
    const user = useSelector((state) => state.auth.user);
    const [selected, setSelected] = useState(null);
    const dispatch = useDispatch();

    const [search, setsearch] = useState("")
  
    useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.email) return;

      try {
        const others = await authservice.getAllUsersExceptCurrent(user.email);
        setOtherUsers(others);
      } catch (error) {
        console.error('Failed to fetch other users:', error);
      }
    };
    fetchUsers();
  }, [user]);

  const filterprodoucts = othersusers.filter((item) => (
  item.name.toLowerCase().includes(search.toLowerCase())
  ))

  const handleChatStart = () => {
  if (selected) {
    dispatch(setSelectedUser(selected));
    onClose(); 
  }
};


  return (
    <div className="absolute top-40 left-130 bg-gray-900 text-black rounded-xl shadow-lg w-130 p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className='text-white'>New Message</h1>
        <button onClick={onClose} className="ml-2 text-gray-500 hover:text-red-500 transition cursor-pointer">
          <X size={20} />
        </button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setsearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 text-white outline-none"
      />

      <div className='w-full'>
        {filterprodoucts.length === 0 ? (
          <p className='text-white text-2xl'>No User Found</p>
        ) : (
          filterprodoucts.map((item) => (
         <div
            key={item.$id}
            onClick={() => setSelected(item)}
            className={`flex items-center space-x-3 rounded-lg cursor-pointer p-2 transition ${
              selected?.$id === item.$id
                ? 'bg-gray-800'
                : 'hover:bg-gray-500 hover:text-black text-white'
          }`}  
          >
            <img
              src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${item.imageurl}/download?project=684296e5003206790aa0`}
              alt={item.name}
              className="w-15 h-15 rounded-full object-cover"
            />
            <div className="pl-3">
              <p className="text-white text-md">{item.name}</p>
              <p className="text-gray-400 text-sm">{item.email}</p>
            </div>
          </div>
          )))}
      </div>
        <button
      onClick={handleChatStart}
      disabled={!selected}
      className={`w-full py-2 rounded-lg transition  ${
        selected
          ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
          : 'bg-gray-600 text-gray-300 cursor-not-allowed'
      }`}
    >
            Chat
          </button>
    </div>
  );
}

export default Searchbox;
