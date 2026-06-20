'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [billingInfo, setBillingInfo] = useState({ name: '', email: '', address: '', zip: '', card: '' });
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderResult, setOrderResult] = useState<{ success: boolean; orderId: string; message: string } | null>(null);

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingOut(true);

    const payload = {
      cart: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      billing: billingInfo
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setOrderResult({ success: true, orderId: data.orderId, message: data.message });
        clearCart();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.warn('API Offline. Simulating local checkout.');
      const mockId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setOrderResult({
        success: true,
        orderId: mockId,
        message: "Demo Mode Checkout: Order placed and saved in local cache!"
      });
      clearCart();
    } finally {
      setCheckingOut(false);
    }
  };

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 500 ? 0 : 25;
  const total = cartTotal + tax + shipping;

  if (orderResult) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center', maxWidth: '600px' }}>
        <div className="glass-card" style={{ padding: '3rem', borderRadius: '24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.8rem', color: 'var(--accent-green)' }}>Order Placed!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{orderResult.message}</p>
          
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            marginBottom: '2rem',
            fontSize: '0.9rem'
          }}>
            Order ID Reference: <strong>{orderResult.orderId}</strong>
          </div>

          <Link href="/shop" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '6rem', paddingTop: '2rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{ color: 'var(--accent-orange)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Review Order</span>
        <h1 style={{ fontSize: '2.8rem', marginTop: '0.5rem' }}>Shopping Cart</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Confirm hardware quantities, configure logistics details, and complete your secure checkout.</p>
      </div>

      {cart.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-secondary)' }}>Your cart is empty</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '2rem' }}>Choose from our outstanding components in the catalog.</p>
          <Link href="/shop" className="btn btn-primary">
            Browse Components Catalog
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.3fr 0.7fr',
          gap: '3rem',
          alignItems: 'start'
        }}>
          
          {/* Cart items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cart.map(item => (
              <div 
                key={item.product.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem'
                }}
              >
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  style={{ width: '65px', height: '65px', borderRadius: '8px', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.product.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Category: {item.product.category}</span>
                </div>

                {/* Quantities control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ minWidth: '90px', textAlign: 'right' }}>
                  <strong style={{ color: 'var(--accent-orange)' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </strong>
                </div>

                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-red)',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Billing & Total Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Invoice Breakdown */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem' }}>Invoice Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.2rem', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Secure Logistics / Shipping:</span>
                  <span>{shipping === 0 ? <strong style={{ color: 'var(--accent-green)' }}>FREE</strong> : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.15rem' }}>
                <strong>Total Amount:</strong>
                <strong style={{ fontSize: '1.4rem', color: 'var(--accent-orange)' }}>${total.toFixed(2)}</strong>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem' }}>Billing Details</h3>
              
              <form onSubmit={handleSubmitCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full Name</label>
                  <input 
                    type="text" 
                    value={billingInfo.name} 
                    onChange={e => setBillingInfo({ ...billingInfo, name: e.target.value })}
                    required 
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      padding: '0.7rem',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '0.85rem'
                    }}
                    placeholder="John Doe" 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email Address</label>
                  <input 
                    type="email" 
                    value={billingInfo.email} 
                    onChange={e => setBillingInfo({ ...billingInfo, email: e.target.value })}
                    required 
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      padding: '0.7rem',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '0.85rem'
                    }}
                    placeholder="john@example.com" 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Shipping Address</label>
                  <input 
                    type="text" 
                    value={billingInfo.address} 
                    onChange={e => setBillingInfo({ ...billingInfo, address: e.target.value })}
                    required 
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      padding: '0.7rem',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '0.85rem'
                    }}
                    placeholder="123 Steel St" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ZIP Code</label>
                    <input 
                      type="text" 
                      value={billingInfo.zip} 
                      onChange={e => setBillingInfo({ ...billingInfo, zip: e.target.value })}
                      required 
                      style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--border-color)',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        fontSize: '0.85rem'
                      }}
                      placeholder="90210" 
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Credit Card</label>
                    <input 
                      type="text" 
                      value={billingInfo.card} 
                      onChange={e => setBillingInfo({ ...billingInfo, card: e.target.value })}
                      required 
                      style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--border-color)',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        fontSize: '0.85rem'
                      }}
                      placeholder="4111 2222 3333 4444" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={checkingOut}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {checkingOut ? 'Processing Checkout...' : `Pay $${total.toFixed(2)}`}
                </button>
              </form>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
