import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { BarLoader } from "react-spinners";
import Home from "./components/Home";
import Login from "./components/Login";
import ReportItem from "./components/ReportItem";
import Navbar from "./components/Navbar";
import ItemsList from "./components/ItemsList";
import ArchivedItems from "./components/ArchivedItems";
import SignUp from "./components/SignUp";
// import AdminDashboard from "./components/AdminDashboard";
import ForgotPassword from "./components/ForgotPassword";
import UserProfile from "./components/UserProfile";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BarLoader color="#36d7b7" loading={loading} size={150} />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/signup"
          element={user ? <Navigate to="/home" /> : <SignUp />}
        />
        <Route
          path="/admin"
          element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/report"
          element={user ? <ReportItem /> : <Navigate to="/login" />}
        />
        <Route
          path="/items"
          element={user ? <ItemsList /> : <Navigate to="/login" />}
        />
        <Route
          path="/archived"
          element={user ? <ArchivedItems /> : <Navigate to="/login" />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/home" /> : <ForgotPassword />}
        />
        <Route
          path="/profile"
          element={user ? <UserProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
