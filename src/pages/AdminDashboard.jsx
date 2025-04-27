import React from 'react';
import Header from '../layouts/Header';
import AdminSidemenu from '../layouts/AdminSidemenu';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import ColumnChart from '../components/ColumnChart';
import Footer from '../layouts/Footer'; 
import { Calendar, HandCoins, Receipt, ChartNoAxesCombined } from 'lucide-react';


const AdminDashboard = () => {

  return (
    <div className="h-screen w-screen flex flex-col gap-1 overflow-hidden">
      <Header />
      <div className="flex w-full h-full gap-3">
        <AdminSidemenu />
        <div className="flex flex-col gap-5 w-full h-fit pr-[10px] mt-2">
          <Breadcrumb />
          <div className="grid grid-cols-4 w-full px-5 gap-5 mb-3">
              <button className="flex items-center justify-center gap-2 bg-secondary focus:bg-primary py-2 focus:text-white hover:bg-mustard hover:text-black rounded-full text-black text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer">
                  <Calendar size={15} /> Last Day
              </button>
              <button className="flex items-center justify-center gap-2 bg-secondary focus:bg-primary py-2 focus:text-white hover:bg-mustard hover:text-black rounded-full text-black text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer">
                  <Calendar size={15} /> Last Week
              </button>
              <button className="flex items-center justify-center gap-2 bg-secondary focus:bg-primary py-2 focus:text-white hover:bg-mustard hover:text-black rounded-full text-black text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer">
                  <Calendar size={15} /> Last Month
              </button>
              <button className="flex items-center justify-center gap-2 bg-secondary focus:bg-primary py-2 focus:text-white hover:bg-mustard hover:text-black rounded-full text-black text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer">
                  <Calendar size={15} /> Last Year
              </button>
          </div>
          <div className="flex justify-between h-full w-full gap-4">
            <ColumnChart />
            <div className='grid grid-rows-3 gap-4 w-full px-5'>  
                <Card category="Current Sales" value="₱30,000.00" color="#B82132" />
                <Card category="Current Expenses" value="₱20,000.00" color="#B82132" />
                <Card category="Net Profit" value="₱50,000.00" color="#B82132" />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
