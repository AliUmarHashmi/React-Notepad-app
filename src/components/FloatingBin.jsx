import React from 'react'

function FloatingBin({ isActive, onDrop }) {
  return (
    <div
      id="floating-bin"
      onDragOver={e => { e.preventDefault(); }}
      onDrop={e => { e.preventDefault(); onDrop && onDrop(e); }}
      style={{
        position: 'fixed',
        right: 22,
        bottom: 18,
        zIndex: 9999,
        width: 82,
        height: 42,
        background: isActive ? '#e53935' : '#d32f2f',
        color: '#fff',
        borderRadius: '13px',
        boxShadow: isActive ? '0 8px 30px #e5393550' : '0 2px 14px #0003',
        border: isActive ? '2px solid #fff' : '2px solid #b71c1c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 16,
        transition: 'all 0.2s',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      🗑️ Bin
    </div>
  )
}

export default FloatingBin