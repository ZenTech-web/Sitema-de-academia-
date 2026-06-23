import Header from '../../Components/Header'
import { PlusCircle } from 'lucide-react'

export default function Adicionar() {
  return (
    <div className="flex flex-col min-h-full">
      <Header title="Adicionar" />
      <div className="flex flex-col items-center justify-center gap-3 p-8 mt-12 text-center">
        <PlusCircle size={48} className="text-gray-300" />
        <p className="text-gray-500 text-sm">Funcionalidade disponível em breve</p>
      </div>
    </div>
  )
}
