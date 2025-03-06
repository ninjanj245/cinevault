"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { handleOAuthCallback } from "@/lib/dropbox-integration"

export default function DropboxCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const processAuth = async () => {
      const code = searchParams.get("code")

      if (!code) {
        setStatus("error")
        return
      }

      try {
        const success = await handleOAuthCallback(code)
        if (success) {
          setStatus("success")
          // Redirect after a short delay
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        } else {
          setStatus("error")
        }
      } catch (error) {
        console.error("Error during Dropbox authentication:", error)
        setStatus("error")
      }
    }

    processAuth()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {status === "loading" && "Connecting to Dropbox..."}
          {status === "success" && "Successfully connected to Dropbox!"}
          {status === "error" && "Error connecting to Dropbox"}
        </h1>

        <div className="text-center">
          {status === "loading" && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          )}

          {status === "success" && (
            <div className="text-green-600 mb-4">
              <p>Your film database will now be synced with Dropbox.</p>
              <p className="mt-2">Redirecting to dashboard...</p>
            </div>
          )}

          {status === "error" && (
            <div className="text-red-600 mb-4">
              <p>There was a problem connecting to Dropbox.</p>
              <p className="mt-2">Please try again.</p>
              <button
                onClick={() => router.push("/dashboard/settings")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

