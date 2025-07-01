import { ImageIcon, Send } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import authservice from '../components/appwrite/auth';

function Messagesend({ onMessageSent }) {
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [file, setfile] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const selectedUser = useSelector((state) => state.auth.selectedUser);

  const handleImageChange = (e) => {
    const setImageFiles = e.target.files[0];
    setImageFile(setImageFiles);

    const reader = new FileReader();
    reader.onload = () => {
      setfile(reader.result);
    };
    reader.readAsDataURL(setImageFiles);
  };

const handlesubmit = async (e) => {
  e.preventDefault();
  if (!message.trim() && !imageFile) return;

  const chatId = [user.$id, selectedUser.$id].sort().join('___');
  const msgText = message.trim();
  let imageId = null;

  setMessage('');

  try {
    if (imageFile) {
      const uploaded = await authservice.getfiles(imageFile);
      if (!uploaded) {
        throw new Error("Image upload failed");
      }
      imageId = uploaded.$id;
    }

    const saved = await authservice.storemessageindatabase(
      user.$id,
      selectedUser.$id,
      msgText,
      new Date().toISOString(),
      chatId,
      imageId
    );

    setImageFile(null);
    setfile(null);
    onMessageSent(saved);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};


  return (
    <div className="w-full p-3">
      {file && (
        <div className="mb-2 flex justify-start">
          <img
            src={file}
            alt="Selected"
            className="max-w-[200px] max-h-[150px] rounded border border-gray-500"
          />
        </div>
      )}

      <form onSubmit={handlesubmit} className="relative">
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
          <Send size={30} className='mr-2' />
        </button>
      </form>
    </div>
  );
}

export default Messagesend;
