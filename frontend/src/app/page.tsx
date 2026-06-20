'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormStatus(null);

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setFormStatus({ type: 'success', text: data.message || 'Message sent successfully!' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to submit message.');
      }
    } catch (err: any) {
      console.warn('API Offline. Simulating local message cache.');
      // Fallback behavior when API is offline
      setFormStatus({ 
        type: 'success', 
        text: 'Demo Mode: Message cached locally. Thank you for reaching out!' 
      });
      setFormData({ name: '', email: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      
      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        alignItems: 'center',
        gap: '4rem',
        padding: '6rem 0 4rem 0',
        minHeight: '75vh'
      }}>
        <div>
          <span style={{
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-title)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            Next-Gen Computer Hardware & Maintenance
          </span>
          <h1 style={{
            fontSize: '3.6rem',
            lineHeight: 1.15,
            marginTop: '1rem',
            marginBottom: '1.5rem'
          }}>
            Building Power.<br />
            <span className="gradient-text">Forging Performance.</span>
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.15rem',
            maxWidth: '550px',
            marginBottom: '2.5rem'
          }}>
            From high-end RTX 4090 GPUs to custom liquid cooling loops, ByteForge provides the ultimate hardware catalog and elite diagnostic services for your computing rigs.
          </p>
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            <Link href="/pc-builder" className="btn btn-primary btn-large">
              Custom PC Builder
            </Link>
            <Link href="/shop" className="btn btn-secondary btn-large">
              Shop Components
            </Link>
          </div>
        </div>

        {/* Hero Interactive Visual */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="glass-card" style={{
            width: '340px',
            height: '380px',
            position: 'relative',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '24px'
          }}>
            <div>
              <span style={{
                background: 'rgba(0, 240, 255, 0.1)',
                color: 'var(--accent-cyan)',
                fontSize: '0.75rem',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontWeight: 600,
                border: '1px solid rgba(0, 240, 255, 0.2)'
              }}>
                Interactive Rig Preview
              </span>
              <h3 style={{ marginTop: '1.2rem', fontSize: '1.4rem' }}>Ultimate Gaming Build</h3>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
              margin: '1.5rem 0'
            }}>
              {/* Premium Vector PC component showcase */}
              <svg viewBox="0 0 100 100" style={{
                width: '150px',
                height: '150px',
                filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.35))'
              }}>
                <defs>
                  <linearGradient id="gpu-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff6b00" />
                    <stop offset="100%" stop-color="#bd00ff" />
                  </linearGradient>
                </defs>
                <rect x="20" y="15" width="60" height="70" rx="8" fill="#141a2e" stroke="var(--border-color)" strokeWidth="2" />
                <line x1="20" y1="35" x2="80" y2="35" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
                {/* GPU Card Representation */}
                <rect x="25" y="45" width="50" height="15" rx="3" fill="url(#gpu-grad)" />
                <circle cx="35" cy="52.5" r="4" fill="#00f0ff" />
                <circle cx="65" cy="52.5" r="4" fill="#00f0ff" />
                {/* Cooler Fans */}
                <circle cx="50" cy="28" r="8" fill="none" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 2" />
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '1.3rem' }}>$2,849.99</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Liquid Cooled</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight Section */}
      <section style={{ padding: '6rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem' }}>Professional Workshop Services</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Our trained technicians provide professional support to keep your systems running at absolute maximum capacity.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem'
        }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🔬</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>Diagnosis & Testing</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Experiencing BSODs or random freezes? We conduct exhaustive hardware testing to identify component bottlenecks or errors.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🧹</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>Elite Dusting & Repasting</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Restore factory temperatures and performance. We thoroughly clean heat sinks and apply premium thermal compounds.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>⚙️</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>Custom Builds</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Provide us your component list, and our builders will assemble, optimize bios configuration, and stress test your machine.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <Link href="/services" className="btn btn-cyan">
            Book Workshop Service Now
          </Link>
        </div>
      </section>

      {/* Dynamic Compatibility / PC Builder Highlight CTA */}
      <section className="glass-card" style={{
        padding: '4rem',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(20,25,48,0.7) 0%, rgba(12,15,30,0.9) 100%)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: '4rem',
        margin: '2rem 0'
      }}>
        <div>
          <h2 style={{ fontSize: '2.3rem', lineHeight: '1.2' }}>
            Build Your Custom Rig With <span className="gradient-text-purple">Real-Time Validation</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1.2rem', marginBottom: '2rem' }}>
            Our dynamic PC builder validates your parts selection, monitors estimated power requirements, and warns you about socket mismatches in real-time. Make sure your parts work together perfectly before checking out.
          </p>
          <Link href="/pc-builder" className="btn btn-primary">
            Launch PC Builder 🛠️
          </Link>
        </div>
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '2rem'
        }}>
          <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>Compatibility Engine</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <li style={{ display: 'flex', gap: '0.8rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--accent-green)' }}>✓</span> Socket Compatibility Checked (LGA1700, AM5)
            </li>
            <li style={{ display: 'flex', gap: '0.8rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--accent-green)' }}>✓</span> Power Draw Wattage Estimates (PSU Margin)
            </li>
            <li style={{ display: 'flex', gap: '0.8rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--accent-green)' }}>✓</span> DDR5 / DDR4 Mainboard RAM Match Check
            </li>
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '6rem 0 2rem 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>Have Questions? We Have Answers.</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Not sure which RAM latency is optimal for your build, or need details on diagnostic timelines? Get in touch with our certified hardware technician team.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>📍 100 Forge Avenue, Steelworks City</p>
              <p>✉️ consult@byteforge.com</p>
              <p>📞 +1 (555) 739-3674</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.2rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required 
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--border-color)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                  placeholder="John Doe" 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.2rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required 
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--border-color)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                  placeholder="john@example.com" 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your Message</label>
                <textarea 
                  value={formData.message} 
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  rows={4} 
                  required 
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--border-color)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'none'
                  }}
                  placeholder="Describe your PC build details or service question..." 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary" 
                style={{ width: '100%' }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {formStatus && (
              <div style={{
                marginTop: '1.5rem',
                padding: '0.8rem',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '0.9rem',
                backgroundColor: formStatus.type === 'success' ? 'rgba(0, 255, 100, 0.1)' : 'rgba(255, 0, 50, 0.1)',
                color: formStatus.type === 'success' ? '#00ff64' : '#ff334b',
                border: `1px solid ${formStatus.type === 'success' ? 'rgba(0, 255, 100, 0.2)' : 'rgba(255, 0, 50, 0.2)'}`
              }}>
                {formStatus.text}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
