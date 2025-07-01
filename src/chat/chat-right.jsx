import {DotSquare,GalleryThumbnails,MessageCircle,MessageCircleWarning,Phone,Video,} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Messagesend from './messagesend';
import authservice from '../components/appwrite/auth';
import Searchbox from './searchbox';
import Deleteicon from './deleteicon';

function Chatright() {
  const selectedUser = useSelector((state) => state.auth.selectedUser);
  const user = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [search, setsearch] = useState(false);
  const messagesEndRef = useRef(null);
const [activeDotsId, setActiveDotsId] = useState(null);

      const handlesearch = () => {
        setsearch(prev => !prev)    
        }
  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !selectedUser) return;
      const chatId = [user.$id, selectedUser.$id].sort().join('___');
      try {
        const result = await authservice.getMessagesByChatId(chatId);
        setMessages(result);
        console.log(chatId);
        
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [user, selectedUser]);

  const handleDotsClick = (id) => {
  setActiveDotsId(prev => (prev === id ? null : id));
};


   const formatLastSeen = (lastSeenTime) => {
  const lastSeen = new Date(lastSeenTime);
  const now = new Date();
  const diffMs = now - lastSeen;

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  console.log(diffMin);
  
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;

  return lastSeen.toLocaleDateString();
};

  if (!selectedUser) {
    return (
     <div className="flex flex-col items-center justify-center h-full text-white p-6">
        <MessageCircle size={48} className="text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
        <p className="text-gray-400 text-center">
          Send private photos and messages to a friend or group.
        </p>
        <button onClick={handlesearch} className="mt-4 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition">
          Send Message
        </button>
        {search && <Searchbox onClose={() => setsearch(false)} /> }
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden">
      <div className="w-full flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-4 overflow-hidden">
          <img
            src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${selectedUser.imageurl}/download?project=684296e5003206790aa0`}
            alt={selectedUser.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="text-md font-semibold truncate">{selectedUser.name}</p>
             {user?.lastseen && (
        //  <p className="text-sm text-black">
        //   Last seen {formatDistanceToNow(new Date(user.lastseen), { addSuffix: true })}
        // </p>
                <p className=" text-sm text-white">
            Last seen {formatLastSeen(selectedUser.lastseen)}
          </p>
      )}
          </div>
        </div>

        <div className="flex items-center gap-4 pr-2">
          <Phone
            size={24}
            className="text-white hover:text-green-400 cursor-pointer transition duration-150"
          />
          <Video
            size={24}
            className="text-white hover:text-blue-400 cursor-pointer transition duration-150"
          />
          <MessageCircleWarning
            size={24}
            className="text-white hover:text-yellow-400 cursor-pointer transition duration-150"
          />
        </div>
      </div>

   <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
  {messages.map((msg) => (
    <div
      key={msg.$id}
      className={`group relative max-w-xs px-4 py-1 rounded-lg text-white ${
        msg.senderid === user.$id ? 'self-end ml-auto' : 'self-start mr-auto'
      } ${!msg.imageid ? (msg.senderid === user.$id ? 'bg-blue-600' : 'bg-gray-700') : ''}`}
    >
  <button
  onClick={() => handleDotsClick(msg.$id)}
  className={`absolute top-1 ${msg.senderid === user.$id ? 'left-[-24px]' : 'right-[-24px]'}
  opacity-0 group-hover:opacity-100 duration-200 text-white text-2xl cursor-pointer`}
>
  ⋮
</button>

  {activeDotsId === msg.$id && (
     <Deleteicon  
  messageid={msg.$id}
   ondelete={(deletedId) => {
      setMessages((prev) => prev.filter((m) => m.$id !== deletedId));
      setActiveDotsId(null);
    }}
    imageid={msg.imageid}
    position = {msg.senderid === user.$id ? "left" : "right" }
    isSender = {msg.senderid === user.$id}
    content = {msg.content}
   />
  )}
      {msg.imageid ? (
        <img
          src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${msg?.imageid}/download?project=684296e5003206790aa0`}
          alt="avatar"
          className="w-100 h-50 rounded-2xl object-cover shadow-sm bg-none border-2 border-gray-700"
        />
      ) : (
        <p>{msg.content}</p>
      )}

      <p className="text-[10px] text-gray-300 text-right">
        {new Date(msg.time).toLocaleTimeString()}
      </p>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>

      <div className=" p-4">
        <Messagesend onMessageSent={(newMessage) =>setMessages((prev) => [...prev, newMessage])}
/>
      </div>
    </div>
  );
}

export default Chatright;
