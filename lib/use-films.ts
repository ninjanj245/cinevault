"use client"

import { useState, useEffect } from "react"
import type { Film, Stats } from "./types"

// Mock data for demonstration
const initialFilms: Film[] = [
  {
    id: "1",
    title: "Night of the Living Dead",
    director: "George A. Romero",
    actors: "Duane Jones, Judith O'Dea",
    genre: "Horror",
    idNumber: "001",
    year: "1968",
    tags: "zombie,classic,black and white",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/film%20card%20modal.jpg-uTa3i4rO9FGEnWoR5AreZlVdef2ekd.jpeg",
    dateAdded: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "The Godfather",
    director: "Francis Ford Coppola",
    actors: "Marlon Brando, Al Pacino",
    genre: "Crime",
    idNumber: "002",
    year: "1972",
    tags: "mafia,classic,drama",
    imageUrl: "/placeholder.svg?height=300&width=300",
    dateAdded: "2023-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    actors: "John Travolta, Uma Thurman",
    genre: "Crime",
    idNumber: "003",
    year: "1994",
    tags: "crime,classic,tarantino",
    imageUrl: "/placeholder.svg?height=300&width=300",
    dateAdded: "2023-01-03T00:00:00.000Z",
  },
  {
    id: "4",
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    actors: "Tim Robbins, Morgan Freeman",
    genre: "Drama",
    idNumber: "004",
    year: "1994",
    tags: "prison,drama,classic",
    imageUrl: "/placeholder.svg?height=300&width=300",
    dateAdded: "2023-01-04T00:00:00.000Z",
  },
  {
    id: "5",
    title: "The Dark Knight",
    director: "Christopher Nolan",
    actors: "Christian Bale, Heath Ledger",
    genre: "Action",
    idNumber: "005",
    year: "2008",
    tags: "superhero,batman,nolan",
    imageUrl: "/placeholder.svg?height=300&width=300",
    dateAdded: "2023-01-05T00:00:00.000Z",
  },
]

// Mock Dropbox functions (replace with actual implementation)
const isDropboxAuthenticated = () => {
  // Replace with your actual Dropbox authentication check
  return false
}

const loadFilmsFromDropbox = async () => {
  // Replace with your actual Dropbox data loading logic
  return null
}

const saveFilmsToDropbox = async (films: Film[]) => {
  // Replace with your actual Dropbox data saving logic
}

const loadLastSearchedFromDropbox = async () => {
  // Replace with your actual Dropbox data loading logic
  return null
}

const saveLastSearchedToDropbox = async (lastSearched: Film[]) => {
  // Replace with your actual Dropbox data saving logic
}

const loadLastAddedFromDropbox = async () => {
  // Replace with your actual Dropbox data loading logic
  return null
}

const saveLastAddedToDropbox = async (lastAdded: Film[]) => {
  // Replace with your actual Dropbox data saving logic
}

