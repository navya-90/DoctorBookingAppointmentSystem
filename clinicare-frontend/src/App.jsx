import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import Navigation from "./components/Navigation";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import DoctorManagement from "./pages/dashboard/DoctorManagement";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";
import PatientDashboard from "./pages/dashboard/PatientDashboard";
import DoctorSlotBooking from "./pages/dashboard/DoctorSlotBooking";
import PricingPage from "./pages/PricingPage";
import UpgradeSuccess from "./pages/UpgradeSuccess";
import ChangePassword from "./pages/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientManagement from "./pages/dashboard/PatientManagement";

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1>Something went wrong.</h1>;
//     }

//     return this.props.children;
//   }
// }

function App() {

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/doctors" element={<ProtectedRoute><DoctorManagement /></ProtectedRoute>} />
        <Route path="/admin/patients" element={<ProtectedRoute><PatientManagement /></ProtectedRoute>}/>
        <Route path="/doctor-dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/patient-dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient-dashboard/:doctorId" element={<ProtectedRoute><DoctorSlotBooking /></ProtectedRoute>} />
        <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
        <Route path="/upgrade_plan/success" element={<ProtectedRoute><UpgradeSuccess /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App;