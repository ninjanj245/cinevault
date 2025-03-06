import AuthScreen from "@/components/auth-screen"

export default function Home() {
  // In a real app, you would check server-side if the user is authenticated
  // For this demo, we'll redirect to the home screen
  // The actual auth check happens client-side in the dashboard component
  return <AuthScreen />
}

