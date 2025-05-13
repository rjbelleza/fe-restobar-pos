import MenuCard from "../components/MenuCard";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from '../api/axios';
import Snackbar from "./Snackbar";
import Loading from '../components/Loading';

const MenuList = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [discountPercent, setDiscountPercent] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [amountPaid, setAmountPaid] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [orderType, setOrderType] = useState('dine-in');
    const [proceedModal, setProceedModal] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [keyTrigger, setKeyTrigger] = useState(0);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [responseStatus, setResponseStatus] = useState('');
    const [focus, setFocus] = useState('main_dish');

    useEffect(() => {
        const fetchMenuItems = async () => {
            setLoading(true);
            try {
                const res = await api.get('/product/fetch', {
                    params: {
                        category: focus
                    }
                });
                setMenuItems(res.data || []);
            } catch (err) {
                setMessage(err.response?.data?.message || 'Failed to fetch menu items');
                setResponseStatus('error');
                setShowSnackbar(true);
            } finally {
                setLoading(false);
            }
        };
    
        fetchMenuItems();
    }, [focus, keyTrigger]);

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
        // Check if the item is available based on the track_stock flag
        const isAvailable = item.track_stock 
            ? item.stock > 0 
            : item.available_quantity > 0;
        
        if (!isAvailable) {
            setMessage('Item is out of stock');
            setResponseStatus('error');
            setShowSnackbar(true);
            return;
        }

        const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
        
        if (existingItem) {
            // Check quantity limits based on track_stock flag
            const maxQuantity = item.track_stock ? item.stock : item.available_quantity;
            
            if (existingItem.quantity >= maxQuantity) {
                setMessage(`Maximum quantity (${maxQuantity}) reached`);
                setResponseStatus('error');
                setShowSnackbar(true);
                return;
            }
            handleIncrement(item.id);
        } else {
            const newItem = {
                id: item.id,
                name: item.name,
                price: typeof item.price === 'string' ? parseFloat(item.price.replace('₱', '')) : item.price,
                quantity: 1,
                imagePath: item.imagePath
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

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        
        try {
            const orderData = {
                order_items: orderItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                discount_percent: discountPercent || 0,
                total_amount: total,
                amount_paid: parseFloat(amountPaid),
                payment_method: paymentMethod,
                order_type: orderType,
                change: change
            };

            const response = await api.post('/order/create', orderData);
            
            setMessage('Order submitted successfully!');
            setResponseStatus('success');
            setShowSnackbar(true);
            
            // Reset order form
            setOrderItems([]);
            setDiscountPercent(null);
            setAmountPaid('');
            setPaymentMethod('cash');
            setOrderType('dine-in');
            setKeyTrigger(prev => prev + 1);
            
            // Show thank you modal
            setProceedModal(true);
            setTimeout(() => {
                setProceedModal(false);
            }, 2000);
            
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to submit order');
            setResponseStatus('error');
            setShowSnackbar(true);
        }
    };

    return (
        <div className="flex w-full">

            {showSnackbar && (
              <Snackbar 
                message={message}
                type={responseStatus}
                onClose={() => setShowSnackbar(false)}
              />
            )}

            <div className="flex flex-col w-full">
                <div className="flex justify-between w-full">
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
                    <button 
                        onClick={() => setFocus('main_dish')}
                        className={`px-4 py-2 ${focus === 'main_dish' ? 'bg-primary text-white' : 'bg-secondary text-primary'} rounded-lg hover:bg-primary hover:text-white cursor-pointer`}
                    >Value Meal
                    </button>
                    <button 
                        onClick={() => setFocus('beverage')}
                        className={`px-4 py-2 ${focus === 'beverage' ? 'bg-primary text-white' : 'bg-secondary text-primary'} rounded-lg hover:bg-primary hover:text-white cursor-pointer`}
                    >Beverages
                    </button>
                    <button 
                        onClick={() => setFocus('dessert')}
                        className={`px-4 py-2 ${focus === 'dessert' ? 'bg-primary text-white' : 'bg-secondary text-primary'} rounded-lg hover:bg-primary hover:text-white cursor-pointer`}
                    >Desserts
                    </button>
                    <button 
                        onClick={() => setFocus('item')}
                        className={`px-4 py-2 ${focus === 'item' ? 'bg-primary text-white' : 'bg-secondary text-primary'} rounded-lg hover:bg-primary hover:text-white cursor-pointer`}
                    >Others
                    </button>
                </div>

                <div className="w-full pb-30 px-10 py-10 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100">
                    { loading ? <Loading />
                    : menuItems.length === 0 ? 'No Products available' 
                    : (<MenuCard 
                        menu={menuItems} 
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        trigger={orderItems}
                      />)
                    }
                </div>
            </div>

            {orderItems.length > 0 && (
                <form
                    onSubmit={handleSubmitOrder} 
                    className="flex flex-col h-full w-[40%] p-3 pb-30 bg-secondary rounded-l-lg shadow-md overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100">
                    <h2 className="text-xl font-bold mt-3 text-[#B82132]">Current Order</h2>

                    <div className="flex flex-col gap-4">
                        {orderItems.map(item => (
                            <div key={`${item.id}-${item.quantity}`} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img src={`http://localhost:8000/storage/${item.imagePath}`} alt={item.name} className="h-[52px] w-[56px] object-cover rounded" />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm font-semibold">₱{item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleDecrement(item.id)}
                                        className="bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer hover:bg-gray-300"
                                    >-</button>
                                    <span className="font-medium">{item.quantity}</span>
                                    <button
                                        type="button"
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
                        <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                        <select
                            id="orderType"
                            value={orderType}
                            onChange={(e) => setOrderType(e.target.value)}
                            className="w-full p-2 border border-gray-800 rounded cursor-pointer"
                        >
                            <option value="dine-in">Dine-in</option>
                            <option value="take-out">Take-out</option>
                        </select>
                    </div>

                    <div className="mt-4 mb-3">
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-2 border border-gray-800 rounded cursor-pointer"
                        >
                            <option value="cash">Cash</option>
                            <option value="gcash">GCash</option>
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

                    <button
                        type="submit"
                        disabled={amountPaid < total}
                        className={`mt-2 py-3 ${amountPaid < total ? 'bg-gray-300' : 'bg-primary hover:bg-mustard hover:text-black'} text-white font-bold rounded-lg cursor-pointer`}>
                        Proceed
                    </button>
                </form>
            )}

            <div 
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
                className={`fixed inset-0 flex items-center justify-center z-1000 transition-all duration-300 ${proceedModal ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div 
                    className={`w-fit bg-white px-10 py-10 rounded-sm shadow-lg transition-all duration-300 ${proceedModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                >
                    <div className="text-center">
                        <p className="text-[25px] font-medium text-primary">"Thank you for choosing us!"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuList;
