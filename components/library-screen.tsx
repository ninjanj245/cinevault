"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NavigationBar from "@/components/navigation-bar"
import { useFilms } from "@/lib/use-films"
import type { Film } from "@/lib/types"
import FilmModal from "@/components/film-modal"
import FilmGridItem from "@/components/film-grid-item"
import FilmListItem from "@/components/film-list-item"

type ViewMode = "grid" | "list"
type SortOption =
  | "title"
  | "titleDesc"
  | "year"
  | "yearDesc"
  | "genre"
  | "idNumber"
  | "idNumberDesc"
  | "dateAdded"
  | "dateAddedDesc"

export default function LibraryScreen() {
  const router = useRouter()
  const { films } = useFilms()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortOption>("title")
  const [filterGenre, setFilterGenre] = useState<string>("")
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (viewMode === "list") {
      setSortBy("title")
    }
  }, [viewMode])

  // Get unique genres for filter dropdown
  const genres = [...new Set(films.map((film) => film.genre).filter(Boolean))]

  // Sort and filter films
  const sortedAndFilteredFilms = [...films]
    .filter((film) => filterGenre === "all" || !filterGenre || film.genre === filterGenre)
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "titleDesc":
          return b.title.localeCompare(a.title)
        case "year":
          return (a.year || "0").localeCompare(b.year || "0")
        case "yearDesc":
          return (b.year || "0").localeCompare(a.year || "0")
        case "genre":
          return (a.genre || "").localeCompare(b.genre || "")
        case "idNumber":
          return (a.idNumber || "0").localeCompare(b.idNumber || "0")
        case "idNumberDesc":
          return (b.idNumber || "0").localeCompare(a.idNumber || "0")
        case "dateAdded":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        case "dateAddedDesc":
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        default:
          return 0
      }
    })

  // Group films by first letter
  const groupedFilms = sortedAndFilteredFilms.reduce((acc, film) => {
    const firstLetter = film.title[0].toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(film)
    return acc
  }, {} as Record<string, Film[]>)

  const handleFilmClick = (film: Film) => {
    setSelectedFilm(film)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button onClick={() => router.back()} className="mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold">Library</h1>
        </div>

        <div className="mb-6">
          <Input placeholder="Search in library" className="h-14 pl-4 pr-14 rounded-full" />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Filter by Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="titleDesc">Title (Z-A)</SelectItem>
                <SelectItem value="year">Year (Oldest)</SelectItem>
                <SelectItem value="yearDesc">Year (Newest)</SelectItem>
                <SelectItem value="idNumber">ID (Ascending)</SelectItem>
                <SelectItem value="idNumberDesc">ID (Descending)</SelectItem>
                <SelectItem value="dateAdded">Recently Added</SelectItem>
                <SelectItem value="dateAddedDesc">Oldest Added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {sortedAndFilteredFilms.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-4"}>
            {viewMode === "list" ? (
              Object.entries(groupedFilms).map(([letter, films]) => (
                <div key={letter}>
                  <h2 className="text-xl font-bold mb-2 mt-4">{letter}</h2>
                  {films.map((film) => (
                    <FilmListItem key={film.id} film={film} onClick={() => handleFilmClick(film)} />
                  ))}
                </div>
              ))
            ) : (
              sortedAndFilteredFilms.map((film) => (
                <FilmGridItem key={film.id} film={film} onClick={() => handleFilmClick(film)} />
              ))
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No films found</p>
        )}
      </div>

      <NavigationBar active="library" />

      {showModal && selectedFilm && <FilmModal film={selectedFilm} onClose={() => setShowModal(false)} />}
    </div>
  )
}
