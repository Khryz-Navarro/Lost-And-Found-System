import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./components/Home";
import ReportLostItem from "./components/ReportLostItem";
import ReportFoundItem from "./components/ReportFoundItem";
import LostItems from "./components/LostItems";
import FoundItems from "./components/FoundItems";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./admin/AdminDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="p-4 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/report-lost"
                element={
                  <PrivateRoute>
                    <ReportLostItem />
                  </PrivateRoute>
                }
              />
              <Route
                path="/report-found"
                element={
                  <PrivateRoute>
                    <ReportFoundItem />
                  </PrivateRoute>
                }
              />
              <Route path="/lost-items" element={<LostItems />} />
              <Route path="/found-items" element={<FoundItems />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute adminOnly>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
