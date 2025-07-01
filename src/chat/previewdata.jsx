import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Profileview() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-100 p-4">
      
  

                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl flex flex-col gap-6">
        <div className="relative w-full flex items-center justify-center mb-4">
  <button
    onClick={() => navigate("/chat")}
    className="absolute left-0 px-4 py-1 bg-teal-500 text-white rounded hover:bg-teal-700 transition"
  >
    ← Back
  </button>
  <h2 className="text-2xl font-semibold text-gray-800">Your Profile</h2>
</div>

     
        <div className="flex gap-8">
          <div className="w-1/3 flex flex-col items-center">
            <img
              src={`https://fra.cloud.appwrite.io/v1/storage/buckets/684297610026f3b5092c/files/${user?.imageurl}/download?project=684296e5003206790aa0`}
              alt="User Avatar"
              className="w-52 h-52 object-cover border-4 border-teal-200 mb-4"
            />
            <textarea
              value={user.description || ''}
              disabled
              rows={4}
              placeholder='Add Bio'
              className="w-full p-2 border rounded-md resize-none"
            ></textarea>
          </div>

          <div className="w-2/3 flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={user.name || ''}
                disabled
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={user.number || ''}
                disabled
                className="w-full p-2 border rounded-md"
              />
            </div>
            <select
              value={user.Gender || ''}
              disabled
              className="w-full mt-3 p-2 border rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <button
              onClick={() => navigate('/editdata')}
              className="mt-4 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profileview;
