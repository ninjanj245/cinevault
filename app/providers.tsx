"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  name: string
  isLoggedIn: boolean
}

type FilmDatabaseContextType = {
  user: User
  login: (name: string, password: string, remember?: boolean) => void
  logout: () => void
}

const FilmDatabaseContext = createContext<FilmDatabaseContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ name: "", isLoggedIn: false })

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("filmDbUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (name: string, password: string, remember = false) => {
    // In a real app, you would validate credentials against a backend
    const newUser = { name, isLoggedIn: true }
    setUser(newUser)
    if (remember) {
      localStorage.setItem("filmDbUser", JSON.stringify(newUser))
    }
  }

  const logout = () => {
    setUser({ name: "", isLoggedIn: false })
    localStorage.removeItem("filmDbUser")
  }

  return <FilmDatabaseContext.Provider value={{ user, login, logout }}>{children}</FilmDatabaseContext.Provider>
}

export function useFilmDatabase() {
  const context = useContext(FilmDatabaseContext)
  if (context === undefined) {
    throw new Error("useFilmDatabase must be used within a FilmDatabaseProvider")
  }
  return context
}

