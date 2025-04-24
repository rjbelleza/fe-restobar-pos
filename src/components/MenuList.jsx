import MenuCard from "../components/MenuCard";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const MenuList = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [discountPercent, setDiscountPercent] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [amountPaid, setAmountPaid] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    useEffect(() => {
        fetch('/data/mainDish.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(jsonData => {
                const itemsWithQuantity = jsonData.map(item => ({
                    ...item,
                    quantity: 0
                }));
                setMenuItems(itemsWithQuantity);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const calculateSubtotal = () => {
        return orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const handleIncrement = (id) => {
        const updatedItems = orderItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setOrderItems(updatedItems);
    };

    const handleDecrement = (id) => {
        const updatedItems = orderItems
            .map(item =>
                item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
            )
            .filter(item => item.quantity > 0);
        setOrderItems(updatedItems);
    };

    const handleAddItem = (item) => {
        const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
        if (existingItem) {
            handleIncrement(item.id);
        } else {
            const newItem = {
                id: item.id,
                name: item.itemName,
                price: typeof item.price === 'string' ? parseFloat(item.price.replace('₱', '')) : item.price,
                quantity: 1,
                image: item.image
            };
            setOrderItems([...orderItems, newItem]);
        }
    };

    const handleRemoveItem = (item) => {
        const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
        if (existingItem) {
            handleDecrement(item.id);
        }
    };

    const handleAmountPaidChange = (e) => {
        const value = e.target.value;
        if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
            setAmountPaid(value);
        }
    };

    const subtotal = calculateSubtotal();
    const discountAmount = discountPercent ? subtotal * (discountPercent / 100) : 0;
    const total = subtotal - discountAmount;
    const change = amountPaid ? (parseFloat(amountPaid)) - total : 0;

    const handleDiscountChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue === '') {
            setDiscountPercent(null);
            return;
        }
        const numericValue = parseInt(inputValue, 10);
        if (!isNaN(numericValue)) {
            const clampedValue = Math.min(100, Math.max(0, numericValue));
            setDiscountPercent(clampedValue);
        }
    };

    return (
        <div className="flex">
            <div className="flex flex-col w-full">
                <div className="flex justify-between w-[85%]">
                    <p className="ml-5 font-bold text-[23px]">Categories</p>
                    <div className="relative w-[20%] h-[40px]">
                        <Search size={25} className="absolute top-2 left-2 text-primary" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-full w-full pl-10 pr-2 border p-2 border-primary focus:border-primary focus:border-2 rounded-lg"
                        />
                    </div>
                </div>

                <div className="flex gap-2 px-10 mt-4">
                    <button className="px-4 py-2 bg-secondary text-primary border rounded-lg hover:bg-primary hover:text-white cursor-pointer focus:bg-primary focus:text-white">Value Meal</button>
                    <button className="px-4 py-2 bg-secondary text-primary border rounded-lg hover:bg-primary hover:text-white cursor-pointer focus:bg-primary focus:text-white">Beverages</button>
                    <button className="px-4 py-2 bg-secondary text-primary border rounded-lg hover:bg-primary hover:text-white cursor-pointer focus:bg-primary focus:text-white">Desserts</button>
                    <button className="px-4 py-2 bg-secondary text-primary border rounded-lg hover:bg-primary hover:text-white cursor-pointer focus:bg-primary focus:text-white">Others</button>
                </div>

                <div className="p-5 pb-30 w-full grid-cols-5 overflow-y-auto">
                    <MenuCard 
                        menu={menuItems} 
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                    />
                </div>
            </div>

            {orderItems.length > 0 && (
                <div className="flex flex-col h-full w-[40%] p-3 pb-30 bg-secondary rounded-l-lg shadow-md overflow-y-auto">
                    <h2 className="text-xl font-bold mt-3 text-[#B82132]">Current Order</h2>

                    <div className="flex flex-col gap-4">
                        {orderItems.map(item => (
                            <div key={`${item.id}-${item.quantity}`} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded" />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm font-semibold">₱{item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDecrement(item.id)}
                                        className="bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer hover:bg-gray-300"
                                    >-</button>
                                    <span className="font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => handleIncrement(item.id)}
                                        className="bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer hover:bg-gray-300"
                                    >+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 mb-3">
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                        <input
                            type="text"
                            id="discount"
                            min="0"
                            max="100"
                            value={discountPercent ?? ''}
                            onChange={handleDiscountChange}
                            className="w-full p-2 border border-gray-800 rounded cursor-pointer"
                        />
                    </div>

                    <div className="mt-4 p-4 bg-secondary rounded-lg text-sm">
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>₱{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Discount ({discountPercent || 0}%)</span>
                            <span>-₱{discountAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-2">
                            <span>Total</span>
                            <span>₱{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-4 mb-3">
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-2 border border-gray-800 rounded cursor-pointer"
                        >
                            <option value="Cash">Cash</option>
                            <option value="GCash">GCash</option>
                        </select>
                    </div>

                    <div className="mt-4 mb-3">
                        <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                        <input
                            type="text"
                            id="amountPaid"
                            min="0"
                            value={amountPaid}
                            onChange={handleAmountPaidChange}
                            className="w-full p-2 border border-gray-800 rounded cursor-pointer"
                        />
                    </div>

                    {amountPaid && (
                        <div className="flex justify-between font-bold text-lg mt-2 mb-4">
                            <span>Change</span>
                            <span>₱{change.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    )}

                    <button className="mt-2 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark cursor-pointer">
                        Proceed
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuList;
