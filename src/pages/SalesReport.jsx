import React from 'react';
import Header from '../layouts/Header';
import AdminSidemenu from '../layouts/AdminSidemenu';
import Breadcrumb from '../components/Breadcrumb';


const SalesReport = () => {

  return (
    <div className="h-screen w-screen flex flex-col gap-1 overflow-x-hidden">
      <Header />
      <div className="flex w-full h-full gap-3">
        <AdminSidemenu />
        <div className="flex flex-col gap-5 w-full h-fit pr-[10px] mt-2">
          <Breadcrumb />

        </div>
      </div>
    </div>
  );
};

export default SalesReport;
