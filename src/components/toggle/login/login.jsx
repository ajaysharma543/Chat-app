import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Inputbox from '../../inputbox';
import { useForm } from 'react-hook-form';
import authservice from '../../appwrite/auth';
import { useDispatch } from 'react-redux';
import { setuser } from '../../../store/authslice';
import { useNavigate } from 'react-router-dom';

const Login = ({ onswitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlelogin = async (data) => {
    try {
      setError("");
      const session = await authservice.login(data);
      if (session) {
        const account = await authservice.getcurrentuser();
        const userProfile = await authservice.getuserprofilebyemail(account.email);
        if (userProfile) {
          dispatch(setuser(userProfile));
          if (userProfile.imageurl && userProfile.imageurl !== "") {
            navigate("/");
          } else {
            navigate("/image");
          }
        } else {
          setError("User profile not found.");
        }
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="relative flex items-center justify-center overflow-hidden px-4">

      {/* Floating background effects */}
      <span className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -left-20 animate-pulse-slow"></span>
      <span className="absolute w-60 h-60 bg-white/10 rounded-full -bottom-10 -right-10 animate-pulse-slower"></span>

      {/* Login Card */}
      <div className="z-10 bg-gray-800/90 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl transition-all duration-500 ease-in-out">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">LOGIN</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit(handlelogin)}>
          {/* Email */}
          <Inputbox
            type="email"
            label="Email"
            icon="fa-solid fa-envelope"
            autoComplete="off"
            dark
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Invalid email address",
              },
            })}
          />

          {/* Password */}
          <div className="relative">
            <Inputbox
              type={showPassword ? "text" : "password"}
              label="Password"
              autoComplete="new-password"
              dark
              {...register("password", { required: "Password is required" })}
            />
            <span
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-5 cursor-pointer text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Switch to Signup */}
        <p className="text-sm text-center text-white mt-4">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onswitch?.('signup')}
            className="font-semibold cursor-pointer text-teal-400 hover:underline ml-1"
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
