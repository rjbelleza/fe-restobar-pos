import React from 'react';
import dashboardIcon from '../assets/icons/dashboard-icon.png';
import arrowNext from '../assets/icons/arrow.png';

const Breadcrumb = ({ currentMenu }) => {
  return (
    <div className="flex justify-start items-center p-[10px] w-full h-[50px] bg-secondary rounded-md">
      <img src={dashboardIcon} alt="Dashboard Icon" className="h-[25px] ml-[40px] mr-[5px]  " />
      <h1 className="text-primary font-medium text-[15px]">{currentMenu}</h1>
      <img src={arrowNext} alt="Arrow Icon" className="h-[25px]" />
    </div>
  );
};

export default Breadcrumb;
