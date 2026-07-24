import React, { useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useStore } from '../hooks/useStore';
import '../components/StatusBar.css';

interface MonacoWrapperProps {
  currentTheme: string;
}

const MonacoWrapper: React.FC<MonacoWrapperProps> = ({ currentTheme }) => {
  const { tabs, activeTabId, updateTabContent, fontSize, wordWrap } = useStore();
  const monaco = useMonaco();
  
  const activeTab = tabs.find(t => t.id === activeTabId);

  useEffect(() => {
    if (monaco) {
      // Define a custom theme based on the current CSS variables if needed,
      // or simply map our themes to standard monaco themes: 'vs', 'vs-dark', 'hc-black'.
      // For a truly professional feel, we would dynamically parse CSS variables and create a Monaco theme.
      // For now, we approximate based on the theme name.
      const isDark = currentTheme !== 'theme-light' && currentTheme !== 'theme-github-light' && currentTheme !== 'theme-solarized-light';
      monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
    }
  }, [monaco, currentTheme]);

  if (!activeTab) {
    return (
      <div className="editor-empty-state">
        <div className="empty-logo">TexNotepad Pro</div>
        <div className="empty-shortcut">Ctrl+N to create a new file</div>
        <div className="empty-shortcut">Ctrl+O to open a file</div>
      </div>
    );
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateTabContent(activeTab.id, value);
    }
  };

  // Determine language based on file extension
  let language = 'plaintext';
  if (activeTab.name.endsWith('.js') || activeTab.name.endsWith('.jsx')) language = 'javascript';
  else if (activeTab.name.endsWith('.ts') || activeTab.name.endsWith('.tsx')) language = 'typescript';
  else if (activeTab.name.endsWith('.html')) language = 'html';
  else if (activeTab.name.endsWith('.css')) language = 'css';
  else if (activeTab.name.endsWith('.json')) language = 'json';
  else if (activeTab.name.endsWith('.md')) language = 'markdown';
  else if (activeTab.name.endsWith('.xml')) language = 'xml';
  else if (activeTab.name.endsWith('.py')) language = 'python';

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <Editor
        height="100%"
        language={language}
        value={activeTab.content}
        onChange={handleEditorChange}
        options={{
          fontSize: fontSize,
          wordWrap: wordWrap,
          minimap: { enabled: true },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          formatOnPaste: true,
          fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace",
          fontLigatures: true,
          renderWhitespace: 'selection',
        }}
      />
    </div>
  );
};

export default MonacoWrapper;
