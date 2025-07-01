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
  const checkSession = async () => {
    try {
      const account = await authservice.getcurrentuser();
      const profile = await authservice.getuserprofilebyemail(account.email);

  if (profile) {
  dispatch(setuser(profile));
  
  if (window.location.pathname === '/' || window.location.pathname === '/') {
    if (profile.imageurl && profile.imageurl.trim() !== "") {
      navigate('/chat');
    } 
  }
      } else {
        dispatch(logout());
        navigate('/');
      }
    } catch (err) {
      dispatch(logout());
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  checkSession();
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
