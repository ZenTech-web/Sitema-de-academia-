import { NavLink } from 'react-router-dom'
import { Home, CreditCard, Dumbbell, PlusCircle, MoreHorizontal } from 'lucide-react'

const ITEMS = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/pagamentos', icon: CreditCard, label: 'Pagamentos' },
  { to: '/treinos', icon: Dumbbell, label: 'Treino' },
  { to: '/adicionar', icon: PlusCircle, label: 'Adicionar' },
  { to: '/mais', icon: MoreHorizontal, label: 'Mais' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center z-50">
      {ITEMS.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#0056D2]' : 'text-gray-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
