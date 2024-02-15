import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <main className="bg-secondary h-100 w-100 vh-100 overflow-auto">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/postpage" element={<Post />} />
        </Routes>
      </main>
    </UserProvider>
  );
}
export default App;
