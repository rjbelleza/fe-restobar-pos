import { PlusIcon, MinusIcon } from "lucide-react";

const MenuCard = ({ menu, onAddItem, onRemoveItem, trigger }) => {
  // Check if an item is available based on track_stock flag
  const isItemAvailable = (item) => {
    // If track_stock is true (1), check stock value
    // If track_stock is false (0), check available_quantity
    return item.track_stock ? item.stock > 0 : item.available_quantity > 0;
  };

  // Determine if we can add more of an item based on track_stock flag
  const canAddMore = (item, currentQuantity) => {
    // Only enforce quantity limits based on stock when track_stock is true
    if (item.track_stock) {
      return currentQuantity < item.stock;
    }
    // When track_stock is false, check against available_quantity
    return currentQuantity < item.available_quantity;
  };

  // Get appropriate text to display for availability
  const getAvailableText = (item) => {
    return item.track_stock 
      ? `Stock: ${item.stock}` 
      : `Available: ${item.available_quantity}`;
  };

  return (  
    <div className={`grid ${trigger?.length > 0 ? 'grid-cols-4' : 'grid-cols-5'} gap-5`}>
      {menu.map((p) => {
        const available = isItemAvailable(p);
        const orderItem = trigger?.find(order => order.id === p.id);
        const currentQuantity = orderItem ? orderItem.quantity : 0;
        const allowAddMore = canAddMore(p, currentQuantity);

        return (
          <div
            key={p.id}
            className={`relative flex flex-col justify-between h-[250px] w-full p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              !available ? 'bg-gray-200' : 'bg-[#FFDE59]'
            }`}
          >
            {!available && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg z-10">
                <span className="text-white font-bold">Out of Stock</span>
              </div>
            )}
            <img
              src={`http://localhost:8000/storage/${p.imagePath}`}
              alt={p.name}
              className="h-[150px] w-full object-cover rounded-md"
            />
            <div> 
              <p className="font-semibold text-lg mt-2">{p.name}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-[16px]">₱{p.price}</p>

              <div className="flex gap-2">
                <button
                  className={`flex items-center gap-1 px-2 py-2 rounded-full duration-300 transition-all ease-in-out ${
                    !available || !allowAddMore
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-secondary hover:scale-110 cursor-pointer'
                  }`}
                  onClick={() => onAddItem(p)}
                  disabled={!available || !allowAddMore}
                >   
                  <PlusIcon size={15} />
                </button>

                <button
                  className={`flex items-center gap-1 px-2 py-2 rounded-full duration-300 transition-all ease-in-out ${
                    currentQuantity <= 0
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-secondary hover:scale-110 cursor-pointer'
                  }`}
                  onClick={() => onRemoveItem(p)}
                  disabled={currentQuantity <= 0}
                >
                  <MinusIcon size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuCard;
