import "./App.css";
import { Routes, Route } from "react-router-dom";
import ImageFeed from "./pages/imageFeed/ImageFeed";
import Login from "./pages/login/Login";
import Navbar from "./components/navbar/Navbar";
import UserFeed from "./pages/userFeed/UserFeed";
import ProfileMain from "./components/profileMain/ProfileMain";
import Layout from "./components/Layout";
import EditProfileMain from "./components/editProfileMain/EditProfileMain";
import ChatMain from "./components/chatComponents/chatMain/ChatMain";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<UserFeed />} />
        <Route path='/:userParam' element={<ProfileMain />} />
        <Route path='/accounts/:accountsPath' element={<Login />} />
        <Route path='/direct/inbox' element={<ChatMain />} />
        <Route path='/accounts/edit' element={<EditProfileMain />} />
        <Route path='/accounts/password' element={<EditProfileMain />} />
      </Route>
    </Routes>
  );
}

export default App;
