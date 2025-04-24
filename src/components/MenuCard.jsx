import { PlusIcon, MinusIcon } from "lucide-react";

const MenuCard = ({ menu, onAddItem, onRemoveItem }) => {
  return (  
    <div className="flex flex-wrap gap-6 justify-start">
      {menu.map((e) => (
        <div
          key={e.id}
          className="flex flex-col justify-between h-[250px] w-[220px] p-4 rounded-lg bg-[#FFDE59] shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            src={e.image}
            alt={e.itemName}
            className="h-[150px] w-full object-cover rounded-md"
          />
          <p className="font-semibold text-lg mt-2">{e.name}</p>
          <div className="flex justify-between items-center">
            <p className="font-bold text-[16px]">₱{e.price.toFixed(2)}</p>

            <div className="flex gap-2">
                <button
                className="flex items-center gap-1 px-2 py-2 bg-secondary rounded-full duration-300 cursor-pointer hover:scale-110 transition-all ease-in-out"
                onClick={() => onAddItem(e)}
                >   
                <PlusIcon size={15} />
                </button>

                <button
                className="flex items-center gap-1 px-2 py-2 bg-secondary rounded-full duration-300 cursor-pointer hover:scale-110 transition-all ease-in-out"
                onClick={() => onRemoveItem(e)}
                >
                <MinusIcon size={15} />
                </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuCard;
