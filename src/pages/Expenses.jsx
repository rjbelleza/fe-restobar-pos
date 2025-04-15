
import React from 'react';
import Header from '../layouts/Header';
import AdminSidemenu from '../layouts/AdminSidemenu';
import Breadcrumb from '../components/Breadcrumb';
import ExpensesTable from '../components/ExpensesTable';


const Expenses = () => {

  return (
    <div className="h-screen w-screen flex flex-col gap-1 overflow-x-hidden">
      <Header />
      <div className="flex w-full h-full gap-3">
        <AdminSidemenu />
        <div className="flex flex-col gap-5 w-full pr-[10px] mt-2">
          <Breadcrumb />
          <div className="flex justify-between h-full w-full gap-4">
            <ExpensesTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;

