import { PlusIcon } from "lucide-react";

const MenuCard = ({ menu, onAddItem }) => {

  return (  
    <div className="flex flex-wrap gap-6 justify-start">
      {menu.map((e) => (
        <div
          key={e.id}
          className="flex flex-col justify-between h-[200px] w-[200px] p-4 rounded-lg bg-[#FFDE59] shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            src={e.image}
            alt={e.itemName}
            className="h-[150px] w-full object-cover rounded-md"
          />
          <p className="font-semibold text-lg mt-2">{e.itemName}</p>
          <div className="flex justify-between items-center mt-auto">
            <p className="font-bold text-[16px]">{e.price}</p>
            
            <button
              className="flex items-center gap-1 px-3 py-2 bg-[#eab308] rounded-lg duration-300 cursor-pointer hover:scale-110 transition-all ease-in-out"
              onClick={() => onAddItem(e)}
            >
              <PlusIcon size={20} />
              <span className="text-sm font-medium">Add to Cart</span>
            </button>

          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuCard;
