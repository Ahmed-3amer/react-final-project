import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

import { NavBar, Layout } from "@components";
import {
  HomePage,
  Login,
  Register,
  Profile,
  PostList,
  SinglePost,
} from "@pages";
import AuthGurdRoute from "./components/AuthGurd";
import NewPost from "./pages/NewPost";
import PostDetails from "./Pages/PostDetails";
import EditPost from "./Pages/EditPost";
import UserPosts from "./Pages/UserPosts";
import AllPosts from "./Pages/PostList";
import LogReg from "./Pages/LogReg";

function App() {
  return (
    <Router>


      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<LogReg />} />
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}

          <Route element={<AuthGurdRoute />}>
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/posts"
              element={
                <Layout>
                  <AllPosts />
                </Layout>
              }
            />
            <Route
              path="/user-posts"
              element={
                <Layout>
                  <UserPosts />
                </Layout>
              }
            />
            <Route
              path="/posts/create"
              element={
                <Layout>
                  <NewPost />
                </Layout>
              }
            />
            <Route path="/posts/:postId" element={<PostDetails />} />
            <Route path="/posts/:postId/edit" element={<EditPost />} />
          </Route>
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
