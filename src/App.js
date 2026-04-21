import React, { useState, useRef, useCallback } from 'react'
import Header from './components/Header'
import NoteList from './components/NoteList'
import NoteEditorModal from './components/NoteEditorModal'
import ConfirmModal from './components/ConfirmModal'
import FloatingBin from './components/FloatingBin'
import { useNotes } from './context/NotesContext'

function App() {
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [search, setSearch] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState('add')
  const [editorNoteId, setEditorNoteId] = useState(null)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pendingEditorData, setPendingEditorData] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const lastNoteSnapshot = useRef({})
  const [hoveredNoteId, setHoveredNoteId] = useState(null)

  // For drag-to-bin
  const [draggingId, setDraggingId] = useState(null)
  const [binActive, setBinActive] = useState(false)

  // Filter notes for display
  const filteredNotes = notes.filter(note =>
    ! note.deletedAt &&
    (
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.contentMd.toLowerCase().includes(search.toLowerCase())
    )
  )

  // Find the note object for editing
  const editorNote = editorMode === 'edit'
    ? notes.find(n => n.id === editorNoteId)
    : null

  // Open Add Note modal
  const handleAddNote = () => {
    setEditorMode('add')
    setEditorNoteId(null)
    setEditorOpen(true)
    setUnsavedChanges(false)
    lastNoteSnapshot.current = { title: '', contentMd: '', color: '' }  // ✅ Set initial snapshot
  }

  // Open Edit Note modal
  const handleEditNote = (id) => {
    setEditorMode('edit')
    setEditorNoteId(id)
    setEditorOpen(true)
    setUnsavedChanges(false)
    const note = notes.find(n => n.id === id)
    lastNoteSnapshot.current = {
      title: note.title,
      contentMd: note. contentMd,
      color: note.color
    }
  }

  // ✅ NEW: Check if data actually changed from snapshot
  const handleEditorChange = useCallback((currentData) => {
    const hasChanges = 
      currentData.title !== lastNoteSnapshot.current.title ||
      currentData.contentMd !== lastNoteSnapshot.current. contentMd ||
      currentData.color !== lastNoteSnapshot. current.color

    setUnsavedChanges(hasChanges)
  }, [])

  // Save note data
  const handleSave = (data) => {
    if (editorMode === 'add') {
      addNote({
        title: data.title,
        contentMd: data.contentMd,
        color: data.color,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
    } else if (editorMode === 'edit' && editorNote) {
      updateNote(editorNote.id, {
        ... editorNote,
        ...data,
        updatedAt: Date. now()
      })
    }
    setEditorOpen(false)
    setUnsavedChanges(false)
  }

  // Discard changes (revert to snapshot)
  const handleDiscard = () => {
    setEditorOpen(false)
    setUnsavedChanges(false)
    setPendingEditorData(null)
  }

  // Delete note (after confirmation)
  const handleDelete = () => {
    if (pendingDeleteId) {
      deleteNote(pendingDeleteId)
      setPendingDeleteId(null)
    } else if (editorMode === 'edit' && editorNote) {
      deleteNote(editorNote. id)
    }
    setShowDeleteConfirm(false)
    setEditorOpen(false)
  }

  // Try closing editor (from background click or escape)
  const tryCloseEditor = (editorData) => {
    if (unsavedChanges) {
      setShowSaveConfirm(true)
      setPendingEditorData(editorData)
    } else {
      setEditorOpen(false)
    }
  }

  // Confirm modal when user tries to close modal with unsaved changes
  const handleSaveConfirm = (save) => {
    setShowSaveConfirm(false)
    if (save && pendingEditorData) {
      handleSave(pendingEditorData)
    } else {
      handleDiscard()
    }
    setPendingEditorData(null)
  }

  // Drag logic for bin
  const handleDragStart = (id, e) => {
    setDraggingId(id)
  }
  const handleDragEnd = (id, e) => {
    setDraggingId(null)
    setBinActive(false)
  }
  const handleBinEnter = () => {
    setBinActive(true)
  }
  const handleBinLeave = () => {
    setBinActive(false)
  }
  const handleBinDrop = (e) => {
    setBinActive(false)
    if (draggingId) {
      setPendingDeleteId(draggingId)
      setShowDeleteConfirm(true)
      setDraggingId(null)
    }
  }

  return (
    <div>
      <Header search={search} setSearch={setSearch} />
      <main style={{ padding: '2rem 0', minHeight: '100vh' }}>
        <div style={{
          background: 'var(--note-bg)',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
          margin: 'auto',
          maxWidth: 1100,
          padding: '2rem'
        }}>
          <button
            onClick={handleAddNote}
            style={{
              marginBottom: '1. 5rem',
              padding: '0.5rem 1. 2rem',
              background: 'var(--header-bg)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            + Add note
          </button>
          <NoteList
            notes={filteredNotes}
            onCardClick={handleEditNote}
            hoveredNoteId={hoveredNoteId}
            setHoveredNoteId={setHoveredNoteId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggingId={draggingId}
          />
        </div>
      </main>

      {/* Floating Bin */}
      <FloatingBin
        isActive={binActive}
        onDrop={handleBinDrop}
        onDragOver={handleBinEnter}
        onDragLeave={handleBinLeave}
      />

      {/* Note Editor Modal (Add/Edit) */}
      <NoteEditorModal
        open={editorOpen}
        mode={editorMode}
        initialNote={editorMode === "edit" && editorNote ?  editorNote : { title: "", contentMd: "", color: "" }}
        onSave={handleSave}
        onDiscard={() => {
          if (unsavedChanges) {
            setShowSaveConfirm(true)
            setPendingEditorData(lastNoteSnapshot.current)
          } else {
            handleDiscard()
          }
        }}
        onChange={handleEditorChange}  // ✅ Now passes current data
        onRequestClose={tryCloseEditor}
      />

      {/* Save Changes?  (when closing with unsaved changes) */}
      <ConfirmModal
        open={showSaveConfirm}
        title="Discard changes?"
        message="You made changes that will be lost unless you save.  Do you want to save them?"
        confirmText="Save"
        cancelText="Discard"
        onConfirm={() => handleSaveConfirm(true)}
        onCancel={() => handleSaveConfirm(false)}
      />

      {/* Delete Note Confirmation */}
      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete note?"
        message="Are you sure you want to delete this note?  This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteConfirm(false)
          setPendingDeleteId(null)
        }}
      />
    </div>
  )
}

export default App