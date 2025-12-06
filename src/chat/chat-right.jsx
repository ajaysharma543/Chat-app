import {
  DotSquare, GalleryThumbnails, MessageCircle, MessageCircleWarning,
  Phone, Video
} from 'lucide-react';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Messagesend from './messagesend';
import authservice from '../components/appwrite/auth';
import Searchbox from './searchbox';
import Deleteicon from './deleteicon';
import conf from '../config/conf';
import { setSelectedUser } from '../store/authslice';

function Chatright() {

  const selectedUser = useSelector((state) => state.auth.selectedUser);
  const user = useSelector((state) => state.auth.user);

  const [messages, setMessages] = useState([]);
  const [search, setsearch] = useState(false);
  const messagesEndRef = useRef(null);
  const [activeDotsId, setActiveDotsId] = useState(null);
  const [selectedUserState, setSelectedUserState] = useState(null);

  const dispatch = useDispatch();

  const handlesearch = () => {
    setsearch((prev) => !prev);
  };


  /* -------------------------------
      SCROLL TO LAST MESSAGE
  -------------------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  /* -------------------------------
      REALTIME LISTENER FOR USER STATUS
  -------------------------------- */
  useEffect(() => {
    if (!selectedUser) return;

    const unsub = authservice.client.subscribe(
      `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionId}.documents.${selectedUser.$id}`,
      (event) => {
        if (event.events.includes("databases.*.documents.*.update")) {
          setSelectedUserState(event.payload);
          dispatch(setSelectedUser(event.payload));
        }
      }
    );
    return () => unsub();
  }, [selectedUser, dispatch]);


  /* ------------------------------------------
      FETCH & REALTIME LISTENER FOR MESSAGES
  ------------------------------------------- */
  useEffect(() => {
    if (!user || !selectedUser) return;

    const chatId = [user.$id, selectedUser.$id].sort().join("___");

    // initial load
    const fetchMessages = async () => {
      const msgs = await authservice.getMessagesByChatId(chatId);
      setMessages(msgs);
    };
    fetchMessages();

    // REALTIME message listener
    const unsubscribe = authservice.client.subscribe(
      `databases.${conf.appwriteDatabaseId}.collections.${conf.messageCollectionId}.documents`,
      (event) => {
        const newMsg = event.payload;

        if (newMsg.chatid !== chatId) return;

        setMessages((prev) => [
          ...prev.filter((m) => m.$id !== newMsg.$id),
          newMsg
        ]);
      }
    );

    return () => unsubscribe();
  }, [user, selectedUser]);


  /* ------------------------------------------
      MESSAGE OPTIONS
  ------------------------------------------- */
  const handleDotsClick = (id) => {
    setActiveDotsId((prev) => (prev === id ? null : id));
  };


  /* ------------------------------------------
      LAST SEEN FORMATTER
  ------------------------------------------- */
  const formatLastSeen = (lastSeenTime) => {
    const lastSeen = new Date(lastSeenTime);
    const now = new Date();
    const diffMs = now - lastSeen;

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} mins ago`;
    if (diffHr < 24) return `${diffHr} hours ago`;
    if (diffDay < 7) return `${diffDay} days ago`;

    return lastSeen.toLocaleDateString();
  };


  /* ------------------------------------------
      NO USER SELECTED
  ------------------------------------------- */
  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center bg-black h-[50%] text-white p-6">
        <MessageCircle size={48} className="text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
        <p className="text-gray-400 text-center">
          Send private photos and messages to a friend or group.
        </p>
        <button
          onClick={handlesearch}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Send Message
        </button>

        {search && <Searchbox onClose={() => setsearch(false)} />}
      </div>
    );
  }


  /* ------------------------------------------
      CHAT WINDOW
  ------------------------------------------- */
  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="w-full flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <img
            src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${selectedUser.imageurl}/download?project=684296e5003206790aa0`}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold">{selectedUser.name}</p>

            {selectedUserState?.status === "online" ? (
              <p className="text-green-400 text-sm">Online</p>
            ) : (
              <p className="text-sm text-gray-300">
                Last seen {selectedUserState?.lastseen ? formatLastSeen(selectedUserState.lastseen) : "loading..."}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pr-2">
          <Phone size={24} />
          <Video size={24} />
          <MessageCircleWarning size={24} />
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.$id}
            className={`group relative max-w-xs px-4 py-1 rounded-lg text-white
              ${msg.senderid === user.$id ? "self-end bg-blue-600 ml-auto" : "self-start bg-gray-700 mr-auto"}
            `}
          >

            {/* THREE DOTS */}
            <button
              onClick={() => handleDotsClick(msg.$id)}
              className={`absolute top-1 ${msg.senderid === user.$id ? "left-[-24px]" : "right-[-24px]"}
              opacity-0 group-hover:opacity-100 duration-200 text-2xl`}
            >
              ⋮
            </button>

            {activeDotsId === msg.$id && (
              <Deleteicon
                messageid={msg.$id}
                imageid={msg.imageid}
                isSender={msg.senderid === user.$id}
                ondelete={(deletedId) => {
                  setMessages((prev) => prev.filter((m) => m.$id !== deletedId));
                  setActiveDotsId(null);
                }}
              />
            )}

            {/* IMAGE OR TEXT */}
            {msg.imageid ? (
              <img
                src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${msg.imageid}/download?project=684296e5003206790aa0`}
                className="w-64 rounded-xl"
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

      {/* MESSAGE INPUT */}
      <div className="p-4">
        <Messagesend
          onMessageSent={(msg) => setMessages((prev) => [...prev, msg])}
        />
      </div>

    </div>
  );
}

export default Chatright;
