import React from 'react';

const Breadcrumb = ({ currentMenu }) => {
  return (
    <div className="flex justify-start items-center p-[10px] w-full h-[50px] bg-secondary rounded-md">
      <h1 className="text-primary font-medium text-[15px]">{currentMenu}</h1>
    </div>
  );
};

export default Breadcrumb;
