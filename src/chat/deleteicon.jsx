import React from 'react';
import authservice from '../components/appwrite/auth';

function Deleteicon({ messageid, imageid, ondelete, position, isSender, content }) {
  const handleDeleteMessage = async () => {
    try {
      await authservice.deletemessage(messageid);

      if (imageid) {
        await authservice.deleteFile(imageid);
      }

      ondelete(messageid); 
    } catch (error) {
      console.error("Delete message failed:", error);
    }
  };

  const handlecopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Message copied!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div
      className={`absolute top-2 ${
        position === 'left' ? 'left-[-170px]' : 'right-[-120px]'
      } z-10 bg-gray-800 text-white rounded-lg shadow-lg p-2 text-sm font-medium flex flex-col space-y-1`}
    >
      {isSender ? (
        <button
          onClick={handleDeleteMessage}
          className="hover:text-red-500 hover:bg-gray-700 px-2 py-2 rounded transition-colors duration-200 text-left"
        >
          Delete Message
        </button>
      ) : (
        <button
          onClick={handlecopy}
          className="hover:text-green-400 hover:bg-gray-700 px-2 py-2 rounded transition-colors duration-200 text-left"
        >
          Copy
        </button>
      )}
    </div>
  );
}

export default Deleteicon;
