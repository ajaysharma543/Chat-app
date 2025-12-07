import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authservice from "../components/appwrite/auth";
import { logout } from "../store/authslice";

function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      const user = await authservice.getcurrentuser();
      if (user) {
        await authservice.updateUserStatus(user.$id, "offline");
      }

      await authservice.logout();

      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to logout. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <div className="min-h-screen w-full bg-black flex items-center justify-center">
         <button
        type="button"
        onClick={handleLogout}
        className={`px-6 py-2 cursor-pointer rounded-2xl backdrop-blur-md bg-red-500/20 text-red-400 font-semibold border border-red-500/30 hover:bg-red-500/40 hover:text-white hover:border-red-500 transition-all duration-300 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
     </div>
    </>
  );
}

export default LogoutButton;
