import { Slider } from "antd";
import Discount from "./Discount";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const api = import.meta.env.VITE_API;

const fetchUsers = async () => {
    const { data } = await axios.get(
        `${api}/flower/category?access_token=64bebc1e2c6d3f056a8c85b7`
    );
    return data;
};
const CategoriesMain = () => {
    const [price, setPrice] = useState([0, 1000]);

    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category" || "house-plats");

    const { data, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchUsers,
    });

    const updateSort = (sortType) => {
        searchParams.set("category", sortType);
        setSearchParams(searchParams);
    };

    const handleFilterApply = () => {
        searchParams.set("range_min", price[0]);
        searchParams.set("range_max", price[1]);
        setSearchParams(searchParams);
    };

    if (isLoading) return <p>Yuklanmoqda...</p>;
    if (error) return <p>Xatolik yuz berdi: {error.message}</p>;
    console.log(data);
    return (
        <div className="w-[310px] bg-[#F5F5F580] p-[15px] max-lg:hidden">
            <h3 className="font-bold">Categories</h3>
            <div className="flex flex-col gap-4 mt-[10px] pl-[10px] cursor-pointer">
                {data?.data?.map(({ title, count, route_path }, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => updateSort(route_path)}
                            className={`flex justify-between hover:text-green-600  ${
                                category === route_path && "text-green-600"
                            } `}
                        >
                            <h3>{title}</h3>
                            <h3>({count})</h3>
                        </div>
                    );
                })}
            </div>
            <div className="mt-[15px] ">
                <h3 className="font-bold">Price Range</h3>
                <Slider
                    range
                    defaultValue={[0, 1000]}
                    max={1000}
                    onChange={(value) => setPrice(value)}
                />
                <p className="font-normal text-left">
                    Price:{" "}
                    <span className="font-bold text-[#46A358]">
                        ${price[0]} - ${price[1]}
                    </span>
                </p>
                <button
                    className="mt-[16px] bg-[#46A358] text-white px-[23px] py-[8px] rounded-lg font-bold mr-[200px]"
                    onClick={handleFilterApply}
                >
                    Filter
                </button>
            </div>
            <Discount />
        </div>
    );
};

export default CategoriesMain;
