import { useState, useEffect } from 'react'
import { getOrders } from '../api'

export default function OrderSummary({ token }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // UPDATED: Your computer's IP
  const API_URL = "http://192.168.16.13:8000";

  // Helper for clean image paths
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
  };

  useEffect(() => {
    if (token) {
      getOrders(token)
        .then(setOrders)
        .catch(() => setError('Failed to load orders'))
        .finally(() => setLoading(false))
    }
  }, [token])

  if (loading) return <div className="container"><p>Loading your orders...</p></div>
  if (error) return <div className="container"><p className="error">{error}</p></div>

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="card"><p>You haven't placed any orders yet.</p></div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px', marginBottom: '25px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f4f4f4', paddingBottom: '12px', marginBottom: '15px' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>Order #HLW{order.id}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>Placed on {new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <span style={{ 
                  background: order.status === 'pending' ? '#fff3cd' : '#d4edda', 
                  color: order.status === 'pending' ? '#856404' : '#155724',
                  padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', alignSelf: 'center'
                }}>
                  {order.status?.toUpperCase() || 'PAID'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', padding: '15px', background: '#fcfcfc', borderRadius: '8px', border: '1px dashed #eee' }}>
                <div>
                  <h5 style={{ margin: '0 0 5px 0', color: '#555' }}>Shipping Address</h5>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {order.street}<br />
                    {order.city}, {order.pincode}
                  </p>
                </div>
                <div>
                  <h5 style={{ margin: '0 0 5px 0', color: '#555' }}>Payment Method</h5>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>
                    {order.payment_method === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                  </p>
                </div>
              </div>

              <div className="order-items">
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                    <img 
                      // FIXED: Now uses the helper function for network visibility
                      src={getImageUrl(item.product_image)} 
                      alt={item.product_name} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                      onError={(e) => { e.target.src = 'https://placehold.co/60x60?text=Item'; }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: '500' }}>{item.product_name}</p>
                      <small style={{ color: '#777' }}>Qty: {item.quantity} @ ₹{Number(item.price).toFixed(2)}</small>
                    </div>
                    <div style={{ fontWeight: '600' }}>
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'right', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                <span style={{ color: '#666', marginRight: '10px' }}>Total Amount:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2563eb' }}>
                  ₹{Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}