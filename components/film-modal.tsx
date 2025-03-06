"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { Film } from "@/lib/types"
import { useFilms } from "@/lib/use-films"
import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type FilmModalProps = {
  film: Film
  onClose: () => void
}

export default function FilmModal({ film, onClose }: FilmModalProps) {
  const { deleteFilm } = useFilms()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    deleteFilm(film.id)
    onClose()
  }

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the film from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="relative w-full max-w-md bg-[#d4f7d4] rounded-xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <div className="p-6">
            {film.imageUrl ? (
              <div className="relative w-3/4 mx-auto mt-8 mb-4 aspect-video rounded-lg overflow-hidden">
                <Image src={film.imageUrl} alt={film.title} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">No image</div>
            )}

            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold">{film.title}</h2>
              <span>ID {film.idNumber}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
              <div>
                <span className="italic">Director</span>
                <p>{film.director || "—"}</p>
              </div>

              <div>
                <span className="italic">Genre</span>
                <p>{film.genre || "—"}</p>
              </div>

              <div>
                <span className="italic">Year</span>
                <p>{film.year || "—"}</p>
              </div>

              <div>
                <span className="italic">Actors</span>
                <p>{film.actors || "—"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="bg-black text-white">
                Edit
              </Button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="border-3 border-coral-500 text-coral-500 hover:bg-coral-100 font-medium border-width: 3px"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
