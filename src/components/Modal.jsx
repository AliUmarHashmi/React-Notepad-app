import React from 'react'

function Modal({ open, onClose, children, width = "500px", maxWidth = "90vw" }) {
  // Always run the hook, but only set overflow when open!
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 1000,
        top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(30,30,30,0.28)',
        backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s'
      }}
      onMouseDown={e => {
        if (e.target === e.currentTarget && onClose) onClose()
      }}
    >
      <div
        style={{
          background: 'var(--note-bg)',
          borderRadius: '14px',
          boxShadow: '0 6px 32px rgba(0,0,0,0.13)',
          padding: '2rem 1.5rem',
          minWidth: '280px',
          width: width,
          maxWidth: maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal