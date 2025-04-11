import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../layouts/Header';
import AdminSidemenu from '../layouts/AdminSidemenu';
import Breadcrumb from '../components/Breadcrumb';
import BarGraph from '../components/BarGraph';
import Card from '../components/Card';
import ColumnChart from '../components/ColumnChart';


const label = [
  { menu: 'Dashboard', path: '/adminDashboard' },
  { menu: 'Sales', path: '/sales', },
  { menu: 'Inventory', path: '/adminInventory' },
  { menu: 'Order History', path: '/adminorderHistory'},
  { menu: 'Reports', path: '/reports', },
  { menu: 'Staff Information', path: '/staffInformation' },
];

const AdminDashboard = () => {
  const location = useLocation();

  const sales = [
    {
      category: 'Current Sales',
      value: '₱30,000',
      sub1: 'Total Sales: ₱50,000',
      sub2: 'Target Sales: ₱1,000,000',
    },
  ];  

  const inventory = [
    {
      category: 'Inventory',
      value: 'Low Stock',
      sub1: 'Beverages: 50',
      sub2: 'Desserts: 20',
    },
  ];

  const staffInformation = [
    {
      category: 'Staff Information',
      value: '15 Employees',
      sub1: '',
      sub2: '',
    },
  ];

  const menu = () => {
    if (location.pathname === '/adminDashboard') {
      return 'DASHBOARD';
    }
    return '';
  };

  return (
    <div className="h-screen w-screen flex flex-col gap-1">
      <Header />
      <div className="flex w-full h-full gap-3">
        <AdminSidemenu />
        <div className="flex flex-col gap-5 w-full pr-[10px] mt-2">
          <Breadcrumb currentMenu={menu()} />
          <div className="flex justify-between h-full w-full gap-4">
            <ColumnChart />
            <div className='grid grid-rows-4 gap-4 w-full px-5'>
                <Card url="card-bg1.png" category="Current Sales" value="₱30,000.00" range="Last 30 days" color="#B82132" />
                <Card url="card-bg2.png" category="Current Expenses" value="₱20,000.00" range="Last 30 days" color="#B82132" />
                <Card url="card-bg3.png" category="Inventory Level" value="In Stock" range="All products" color="#B82132" />
                <Card url="card-bg4.png" category="Net Profit" value="₱50,000.00" range="From Last 30 days" color="#B82132" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
