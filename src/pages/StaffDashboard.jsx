import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import { useState, useEffect } from "react";

const label = [
    { menu: 'Menu', path: '/staffDashboard' },
    { menu: 'Inventory', path: '/staffInventory' },
    { menu: 'Order History', path: '/stafforderHistory' },
];

const itemsData = [
    { id: 1, itemName: 'Sizzling Pork Sisig', image: 'src/images/sizzlingpork.png', price: '₱79.00' },
    { id: 2, itemName: 'Sizzling Pork Chop', image: 'src/images/sizzlingporkchop.png', price: '₱79.00' },
    { id: 3, itemName: 'Sizzling Fried Chicken', image: 'src/images/javarice-friedchicken.png', price: '₱69.00' },
    { id: 4, itemName: 'Beef Pares', image: 'src/images/beefpares.png', price: '₱79.00' },
];

const user = [
    { id: 1, name: 'Rolyn Jane Tacastacas', email: "chidrosafoodservices@gmail.com", username: "rolynjane", password: "password", role: 'admin' },
    { id: 2, name: 'Rey Lois Baer', email: 'reylois.baer1@gmail.com', username: 'reylois', password: 'password', role: 'cashier' },
];

const StaffDashboard = () => {
    const [currentUser, setCurrentUser] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [discountPercent, setDiscountPercent] = useState(0);

    useEffect(() => {
        const cashier = user.find(u => u.role === "cashier");
        if (cashier) {
            setCurrentUser([{ id: cashier.id, name: cashier.name, email: cashier.email, role: cashier.role }]);
        }
    }, []);

    const calculateSubtotal = () => {
        return orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    const handleIncrement = (id) => {
        setOrderItems(orderItems.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
    };

    const handleDecrement = (id) => {
        setOrderItems(orderItems.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0));
    };

    const handleAddItem = (item) => {
        const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
        if (existingItem) {
            setOrderItems(orderItems.map(orderItem => orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem));
        } else {
            setOrderItems([...orderItems, { id: item.id, name: item.itemName, price: parseFloat(item.price.replace('₱', '')), quantity: 1, image: item.image }]);
        }
    };

    const subtotal = calculateSubtotal();
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;

    return (
        <div className="flex flex-col h-screen w-screen">
            <Header />
            <div className="flex h-full w-full mt-1">
                <AdminSidemenu user={currentUser} label={label} />
                <div className="flex flex-col gap-5 w-full pr-10 overflow-auto">
                    <Breadcrumb currentMenu="MENU" />
                    <div className="h-full w-90% grid grid-rows-4 gap-1 ml-4 overflow-auto">
                        <MenuCard menu={itemsData} onAddItem={handleAddItem} />
                    </div>
                </div>
                {orderItems.length > 0 && (
                    <div className="flex flex-col justify-between w-30% p-3 bg-secondary rounded-l-lg shadow-md">
                        <h2 className="text-xl font-bold mt-3 text-[#B82132]">Current Order</h2>
                        <div className="flex flex-col gap-4 overflow-auto">
                            {orderItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded" />
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm font-semibold">₱{item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleDecrement(item.id)} className="bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer">-</button>
                                        <span className="font-medium">{item.quantity}</span>
                                        <button onClick={() => handleIncrement(item.id)} className="bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 mb-5">
                            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                            <select id="discount" value={discountPercent} onChange={(e) => setDiscountPercent(parseInt(e.target.value))} className="w-full p-2 border border-gray-800 rounded cursor-pointer">
                                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(value => <option key={value} value={value}>{value}%</option>)}
                            </select>
                        </div>
                        <div className="mt-4 p-4 bg-secondary rounded-lg text-sm">
                            <div className="flex justify-between mb-2"><span>Subtotal</span><span>₱{subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between mb-2"><span>Discount ({discountPercent}%)</span><span>-₱{discountAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>₱{total.toFixed(2)}</span></div>
                        </div>
                        <button className="mt-2 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark cursor-pointer">Proceed</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;
