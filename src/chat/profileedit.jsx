import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authservice from '../components/appwrite/auth';
import { setuser } from '../store/authslice';
import { useNavigate } from 'react-router-dom';

function Profileedit() {
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [gender, setGender] = useState('');
  const [password,setpassword] = useState("")

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setNumber(user.number || '');
      setDescription(user.description || '');
       setGender(user.gender || '');
    }
  }, [user]);

  const handleSave = async() => {
    const updated = await authservice.updateuser(
      user.$id,
      name,
      email,
      number,
      description,
      imageFile,
      user.imageurl,
      gender,
      password
    )
    
    if (updated) {
    // console.log('Saving:', updated);
    setpassword("")
    dispatch(setuser(updated))
    // console.log("new redux" , user );
    
    navigate('/edit')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-5xl flex gap-10 items-start">
        <div className="w-1/3 flex flex-col items-center">
          <label className="block mb-2 font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />

           <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your description..."
            rows={4}
            className="w-full p-2 mt-5 border rounded-md resize-none"
          ></textarea>
          <div>
  <label className="block text-gray-700 mb-1">Gender</label>
  <select
    value={gender}
    onChange={(e) => setGender(e.target.value)}
    className="w-full p-2 border rounded-md"
  >
    <option value="">Select Gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
  </select>
</div>
        </div>

        <div className="w-1/3 flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            onClick={handleSave}
            className="mt-4 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md"
          >
            
            Save
          </button>
        </div>

        <div className="w-1/3 flex flex-col items-center text-center">
          <img
            src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${user?.imageurl}/download?project=684296e5003206790aa0`}
            alt="User Avatar"
            className="w-52 h-52 object-cover border-4 border-teal-200 mb-4"
          />
         <input
  type="password"
  placeholder="Enter your password to confirm email change"
  value={password}
  onChange={(e) => setpassword(e.target.value)}
  className="w-full p-2 border rounded-md"
/>
        </div>
      </div>
    </div>
  );
}

export default Profileedit;
