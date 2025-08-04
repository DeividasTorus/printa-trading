import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaChartPie, FaHistory, FaCreditCard } from 'react-icons/fa'; // Example icons

const tabs = [
  { label: 'Dashboard', path: '/dashboard', icon: <FaChartBar /> },
  { label: 'Stats Overview', path: '/yearly-overview', icon: <FaChartPie /> },
  { label: 'Order History', path: '/order-history', icon: <FaHistory /> },
  { label: 'Billing Information', path: '/billing-info', icon: <FaCreditCard /> },
];

export default function NavigationTabs() {
  return (
    <>
      {/* Top nav bar (desktop & tablet only) */}
      <div className="bg-gray-50 border-b hidden md:flex justify-center">
        <ul className="flex space-x-10 text-sm font-medium text-gray-500 p-5">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `pb-3 border-b-2 transition ${
                    isActive
                      ? 'text-[#480090] border-none'
                      : 'border-transparent hover:text-gray-700'
                  }`
                }
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom nav bar (mobile only) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t shadow z-50">
        <ul className="flex justify-around text-xs text-gray-500 py-2">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center px-2 py-1 ${
                    isActive ? 'text-[#480090]' : 'text-gray-400'
                  }`
                }
              >
                <div className="text-lg mb-1">{tab.icon}</div>
                <span>{tab.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
