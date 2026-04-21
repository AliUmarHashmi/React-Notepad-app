import React, { useState } from 'react'
import { getContrastYIQ } from '../utils/colorUtils'

function NoteCard({ note, onClick, isBlurred, onMouseEnter, onMouseLeave, onDragStart, onDragEnd, draggingId }) {
  const accent = note.color || '#75cbf3ff'
  const textColor = getContrastYIQ(accent)
  const isDragging = draggingId === note.id
  const [isHovered, setIsHovered] = useState(false)  // ✅ Track hover state

  return (
    <div
      style={{
        // Base styles
        background: accent,
        color: textColor,
        border: `2px solid ${isHovered ? accent : accent}`,
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
        minHeight: 100,
        padding: '1. 2rem 1rem',
        borderRadius: '10px',
        outline: 'none',
        
        // ✅ Blur logic (other cards blur, but not if THIS card is hovered)
        filter: (isBlurred && !isHovered) ? 'blur(3px) brightness(0.9)' : 'none',
        
        // ✅ Transform: scale up when hovered, rotate when dragging
        transform: isDragging 
          ? 'scale(1.13) rotate(-2deg)' 
          : isHovered 
            ? 'scale(1.08)' 
            : 'scale(1)',
        
        // ✅ Shadow: bigger when hovered
        boxShadow: isHovered
          ? `0 8px 28px ${accent}33`
          : isDragging 
            ? '0 12px 44px rgba(229, 57, 53, 0.3)' 
            : '0 2px 10px rgba(0, 0, 0, 0.04)',
        
        // Z-index: dragging > hovered > normal > blurred
        zIndex: isDragging ? 99 : isHovered ? 3 : isBlurred ? 1 : 2,
        
        // Smooth transitions
        transition: 'all 0.25s cubic-bezier(0. 34, 1.56, 0.64, 1)',
      }}
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true)  // ✅ Set hover state
        onMouseEnter()      // ✅ Still call parent handler
      }}
      onMouseLeave={() => {
        setIsHovered(false)  // ✅ Unset hover state
        onMouseLeave()       // ✅ Still call parent handler
      }}
      onKeyDown={e => { if (e.key === 'Enter') onClick() }}
      draggable
      onDragStart={e => onDragStart && onDragStart(note.id, e)}
      onDragEnd={e => onDragEnd && onDragEnd(note. id, e)}
    >
      <h2 style={{
        fontWeight: 700,
        margin: 0,
        marginBottom: 8,
        fontSize: '1.15rem',
      }}>
        {note.title || <span style={{ opacity: 0.6 }}>Untitled</span>}
      </h2>
      <div style={{
        fontSize: 15,
        opacity: 0.8,
        marginBottom: 10,
      }}>
        {note.contentMd. slice(0, 70) || <span style={{ opacity: 0.6 }}>(No content)</span>}
        {note.contentMd.length > 70 && '…'}
      </div>
      <div style={{
        fontSize: 12,
        opacity: 0.7
      }}>
        {note. updatedAt
          ? new Date(note.updatedAt).toLocaleString()
          : new Date(note.createdAt). toLocaleString()}
      </div>
    </div>
  )
}

export default NoteCard