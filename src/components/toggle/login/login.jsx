import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Inputbox from '../../inputbox';
import { useForm } from 'react-hook-form';
import authservice from '../../appwrite/auth';
import { useDispatch } from 'react-redux';
import { logout, setuser } from '../../../store/authslice'
import { useNavigate } from 'react-router-dom';

const Login = ({onswitch}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const [error , seterror] = useState("")
  const navigate = useNavigate();

  const handlelogin = async (data) => {
  try {
    seterror("");
    const session = await authservice.login(data);
    if (session) {
     const account = await authservice.getcurrentuser();
        const userProfile = await authservice.getuserprofilebyemail(account.email);
        if (userProfile) {
          dispatch(setuser(userProfile));
          navigate('/chat');
          console.log("Redux state updated with user:", userProfile);
        } else {
          seterror("User profile not found.");
        }
        if (userProfile.imageurl && userProfile.imageurl !== "") {
        navigate("/chat");
      } else {
        navigate("/image");
      }
      console.log("Redux state updated with user:", user);
      if (!user) {
        seterror("User not found in database.");
        return;
      }
      console.log("login", user);
    }
  } catch (error) {
    seterror(error.message || "Login failed");
  }
};

 const handlelogout = async () => {
    try {
      await authservice.logout();
      dispatch(logout());
      navigate('/')
      console.log('Logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
    <button onClick={handlelogout}>
      logout
    </button>
    <div className="relative min-h-screen flex items-center justify-center  overflow-hidden px-4">
<div className="z-10 bg-white p-6 sm:p-8 md:p-10 rounded-xl border border-gray-300 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">LOGIN</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form className="space-y-8" onSubmit={handleSubmit(handlelogin)}>
          {/* Email */}
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
              className="absolute right-3 top-5 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{' '}
           <button
              type="button"
              onClick={() => onswitch?.('signup')}
              className=" font-semibold ml-1 cursor-pointer"
            >
              Signup
            </button>
        </p>
      </div>
      <img
        src="/wave.svg"
        alt="wave"
        className="fixed bottom-0 left-0 w-full h-auto z-0"
      />
    </div>
    </>
  );
};

export default Login;
