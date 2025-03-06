"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFilmDatabase } from "../providers"
import HomeScreen from "@/components/home-screen"

export default function Dashboard() {
  const { user } = useFilmDatabase()
  const router = useRouter()

  useEffect(() => {
    if (!user.isLoggedIn) {
      router.push("/")
    }
  }, [user, router])

  if (!user.isLoggedIn) {
    return null
  }

  return <HomeScreen />
}

