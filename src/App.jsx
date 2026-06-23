import { Outlet } from 'react-router-dom'
import BottomNav from './Components/BottomNav'
import { useAuth } from './context/AuthContext'
import Login from './Pages/Login'
import Admin from './Pages/Admin'

export default function App() {
  const { estudante, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0056D2] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="text-white/60 text-xs">Conectando ao servidor...</p>
      </div>
    )
  }

  if (!estudante) return <Login />

  if (estudante.role === 'ADMIN') return <Admin />

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex flex-col">
      <main className="flex-1 pb-16 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
