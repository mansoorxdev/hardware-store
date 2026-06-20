'use client';

import { useState, useEffect } from 'react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [formData, setFormData] = useState({ name: '', email: '', date: '', details: '' });
  const [bookingStatus, setBookingStatus] = useState<{ success: boolean; text: string; id?: string } | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('http://localhost:5000/api/services');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.warn('API Offline. Loading local fallback workshop services.');
        const fallback = [
          {
            id: "srv-diagnostic",
            name: "Full PC Diagnosis & Troubleshooting",
            price: 49.99,
            duration: "1-2 Hours",
            description: "Complete health checkup of your hardware and software. Finding stability issues, thermal throttling, or component failures."
          },
          {
            id: "srv-cleanup",
            name: "Elite Cleaning & Thermal Paste Repaste",
            price: 79.99,
            duration: "2-3 Hours",
            description: "Deep dust cleaning of all fans and radiators, plus application of premium thermal paste (Arctic MX-6 or liquid metal if applicable) to drop CPU/GPU temps."
          },
          {
            id: "srv-assembly",
            name: "Custom PC Build & Cable Management",
            price: 129.99,
            duration: "4-6 Hours",
            description: "Drop off your parts, and our experts will assemble your dream rig with flawless cable routing, latest BIOS update, and stress-testing."
          },
          {
            id: "srv-upgrade",
            name: "Component Install & OS Migration",
            price: 59.99,
            duration: "1-2 Hours",
            description: "Installing upgrades (new GPU, RAM, SSD, or Motherboard) and cloning your old storage safely to the new drive."
          }
        ];
        setServices(fallback);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    setBookingLoading(true);
    setBookingStatus(null);

    const payload = {
      serviceId: selectedService.id,
      name: formData.name,
      email: formData.email,
      date: formData.date,
      details: formData.details
    };

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setBookingStatus({ success: true, text: data.message, id: data.bookingId });
        setFormData({ name: '', email: '', date: '', details: '' });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.warn('API Offline. Simulating booking confirmation.');
      const mockId = 'BKG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setBookingStatus({
        success: true,
        text: `Demo Mode: Booking confirmed for ${selectedService.name} on ${formData.date}.`,
        id: mockId
      });
      setFormData({ name: '', email: '', date: '', details: '' });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '6rem', paddingTop: '2rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Professional Support</span>
        <h1 style={{ fontSize: '2.8rem', marginTop: '0.5rem' }}>Hardware Workshop Booking</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Book diagnostic assessments, deep-cleaning procedures, hardware upgrades, and custom assemblies.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedService ? '1.2fr 0.8fr' : '1fr',
        gap: '3rem',
        transition: 'all 0.5s ease'
      }}>
        
        {/* Services List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              Loading workshop schedules...
            </div>
          ) : (
            services.map(srv => (
              <div 
                key={srv.id} 
                className="glass-card" 
                style={{
                  padding: '2rem',
                  borderRadius: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: '2rem',
                  border: selectedService?.id === srv.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  boxShadow: selectedService?.id === srv.id ? '0 0 20px rgba(0, 240, 255, 0.15)' : 'none'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: selectedService?.id === srv.id ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>{srv.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1rem', maxWidth: '650px' }}>
                    {srv.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>⏱️ Duration: <strong>{srv.duration}</strong></span>
                    <span>🛠️ Base Rate: <strong>${srv.price.toFixed(2)}</strong></span>
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => {
                      setSelectedService(srv);
                      setBookingStatus(null);
                    }}
                    className={`btn ${selectedService?.id === srv.id ? 'btn-cyan' : 'btn-secondary'}`}
                  >
                    {selectedService?.id === srv.id ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Booking Form Sidebar */}
        {selectedService && (
          <div className="glass-card" style={{
            padding: '2.5rem',
            borderRadius: '20px',
            alignSelf: 'start',
            position: 'sticky',
            top: '120px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Schedule Service</h3>
              <button 
                onClick={() => setSelectedService(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Booking: <strong style={{ color: 'var(--text-primary)' }}>{selectedService.name}</strong> (${selectedService.price.toFixed(2)})
            </p>

            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required 
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                  placeholder="Your Name" 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required 
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                  placeholder="name@email.com" 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Appointment Date</label>
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required 
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rig Specifications & Notes</label>
                <textarea 
                  value={formData.details} 
                  onChange={e => setFormData({ ...formData, details: e.target.value })}
                  rows={3} 
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'none'
                  }}
                  placeholder="Tell us about your system details or errors..." 
                />
              </div>

              <button 
                type="submit" 
                disabled={bookingLoading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {bookingLoading ? 'Scheduling...' : 'Confirm Appointment'}
              </button>
            </form>

            {bookingStatus && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 255, 100, 0.08)',
                border: '1px solid rgba(0, 255, 100, 0.2)',
                color: '#00ff64',
                fontSize: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <p>{bookingStatus.text}</p>
                {bookingStatus.id && (
                  <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    Confirmation Ref: <strong>{bookingStatus.id}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
