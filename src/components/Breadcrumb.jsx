import React from 'react';
import { useLocation } from "react-router";

const Breadcrumb = () => {
  const location = useLocation();

  const handleCurrentLoc = () => {
      if(location.pathname === '/admin-dashboard') {
          return 'DASHBOARD'
      }
      else if (location.pathname === '/admin-sales') {
          return 'SALES MANAGEMENT'
      }
      else if (location.pathname === '/inventory') {
          return 'INVENTORY MANAGEMENT'
      }
      else if (location.pathname === '/expenses') {
          return 'EXPENSES MANAGEMENT'
      }
      else if (location.pathname === '/product-list') {
        return 'PRODUCT LIST'
      }
      else if (location.pathname === '/sales') {
        return 'SALES MANAGEMENT'
      }
      else if (location.pathname === '/sales-report') {
        return 'SALES REPORT'
      }
      else if (location.pathname === '/expenses-report') {
        return 'EXPENSES REPORT'
      }
      else if (location.pathname === '/order-history') {
        return 'ORDER HISTORY'
      }
      else if (location.pathname === '/cashier-dashboard') {
        return 'DASHBOARD'
      }
  }

  return (
    <div className="flex justify-start items-center p-[10px] w-full h-[50px] bg-secondary rounded-sm border-l-7 border-primary">
      <h1 className="text-primary font-medium text-[15px]">{handleCurrentLoc()}</h1>
    </div>
  );
};

export default Breadcrumb;
