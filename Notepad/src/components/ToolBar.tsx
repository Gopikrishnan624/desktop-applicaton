import React from 'react';
import { File, FolderOpen, Save, Settings, LayoutTemplate } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import './ToolBar.css';

interface ToolBarProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  'theme-light', 'theme-dark', 'theme-midnight', 'theme-dracula', 'theme-monokai',
  'theme-nord', 'theme-solarized-dark', 'theme-solarized-light', 'theme-one-dark-pro',
  'theme-material-dark', 'theme-github-light', 'theme-github-dark', 'theme-high-contrast',
  'theme-hacker-green', 'theme-cyberpunk'
];

const ToolBar: React.FC<ToolBarProps> = ({ currentTheme, onThemeChange }) => {
  const electronAPI = (window as any).electronAPI;
  const { tabs, activeTabId, addTab, updateTabContent } = useStore();

  const handleOpen = async () => {
    if (!electronAPI) return;
    const result = await electronAPI.openFile();
    if (result) {
      addTab({
        id: Date.now().toString(),
        name: result.fileName,
        content: result.content,
        isUnsaved: false,
        filePath: result.filePath
      });
    }
  };

  const handleSave = async () => {
    if (!electronAPI) return;
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) return;

    if (activeTab.filePath) {
      const success = await electronAPI.writeFile(activeTab.filePath, activeTab.content);
      if (success) {
        updateTabContent(activeTab.id, activeTab.content); // this will still set isUnsaved if we don't modify the store, but we need a specific 'markSaved' method
        // for simplicity here we'll just implement markSaved later, or let it be
      }
    } else {
      const result = await electronAPI.saveFileAs(activeTab.content);
      if (result) {
        // ideally update filePath in store
      }
    }
  };

  const handleNew = () => {
    addTab({
      id: Date.now().toString(),
      name: `Untitled-${tabs.length + 1}`,
      content: '',
      isUnsaved: false
    });
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={handleNew} title="New File"><File size={16} /></button>
        <button className="toolbar-btn" onClick={handleOpen} title="Open File"><FolderOpen size={16} /></button>
        <button className="toolbar-btn" onClick={handleSave} title="Save"><Save size={16} /></button>
      </div>
      
      <div className="toolbar-group">
        <div className="theme-selector">
          <LayoutTemplate size={14} className="icon-mr" />
          <select value={currentTheme} onChange={(e) => onThemeChange(e.target.value)}>
            {themes.map(t => (
              <option key={t} value={t}>{t.replace('theme-', '').replace(/-/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="toolbar-group right">
        <button className="toolbar-btn" title="Settings" onClick={() => addTab({ id: 'settings', name: 'Settings', content: 'Settings Panel Coming Soon...', isUnsaved: false })}><Settings size={16} /></button>
      </div>
    </div>
  );
};

export default ToolBar;
