import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Stats Overview', path: '/yearly-overview' },
  { label: 'Order History', path: '/order-history' },
  { label: 'Billing Information', path: '/billing-info' },
];

export default function NavigationTabs() {
  return (
    <div className="bg-gray-50 border-b flex justify-center">
      <ul className="flex space-x-10 text-sm font-medium text-gray-500 p-5">
        {tabs.map((tab) => (
          <li key={tab.path}>
            <NavLink
              to={tab.path}
              className={({ isActive }) =>
                `pb-3 border-b-2 transition ${isActive
                  ? 'text-purple-600 border-purple-600'
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
  );
}
