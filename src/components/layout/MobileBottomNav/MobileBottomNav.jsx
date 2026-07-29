import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdExplore, MdCalendarMonth, MdPerson, MdContentCut, MdPeople } from 'react-icons/md';

const TABS = [
  { label: 'Explore', to: '/', icon: MdExplore },
  { label: 'Services', to: '/services', icon: MdContentCut },
  { label: 'Stylists', to: '/stylists', icon: MdPeople },
  { label: 'Book', to: '/salons/nearby', icon: MdCalendarMonth },
  { label: 'Profile', to: '/profile', icon: MdPerson },
];

export default function MobileBottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-2xl border-t border-primary/10 z-50 flex justify-around items-center px-md">
      {TABS.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={label}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-xs relative ${
              isActive ? 'text-primary' : 'text-on-surface-variant'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute -top-1 w-1 h-1 rounded-full bg-primary" />
              )}
              <Icon className="text-2xl" />
              <span className="text-[10px] font-bold">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
