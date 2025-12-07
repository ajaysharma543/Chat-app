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
import Loader from './chat/loader';
import LogoutButton from './chat/setting';

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

          if (window.location.pathname === "/toggle") {
            if (profile.imageurl && profile.imageurl.trim() !== "") {
              navigate("/");
            }
          }

          authservice.updateUserStatus(profile.$id, "online");

        } else {
          dispatch(logout());
          navigate("/toggle");
        }
      } catch (err) {
        dispatch(logout());
        navigate("/toggle");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const goOffline = () => {
      if (profileDataRef.current) {
        authservice.updateUserStatus(profileDataRef.current.$id, "offline");
      }
    };

    const visibilityHandler = () => {
      if (!profileDataRef.current) return;

      if (document.visibilityState === "hidden") {
        authservice.updateUserStatus(profileDataRef.current.$id, "offline");
      } else {
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

  // 🔥 FIX: Do not render anything until loading is done
  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navbar />} />
      <Route path="/toggle" element={<Toggle />} />

      <Route element={<PrivateRoute />}>
        <Route path="/image" element={<Imagesection />} />
        <Route path="/editdata" element={<Profileedit />} />
        <Route path="/edit" element={<Profileview />} />
        <Route path="/logout" element={<LogoutButton />} />
      </Route>
    </Routes>
  );
}



export default App;
