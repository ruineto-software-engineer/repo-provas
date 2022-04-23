import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register, Courses } from "./pages";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}