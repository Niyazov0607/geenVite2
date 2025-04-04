import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import Home from "./pages/home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import { Toaster } from "sonner";
import Profile from "./components/Profile/profile";
import Account from "./components/Profile/ProfileDetails/Account";
import AboutCards from "./pages/AboutCards/aboutCards";

function App() {
    return (
        <>
            <Toaster position="top-right" richColors />

            <Navbar />
            <Routes>
                <Route element={<Home />} path="/" />
                <Route element={<Profile />} path="/profile">
                    <Route element={<Account />} path="account" />
                </Route>
                <Route path="*" element={<NotFound />} />
                <Route element={<AboutCards />} path="/pages/aboutCards/:id" />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
