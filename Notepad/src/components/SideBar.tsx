import React, { useState } from 'react';
import { Files, Search, Bookmark, ChevronRight } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import './SideBar.css';

const SideBar: React.FC = () => {
  const { sidebarOpen, tabs, activeTabId, setActiveTab } = useStore();
  const [activeView, setActiveView] = useState<'explorer' | 'search' | 'bookmarks'>('explorer');

  if (!sidebarOpen) return null;

  return (
    <div className="sidebar">
      <div className="sidebar-icons">
        <div 
          className={`sidebar-icon ${activeView === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveView('explorer')}
        >
          <Files size={20} />
        </div>
        <div 
          className={`sidebar-icon ${activeView === 'search' ? 'active' : ''}`}
          onClick={() => setActiveView('search')}
        >
          <Search size={20} />
        </div>
        <div 
          className={`sidebar-icon ${activeView === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveView('bookmarks')}
        >
          <Bookmark size={20} />
        </div>
      </div>
      <div className="sidebar-content">
        {activeView === 'explorer' && (
          <>
            <div className="sidebar-header">EXPLORER</div>
            <div className="sidebar-section">
              <div className="sidebar-section-title">
                <ChevronRight size={14} />
                <span>OPEN EDITORS</span>
              </div>
              <div className="sidebar-list">
                {tabs.map(tab => (
                  <div 
                    key={tab.id} 
                    className={`sidebar-list-item ${activeTabId === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="file-icon">{/* placeholder for language icon */}</div>
                    <span className="file-name">{tab.name}</span>
                    {tab.isUnsaved && <span className="unsaved-dot"></span>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {activeView === 'search' && (
          <>
            <div className="sidebar-header">SEARCH</div>
            <div className="sidebar-section" style={{ padding: '0 10px' }}>
              <input 
                type="text" 
                placeholder="Search" 
                style={{
                  width: '100%', padding: '4px', background: 'var(--hover-bg, #333)', 
                  border: '1px solid var(--border-color, #444)', color: 'inherit',
                  outline: 'none', marginTop: '10px'
                }}
              />
              <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '10px' }}>
                Search functionality coming soon.
              </p>
            </div>
          </>
        )}
        {activeView === 'bookmarks' && (
          <>
            <div className="sidebar-header">BOOKMARKS</div>
            <div className="sidebar-section" style={{ padding: '0 10px' }}>
              <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '10px' }}>
                No bookmarks found.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SideBar;