export function useFilms() {
  const [films, setFilms] = useState<Film[]>([])
  const [lastSearched, setLastSearched] = useState<Film[]>([])
  const [lastAdded, setLastAdded] = useState<Film[]>([])
  const [stats, setStats] = useState<Stats>({
    totalFilms: 0,
    daysSinceLastAdded: 0,
  })

  // Initialize with data from localStorage or Dropbox
  useEffect(() => {
    const loadData = async () => {
      // First check if we're authenticated with Dropbox
      const isDropboxAuth = isDropboxAuthenticated()

      if (isDropboxAuth) {
        try {
          // Try to load from Dropbox first
          const dropboxFilms = await loadFilmsFromDropbox()
          if (dropboxFilms) {
            setFilms(dropboxFilms)
          } else {
            // If no Dropbox data, fall back to localStorage
            const storedFilms = localStorage.getItem("films")
            if (storedFilms) {
              setFilms(JSON.parse(storedFilms))
              // Also save to Dropbox for future use
              saveFilmsToDropbox(JSON.parse(storedFilms))
            } else {
              setFilms(initialFilms)
              localStorage.setItem("films", JSON.stringify(initialFilms))
              saveFilmsToDropbox(initialFilms)
            }
          }

          // Load last searched from Dropbox
          const dropboxLastSearched = await loadLastSearchedFromDropbox()
          if (dropboxLastSearched) {
            setLastSearched(dropboxLastSearched)
          } else {
            const storedLastSearched = localStorage.getItem("lastSearched")
            if (storedLastSearched) {
              setLastSearched(JSON.parse(storedLastSearched))
              saveLastSearchedToDropbox(JSON.parse(storedLastSearched))
            }
          }

          // Load last added from Dropbox
          const dropboxLastAdded = await loadLastAddedFromDropbox()
          if (dropboxLastAdded) {
            setLastAdded(dropboxLastAdded)
          } else {
            const storedLastAdded = localStorage.getItem("lastAdded")
            if (storedLastAdded) {
              setLastAdded(JSON.parse(storedLastAdded))
              saveLastAddedToDropbox(JSON.parse(storedLastAdded))
            }
          }
        } catch (error) {
          console.error("Error loading data from Dropbox:", error)
          // Fall back to localStorage
          loadFromLocalStorage()
        }
      } else {
        // Not authenticated with Dropbox, use localStorage
        loadFromLocalStorage()
      }
    }

    const loadFromLocalStorage = () => {
      const storedFilms = localStorage.getItem("films")
      if (storedFilms) {
        setFilms(JSON.parse(storedFilms))
      } else {
        setFilms(initialFilms)
        localStorage.setItem("films", JSON.stringify(initialFilms))
      }

      const storedLastSearched = localStorage.getItem("lastSearched")
      if (storedLastSearched) {
        setLastSearched(JSON.parse(storedLastSearched))
      }

      const storedLastAdded = localStorage.getItem("lastAdded")
      if (storedLastAdded) {
        setLastAdded(JSON.parse(storedLastAdded))
      }
    }

    loadData()
  }, [])

  // Update stats whenever films change
  useEffect(() => {
    if (films.length === 0) return

    // Calculate days since last added
    const dates = films.map((film) => new Date(film.dateAdded).getTime())
    const mostRecent = new Date(Math.max(...dates))
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - mostRecent.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    setStats({
      totalFilms: films.length,
      daysSinceLastAdded: diffDays,
    })

    // Update last added
    const sortedByDate = [...films].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    setLastAdded(sortedByDate.slice(0, 5))
    localStorage.setItem("lastAdded", JSON.stringify(sortedByDate.slice(0, 5)))

    // If connected to Dropbox, also save there
    if (isDropboxAuthenticated()) {
      saveLastAddedToDropbox(sortedByDate.slice(0, 5))
    }
  }, [films])

  const addFilm = (filmData: Omit<Film, "id" | "dateAdded">) => {
    const newFilm: Film = {
      ...filmData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
    }

    const updatedFilms = [newFilm, ...films]
    setFilms(updatedFilms)
    localStorage.setItem("films", JSON.stringify(updatedFilms))

    // Sync with Dropbox if connected
    if (isDropboxAuthenticated()) {
      saveFilmsToDropbox(updatedFilms)
    }

    // Update last added
    const newLastAdded = [newFilm, ...lastAdded].slice(0, 5)
    setLastAdded(newLastAdded)
    localStorage.setItem("lastAdded", JSON.stringify(newLastAdded))

    // Sync last added with Dropbox if connected
    if (isDropboxAuthenticated()) {
      saveLastAddedToDropbox(newLastAdded)
    }
  }

  const addFilms = (filmsData: Omit<Film, "id" | "dateAdded">[]) => {
    const newFilms = filmsData.map((filmData) => ({
      ...filmData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString(),
    }))

    const updatedFilms = [...newFilms, ...films]
    setFilms(updatedFilms)
    localStorage.setItem("films", JSON.stringify(updatedFilms))

    // Sync with Dropbox if connected
    if (isDropboxAuthenticated()) {
      saveFilmsToDropbox(updatedFilms)
    }

    // Update last added
    const newLastAdded = [...newFilms, ...lastAdded].slice(0, 5)
    setLastAdded(newLastAdded)
    localStorage.setItem("lastAdded", JSON.stringify(newLastAdded))

    // Sync last added with Dropbox if connected
    if (isDropboxAuthenticated()) {
      saveLastAddedToDropbox(newLastAdded)
    }
  }

  const deleteFilm = (id: string) => {
    const updatedFilms = films.filter((film) => film.id !== id)
    setFilms(updatedFilms)
    localStorage.setItem("films", JSON.stringify(updatedFilms))

    // Sync with Dropbox if connected
    if (isDropboxAuthenticated()) {
      saveFilmsToDropbox(updatedFilms)
    }

    // Update last added and last searched
    const updatedLastAdded = lastAdded.filter((film) => film.id !== id)
    const updatedLastSearched = lastSearched.filter((film) => film.id !== id)

    setLastAdded(updatedLastAdded)
    setLastSearched(updatedLastSearched)

    localStorage.setItem("lastAdded", JSON.stringify(updatedLastAdded))
    localStorage.setItem("lastSearched", JSON.stringify(updatedLastSearched))

    // Sync with Dropbox if connected
    if (isDropboxAuthenticated()) {
      saveLastAddedToDropbox(updatedLastAdded)
      saveLastSearchedToDropbox(updatedLastSearched)
    }
  }

  const searchFilms = (term: string) => {
    if (!term.trim()) return []

    const results = films.filter((film) => {
      const searchableText = `${film.title} ${film.director} ${film.actors} ${film.genre} ${film.tags}`.toLowerCase()
      return searchableText.includes(term.toLowerCase())
    })

    // Update last searched
    const newLastSearched = [...results, ...lastSearched]
      .filter((film, index, self) => self.findIndex((f) => f.id === film.id) === index)
      .slice(0, 5)

    setLastSearched(newLastSearched)
    localStorage.setItem("lastSearched", JSON.stringify(newLastSearched))

    // Sync with Dropbox if connected
    if (isDropboxAuthenticated()) {
      saveLastSearchedToDropbox(newLastSearched)
    }

    return results
  }

  return {
    films,
    lastSearched,
    lastAdded,
    stats,
    addFilm,
    addFilms,
    deleteFilm,
    searchFilms,
  }
}

