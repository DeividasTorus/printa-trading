import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-zinc-900 px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-white font-semibold text-lg">LOGO</div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 relative" ref={dropdownRef}>
        {/* Search Input */}
        <div className="relative w-64 mx-10">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-zinc-800 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
          />
        </div>

        {/* Profile Image */}
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        {/* Dropdown Toggle Icon */}
        <FiChevronDown
          className="text-white cursor-pointer w-5 h-5"
          onClick={() => setIsOpen(!isOpen)}
        />

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-12 right-0 bg-zinc-800 text-white shadow-md rounded-md py-2 w-40 z-50">
            <button className="block w-full text-left px-4 py-2 hover:bg-zinc-700">Profile</button>
            <button className="block w-full text-left px-4 py-2 hover:bg-zinc-700">Settings</button>
            <button className="block w-full text-left px-4 py-2 hover:bg-zinc-700">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}


