import React, {createContext, useReducer, useEffect, useContext} from 'react'
import {nanoid } from 'nanoid'

const NotesContext= createContext()

const initialState = { notes: [] }

function notesReducer(state, action){
    switch(action.type){
        case 'INIT':
            return {... state, notes: action.payload}
        case 'ADD':
            return {...state, notes: [action.payload, ...state.notes] } 
        case 'UPDATE':
            return {
                ...state,
                notes: state.notes.map(n => (n.id === action.payload. id ? {... n, ...action.payload} : n))
            }
        case 'DELETE':
            return {
                ...state,
                notes: state.notes.map(n => (n.id === action.payload ?  {...n, deletedAt: Date.now()} : n))   
            }
        default: 
            return state
    }
}

export function NotesProvider({children}){
    const [state, dispatch] = useReducer(notesReducer, initialState)

    useEffect(() => {
        const raw = localStorage.getItem('notes-v1')
            if(raw){
                try{
                    dispatch({ type: 'INIT', payload: JSON.parse(raw) })
                }
                catch(e){
                    console.error('Failed to parse notes from localStorage', e)
                    dispatch({type: 'INIT', payload: []})
                }
            }
            else{
                const seed = [{
                    id: nanoid(),
                    title: 'Welcome',
                    contentMd: 'This is your first note. Edit or delete it.',
                    color: '#ffe066', 
                    tags: [],
                    pinned: false,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                }]
                dispatch({ type: 'INIT', payload: seed })
            }
    }, [])
      
    useEffect(() => {
        localStorage.setItem('notes-v1', JSON.stringify(state.notes)) 
    }, [state.notes])

    const addNote = (payload = {}) => {
        const note = {
            id: nanoid(),
            title: payload.title || 'Untitled',
            contentMd: payload.contentMd || '',
            color: payload.color || '',
            tags: payload.tags || [],
            pinned: false,
            createdAt: Date. now(),
            updatedAt: Date.now()
        }
        dispatch({ type: 'ADD', payload: note })
        return note
    }

    const updateNote = (id, patch) => dispatch({ type: 'UPDATE', payload: { id, ... patch } })
    const deleteNote = (id) => dispatch({ type: 'DELETE', payload: id })

    return(
        <NotesContext.Provider value={{ notes: state.notes, addNote, updateNote, deleteNote }}>
            {children}
        </NotesContext.Provider>
    )
}

export const useNotes = () => useContext(NotesContext)