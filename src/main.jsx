import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'
import Home from './Pages/Main/index.jsx'
import Treinos from './Pages/Treinos/index.jsx'
import Treino from './Pages/Treino/index.jsx'
import Mais from './Pages/Mais/index.jsx'
import Pagamentos from './Pages/Pagamentos/index.jsx'
import Progresso from './Pages/Progresso/index.jsx'
import NotFound from './Pages/NotFound/index.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'treinos', element: <Treinos /> },
      { path: 'treino/:id', element: <Treino /> },
      { path: 'pagamentos', element: <Pagamentos /> },
      { path: 'progresso', element: <Progresso /> },
      { path: 'mais', element: <Mais /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
