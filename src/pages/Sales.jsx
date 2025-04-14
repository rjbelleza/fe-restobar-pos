import AdminSidemenu from "../layouts/AdminSidemenu";
import Header from "../layouts/Header";
import Breadcrumb from "../components/Breadcrumb";
import SalesTable from "../components/SalesTable";
import { useState } from "react";

const Sales = () => {
  const [category, setCategory] = useState("mainDish");

    return (
        <div className="h-screen w-screen flex flex-col gap-1">
            <Header />
            <div className="flex w-full h-full gap-3">
                <AdminSidemenu />
                <div className="flex flex-col gap-5 w-full pr-[10px] mt-2">
                    <Breadcrumb />
                    <div className='flex justify-between font-medium text-primary mb-3'>
                        <SalesTable />
                    </div>
              </div>
            </div>
        </div>
    );
}

export default Sales;
