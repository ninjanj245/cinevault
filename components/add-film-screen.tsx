"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NavigationBar from "@/components/navigation-bar"
import { useFilms } from "@/lib/use-films"
import type { Film } from "@/lib/types"

export default function AddFilmScreen() {
  const router = useRouter()
  const { addFilm, addFilms } = useFilms()
  const [formData, setFormData] = useState<Omit<Film, "id" | "dateAdded">>({
    title: "",
    director: "",
    actors: "",
    genre: "",
    idNumber: "",
    year: "",
    tags: "",
    imageUrl: "",
  })
  const [dragActive, setDragActive] = useState(false)
  const [bulkText, setBulkText] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // In a real app, you would upload the file to a storage service
      // and get back a URL to store in the database
      // For this demo, we'll just use a placeholder
      setFormData((prev) => ({ ...prev, imageUrl: "/placeholder.svg?height=300&width=300" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addFilm(formData)
    setShowSuccess(true)

    // Reset form
    setFormData({
      title: "",
      director: "",
      actors: "",
      genre: "",
      idNumber: "",
      year: "",
      tags: "",
      imageUrl: "",
    })

    // Show success message for 3 seconds then redirect
    setTimeout(() => {
      router.push("/dashboard")
    }, 3000)
  }

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Parse the bulk text into film objects
    // Format expected: Title, Director, Actors, Genre, ID, Year, Tags
    const films = bulkText
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const [title, director, actors, genre, idNumber, year, tags] = line.split(",").map((item) => item.trim())
        return {
          title: title || "",
          director: director || "",
          actors: actors || "",
          genre: genre || "",
          idNumber: idNumber || "",
          year: year || "",
          tags: tags || "",
          imageUrl: "",
        }
      })

    addFilms(films)
    setBulkText("")
    setShowSuccess(true)

    // Show success message for 3 seconds then redirect
    setTimeout(() => {
      router.push("/dashboard")
    }, 3000)
  }

  const downloadTemplate = () => {
    const template = "Title, Director, Actors, Genre, ID Number, Year, Tags"
    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "film_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
          <h1 className="text-3xl font-bold">Add</h1>
        </div>

        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Film(s) added successfully! Redirecting to home...
          </div>
        )}

        <Tabs defaultValue="single" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="single">Add Single Film</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Add</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <form onSubmit={handleSubmit} className="border border-[#ff6b6b] rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Film Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="director">Director</Label>
                  <Input
                    id="director"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="actors">Actor</Label>
                  <Input id="actors" name="actors" value={formData.actors} onChange={handleChange} className="mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Input id="genre" name="genre" value={formData.genre} onChange={handleChange} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="idNumber">ID number</Label>
                    <Input
                      id="idNumber"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" name="year" value={formData.year} onChange={handleChange} className="mt-1" />
                  </div>
                </div>

                <div
                  className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <p className="text-gray-500 italic">Drag & drop for upload</p>
                </div>

                <div>
                  <Label htmlFor="imageUrl">Upload image via URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button type="submit" className="bg-green-500 hover:bg-green-600">
                    Add
                  </Button>
                  <Button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    variant="outline"
                    className="border-[#ff6b6b] text-[#ff6b6b]"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="bulk">
            <div className="border border-[#ff6b6b] rounded-lg p-6">
              <div className="mb-4">
                <p className="mb-2">Upload a CSV file or paste a list of films below.</p>
                <p className="mb-4">Format: Title, Director, Actors, Genre, ID Number, Year, Tags</p>
                <Button onClick={downloadTemplate} variant="outline" size="sm" className="mb-4">
                  Download Template
                </Button>
              </div>

              <form onSubmit={handleBulkSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bulkText">Paste film data (one film per line)</Label>
                    <textarea
                      id="bulkText"
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      className="w-full h-40 mt-1 p-2 border rounded-md"
                      placeholder="The Godfather, Francis Ford Coppola, Marlon Brando Al Pacino, Crime Drama, 001, 1972, classic mafia"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button type="submit" className="bg-green-500 hover:bg-green-600">
                      Add Films
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push("/dashboard")}
                      variant="outline"
                      className="border-[#ff6b6b] text-[#ff6b6b]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <NavigationBar active="add" />
    </div>
  )
}

