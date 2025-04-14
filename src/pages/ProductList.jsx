import AdminSidemenu from "../layouts/AdminSidemenu";
import Header from "../layouts/Header";
import Breadcrumb from "../components/Breadcrumb";
import MainDish from "../components/ProductList/MainDish";
import Beverage from "../components/ProductList/Beverage";
import Dessert from "../components/ProductList/Dessert";
import OtherProduct from "../components/ProductList/OtherProduct";
import { useState } from "react";

const Inventory = () => {
  const [category, setCategory] = useState("mainDish");

    return (
        <div className="h-screen w-screen flex flex-col gap-1">
            <Header />
            <div className="flex w-full h-full gap-3">
                <AdminSidemenu />
                <div className="flex flex-col gap-5 w-full pr-[10px] mt-2">
                    <Breadcrumb />
                    <div className='flex justify-between font-medium text-primary mb-3'>
                        <div className="w-1/2 h-[30px] fixed z-30">
                            <select 
                                className='h-[35px] border border-black rounded-sm px-2'
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="mainDish">Main Dish</option>
                                <option value="beverage">Beverage</option>
                                <option value="desserts">Desserts</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                    </div>
                    {category == "mainDish" ? (
                        <MainDish />
                    ) : category == "beverage" ? (
                        <Beverage />
                    ) : category == "desserts" ? (
                        <Dessert /> 
                    ) : category == "others" ? (
                        <OtherProduct />
                    ) : (
                        <></>
                    )}
              </div>
            </div>
        </div>
    );
}

export default Inventory;
