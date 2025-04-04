"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const token = "64bebc1e2c6d3f056a8c85b7";

export function Auth() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isRegistering, setIsRegistering] = useState(false);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [userName, setUserName] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, surname, email, password, confirmPassword } = formData;

        try {
            let res;
            if (isRegistering) {
                res = await axios.post(
                    `https://green-shop-backend.onrender.com/api/user/sign-up?access_token=${token}`,
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
                    `https://green-shop-backend.onrender.com/api/user/sign-in?access_token=${token}`,
                    {
                        email,
                        password,
                    }
                );
            }

            localStorage.setItem("user", JSON.stringify(res?.data?.data));
            localStorage.setItem(
                "userToken",
                JSON.stringify(res.data.data.token)
            );
            localStorage.setItem(
                "userData",
                JSON.stringify(res.data.data.user)
            );

            setUserName(res.data.data.user.name);
            setIsLoggedIn(true);

            localStorage.setItem("userName", res.data.data.user.name);

            setFormData({
                name: "",
                surname: "",
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
            });

            setOpen(false);
            navigate("/profile/account");
        } catch (error) {
            console.error(
                `${isRegistering ? "Signup" : "Login"} failed:`,
                error
            );
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
                    <form onSubmit={handleSubmit} className="mt-4">
                        {isRegistering && (
                            <>
                                <Input
                                    id="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mb-2"
                                />
                                <Input
                                    id="surname"
                                    placeholder="Surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    className="mb-2"
                                />
                            </>
                        )}
                        <Input
                            id="email"
                            placeholder="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mb-2"
                        />
                        <Input
                            id="password"
                            placeholder="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mb-2"
                        />
                        {isRegistering && (
                            <Input
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mb-2"
                            />
                        )}
                        {!isRegistering && (
                            <h3 className="text-[#46A358] font-normal cursor-pointer w-fit ml-auto">
                                Forgot Password?
                            </h3>
                        )}
                        <Button
                            type="submit"
                            className="bg-[#46A358] text-white w-full h-[45px] my-[20px]"
                        >
                            {isRegistering ? "Register" : "Login"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
