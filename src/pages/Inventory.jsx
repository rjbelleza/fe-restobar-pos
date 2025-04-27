import AdminSidemenu from "../layouts/AdminSidemenu";
import Header from "../layouts/Header";
import Breadcrumb from "../components/Breadcrumb";
import IngredientsTable from "../components/IngredientsTable";
import BeverageTable from '../components/BeverageTable';
import DessertTable from "../components/DessertTable";
import OthersTable from "../components/OthersTable";
import { useState } from "react";
import { X } from "lucide-react";

const Inventory = () => {
  const [category, setCategory] = useState("ingredients");
  const [settingsModal, setSettingsModal] = useState(false);
  const [lowStock, setLowStock] = useState(0);

    return (
        <div className="h-screen w-screen flex flex-col gap-1 overflow-x-hidden">
            {settingsModal && (
                <InventorySettings 
                    setSettingsModal={setSettingsModal} 
                    setLowStock={setLowStock} 
                    lowStock={lowStock} 
                />
            )}
            <Header />
            <div className="flex w-full h-full gap-3">
                <AdminSidemenu />
                <div className="flex flex-col gap-5 w-full pr-[10px] mt-2">
                    <Breadcrumb />
                    <div className='flex justify-between font-medium text-primary mb-3'>
                        <div className="w-1/2 h-[30px] mb-[-50px] z-30">
                            <select 
                                className='h-[35px] border border-black rounded-sm px-2'
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="ingredients">Ingredients</option>
                                <option value="beverage">Beverage</option>
                                <option value="desserts">Desserts</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                    </div>
                    {category == "ingredients" ? (
                        <IngredientsTable openSettingsModal={setSettingsModal} lowStock={lowStock} />
                    ) : category == "beverage" ? (
                        <BeverageTable openSettingsModal={setSettingsModal} />
                    ) : category == "desserts" ? (
                        <DessertTable openSettingsModal={setSettingsModal} /> 
                    ) : category == "others" ? (
                        <OthersTable openSettingsModal={setSettingsModal} />
                    ) : (
                        <></>
                    )}
              </div>
            </div>
        </div>
    );
}
    
export default Inventory;

const InventorySettings = ({setSettingsModal, setLowStock, lowStock}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        setSettingsModal(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-1000" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="w-[400px] bg-white p-7 pb-10 rounded-sm shadow-lg">
            <p className="flex justify-between text-[19px] font-medium text-primary mb-8">
              INVENTORY SETTINGS
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                    type="button" 
                    onClick={() => setSettingsModal(false)} className="cursor-pointer">
                  <X size={20} />
                </button>
              </span>
            </p>
            <form 
                onSubmit={handleSubmit}
                className="flex flex-col w-full gap-5">
                <div className="flex flex-col w-full gap-3">
                    <label htmlFor="notify" className="">Set Low Stock Notification</label>
                    <input 
                        type="number"
                        id="notify"
                        value={lowStock}
                        onChange={(e) => setLowStock(Number(e.target.value))}
                        placeholder="Enter Quantity"
                        className="w-full text-[15px] px-3 py-2 border border-black rounded-sm"
                    />
                </div>  
                <button
                    type="submit" 
                    className="w-full bg-primary text-white hover:bg-mustard hover:text-black cursor-pointer py-2 rounded-sm">
                    Confirm
                </button>
            </form>
          </div>
        </div>
    );
}
