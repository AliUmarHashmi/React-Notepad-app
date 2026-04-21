import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { getContrastYIQ } from '../utils/colorUtils'

const COLORS = [
  { name: 'Yellow', value: '#ffe066' },
  { name: 'Orange', value: '#ffc971' },
  { name: 'Blue', value: '#5ec8e6' },
  { name: 'Red', value: '#ff7675' },
  { name: 'Green', value: '#55efc4' },
  { name: 'Pink', value: '#fab1a0' }
]

function NoteEditorModal({
  open,
  mode = "add",
  initialNote = { title: "", contentMd: "", color: "" },
  onSave,
  onDiscard,
  onChange,
  onRequestClose
}) {
  const [title, setTitle] = useState(initialNote.title || "")
  const [contentMd, setContentMd] = useState(initialNote.contentMd || "")
  const [color, setColor] = useState(initialNote.color || "")

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setTitle(initialNote.title || "")
      setContentMd(initialNote.contentMd || "")
      setColor(initialNote.color || "")
    }
  }, [open, initialNote. title, initialNote.contentMd, initialNote.color])

  // ✅ SIMPLER: Just notify parent on every change
  const notifyChange = (newTitle, newContent, newColor) => {
    if (onChange) {
      onChange({ 
        title: newTitle, 
        contentMd: newContent, 
        color: newColor 
      })
    }
  }

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    notifyChange(newTitle, contentMd, color)
  }

  const handleContentChange = (e) => {
    const newContent = e.target. value
    setContentMd(newContent)
    notifyChange(title, newContent, color)
  }

  const handleColorChange = (newColor) => {
    setColor(newColor)
    notifyChange(title, contentMd, newColor)
  }

  const handleDiscard = () => {
    setTitle(initialNote. title || "")
    setContentMd(initialNote.contentMd || "")
    setColor(initialNote.color || "")
    if (onDiscard) onDiscard()
  }

  const handleSave = () => {
    if (onSave) onSave({ title, contentMd, color })
  }

  return (
    <Modal open={open} onClose={() => onRequestClose({ title, contentMd, color })} width="520px" maxWidth="95vw">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}  // ✅ Use new handler
          placeholder="Title"
          autoFocus
          style={{
            fontSize: '1.3rem',
            fontWeight: 600,
            border: 'none',
            background: color || 'var(--background)',
            color: getContrastYIQ(color || '#fff'),
            padding: '0.5rem 0.5rem',
            borderRadius: '6px',
            transition: 'background 0.2s'  // ✅ Smooth color transition
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => handleColorChange(c.value)}  // ✅ Use new handler
              style={{
                width: 28,
                height: 28,
                background: c. value,
                border: color === c.value ? '3px solid #222' : '2px solid #ccc',
                borderRadius: '50%',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.15s',
                transform: color === c.value ? 'scale(1.2)' : 'scale(1)',
                boxShadow: color === c.value ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
              }}
              title={c.name}
              aria-label={`Select ${c.name} color`}
            />
          ))}
        </div>
        <textarea
          value={contentMd}
          onChange={handleContentChange}  // ✅ Use new handler
          placeholder="Note..."
          rows={8}
          style={{
            fontSize: '1rem',
            border: '1px solid #bbb',
            background: color || 'var(--note-bg)',
            color: getContrastYIQ(color || '#181818'),
            borderRadius: '6px',
            padding: '0.75rem',
            resize: 'vertical',
            minHeight: 120,
            transition: 'background 0.2s'  // ✅ Smooth color transition
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          marginTop: 8
        }}>
          <button
            onClick={handleDiscard}
            style={{
              background: '#d32f2f',
              border: 'none',
              color: '#fff',
              borderRadius: 6,
              padding: '0.5rem 1. 2rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.11)'
            }}
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            style={{
              background: color || 'var(--header-bg)',
              border: '1px solid #bbb',
              color: getContrastYIQ(color || '#181818'),
              borderRadius: 6,
              padding: '0.5rem 1.2rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default NoteEditorModal