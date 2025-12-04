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
  let profileData = null;

  const checkSession = async () => {
    try {
    const profile = await authservice.getcurrentuser();
      profileData = profile;

      if (profile) {
        dispatch(setuser(profile));

        if (window.location.pathname === "/") {
          if (profile.imageurl && profile.imageurl.trim() !== "") {
            navigate("/chat");
          }
        }

        // Set user ONLINE
        authservice.updateUserStatus(profile.$id, "online");
      } else {
        dispatch(logout());
        navigate("/");
      }
    } catch (err) {
      dispatch(logout());
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  checkSession();

  // Offline when tab closes
  const goOffline = () => {
    if (profileData) {
      authservice.updateUserStatus(profileData.$id, "offline");
    }
  };

  const visibilityHandler = () => {
    if (!profileData) return;

    if (document.visibilityState === "hidden") {
      authservice.updateUserStatus(profileData.$id, "offline");
    } else {
      authservice.updateUserStatus(profileData.$id, "online");
    }
  };

  window.addEventListener("beforeunload", goOffline);
  window.addEventListener("visibilitychange", visibilityHandler);

  // Cleanup
  return () => {
    window.removeEventListener("beforeunload", goOffline);
    window.removeEventListener("visibilitychange", visibilityHandler);
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
