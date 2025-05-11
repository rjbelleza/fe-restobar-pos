import { PlusIcon, MinusIcon } from "lucide-react";

const MenuCard = ({ menu, onAddItem, onRemoveItem, trigger }) => {
  // Style configuration
  const UNAVAILABLE_STYLES = {
    cardBg: 'bg-gray-200',
    imageFilter: 'brightness-50 opacity-80',
    overlay: 'bg-gray-500 opacity-50',
    label: 'bg-red-600 text-white text-xs font-bold px-2 py-1 rounded absolute top-[40%] left-[25%] z-10',
    buttonDisabled: 'bg-gray-400 cursor-not-allowed',
    buttonEnabled: 'bg-secondary hover:scale-110 cursor-pointer'
  };

  const isItemAvailable = (item) => (
    item.track_stock ? item.stock > 0 : item.available_quantity > 0
  );

  return (  
    <div className={`grid ${trigger?.length > 0 ? 'grid-cols-4' : 'grid-cols-5'} gap-5`}>
      {menu.map((p) => {
        const available = isItemAvailable(p);
        const orderItem = trigger?.find(order => order.id === p.id);
        const currentQuantity = orderItem ? orderItem.quantity : 0;
        const maxQuantity = p.track_stock ? p.stock : p.available_quantity;
        const reachedLimit = currentQuantity >= maxQuantity;
        const isDisabled = !available || (reachedLimit && currentQuantity <= 0);

        return (
          <div
            key={p.id}
            className={`relative flex flex-col justify-between h-[250px] w-full p-4 rounded-lg shadow-md transition-all ${
              (!available || reachedLimit) ? UNAVAILABLE_STYLES.cardBg : 'bg-[#ffde59] hover:shadow-lg'
            }`}
          >
            <div className="relative">
              {/* Disabled State Label */}
              {(!available || reachedLimit) && (
                <>
                  <div className={UNAVAILABLE_STYLES.label}>
                    {!available ? "OUT OF STOCK" : "MAX REACHED"}
                  </div>
                  <div className={`absolute inset-0 rounded-md ${UNAVAILABLE_STYLES.overlay}`}></div>
                </>
              )}
              
              <img
                src={`http://localhost:8000/storage/${p.imagePath}`}
                alt={p.name}
                className={`h-[150px] w-full object-cover rounded-md transition-all ${
                  (!available || reachedLimit) ? UNAVAILABLE_STYLES.imageFilter : ''
                }`}
              />
            </div>
            
            <div>
              <p className="font-semibold text-lg mt-2">{p.name}</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="font-bold text-[16px]">₱{p.price}</p>
              <div className="flex gap-2">
                <button
                  className={`flex items-center gap-1 px-2 py-2 rounded-full duration-300 transition-all ease-in-out ${
                    !available || reachedLimit
                      ? UNAVAILABLE_STYLES.buttonDisabled 
                      : UNAVAILABLE_STYLES.buttonEnabled
                  }`}
                  onClick={() => onAddItem(p)}
                  disabled={!available || reachedLimit}
                >   
                  <PlusIcon size={15} />
                </button>

                <button
                  className={`flex items-center gap-1 px-2 py-2 rounded-full duration-300 transition-all ease-in-out ${
                    !available || currentQuantity <= 0
                      ? UNAVAILABLE_STYLES.buttonDisabled 
                      : UNAVAILABLE_STYLES.buttonEnabled
                  }`} 
                  onClick={() => onRemoveItem(p)}
                  disabled={!available || currentQuantity <= 0}
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
