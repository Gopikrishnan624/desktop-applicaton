import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import './TabSystem.css';

const TabSystem: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, closeTab } = useStore();

  return (
    <div className="tab-system">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTabId === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="tab-name">{tab.name}</div>
            <div className="tab-actions">
              {tab.isUnsaved && <div className="tab-unsaved-dot"></div>}
              <div
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <X size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabSystem;
