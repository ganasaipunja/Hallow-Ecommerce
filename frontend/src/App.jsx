import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import Layout from './Layout'
import Login from './pages/Login'
import Catalog from './pages/Catalog'
import Cart from './pages/Cart'
import OrderSummary from './pages/OrderSummary'
import Home from './pages/Home'
import About from './pages/About'; // Adjust the path based on where you saved the file

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  })

  const onLogin = useCallback((data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ id: data.user_id, username: data.username }))
    setToken(data.token)
    setUser({ id: data.user_id, username: data.username })
  }, [])

  const onLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken('')
    setUser(null)
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Layout token={token} user={user} onLogout={onLogout} />}>
        <Route index element={<Home/>} />
        {/* <Route index element={token ? <Navigate to="/catalog" replace /> : <Navigate to="/login" replace />} /> */}
        <Route path="login" element={token ? <Navigate to="/home" replace /> : <Login onLogin={onLogin} />} />
        <Route path="catalog" element={<Catalog token={token} />} />
        <Route path="/about" element={<About />} />
        <Route path="cart" element={token ? <Cart token={token} /> : <Navigate to="/login" replace />} />
        <Route path="orders" element={token ? <OrderSummary token={token} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
