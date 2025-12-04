import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import authservice from '../components/appwrite/auth';
import { setSelectedUser } from '../store/authslice';

function Middlechats() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [otherUsers, setOtherUsers] = useState([]);
  const [usersWithMessages, setUsersWithMessages] = useState([]);

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

  useEffect(() => {
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
          });
        }

        setUsersWithMessages(usersmessage);
      } catch (error) {
        console.error('Failed to fetch enriched users:', error);
      }
    };
          enrichUsersWithLastMessages();


    const interval = setInterval(enrichUsersWithLastMessages, 1000);
    return () => clearInterval(interval);
  }, [user?.$id, otherUsers]);

 
  return (
   <div className="w-full max-h-[85vh] overflow-y-auto px-6 pt-4 text-white scrollbar-none">
  <h2 className="text-md font-semibold mb-4">Messages</h2>

  <div className="space-y-1">
    {usersWithMessages.length === 0 ? (
      <p className="text-gray-400">No other users found.</p>
    ) : (
      usersWithMessages.map((u) => (
        <div
          key={u.$id}
          onClick={() => dispatch(setSelectedUser(u))}
          className="flex items-center space-x-3 rounded-lg hover:bg-gray-800 cursor-pointer transition"
        >
          <img
            src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${u.imageurl}/download?project=684296e5003206790aa0`}
            alt={u.name}
            className="w-15 h-15 rounded-full object-cover mt-2"
          />
          <div className="pl-3">
            <p className="text-white text-md">{u.name}</p>
            <p className="text-gray-400 text-sm truncate max-w-[200px]">
              {u.lastMessage}
            </p>
          </div>
        </div>
      ))
    )}
  </div>
</div>

  );
}

export default Middlechats;
