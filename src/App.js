import "./App.css";
import { Routes, Route } from "react-router-dom";
import ImageFeed from "./pages/imageFeed/ImageFeed";
import Login from "./pages/login/Login";
import Navbar from "./components/navbar/Navbar";
import UserFeed from "./pages/userFeed/UserFeed";
import ProfileMain from "./components/profileMain/ProfileMain";
import Profile from "./pages/Profile/Profile";
import Chats from "./pages/chats/Chats";
import EditProfile from "./pages/editProfile/EditProfile";
import PrivateRoutes from "./utils/ProtectedRoutes";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<UserFeed />} />
        <Route path='/:userParam' element={<Profile />} />
        <Route path='/accounts/:accountsPath' element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/direct/inbox' element={<Chats />} />
          <Route path='/accounts/edit' element={<EditProfile />} />
          <Route path='/accounts/password' element={<EditProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
