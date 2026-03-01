import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import MoodEntry from "./pages/MoodEntry";
import Progress from "./pages/Progress";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES - No authentication required */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES - Requires authentication token */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
        <Route path="/MoodEntry" element={<ProtectedRoute element={<MoodEntry />} />} />
        <Route path="/progress" element={<ProtectedRoute element={<Progress />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




