import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-black px-6 py-4 flex justify-between items-center">
      <div className="text-lg font-bold text-white">LOGO</div>
      <input type="text" placeholder="Search anything..." className="px-3 py-1 rounded text-sm w-1/3" />
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
    </nav>
  );
}