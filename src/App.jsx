import { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Toggle from './components/toggle/toggle';
import Navbar from './chat/chat';
import authservice from './components/appwrite/auth';
import { useDispatch } from 'react-redux';
import { logout, setuser } from './store/authslice';
import Imagesection from './components/imagesection/imagesection';
import Profileedit from './chat/profileedit';
import PrivateRoute from './chat/privateroute';
import Profileview from './chat/previewdata';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let currentProfile = null;

  const checkUser = async () => {
    const profile = await authservice.getcurrentuser();
    currentProfile = profile;

    if (profile) {
      dispatch(setuser(profile));

      // Make sure user becomes online
      authservice.updateUserStatus(profile.$id, "online");

      if (window.location.pathname === "/") {
        navigate("/chat");
      }
    } else {
      dispatch(logout());
      navigate("/");
    }

    setLoading(false);
  };

  checkUser();

  // When closing tab or browser => offline
  const goOffline = () => {
    if (currentProfile) {
      authservice.updateUserStatus(currentProfile.$id, "offline");
    }
  };

  // When switching tab => offline/online
  const handleVisibility = () => {
    if (!currentProfile) return;
    if (document.visibilityState === "hidden") {
      authservice.updateUserStatus(currentProfile.$id, "offline");
    } else {
      authservice.updateUserStatus(currentProfile.$id, "online");
    }
  };

  window.addEventListener("beforeunload", goOffline);
  window.addEventListener("visibilitychange", handleVisibility);

  return () => {
    window.removeEventListener("beforeunload", goOffline);
    window.removeEventListener("visibilitychange", handleVisibility);
  };
}, [dispatch, navigate]);



  if (loading) {
    return <div className="text-center mt-20 text-lg font-semibold">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Toggle />} />
    <Route element={<PrivateRoute />}>
    <Route path="/image" element={<Imagesection />} />
    <Route path="/chat" element={<Navbar />} />
    <Route path='/editdata' element={<Profileedit />} />
    <Route path="/edit" element={<Profileview />} />
  </Route>
</Routes>
  );
}

export default App;
