import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Tag, 
  ArrowUpDown, 
  CreditCard,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react'

const Layout = ({ children, onLogout }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [currentUser, setCurrentUser] = React.useState(null)

  React.useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Categorias', href: '/categorias', icon: Tag },
    { name: 'Tipos de Movimentação', href: '/tipos-movimentacao', icon: ArrowUpDown },
    { name: 'Movimentações', href: '/movimentacoes', icon: CreditCard },
  ]

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      onLogout()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Calculadora de Gastos</h1>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 flex-1">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {currentUser?.nome || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Calculadora de Gastos</h1>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-600"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout