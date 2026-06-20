'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [theme, setTheme] = useState('dark');

  // Sync theme with document element
  useEffect(() => {
    const savedTheme = localStorage.getItem('byteforge_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('byteforge_theme', nextTheme);
  };

  const linkClass = (path: string) => {
    return pathname === path ? 'nav-item active' : 'nav-item';
  };

  return (
    <header className="header-wrapper">
      <div className="container header-container">
        <Link href="/" className="logo-link">
          <span className="logo-sym">⚡</span>
          <span className="logo-txt">ByteForge</span>
        </Link>

        <nav className="nav-links">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <Link href="/shop" className={linkClass('/shop')}>Shop Parts</Link>
          <Link href="/pc-builder" className={linkClass('/pc-builder')}>PC Builder</Link>
          <Link href="/services" className={linkClass('/services')}>Services</Link>
        </nav>

        <div className="header-actions">
          <button onClick={toggleTheme} className="theme-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <Link href="/cart" className="cart-icon-btn" aria-label="View Cart">
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
