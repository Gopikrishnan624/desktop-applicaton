import React, { useRef, useEffect } from 'react';
import './MenuDropdown.css';

export interface MenuItem {
  label?: string;
  shortcut?: string;
  divider?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

interface MenuDropdownProps {
  label: string;
  items: MenuItem[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ label, items, isOpen, onToggle, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="menu-dropdown-container" ref={menuRef}>
      <div 
        className={`menu-item ${isOpen ? 'active' : ''}`} 
        onClick={onToggle}
      >
        {label}
      </div>
      {isOpen && (
        <div className="menu-dropdown-panel">
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="menu-dropdown-divider"></div>;
            }
            return (
              <div 
                key={index} 
                className={`menu-dropdown-item ${item.disabled ? 'disabled' : ''}`}
                onClick={() => {
                  if (!item.disabled && item.onClick) {
                    item.onClick();
                    onClose();
                  }
                }}
              >
                <span className="menu-dropdown-label">{item.label}</span>
                {item.shortcut && <span className="menu-dropdown-shortcut">{item.shortcut}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
