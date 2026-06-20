'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (res.ok) {
          setServerOnline(true);
        } else {
          setServerOnline(false);
        }
      } catch (err) {
        setServerOnline(false);
      }
    }
    checkStatus();
    // Re-check every 15 seconds
    const timer = setInterval(checkStatus, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>⚡ ByteForge</h3>
            <p style={{ marginTop: '0.5rem', maxWidth: '280px' }}>
              Your ultimate source for elite computer hardware, custom rigs, and professional diagnostic & repair services.
            </p>
          </div>
          <div className="footer-col">
            <h3>Explore</h3>
            <ul>
              <li><Link href="/shop">Shop Parts</Link></li>
              <li><Link href="/pc-builder">Custom PC Builder</Link></li>
              <li><Link href="/services">Book Repair Service</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Support</h3>
            <ul>
              <li><Link href="/services">System Diagnostics</Link></li>
              <li><Link href="/#contact">Help Center</Link></li>
              <li><a href="#">Warranty Claim</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9 AM - 8 PM</p>
            <p>Saturday: 10 AM - 6 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ByteForge Solutions. Forged for maximum computing potential.</p>
          
          <div className="status-indicator">
            {serverOnline === null ? (
              <>
                <span className="status-dot" style={{ backgroundColor: '#e2e8f0' }}></span>
                <span>Checking ByteForge Core API...</span>
              </>
            ) : serverOnline ? (
              <>
                <span className="status-dot online"></span>
                <span>ByteForge Server Live</span>
              </>
            ) : (
              <>
                <span className="status-dot offline"></span>
                <span>Offline Demo Mode</span>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
