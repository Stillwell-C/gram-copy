import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import UserFeed from "./components/userFeed/UserFeed";
import ProfileMain from "./components/profileMain/ProfileMain";
import Layout from "./components/Layout";
import EditProfileMain from "./components/editProfileMain/EditProfileMain";
import ChatMain from "./components/chatComponents/chatMain/ChatMain";
import PersistentLogin from "./features/auth/PersistentLogin";
import NotFound from "./components/NotFound";
import LoginForm from "./components/loginForm/LoginForm";
import SignupForm from "./components/signupForm/SignupForm";

function App() {
  return (
    <Routes>
      <Route element={<PersistentLogin />}>
        <Route path='/' element={<Layout />}>
          <Route element={<Navbar />}>
            <Route index element={<UserFeed />} />
            <Route path='/:userID' element={<ProfileMain />} />
            <Route path='/accounts/login' element={<LoginForm />} />
            <Route path='/accounts/emailsignup' element={<SignupForm />} />
            <Route path='/direct/inbox' element={<ChatMain />} />
            <Route path='/accounts/edit' element={<EditProfileMain />} />
            <Route path='/accounts/password' element={<EditProfileMain />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
