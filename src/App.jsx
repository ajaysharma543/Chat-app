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
    let profileDataRef = { current: null };

    const checkSession = async () => {
      try {
        const profile = await authservice.getcurrentuser();
        profileDataRef.current = profile;

        if (profile) {
          dispatch(setuser(profile));

          // Redirect only if user is on home "/"
          if (window.location.pathname === "/") {
            if (profile.imageurl && profile.imageurl.trim() !== "") {
              navigate("/chat");
            }
          }

          // Always set online after loading profile
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

    // User goes offline when closing tab
    const goOffline = () => {
      if (profileDataRef.current) {
        authservice.updateUserStatus(profileDataRef.current.$id, "offline");
      }
    };

  const visibilityHandler = () => {
  if (!profileDataRef.current) return;

  if (document.visibilityState === "visible") {
    authservice.updateUserStatus(profileDataRef.current.$id, "online");
  }
};


    window.addEventListener("beforeunload", goOffline);
    window.addEventListener("visibilitychange", visibilityHandler);

    return () => {
      window.removeEventListener("beforeunload", goOffline);
      window.removeEventListener("visibilitychange", visibilityHandler);
    };
  }, [dispatch, navigate]);


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
