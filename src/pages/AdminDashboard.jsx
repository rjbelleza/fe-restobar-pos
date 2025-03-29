import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../layouts/Header';
import Sidemenu from '../layouts/Sidemenu';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import BarGraph from '../components/BarGraph';
import dashboardIcon from '../assets/icons/dashboard.png';
import salesIcon from '../assets/icons/sales.png';
import inventoryIcon from '../assets/icons/inventory.png';
import orderHistoryIcon from '../assets/icons/order-history.png';
import reportsIcon from '../assets/icons/reports.png';
import staffInfoIcon from '../assets/icons/staff-info.png';

const label = [
  { menu: 'Dashboard', path: '/adminDashboard', icon: dashboardIcon },
  { menu: 'Sales', path: '/sales', icon: salesIcon },
  { menu: 'Inventory', path: '/adminInventory', icon: inventoryIcon },
  { menu: 'Order History', path: '/adminorderHistory', icon: orderHistoryIcon },
  { menu: 'Reports', path: '/reports', icon: reportsIcon },
  { menu: 'Staff Information', path: '/staffInformation', icon: staffInfoIcon },
];

const AdminDashboard = () => {
  const location = useLocation();

  const user = [
    { id: 0, name: 'Rolyn Jane Tacastacas', email: 'chidrosafoodservices@gmail.com', role: 'admin' },
  ];

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
        <Sidemenu user={user} label={label} />
        <div className="flex flex-col gap-5 w-full pr-[10px]">
          <Breadcrumb currentMenu={menu()} />
          <div className="flex gap-4 flex-wrap">
            <BarGraph />
            <div className='flex flex-col gap-[50px] justify-center'>
              <Card content={sales} />
              <Card content={inventory} />
              <Card content={staffInformation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
