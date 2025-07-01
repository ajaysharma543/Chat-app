import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import authservice from '../appwrite/auth';
import { updateUserImage } from '../../store/authslice';

function Imagesection() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchName = async () => {
      setName(user?.name || '');
    };
    fetchName();
  }, [user]);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleNext = async () => {
    try {
      if (user?.$id && file) {
        const uploadedFile = await authservice.getfiles(file);
        if (!uploadedFile?.$id) {
          throw new Error('File upload failed.');
        }
        await authservice.updateUserimage(user.$id, uploadedFile.$id);
        dispatch(updateUserImage(uploadedFile.$id));
        navigate('/chat');
        console.log(user);
        
      }
    } catch (error) {
      console.error('Image upload or update failed:', error);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 flex flex-col justify-center items-center overflow-hidden">
      <div className="z-10 w-[300px] md:w-[350px] h-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4">
        <div className="relative w-40 h-40 bg-gray-200 rounded-full overflow-hidden flex justify-center items-center border-4 border-blue-400">
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
          {image ? (
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <User className="w-16 h-16 text-gray-600" />
          )}
        </div>

        <h1 className="text-xl font-semibold text-gray-800">
          {file ? 'Profile pic uploaded' : 'Upload profile pic'}
        </h1>
        <h2 className="text-lg text-gray-700 font-medium">{name}</h2>

        <button
          onClick={handleNext}
          type="button"
          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
        >
          Next
        </button>
      </div>

      <img
        src="/wave.svg"
        alt="wave"
        className="absolute bottom-0 left-0 w-full h-auto z-0 pointer-events-none"
      />
    </div>
  );
}

export default Imagesection;
