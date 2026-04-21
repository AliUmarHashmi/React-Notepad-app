import React, { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext= createContext();

export function ThemeProvider({ children }){
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system')

    useEffect(() =>{
        const applied = theme === 'system'
        ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme
        
        document.documentElement.setAttribute('data-theme', applied)
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <ThemeContext.Provider value = {{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)