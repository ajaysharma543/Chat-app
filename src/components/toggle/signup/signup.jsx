import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Inputbox from '../../inputbox';
import authservice from '../../appwrite/auth';
import { setuser } from '../../../store/authslice';
import { useDispatch } from 'react-redux';

const Signup = ({onswitch}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit} = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();
const dispatch = useDispatch()

  const handlesignup = async (data) => {
    setError("");
    try {
      const session = await authservice.createuser(data)
     if (session) {
  const account = await authservice.getcurrentuser();
  const userProfile = await authservice.getuserprofilebyemail(account.email);

  if (userProfile) {
    dispatch(setuser(userProfile));
    console.log("Redux state updated with user:", userProfile);
    navigate('/image');
  } else {
    setError("User profile not found.");
  }
}
    }catch (err) {
      setError(err?.message || 'Signup failed. Please try again.');
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Login Box */}
<div className="z-10 bg-white p-6 sm:p-8 md:p-10 rounded-xl border border-gray-300 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign-up</h2>
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit(handlesignup)}>
           <Inputbox
            icon="fa-solid fa-user"
            type="text"
            label="Full Name"
            {...register("name", { required: "Name is required" })}
          />
          <Inputbox
            type="email"
            label="Email"
            icon="fa-solid fa-envelope"
            autoComplete="off"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Invalid email address",
              },
            })}
          />
           <Inputbox
            icon="fa-solid fa-phone"
            type="number"
            label="Number"
            {...register("phone", { required: "Phone number is required" })}
          />
         <div className="relative">
            <Inputbox
              type={showPassword ? "text" : "password"}
              label="Password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3.5 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition duration-200"
          >
            Sign-up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{' '}
            <button
              type="button"
              onClick={() => onswitch?.('login')}
              className=" font-semibold ml-1 cursor-pointer"
            >
              Login
            </button>
        </p>
      </div>

      <img
        src="/wave.svg"
        alt="wave"
        className="fixed bottom-0 left-0 w-full h-auto z-0"
      />
    </div>
  );
};

export default Signup;
