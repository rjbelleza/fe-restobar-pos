import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const { logout } = useAuth();

    const handleLogoutClick = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); // Redirect only if logout is successful
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
    };

    const cancelLogout = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className="w-screen h-[70px] bg-primary p-[20px] flex items-center justify-between">
                <h1 className="text-[20px] font-bold ml-[30px] text-white cursor-pointer">Nuna's Restobar</h1>
                <Link to="/" onClick={handleLogoutClick}>
                    <h1 className="text-white mr-[30px] cursor-pointer">Logout</h1>
                </Link>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black opacity-95 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[300px]">
                        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
                        <p className="mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelLogout}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
