import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProfileMain from "./components/ProfileMain";
import Layout from "./components/Layout";
import ChatMain from "./components/chatComponents/chatMain/ChatMain";
import PersistentLogin from "./features/auth/PersistentLogin";
import NotFound from "./components/NotFound";
import AccountError from "./components/AccountError";
import ErrorPage from "./components/ErrorPage";
import SinglePostPage from "./components/SinglePostPage";
import NotificationsPage from "./features/notifications/NotificationsPage";
import RequireLogout from "./features/auth/RequireLogout";
import RequireLogin from "./features/auth/RequireLogin";
import EditProfileMain from "./components/EditProfileMain";
import LoginForm from "./features/auth/LoginForm";
import SignupForm from "./components/SignupForm";
import HomeFeed from "./features/posts/HomeFeed";
import ExploreFeed from "./features/posts/ExploreFeed";
import SearchFeed from "./features/posts/SearchFeed";

function App() {
  return (
    <Routes>
      <Route element={<PersistentLogin />}>
        <Route path='/' element={<Layout />}>
          <Route element={<Navbar />}>
            <Route index element={<HomeFeed />} />
            <Route index path='/explore' element={<ExploreFeed />} />
            <Route
              index
              path='/search/:searchParam/:searchQuery'
              element={<SearchFeed />}
            />
            <Route path='/:userID' element={<ProfileMain />} />
            <Route path='/p/:postID' element={<SinglePostPage />} />

            <Route element={<RequireLogin />}>
              <Route path='/direct/inbox' element={<ChatMain />} />
              <Route path='/notifications' element={<NotificationsPage />} />
            </Route>

            <Route path='/accounts'>
              <Route element={<RequireLogout />}>
                <Route path='login' element={<LoginForm />} />
                <Route path='emailsignup' element={<SignupForm />} />
              </Route>
              <Route path='error' element={<AccountError />} />
              <Route element={<RequireLogin />}>
                <Route path='edit' element={<EditProfileMain />} />
                <Route path='password' element={<EditProfileMain />} />
              </Route>
            </Route>

            <Route path='/error' element={<ErrorPage />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
