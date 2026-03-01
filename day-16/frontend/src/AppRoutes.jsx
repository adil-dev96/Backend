import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/auth/pages/Feed";
import CreatePost from "./features/auth/pages/CreatePost";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= { <Feed/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path = "/create-post" element={<CreatePost/>}/>

        
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoutes