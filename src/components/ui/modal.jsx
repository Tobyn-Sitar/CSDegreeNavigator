"use client"; // Ensure this is a client component

import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // If modal is not open, don't render anything

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            {/* Modal Content */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-[400px] relative">
                {/* Close Button */}
                <button
                    className="absolute -top-4 -right-4 bg-white text-[#5A1F58] hover:text-[#5A1F58] 
               dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 
               shadow-lg p-2 rounded-full transition-transform transform hover:scale-110"
                    onClick={onClose}
                >
                    <span className="text-xl font-bold">✖</span>
                </button>



                {/* Modal Content */}
                {children}
            </div>
        </div>
    );
};

export default Modal;
