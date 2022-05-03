import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  AuthProvider,
  DisciplinesProvider,
  InstructorsProvider,
  TermsInputValueProvider,
  InstructorsInputValueProvider
} from "./contexts";
import { Login, Register, Oauth, Courses, Instructors, Create } from "./pages";
import Header from "./components/Header";

export default function App() {
  return (
    <AuthProvider>
      <DisciplinesProvider>
        <InstructorsProvider>
          <TermsInputValueProvider>
            <InstructorsInputValueProvider>
              <BrowserRouter>
                <Header />
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/oauth" element={<Oauth />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/instructors" element={<Instructors />} />
                  <Route path="/create" element={<Create />} />
                </Routes>
              </BrowserRouter>
            </InstructorsInputValueProvider>
          </TermsInputValueProvider>
        </InstructorsProvider>
      </DisciplinesProvider>
    </AuthProvider>
  );
}