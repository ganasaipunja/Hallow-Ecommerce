import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'

export default function Layout({ token, user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    // Redirect to catalog with search query as a URL parameter
    navigate(`/catalog?search=${searchQuery}`)
  }

  return (
    <>
      <nav className="navbar">
        <Link 
  to="/" 
  style={{ 
    textDecoration: 'none', 
    fontSize: '28px', 
    fontWeight: '900', 
    letterSpacing: '2px', 
    textTransform: 'uppercase',
    marginRight: '25px',
    padding: '5px 10px',
    display: 'inline-block',
    // Gradient Background clipped to text
    background: 'linear-gradient(45deg, #2563eb, #9333ea, #db2777)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    // Animation/Transition
    transition: 'transform 0.5s ease, filter 0.8s ease',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'scale(1.1) rotate(-1deg)';
    e.currentTarget.style.filter = 'brightness(1.6)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
    e.currentTarget.style.filter = 'brightness(1)';
  }}
>
  HALLOW
</Link>
        <Link to="/">Home</Link>
        <form onSubmit={handleSearch} className="search-form">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>
        <Link to="/catalog">Products</Link>
        
        {token ? (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/about">About</Link>
            <div className="nav-right" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="username">Welcome, {user?.username}</span>
              <button className="logout-btn" type="button" onClick={onLogout}>Logout</button>
            </div>
          </>
        ) : (
          <Link to="/login" style={{ marginLeft: 'auto' }}>Login</Link>
        )}
      </nav>
      <main className="container">
        <Outlet />
      </main>
        
      {/* --- GLOBAL FOOTER (The "Future" Section) --- */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>HALLOW</h3>
            <p>Premium electronics and accessories for the modern lifestyle.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/catalog">All Products</Link>
            <Link to="/cart">My Cart</Link>
            <Link to="/orders">Order History</Link>
          </div>
          <div className="footer-col">
            <h4>Stay Connected</h4>
            <p>Get 10% off your first order!</p>
            <div className="footer-newsletter">
              <input type="email" placeholder="Email address" />
              <button>Join</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 HALLOW. Built for excellence.</p>
        </div>
      </footer>
    





    </>
    
    
  )
}