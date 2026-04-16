import React from 'react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { icon: '🏠', label: 'Home', active: true, color: 'text-kreeda-orange' },
    { icon: '🎥', label: 'My Videos', active: false, color: 'text-gray-400' },
    { icon: '🎓', label: 'Coach Marketplace', active: false, color: 'text-gray-400' },
    { icon: '📅', label: 'My Sessions', active: false, color: 'text-gray-400' },
    { icon: '🤖', label: 'AI Coach', active: false, color: 'text-gray-400' },
  ];

  return (
    <div 
      className="fixed left-0 top-0 h-screen bg-[#1A1A1A] border-r border-gray-800 transition-all duration-300 z-40 w-16"
      data-testid="sidebar"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <img 
          src="https://customer-assets.emergentagent.com/job_performance-insights-15/artifacts/08oq0dtt_LogoForVC.png" 
          alt="Kreeda" 
          className="h-8 w-auto"
        />
      </div>

      {/* Menu Items */}
      <nav className="mt-6 px-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center justify-center p-3 rounded-lg mb-2 transition-all ${
              item.active 
                ? 'bg-kreeda-orange bg-opacity-20 text-kreeda-orange' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            data-testid={`sidebar-${item.label.toLowerCase().replace(' ', '-')}`}
            title={item.label}
          >
            <span className="text-2xl">{item.icon}</span>
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-8 left-0 right-0 px-2">
        <button
          className="w-full flex items-center justify-center p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          title="Help & Support"
        >
          <span className="text-2xl">❓</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;