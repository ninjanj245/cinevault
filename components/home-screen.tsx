"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useFilmDatabase } from "@/app/providers"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Film } from "@/lib/types"
import { useFilms } from "@/lib/use-films"
import NavigationBar from "@/components/navigation-bar"
import FilmModal from "@/components/film-modal"

export default function HomeScreen() {
  const { user } = useFilmDatabase()
  const router = useRouter()
  const { films, lastSearched, lastAdded, stats } = useFilms()
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleFilmClick = (film: Film) => {
    setSelectedFilm(film)
    setShowModal(true)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push("/dashboard/search")
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link href="/dashboard/add">
            <Button className="w-full h-16 text-xl bg-[#ff6b6b] hover:bg-[#ff5252]">Add film</Button>
          </Link>
          <Link href="/dashboard/library">
            <Button variant="outline" className="w-full h-16 text-xl border-black border-[3px] text-black">
              View Library
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Input placeholder="Search" className="h-14 pl-4 pr-14 rounded-full" />
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

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Last 5 searches</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ minWidth: "min-content" }}>
              {lastSearched.map((film) => (
                <div
                  key={film.id}
                  className="bg-[#ffcccb] rounded-lg p-4 cursor-pointer flex-shrink-0"
                  style={{ width: "280px" }}
                  onClick={() => handleFilmClick(film)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                      {film.imageUrl ? (
                        <Image
                          src={film.imageUrl || "/placeholder.svg"}
                          alt={film.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">No image</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{film.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Last 5 added</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ minWidth: "min-content" }}>
              {lastAdded.map((film) => (
                <div
                  key={film.id}
                  className="bg-[#d4f7d4] rounded-lg p-4 cursor-pointer flex-shrink-0"
                  style={{ width: "280px" }}
                  onClick={() => handleFilmClick(film)}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                    {film.imageUrl ? (
                      <Image src={film.imageUrl || "/placeholder.svg"} alt={film.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">No image</div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <h3 className="font-medium">{film.title}</h3>
                    <span>ID {film.idNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-200 bg-opacity-25 rounded-lg p-6 text-center">
              <h3 className="text-lg mb-2">Films in storage</h3>
              <p className="text-6xl font-bold">{stats.totalFilms}</p>
            </div>
            <div className="bg-gray-200 bg-opacity-25 rounded-lg p-6 text-center">
              <h3 className="text-lg mb-2">Days since last added</h3>
              <p className="text-6xl font-bold">{stats.daysSinceLastAdded}</p>
            </div>
          </div>
        </section>
      </div>

      <NavigationBar active="home" />

      {showModal && selectedFilm && <FilmModal film={selectedFilm} onClose={() => setShowModal(false)} />}
    </div>
  )
}

