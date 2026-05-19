import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Reservations from "./pages/Reservations";
import HostDashboard from "./pages/HostDashboard";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import MyReservations from "./pages/MyReservations";
import Success from "./pages/Success";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListingDetails from "./pages/ListingDetails";
import Wishlist from "./pages/Wishlist";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<h1>Payment Cancelled</h1>} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/reservations/:id"
          element={
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/host"
          element={
            <ProtectedRoute>
              <HostDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reservations"
          element={
            <ProtectedRoute>
              <MyReservations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listing/:id"
          element={<ListingDetails />}
        />
         
      </Routes>
    </ErrorBoundary>  
    <ToastContainer position="top-right" autoClose={2000} />
  );
}

export default App;
