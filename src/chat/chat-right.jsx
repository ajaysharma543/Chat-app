import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DotSquare,
  GalleryThumbnails,
  MessageCircle,
  MessageCircleWarning,
  Phone,
  Video,
  ImageIcon,
  Send,
} from "lucide-react";
import authservice from "../components/appwrite/auth";
import conf from "../config/conf";
import { setSelectedUser } from "../store/authslice";
import Deleteicon from "./deleteicon";
import Searchbox from "./searchbox";

function Chatright() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const selectedUser = useSelector((state) => state.auth.selectedUser);

  const [selectedUserState, setSelectedUserState] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState(false);
  const [activeDotsId, setActiveDotsId] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

useEffect(() => {
  if (!selectedUser) return;

  const fetchUser = async () => {
    try {
      const userDoc = await authservice.Databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        selectedUser.$id
      );
      setSelectedUserState(userDoc);
      dispatch(setSelectedUser(userDoc));
    } catch (err) {
      console.error(err);
    }
  };

  fetchUser();

  const unsub = authservice.client.subscribe(
    `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionId}.documents.${selectedUser.$id}`,
    (event) => {
      if (event.events.some(e => e.endsWith(".update"))) {
        setSelectedUserState(event.payload);
        dispatch(setSelectedUser(event.payload));
      }
    }
  );

  return () => unsub();
}, [selectedUser?.$id]); // ← FIXED!!



  // Fetch messages & listen realtime
  useEffect(() => {
    if (!user || !selectedUser) return;
    const chatId = [user.$id, selectedUser.$id].sort().join("___");

    const fetchMessages = async () => {
      try {
        const msgs = await authservice.getMessagesByChatId(chatId);
        setMessages(msgs);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();

    const unsubscribe = authservice.listenToMessages(chatId, (newMsg) => {
      setMessages((prev) => {
        if (prev.find((msg) => msg.$id === newMsg.$id)) return prev;
        return [...prev, newMsg];
      });
    });
    return () => unsubscribe();
  }, [user, selectedUser]);

  const handleDotsClick = (id) => {
    setActiveDotsId((prev) => (prev === id ? null : id));
  };

  const formatLastSeen = (lastSeenTime) => {
    const lastSeen = new Date(lastSeenTime);
    const now = new Date();
    const diffSec = Math.floor((now - lastSeen) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    return lastSeen.toLocaleDateString();
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center bg-black h-[50%] text-white p-6">
        <MessageCircle size={48} className="text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
        <p className="text-gray-400 text-center">
          Send private photos and messages to a friend or group.
        </p>
        <button
          onClick={() => setSearch(true)}
          className="mt-4 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
        >
          Send Message
        </button>
        {search && <Searchbox onClose={() => setSearch(false)} />}
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="w-full flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-4 overflow-hidden">
          <img
            src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${selectedUser.imageurl}/download?project=684296e5003206790aa0`}
            alt={selectedUser.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="text-md font-semibold truncate">{selectedUser.name}</p>
            {selectedUserState?.status === "online" ? (
              <p className="text-sm text-green-400">Online</p>
            ) : (
              <p className="text-sm text-white">
                Last seen{" "}
                {selectedUserState?.lastseen
                  ? formatLastSeen(selectedUserState.lastseen)
                  : "loading..."}
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

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.$id}
            className={`group relative max-w-xs px-4 py-1 rounded-lg text-white ${
              msg.senderid === user.$id ? "self-end ml-auto bg-blue-600" : "self-start mr-auto bg-gray-700"
            }`}
          >
            <button
              onClick={() => handleDotsClick(msg.$id)}
              className={`absolute top-1 ${
                msg.senderid === user.$id ? "left-[-24px]" : "right-[-24px]"
              } opacity-0 group-hover:opacity-100 duration-200 text-white text-2xl cursor-pointer`}
            >
              ⋮
            </button>

            {activeDotsId === msg.$id && (
              <Deleteicon
                messageid={msg.$id}
                ondelete={(deletedId) =>
                  setMessages((prev) => prev.filter((m) => m.$id !== deletedId))
                }
                imageid={msg.imageid}
                position={msg.senderid === user.$id ? "left" : "right"}
                isSender={msg.senderid === user.$id}
                content={msg.content}
              />
            )}

            {msg.imageid ? (
              <img
                src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${msg.imageid}/download?project=684296e5003206790aa0`}
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

      {/* MESSAGE INPUT */}
      <MessageInput user={user} selectedUser={selectedUser} onMessageSent={(msg) => setMessages((prev) => [...prev, msg])} />
    </div>
  );
}

// Separate component for message input
function MessageInput({ user, selectedUser }) {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [file, setFile] = useState(null);

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    setImageFile(f);

    const reader = new FileReader();
    reader.onload = () => setFile(reader.result);
    reader.readAsDataURL(f);
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!message.trim() && !imageFile) return;

  const chatId = [user.$id, selectedUser.$id].sort().join("___");
  const msgText = message.trim();
  let imageId = null;

  setMessage("");

  try {
    if (imageFile) {
      const uploaded = await authservice.getfiles(imageFile);
      if (!uploaded) throw new Error("Image upload failed");
      imageId = uploaded.$id;
    }

    await authservice.storemessageindatabase(
      user.$id,
      selectedUser.$id,
      msgText,
      new Date().toISOString(),
      chatId,
      imageId
    );

    setImageFile(null);
    setFile(null);

    // ❌ Remove this line:
    // onMessageSent(saved);

  } catch (error) {
    console.error("Failed to send message:", error);
  }
};


  return (
    <div className="p-4">
      {file && (
        <div className="mb-2 flex justify-start">
          <img src={file} alt="Selected" className="max-w-[200px] max-h-[150px] rounded border border-gray-500" />
        </div>
      )}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full bg-transparent border border-gray-500 text-white px-4 py-3 pr-20 pl-12 rounded-full outline-none placeholder-gray-400"
        />
        <label className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <ImageIcon />
        </label>
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white p-1 rounded-full hover:bg-blue-700 transition"
        >
          <Send size={30} />
        </button>
      </form>
    </div>
  );
}

export default Chatright;
