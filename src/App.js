import "./App.css";
import { Routes, Route } from "react-router-dom";
import ImageFeed from "./pages/imageFeed/ImageFeed";
import Login from "./pages/login/Login";
import Navbar from "./components/navbar/Navbar";
import UserFeed from "./pages/userFeed/UserFeed";
import ProfileMain from "./components/profileMain/ProfileMain";
import Profile from "./pages/Profile/Profile";
import Chats from "./pages/chats/Chats";
import PrivateRoutes from "./utils/ProtectedRoutes";

function App() {
  return (
    <div className='app-container'>
      <Routes>
        <Route path='/' element={<UserFeed />} />
        <Route path='/:userParam' element={<Profile />} />
        <Route path='/accounts/:accountsPath' element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/direct/inbox' element={<Chats />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
