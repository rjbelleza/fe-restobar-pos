import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../layouts/Header';
import AdminSidemenu from '../layouts/AdminSidemenu';
import Breadcrumb from '../components/Breadcrumb';
import BarGraph from '../components/BarGraph';
import Card from '../components/Card';


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
