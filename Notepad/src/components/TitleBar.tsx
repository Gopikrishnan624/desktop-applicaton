import React, { useState } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import MenuDropdown, { MenuItem } from './MenuDropdown';
import './TitleBar.css';

const TitleBar: React.FC = () => {
  const electronAPI = (window as any).electronAPI;
  const { tabs, activeTabId, addTab, updateTabContent, toggleSidebar, setWordWrap, wordWrap } = useStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeMenu = () => setOpenMenu(null);

  const handleNew = () => {
    addTab({
      id: Date.now().toString(),
      name: `Untitled-${tabs.length + 1}`,
      content: '',
      isUnsaved: false
    });
  };

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
        updateTabContent(activeTab.id, activeTab.content);
      }
    } else {
      const result = await electronAPI.saveFileAs(activeTab.content);
      if (result) {
        // ideally update filePath in store
      }
    }
  };

  const fileMenu: MenuItem[] = [
    { label: 'New File', shortcut: 'Ctrl+N', onClick: handleNew },
    { label: 'Open File...', shortcut: 'Ctrl+O', onClick: handleOpen },
    { label: 'Save', shortcut: 'Ctrl+S', onClick: handleSave },
    { divider: true },
    { label: 'Exit', onClick: () => electronAPI?.close() }
  ];

  const editMenu: MenuItem[] = [
    { label: 'Undo', shortcut: 'Ctrl+Z' },
    { label: 'Redo', shortcut: 'Ctrl+Y' },
    { divider: true },
    { label: 'Cut', shortcut: 'Ctrl+X' },
    { label: 'Copy', shortcut: 'Ctrl+C' },
    { label: 'Paste', shortcut: 'Ctrl+V' }
  ];

  const viewMenu: MenuItem[] = [
    { label: 'Toggle Sidebar', onClick: toggleSidebar },
    { label: 'Toggle Word Wrap', onClick: () => setWordWrap(wordWrap === 'on' ? 'off' : 'on') }
  ];

  const helpMenu: MenuItem[] = [
    { label: 'About TexNotepad Pro' }
  ];

  return (
    <div className="titlebar">
      <div className="titlebar-drag-region"></div>
      <div className="titlebar-logo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>
      <div className="titlebar-menu">
        <MenuDropdown label="File" items={fileMenu} isOpen={openMenu === 'File'} onToggle={() => toggleMenu('File')} onClose={closeMenu} />
        <MenuDropdown label="Edit" items={editMenu} isOpen={openMenu === 'Edit'} onToggle={() => toggleMenu('Edit')} onClose={closeMenu} />
        <MenuDropdown label="View" items={viewMenu} isOpen={openMenu === 'View'} onToggle={() => toggleMenu('View')} onClose={closeMenu} />
        <MenuDropdown label="Help" items={helpMenu} isOpen={openMenu === 'Help'} onToggle={() => toggleMenu('Help')} onClose={closeMenu} />
      </div>
      <div className="titlebar-title">TexNotepad Pro</div>
      <div className="titlebar-controls">
        <div className="control-button minimize" onClick={() => electronAPI?.minimize()}>
          <Minus size={16} />
        </div>
        <div className="control-button maximize" onClick={() => electronAPI?.maximize()}>
          <Square size={14} />
        </div>
        <div className="control-button close" onClick={() => electronAPI?.close()}>
          <X size={16} />
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
