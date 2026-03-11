import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Chat from "./pages/Chat";
import ChatRoom from "./pages/ChatRoom";
import Adoption from "./pages/Adoption";
import AdoptionForm from "./pages/AdoptionForm";
import AdoptionProgress from "./pages/AdoptionProgress";
import PetDetail from "./pages/PetDetail";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyPets from "./pages/MyPets";
import Settings from "./pages/Settings";
import AddAdoptionRecord from "./pages/AddAdoptionRecord";
import AdminDashboard from "./pages/AdminDashboard";
import { FavoriteProvider } from "./context/FavoriteContext";
import { AdoptionProvider } from "./context/AdoptionContext";
import { ChatProvider } from "./context/ChatContext";
import { UserProvider } from "./context/UserContext";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div className="h-full w-full flex flex-col flex-1">
      <AnimatePresence mode="wait">
        {/* @ts-expect-error React Router v7 types might not include key in React 19 */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/pet/:id" element={<PetDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<ChatRoom />} />
          <Route path="/adoption" element={<Adoption />} />
          <Route path="/adoption/add" element={<AddAdoptionRecord />} />
          <Route path="/adoption/apply/:id" element={<AdoptionForm />} />
          <Route path="/adoption/:id" element={<AdoptionProgress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/my-pets" element={<MyPets />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen relative overflow-hidden shadow-2xl flex flex-col">
        <BrowserRouter>
          <UserProvider>
            <FavoriteProvider>
              <AdoptionProvider>
                <ChatProvider>
                  <AnimatedRoutes />
                </ChatProvider>
              </AdoptionProvider>
            </FavoriteProvider>
          </UserProvider>
        </BrowserRouter>
      </div>
    </div>
  );
}
