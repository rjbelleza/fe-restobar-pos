import { PlusIcon, MinusIcon } from "lucide-react";

const MenuCard = ({ menu, onAddItem, onRemoveItem, trigger }) => {

  return (  
    <div className={`grid ${trigger?.length > 0 ? 'grid-cols-4' : 'grid-cols-5'} gap-5`}>
      {menu.map((p) => (
        <div
          key={p.id}
          className="flex flex-col justify-between h-[250px] w-full p-4 rounded-lg bg-[#FFDE59] shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            src={`http://localhost:8000/storage/${p.imagePath}`}
            alt={p.name}
            className="h-[150px] w-full object-cover rounded-md"
          />
          <p className="font-semibold text-lg mt-2">{p.name}</p>
          <div className="flex justify-between items-center">
            <p className="font-bold text-[16px]">₱{p.price}</p>

            <div className="flex gap-2">
                <button
                className="flex items-center gap-1 px-2 py-2 bg-secondary rounded-full duration-300 cursor-pointer hover:scale-110 transition-all ease-in-out"
                onClick={() => onAddItem(p)}
                >   
                <PlusIcon size={15} />
                </button>

                <button
                className="flex items-center gap-1 px-2 py-2 bg-secondary rounded-full duration-300 cursor-pointer hover:scale-110 transition-all ease-in-out"
                onClick={() => onRemoveItem(p)}
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
