"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { signInWithGoogle } from "../../../firebase";
import { notification } from "antd";

const API_BASE_URL =
    import.meta.env.VITE_API || "https://green-shop-backend.onrender.com/api";
const API_TOKEN = import.meta.env.VITE_API_TOKEN || "64bebc1e2c6d3f056a8c85b7";

export function Auth() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isRegistering, setIsRegistering] = useState(false);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [userName, setUserName] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type, message, description) => {
        api[type]({
            message,
            description,
            placement: "topRight",
        });
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedUserName = localStorage.getItem("userName");

        if (storedUser || storedUserName) {
            setUserName(
                storedUserName ||
                    (storedUser ? JSON.parse(storedUser)?.name : null)
            );
            setIsLoggedIn(true);
        }

        if (location.pathname.includes("/profile")) {
            setOpen(false);
        }
    }, [location.pathname]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (errors[e.target.id]) {
            setErrors({
                ...errors,
                [e.target.id]: null,
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const { name, surname, email, password, confirmPassword } = formData;

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (isRegistering) {
            if (!name) newErrors.name = "Name is required";
            if (!surname) newErrors.surname = "Surname is required";

            if (!confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password";
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            const result = await signInWithGoogle();

            const data = await axios.post(
                `${API_BASE_URL}/user/sign-in/google?access_token=${API_TOKEN}`,
                {
                    email: result.user.email,
                }
            );

            handleAuthSuccess(data);
        } catch (error) {
            console.error("Google login failed:", error);
            setErrors({ general: "Google login failed. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthSuccess = (response) => {
        if (!response?.data?.data) return;

        const userData = response.data.data;

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userToken", JSON.stringify(userData.token));
        localStorage.setItem("userData", JSON.stringify(userData.user));
        localStorage.setItem("userName", userData.user.name);

        setUserName(userData.user.name);
        setIsLoggedIn(true);

        openNotification(
            "success",
            "Login Successful",
            `Welcome, ${userData.user.name}!`
        );

        setFormData({
            name: "",
            surname: "",
            email: "",
            password: "",
            confirmPassword: "",
        });

        setOpen(false);
        navigate("/profile/account");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const { name, surname, email, password, confirmPassword } = formData;
        setIsLoading(true);

        try {
            let res;
            if (isRegistering) {
                res = await axios.post(
                    `${API_BASE_URL}/user/sign-up?access_token=${API_TOKEN}`,
                    {
                        name,
                        surname,
                        password,
                        confirmPassword,
                        email,
                    }
                );
            } else {
                res = await axios.post(
                    `${API_BASE_URL}/user/sign-in?access_token=${API_TOKEN}`,
                    {
                        email,
                        password,
                    }
                );
            }

            handleAuthSuccess(res);
        } catch (error) {
            console.error(
                `${isRegistering ? "Signup" : "Login"} failed:`,
                error
            );

            if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({
                    general: isRegistering
                        ? "Registration failed. Please try again."
                        : "Login failed. Please check your credentials.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();

        if (isLoggedIn) {
            navigate("/profile/account");
        } else {
            setOpen(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {contextHolder}
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="text-white bg-green-600 border-none cursor-pointer hover:bg-green-600 hover:text-white"
                    onClick={handleButtonClick}
                >
                    {userName ? userName : "Login"}{" "}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] h-auto">
                <div className="flex gap-2.5 items-center justify-center mt-6">
                    <h3
                        className={`cursor-pointer text-xl transition-all ${
                            !isRegistering ? "text-[#46A358]" : "text-gray-500"
                        }`}
                        onClick={() => setIsRegistering(false)}
                    >
                        Login
                    </h3>
                    <div className="border h-4 bg-[#3D3D3D]"></div>
                    <h3
                        className={`cursor-pointer text-xl transition-all ${
                            isRegistering ? "text-[#46A358]" : "text-gray-500"
                        }`}
                        onClick={() => setIsRegistering(true)}
                    >
                        Register
                    </h3>
                </div>
                <div className="w-4/5 m-auto">
                    <h3 className="mt-8 text-sm font-normal">
                        {isRegistering
                            ? "Enter your details to register."
                            : "Enter your email and password to login."}
                    </h3>

                    {/* Display general error message */}
                    {errors.general && (
                        <div className="mt-2 text-sm text-red-500">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-4">
                        {isRegistering && (
                            <>
                                <Input
                                    id="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`mb-2 ${
                                        errors.name ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.name && (
                                    <div className="mb-2 text-xs text-red-500">
                                        {errors.name}
                                    </div>
                                )}

                                <Input
                                    id="surname"
                                    placeholder="Surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    className={`mb-2 ${
                                        errors.surname ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.surname && (
                                    <div className="mb-2 text-xs text-red-500">
                                        {errors.surname}
                                    </div>
                                )}
                            </>
                        )}
                        <Input
                            id="email"
                            placeholder="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`mb-2 ${
                                errors.email ? "border-red-500" : ""
                            }`}
                        />
                        {errors.email && (
                            <div className="mb-2 text-xs text-red-500">
                                {errors.email}
                            </div>
                        )}

                        <Input
                            id="password"
                            placeholder="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`mb-2 ${
                                errors.password ? "border-red-500" : ""
                            }`}
                        />
                        {errors.password && (
                            <div className="mb-2 text-xs text-red-500">
                                {errors.password}
                            </div>
                        )}

                        {isRegistering && (
                            <>
                                <Input
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`mb-2 ${
                                        errors.confirmPassword
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {errors.confirmPassword && (
                                    <div className="mb-2 text-xs text-red-500">
                                        {errors.confirmPassword}
                                    </div>
                                )}
                            </>
                        )}

                        {!isRegistering && (
                            <h3 className="text-[#46A358] font-normal cursor-pointer w-fit ml-auto">
                                Forgot Password?
                            </h3>
                        )}

                        <Button
                            type="submit"
                            className="bg-[#46A358] text-white w-full h-[45px] my-[20px]"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Processing..."
                                : isRegistering
                                ? "Register"
                                : "Login"}
                        </Button>

                        <div className="space-y-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex items-center justify-center w-full gap-2"
                                disabled={isLoading}
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                                    alt="fb"
                                    className="w-5 h-5"
                                />
                                Login with Facebook
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="flex items-center justify-center w-full gap-2"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <FaGoogle />
                                Login with Google
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="flex items-center justify-center w-full gap-2"
                                disabled={isLoading}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 8h4V4H3v4zm0 12h4v-4H3v4zm14 0h4v-4h-4v4zM17 4v4h4V4h-4zM7 12h10"
                                    />
                                </svg>
                                Login with QR Code
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
