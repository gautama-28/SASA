import React from "react";
import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Reports from "./components/Reports";

// Shared layout: Navbar at top, Footer at bottom, page content in between
function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Landing page with Hero only on '/' */}
        <Route index element={<Hero />} />
        {/* Login page */}
        <Route path="login" element={<Login />} />
        {/* 404 fallback (optional) */}
        <Route path="*" element={<Hero />} />
        <Route path="admin" element={<Admin />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
