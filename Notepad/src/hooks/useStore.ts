import { create } from 'zustand';

export interface Tab {
  id: string;
  name: string;
  content: string;
  isUnsaved: boolean;
  filePath?: string;
  language?: string;
}

interface StoreState {
  tabs: Tab[];
  activeTabId: string | null;
  sidebarOpen: boolean;
  fontSize: number;
  wordWrap: 'on' | 'off';
  addTab: (tab: Tab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;
  toggleSidebar: () => void;
  setFontSize: (size: number) => void;
  setWordWrap: (wrap: 'on' | 'off') => void;
}

export const useStore = create<StoreState>((set) => ({
  tabs: [{ id: '1', name: 'Untitled-1', content: '', isUnsaved: false }],
  activeTabId: '1',
  sidebarOpen: true,
  fontSize: 14,
  wordWrap: 'off',
  
  addTab: (tab) => set((state) => ({ 
    tabs: [...state.tabs, tab],
    activeTabId: tab.id
  })),
  
  closeTab: (id) => set((state) => {
    const newTabs = state.tabs.filter(t => t.id !== id);
    return {
      tabs: newTabs,
      activeTabId: state.activeTabId === id ? (newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null) : state.activeTabId
    };
  }),
  
  setActiveTab: (id) => set({ activeTabId: id }),
  
  updateTabContent: (id, content) => set((state) => ({
    tabs: state.tabs.map(t => t.id === id ? { ...t, content, isUnsaved: true } : t)
  })),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setFontSize: (size) => set({ fontSize: size }),
  setWordWrap: (wrap) => set({ wordWrap: wrap })
}));
