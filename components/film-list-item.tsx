"use client"

import Image from "next/image"
import type { Film } from "@/lib/types"

type FilmListItemProps = {
  film: Film
  onClick: () => void
}

export default function FilmListItem({ film, onClick }: FilmListItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={onClick}>
      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
        {film.imageUrl ? (
          <Image src={film.imageUrl || "/placeholder.svg"} alt={film.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">No image</div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{film.title}</h3>
        <p className="text-sm text-gray-500">{film.director}</p>
      </div>
      <div className="text-sm">ID {film.idNumber}</div>
    </div>
  )
}

