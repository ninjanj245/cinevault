"use client"

import Link from "next/link"
import { useFilmDatabase } from "@/app/providers"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type NavigationBarProps = {
  active: "home" | "search" | "add" | "library" | "logout" | "settings"
}

export default function NavigationBar({ active }: NavigationBarProps) {
  const { logout } = useFilmDatabase()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black h-16 flex items-center justify-around">
      <Link href="/dashboard/add">
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={active === "add" ? "#ff6b6b" : "white"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus-circle hover:stroke-[#32CD32] transition-colors"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
        </div>
      </Link>

      <Link href="/dashboard/search">
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={active === "search" ? "#ff6b6b" : "white"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search hover:stroke-[#32CD32] transition-colors"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </Link>

      <Link href="/dashboard">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${active === "home" ? "bg-[#ff6b6b]" : ""} hover:bg-[#32CD32] transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-clapperboard"
            >
              <path d="M4 11v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8" />
              <path d="M4 11V7a1 1 0 0 1 1-1h2" />
              <path d="M4 11h16" />
              <path d="M20 11V7a1 1 0 0 0-1-1h-5.6" />
              <path d="m16 3-4 4-4-4" />
            </svg>
          </div>
        </div>
      </Link>

      <Link href="/dashboard/library">
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={active === "library" ? "#ff6b6b" : "white"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-film hover:stroke-[#32CD32] transition-colors"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 3v18" />
            <path d="M3 7h18" />
            <path d="M3 11h18" />
            <path d="M3 15h18" />
            <path d="M7 3v18" />
            <path d="M17 3v18" />
          </svg>
        </div>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={active === "settings" ? "#ff6b6b" : "white"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-settings hover:stroke-[#32CD32] transition-colors"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black border-gray-700">
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="cursor-pointer hover:bg-gray-800">
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-gray-800">
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
