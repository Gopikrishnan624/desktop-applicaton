import React from 'react';
import { useStore } from '../hooks/useStore';
import './StatusBar.css';

const StatusBar: React.FC = () => {
  const { tabs, activeTabId } = useStore();
  const activeTab = tabs.find(t => t.id === activeTabId);

  let language = 'Plain Text';
  if (activeTab) {
    if (activeTab.name.endsWith('.js') || activeTab.name.endsWith('.jsx')) language = 'JavaScript';
    else if (activeTab.name.endsWith('.ts') || activeTab.name.endsWith('.tsx')) language = 'TypeScript';
    else if (activeTab.name.endsWith('.html')) language = 'HTML';
    else if (activeTab.name.endsWith('.css')) language = 'CSS';
    else if (activeTab.name.endsWith('.json')) language = 'JSON';
    else if (activeTab.name.endsWith('.md')) language = 'Markdown';
  }

  return (
    <div className="statusbar">
      <div className="statusbar-item">
        Ready
      </div>
      <div className="statusbar-spacer"></div>
      
      {activeTab && (
        <>
          <div className="statusbar-item">UTF-8</div>
          <div className="statusbar-item">CRLF</div>
          <div className="statusbar-item">{language}</div>
        </>
      )}
    </div>
  );
};

export default StatusBar;
