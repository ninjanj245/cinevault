"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFilmDatabase } from "@/app/providers"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const { login, user } = useFilmDatabase()
  const router = useRouter()

  // If user is already logged in, redirect to dashboard
  if (user.isLoggedIn) {
    router.push("/dashboard")
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(name, password, rememberMe)
    router.push("/dashboard")
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Personal Film Database</h1>
          <p className="mt-2 text-gray-600">{isSignUp ? "Create an account" : "Sign in to your account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                placeholder="Your name"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Your password"
              />
            </div>

            {!isSignUp && (
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember-me" className="ml-2 text-sm">
                  Remember me
                </Label>
              </div>
            )}
          </div>

          <div>
            <Button type="submit" className="w-full">
              {isSignUp ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}

