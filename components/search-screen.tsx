"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import NavigationBar from "@/components/navigation-bar"
import { useFilms } from "@/lib/use-films"
import type { Film } from "@/lib/types"
import FilmModal from "@/components/film-modal"
import FilmGridItem from "@/components/film-grid-item"
import FilmListItem from "@/components/film-list-item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function SearchScreen() {
  const router = useRouter()
  const { searchFilms } = useFilms()
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<Film[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortOption>("title")
  const [filterGenre, setFilterGenre] = useState<string>("all")
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const searchResults = searchFilms(searchTerm)
    setResults(searchResults)
    // Reset filters when performing a new search
    setFilterGenre("all")
    setSortBy("title")
  }

  const handleFilmClick = (film: Film) => {
    setSelectedFilm(film)
    setShowModal(true)
  }

  // Apply filters and sorting to results
  const filteredAndSortedResults = [...results]
    .filter((film) => filterGenre === "all" || film.genre === filterGenre)
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
        default:
          return 0
      }
    })

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
          <h1 className="text-3xl font-bold">Search</h1>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 pl-4 pr-14 rounded-full"
            />
            <Button
              type="submit"
              className="absolute right-0 top-0 h-14 w-14 rounded-full flex items-center justify-center"
            >
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
                className="lucide lucide-search"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Button>
          </div>
        </form>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {/* Get unique genres from results */}
                {[...new Set(results.map((film) => film.genre).filter(Boolean))].map((genre) => (
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
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="titleDesc">Title (Z-A)</SelectItem>
                <SelectItem value="year">Year (Oldest)</SelectItem>
                <SelectItem value="yearDesc">Year (Newest)</SelectItem>
                <SelectItem value="idNumber">ID (Ascending)</SelectItem>
                <SelectItem value="idNumberDesc">ID (Descending)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <h2 className="text-2xl font-bold mb-4">Results</h2>

        {results.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-4"}>
            {viewMode === "grid"
              ? filteredAndSortedResults.map((film) => (
                  <FilmGridItem key={film.id} film={film} onClick={() => handleFilmClick(film)} />
                ))
              : filteredAndSortedResults.map((film) => (
                  <FilmListItem key={film.id} film={film} onClick={() => handleFilmClick(film)} />
                ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No results found</p>
        )}
      </div>

      <NavigationBar active="search" />

      {showModal && selectedFilm && <FilmModal film={selectedFilm} onClose={() => setShowModal(false)} />}
    </div>
  )
}

