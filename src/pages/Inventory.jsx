import AdminSidemenu from "../layouts/AdminSidemenu";
import Header from "../layouts/Header";
import Breadcrumb from "../components/Breadcrumb";

const Inventory = () => {

    return (
        <div className="h-screen w-screen flex flex-col gap-1">
            <Header />
            <div className="flex w-full h-full gap-3">
                <AdminSidemenu />
                <div className="flex flex-col gap-5 w-full pr-[10px] mt-2">
                    <Breadcrumb />

                    <div className='grid grid-rows-4 gap-4 w-full px-5'>

              </div>
            </div>
          </div>
        </div>
    );
}

export default Inventory;
