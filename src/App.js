import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import PublicCall from "@/pages/PublicCall";
import Landing from "@/pages/Landing";
import { getToken } from "@/lib/api";

function RequireAuth({ children }) {
  const token = getToken();
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}

function App() {
  return (
    <div className="App">
      <Toaster theme="dark" position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          <Route path="/call/:callId" element={<PublicCall />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
