import { useState } from "react";
import { Badge, Popover } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import {
    SearchOutlined,
    ShoppingCartOutlined,
    MenuOutlined,
    LoginOutlined,
    BellOutlined,
} from "@ant-design/icons";
import { Auth } from "../Auth/auth";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="m-auto max-sm:w-full">
            <div className="p-8 flex align-center border-b border-[#46A358]">
                <NavLink to="/">
                    <div className="flex-1">
                        <img src={logo} alt="" />
                    </div>
                </NavLink>
                <div className="flex justify-center flex-1 gap-8 max-sm:hidden">
                    <h3
                        className="cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        Home
                    </h3>
                    <h3
                        className="cursor-pointer"
                        onClick={() => navigate("/blog")}
                    >
                        Blog
                    </h3>
                </div>
                <div className="flex justify-end flex-1 gap-8 max-sm:hidden">
                    <SearchOutlined className="cursor-pointer text-[20px]" />
                    <Popover
                        open={open}
                        title="Notifications"
                        trigger="click"
                        content={<div>Notification</div>}
                    >
                        <Badge className="mt-[5px]">
                            <BellOutlined className="cursor-pointer text-[23px]" />
                        </Badge>
                    </Popover>
                    <Badge className="mt-[5px]">
                        <ShoppingCartOutlined
                            onClick={() => navigate("/product-card")}
                            className="cursor-pointer text-[25px]"
                        />
                    </Badge>
                    <Auth />
                </div>
                <div className="justify-end flex-1 hidden gap-8 max-sm:flex">
                    <SearchOutlined className="cursor-pointer text-[20px]" />
                    <Badge className="mt-[5px]">
                        <ShoppingCartOutlined
                            onClick={() => navigate("/product-card")}
                            className="cursor-pointer text-[25px]"
                        />
                    </Badge>
                    <MenuOutlined className="cursor-pointer text-[20px]" />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
