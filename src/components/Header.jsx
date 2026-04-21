import React from 'react'
import { useTheme } from '../context/ThemeContext'

function Header({ search, setSearch }) {
  const { theme, setTheme } = useTheme()

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '1rem',
      borderBottom: '1px solid var(--border)',
      background: 'var(--header-bg)',
      color: 'var(--text)'
    }}>
      <h1 style={{ flex: 1, fontSize: '1.5rem', margin: 0 }}>Make Notes</h1>
      <select
        value={theme}
        onChange={e => setTheme(e.target.value)}
        style={{ padding: '0.25rem' }}
        aria-label="Theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
      <input
        type="text"
        placeholder="Search notes…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: '0.5rem', minWidth: '200px', color: 'var(--text)', background: 'var(--note-bg)', border: '1px solid var(--border)' }}
      />
    </header>
  )
}

export default Header