import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import authservice from '../components/appwrite/auth';
import { setSelectedUser } from '../store/authslice';
import conf from '../config/conf';

function Middlechats() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [otherUsers, setOtherUsers] = useState([]);
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [loading, setLoading] = useState(true); // 🔥 Added
const selectedUser = useSelector((state) => state.auth.selectedUser);

  useEffect(() => {
    const unsub = authservice.client.subscribe(
      `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionId}.documents`,
      (event) => {
        if (event.events.includes("databases.*.documents.*.update")) {
          const updatedUser = event.payload;

          setOtherUsers((prev) =>
            prev.map((u) => (u.$id === updatedUser.$id ? updatedUser : u))
          );

          setUsersWithMessages((prev) =>
            prev.map((u) => (u.$id === updatedUser.$id ? updatedUser : u))
          );
        }
      }
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.email) return;

      try {
        const others = await authservice.getAllUsersExceptCurrent(user.email);
        setOtherUsers(others);
      } catch (error) {
        console.error('Failed to fetch other users:', error);
      } finally {
        setLoading(false); // 🔥 Stop loading
      }
    };

    fetchUsers();
  }, [user]);

  const enrichUsersWithLastMessages = async () => {
    try {
      const usersmessage = [];

      for (const otherUser of otherUsers) {
        const chatId = [user.$id, otherUser.$id].sort().join('___');
        const session = await authservice.getLastMessageByChatIdInProfile(chatId);

        usersmessage.push({
          ...otherUser,
          lastMessage: session
            ? session.content || (session.imageid ? '📷 Image' : '')
            : 'No messages yet',
          lastMessageTime: session ? new Date(session.$createdAt) : null,
          unread:
            session &&
            session.senderId !== user.$id &&
            !session.readBy?.includes(user.$id),
          sentByMe: session && session.senderid === user.$id
        });
      }

      usersmessage.sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return b.lastMessageTime - a.lastMessageTime;
      });

      setUsersWithMessages(usersmessage);
    } catch (error) {
      console.error('Failed to fetch enriched users:', error);
    }
  };

  useEffect(() => {
    enrichUsersWithLastMessages();
    const interval = setInterval(enrichUsersWithLastMessages, 1000);
    return () => clearInterval(interval);
  }, [user?.$id, otherUsers]);

  useEffect(() => {
    const unsub = authservice.client.subscribe(
      `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteuserCollectionId}.documents`,
      (event) => {
        if (
          event.events.includes("databases.*.documents.*.create") ||
          event.events.includes("databases.*.documents.*.update")
        ) {
          enrichUsersWithLastMessages();
        }
      }
    );

    return () => unsub();
  }, []);

  return (
    <div className="w-full max-h-[85vh] overflow-y-auto px-6 pt-4 text-white scrollbar-none">
      <h2 className="text-md font-semibold mb-4">Messages</h2>

      {/* 🔥 LOADING STATE */}
      {loading && (
        <div className="text-gray-400 animate-pulse">Loading users...</div>
      )}
      {!loading && usersWithMessages.length > 0 && (
        <div className="space-y-1">
          {usersWithMessages.map((u) => (
            <div
              key={u.$id}
              onClick={async () => {
                dispatch(setSelectedUser(u));
                await authservice.markChatAsRead(user.$id, u.$id);
                enrichUsersWithLastMessages();
              }}
              className="flex items-center space-x-3 rounded-lg cursor-pointer px-2 py-2 hover:bg-gray-800 transition"
            >
              <img
                src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${u.imageurl}/download?project=684296e5003206790aa0`}
                alt={u.name}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="pl-1 w-full">
                <p className="text-white text-md">{u.name}</p>

            <p
  className={`text-sm truncate max-w-[200px] 
    ${u.sentByMe
      ? "text-gray-500" 
      : u.unread
        ? (selectedUser?.$id === u.$id 
            ? "text-red-500"   // 🔥 Unread but currently open
            : "text-white font-extrabold" // 🔥 Unread + not opened yet
          )
        : "text-gray-400"
    }`
  }
>
  {u.lastMessage}
</p>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Middlechats;
