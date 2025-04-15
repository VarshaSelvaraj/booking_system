import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import AllEvents from './pages/AllEvents';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import Schedule from './pages/Schedule';

function App() {
  return (
    <Router>
      <Routes>
       <Route path='*' element={<Home/>}/> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/allevents" element={<AllEvents/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/mybookings" element={<MyBookings />} /> {/* Redirect to Home for any other route */}
        <Route path="/schedule" element={<Schedule/>}/>
      </Routes>
    </Router>
  );
}

export default App;
