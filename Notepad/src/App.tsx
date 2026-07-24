import { useEffect, useState } from 'react';
import TitleBar from './components/TitleBar';
import ToolBar from './components/ToolBar';
import SideBar from './components/SideBar';
import TabSystem from './components/TabSystem';
import MonacoWrapper from './editor/MonacoWrapper';
import StatusBar from './components/StatusBar';

function App() {
  const [theme, setTheme] = useState('theme-dark');

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="app-container">
      <TitleBar />
      <ToolBar currentTheme={theme} onThemeChange={setTheme} />
      <div className="main-content">
        <SideBar />
        <div className="flex-col flex-1">
          <TabSystem />
          <MonacoWrapper currentTheme={theme} />
        </div>
      </div>
      <StatusBar />
    </div>
  );
}

export default App;
