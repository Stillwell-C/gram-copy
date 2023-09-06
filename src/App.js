import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import ProfileMain from "./components/profileMain/ProfileMain";
import Layout from "./components/Layout";
import EditProfileMain from "./components/editProfileMain/EditProfileMain";
import ChatMain from "./components/chatComponents/chatMain/ChatMain";
import PersistentLogin from "./features/auth/PersistentLogin";
import NotFound from "./components/NotFound";
import LoginForm from "./components/loginForm/LoginForm";
import SignupForm from "./components/signupForm/SignupForm";
import FeedContainer from "./components/FeedContainer";
import AccountError from "./components/AccountError";
import ErrorPage from "./components/ErrorPage";

function App() {
  return (
    <Routes>
      <Route element={<PersistentLogin />}>
        <Route path='/' element={<Layout />}>
          <Route element={<Navbar />}>
            <Route index element={<FeedContainer />} />
            <Route index path='/explore' element={<FeedContainer />} />
            <Route path='/:userID' element={<ProfileMain />} />
            <Route path='/accounts'>
              <Route path='login' element={<LoginForm />} />
              <Route path='emailsignup' element={<SignupForm />} />
              <Route path='error' element={<AccountError />} />
              <Route path='edit' element={<EditProfileMain />} />
              <Route path='password' element={<EditProfileMain />} />
            </Route>

            <Route path='/direct/inbox' element={<ChatMain />} />

            <Route path='/error' element={<ErrorPage />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
