import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";  
import { AuthProvider, useAuth } from "./contexts/AuthContexts";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Inventory from "./pages/Inventory";

// Protected Route Wrapper
const ProtectedRoute = ({ element, role }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Wait for auth check
  
    if (!user) return <Navigate to="/" replace />; // Redirect if not logged in
  
    if (role && !role.includes(user.role)) return <Navigate to="/" replace />; // Restrict by role
  
    return element;
  };

const App = () => {

    return (
        <Router>
            <AuthProvider>
                <Routes>
                {/* Public Route */}
                <Route path="/" element={<Login />} />

                {/* Protected Admin Routes */}
                <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} role="admin" />} />

                {/* Protected Staff Routes */}
                <Route path="/staff-dashboard" element={<ProtectedRoute element={<StaffDashboard />} role="staff" />} />
                <Route path="/inventory" element={<ProtectedRoute element={<Inventory />} role={["admin", "staff"]} />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
