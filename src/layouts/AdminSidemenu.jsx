import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts';
import { 
    Menu, 
    LayoutDashboard, 
    PackageOpen, 
    HandCoins, 
    ReceiptText , 
    ChartArea, 
    Users, 
    SquareChartGantt 
} from 'lucide-react';

const AdminSidemenu = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);


    const toggleMenu = () => setIsOpen(!isOpen);


    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading]);


    useEffect(() => {
        location.pathname == "/new-sales" && setIsOpen(false);
    }, [])


    if (loading || !user) {
        return <p>Loading...</p>;
    }


    return (
        <div className={`${isOpen ? 'w-60' : 'w-20'} bg-primary flex flex-col bg-[url('/images/sidemenu.png')] bg-cover bg-center mt-2 rounded-tr-md
                        shadow-[2px_0px_10px_gray] bg-opacity-30 sticky left-0 items-center p-3 transition-all ease-in-out`}
        >
            <div className={`${!isOpen ? 'justify-center' : 'justify-end'} flex w-full`}>
                <button 
                    className='cursor-pointer hover:bg-red-400 rounded-md p-1 transition-all'
                    onClick={toggleMenu}
                >
                    <Menu size={30} className='text-secondary' />
                </button>
            </div>
            <div className={`${!isOpen && 'hidden'} flex flex-col gap-1 h-fit w-50 rounded-lg mt-3`}>
                <div className="flex flex-col items-center w-full">
                    <p className="text-[12px] w-full font-medium text-white">Profile</p>
                    <div className='border border-white w-full mb-3 mt-1'></div>
                    <p className="text-center font-medium text-[19px] mb-2 text-white">{user.name}</p>
                    <p className="text-center text-[14px] font-medium text-white">
                        {user.role.toUpperCase()}
                    </p>
                    <div className='border border-white w-full mt-3'></div>
                </div>
                <div className="h-full w-full mt-12">
                    <p className="font-bold text-[12px] text-white mb-3">Menus</p>
                    <SideMenuBtn />
                </div>
            </div>

            {/* Decreased Sidemenu width*/}
            {!isOpen && (
                    <div
                        className="flex flex-col gap-5 h-full mt-20 bg-primary"
                    >
                        <Link to="/admin-dashboard" 
                              className={`flex justify-center items-center h-[40px] w-[50px] rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                                       hover:text-black transition-all ease-in-out text-[14px] font-medium
                                        ${location.pathname == "/admin-dashboard" ? 'bg-[#FFDE59]' : 'bg-secondary'}`}
                        > <LayoutDashboard />
                        </Link>
        
                        <Link to="/inventory" 
                              className={`flex justify-center items-center h-[40px] w-[50px] rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                                        hover:text-black transition-all ease-in-out text-[14px] font-medium
                                        ${location.pathname == "/inventory" ? 'bg-[#FFDE59]' : 'bg-secondary'}`}
                        ><PackageOpen />
                        </Link>

                        <Link to="/product-list" 
                              className={`flex justify-center items-center h-[40px] w-[50px] rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                                        hover:text-black transition-all ease-in-out text-[14px] font-medium
                                        ${location.pathname ==   "/product-list" ? 'bg-[#FFDE59]' : 'bg-secondary'}`}
                        ><SquareChartGantt />
                        </Link>
                                
                        <Link to="/sales" 
                              className={`flex justify-center items-center h-[40px] w-[50px] rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                                hover:text-black transition-all ease-in-out text-[14px] font-medium
                                ${location.pathname ==   "/sales" ? 'bg-[#FFDE59]' : 'bg-secondary'}`}
                        ><HandCoins />
                        </Link>
        
                        <Link to="/admin-dashboard" 
                              className="flex justify-center items-center h-[40px] w-full rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                                       hover:text-black transition-all ease-in-out text-[14px] font-medium bg-secondary"
                        ><ReceiptText  />
                        </Link>
        
                        <Link to="/admin-dashboard" 
                              className="flex justify-center items-center h-[40px] w-full rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                                       hover:text-black transition-all ease-in-out text-[14px] font-medium bg-secondary"
                        ><ChartArea />
                        </Link>
        
                        <Link to="/admin-dashboard" 
                              className="flex justify-center items-center h-[40px] w-full rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                                       hover:text-black transition-all ease-in-out text-[14px] font-medium bg-secondary"
                        ><Users />
                        </Link>
        
                    </div>
            )}
        </div>
    );
}

const SideMenuBtn = () => {


    return (
        <div className="flex flex-col gap-3 h-full w-full text-white font-light">
            <Link to="/admin-dashboard" 
                  className={`flex justify-between items-center px-5 h-[40px] w-full rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                           hover:text-black transition-all ease-in-out text-[14px] font-medium
                             ${location.pathname == "/admin-dashboard" ? 'bg-[#FFDE59]' : 'bg-secondary'}
                            `}
            > 
            <p className='flex justify-center items-center text-[14px] w-full h-full'>Dashboard</p>
            <LayoutDashboard />
            </Link>

            <Link to="/inventory" 
                  className={`flex justify-between items-center px-5 h-[40px] w-full rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                            hover:text-black transition-all ease-in-out text-[14px] font-medium
                            ${location.pathname == "/inventory" ? 'bg-[#FFDE59]' : 'bg-secondary'}
                            `}
            > <p className='flex justify-center items-center text-[14px] w-full h-full'>Inventory</p>
            <PackageOpen />
            </Link> 

            <Link to="/product-list" 
                  className={`flex justify-between items-center px-5 h-[40px] w-full rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                    hover:text-black transition-all ease-in-out text-[14px] font-medium
                    ${location.pathname == "/product-list" ? 'bg-[#FFDE59]' : 'bg-secondary'}
                    `}
            > <p className='flex justify-center items-center text-[14px] w-full h-full'>Product List</p>
            <SquareChartGantt />
            </Link>

            <Link to="/sales" 
                  className={`flex justify-between items-center px-5 h-[40px] w-full rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                    hover:text-black transition-all ease-in-out text-[14px] font-medium
                    ${location.pathname == "/sales" ? 'bg-[#FFDE59]' : 'bg-secondary'}
                    `}
            > <p className='flex justify-center items-center text-[14px] w-full h-full'>Sales</p>
            <HandCoins />
            </Link>

            <Link to="/admin-dashboard" 
                  className="flex justify-between items-center px-5 h-[40px] w-full rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                           hover:text-black transition-all ease-in-out text-[14px] font-medium bg-secondary"
            ><p className='flex justify-center items-center text-[14px] w-full h-full'>Expenses</p>
            <ReceiptText  />
            </Link>

            <Link to="/admin-dashboard" 
                  className="flex justify-between items-center px-5 h-[40px] w-full rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                           hover:text-black transition-all ease-in-out text-[14px] font-medium bg-secondary"
            ><p className='flex justify-center items-center text-[14px] w-full h-full'>Reports</p>
            <ChartArea />
            </Link>

            <Link to="/admin-dashboard" 
                  className="flex justify-between items-center px-5 h-[40px] w-full rounded-lg cursor-pointer hover:bg-[#FFDE59] text-black
                           hover:text-black transition-all ease-in-out text-[14px] font-medium bg-secondary"
            ><p className='flex justify-center items-center text-[14px] w-full h-full'>Users</p>
            <Users />
            </Link>
        </div>
    );
}

export default AdminSidemenu;
