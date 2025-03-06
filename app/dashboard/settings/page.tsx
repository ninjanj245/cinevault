"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useFilmDatabase } from "@/app/providers"
import { Button } from "@/components/ui/button"
import NavigationBar from "@/components/navigation-bar"
import { getAuthUrl, isDropboxAuthenticated, logoutFromDropbox } from "@/lib/dropbox-integration"

export default function SettingsScreen() {
  const { user, logout } = useFilmDatabase()
  const router = useRouter()
  const [isDropboxConnected, setIsDropboxConnected] = useState(false)

  useEffect(() => {
    if (!user.isLoggedIn) {
      router.push("/")
    }

    // Check if connected to Dropbox
    setIsDropboxConnected(isDropboxAuthenticated())
  }, [user, router])

  const handleConnectDropbox = async () => {
    const authUrl = await getAuthUrl()
    window.location.href = authUrl
  }

  const handleDisconnectDropbox = () => {
    logoutFromDropbox()
    setIsDropboxConnected(false)
  }

  const handleLogout = useCallback(() => {
    logout()
    router.push("/")
  }, [logout, router])

  if (!user.isLoggedIn) {
    return null
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
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Account</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-medium">{user.name}</p>
              </div>

              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Storage</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Dropbox Integration</p>
                <p className="font-medium">{isDropboxConnected ? "Connected" : "Not connected"}</p>
              </div>

              {isDropboxConnected ? (
                <Button variant="outline" className="w-full" onClick={handleDisconnectDropbox}>
                  Disconnect from Dropbox
                </Button>
              ) : (
                <Button className="w-full" onClick={handleConnectDropbox}>
                  Connect to Dropbox
                </Button>
              )}

              <p className="text-sm text-gray-500">
                Connecting to Dropbox allows you to store your film database in the cloud and access it from any device.
              </p>
            </div>
          </div>
        </div>
      </div>

      <NavigationBar active="home" />
    </div>
  )
}

