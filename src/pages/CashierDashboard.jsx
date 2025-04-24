import React from 'react';
import Header from '../layouts/Header';
import CashierSidemenu from '../layouts/CashierSidemenu';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../layouts/Footer';


const CashierDashboard = () => {

  return (
    <div className="h-screen w-screen flex flex-col gap-1 overflow-x-hidden">
      <Header />
      <div className="flex w-full h-full gap-3">
        <CashierSidemenu />
        <div className="flex flex-col gap-5 w-full h-fit pr-[10px] mt-2">
          <Breadcrumb />
          <div className="flex justify-between h-full w-full gap-4">

          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;
