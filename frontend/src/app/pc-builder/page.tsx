'use client';

import { useState, useEffect } from 'react';
import { useCart, Product } from '../context/CartContext';

interface CompatibilityResult {
  compatible: boolean;
  warnings: string[];
  estimatedWattage: number;
}

export default function PCBuilder() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected components
  const [selectedParts, setSelectedParts] = useState<Record<string, Product | null>>({
    CPU: null,
    Motherboard: null,
    GPU: null,
    RAM: null,
    Storage: null,
    'Power Supply': null
  });

  // Modal selector state
  const [activeCategoryModal, setActiveCategoryModal] = useState<string | null>(null);

  // Compatibility engine results
  const [compatibility, setCompatibility] = useState<CompatibilityResult>({
    compatible: true,
    warnings: [],
    estimatedWattage: 0
  });
  
  const [checkingCompat, setCheckingCompat] = useState(false);
  const [addedAllAlert, setAddedAllAlert] = useState(false);

  // Fetch all products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.warn('API Offline. Loading local fallback components.');
        const fallback: Product[] = [
          {
            id: "cpu-intel-i9",
            name: "Intel Core i9-14900K",
            category: "CPU",
            price: 529.99,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
            description: "Intel 14th Gen flagship desktop processor, 24 cores (8 P-cores + 16 E-cores), up to 6.0 GHz.",
            specs: { socket: "LGA1700", cores: "24 Cores", speed: "6.0 GHz", power: "125W" }
          },
          {
            id: "cpu-amd-ryzen9",
            name: "AMD Ryzen 9 7950X",
            category: "CPU",
            price: 499.99,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
            description: "AMD Zen 4 architecture powerhouse, 16 cores, 32 threads, up to 5.7 GHz boost clock.",
            specs: { socket: "AM5", cores: "16 Cores", speed: "5.7 GHz", power: "170W" }
          },
          {
            id: "cpu-amd-ryzen7",
            name: "AMD Ryzen 7 7800X3D",
            category: "CPU",
            price: 369.99,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
            description: "The ultimate gaming processor featuring AMD 3D V-Cache technology for massive gaming performance.",
            specs: { socket: "AM5", cores: "8 Cores", speed: "5.0 GHz", power: "120W" }
          },
          {
            id: "mb-asus-z790",
            name: "ASUS ROG Maximus Z790 Hero",
            category: "Motherboard",
            price: 549.99,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
            description: "Premium Intel motherboard with PCIe 5.0, Wi-Fi 6E, robust VRMs, and DDR5 support.",
            specs: { socket: "LGA1700", chipset: "Z790", formFactor: "ATX", ramType: "DDR5" }
          },
          {
            id: "mb-msi-x670",
            name: "MSI MAG X670E Tomahawk WiFi",
            category: "Motherboard",
            price: 259.99,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
            description: "Feature-packed AM5 motherboard built for AMD Ryzen 7000/8000 series with DDR5 slots.",
            specs: { socket: "AM5", chipset: "X670E", formFactor: "ATX", ramType: "DDR5" }
          },
          {
            id: "gpu-rtx4090",
            name: "NVIDIA GeForce RTX 4090 24GB",
            category: "GPU",
            price: 1599.99,
            rating: 5.0,
            image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
            description: "The absolute pinnacle of graphics cards, powered by Ada Lovelace architecture, DLSS 3, and ray tracing.",
            specs: { memory: "24GB GDDR6X", interface: "PCIe 5.0", psuRecommended: "850W", powerDraw: "450W" }
          },
          {
            id: "gpu-rtx4070",
            name: "NVIDIA GeForce RTX 4070 Super 12GB",
            category: "GPU",
            price: 599.99,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
            description: "Excellent high-fps 1440p gaming card with outstanding ray-tracing capabilities and power efficiency.",
            specs: { memory: "12GB GDDR6X", interface: "PCIe 4.0", psuRecommended: "650W", powerDraw: "220W" }
          },
          {
            id: "ram-corsair-32",
            name: "Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz",
            category: "RAM",
            price: 114.99,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
            description: "High-performance DDR5 memory optimized for Intel and AMD systems, with customizable RGB profiling.",
            specs: { capacity: "32GB (2x16GB)", speed: "6000 MHz", type: "DDR5", latency: "CL30" }
          },
          {
            id: "ssd-samsung-990-2tb",
            name: "Samsung 990 Pro 2TB NVMe M.2 SSD",
            category: "Storage",
            price: 169.99,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
            description: "Sequential read speeds up to 7450 MB/s. The best SSD for gaming, video editing, and heavy workloads.",
            specs: { capacity: "2TB", interface: "PCIe Gen 4.0 x4", readSpeed: "7450 MB/s", formFactor: "M.2 2280" }
          },
          {
            id: "psu-corsair-rm1000",
            name: "Corsair RM1000x 1000W 80+ Gold",
            category: "Power Supply",
            price: 189.99,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
            description: "Fully modular ATX power supply, certified 80 PLUS Gold efficiency with zero-RPM fan mode.",
            specs: { wattage: "1000W", efficiency: "80+ Gold", modular: "Fully Modular", rails: "Single +12V" }
          }
        ];
        setProducts(fallback);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Recalculate compatibility when selections modify
  useEffect(() => {
    async function checkCompatibility() {
      const activeParts = Object.values(selectedParts).filter(Boolean) as Product[];
      if (activeParts.length === 0) {
        setCompatibility({ compatible: true, warnings: [], estimatedWattage: 0 });
        return;
      }

      setCheckingCompat(true);
      try {
        const res = await fetch('http://localhost:5000/api/compatibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parts: activeParts })
        });
        const data = await res.json();
        setCompatibility(data);
      } catch (err) {
        // Fallback local compatibility validation if server is offline
        const warnings: string[] = [];
        const cpu = selectedParts.CPU;
        const mb = selectedParts.Motherboard;
        const psu = selectedParts['Power Supply'];
        const gpu = selectedParts.GPU;

        if (cpu && mb && cpu.specs.socket !== mb.specs.socket) {
          warnings.push(`Socket Mismatch: CPU "${cpu.name}" uses ${cpu.specs.socket}, but motherboard "${mb.name}" has socket ${mb.specs.socket}.`);
        }

        let powerDraw = 50; // base
        if (cpu) powerDraw += parseInt(cpu.specs.power) || 120;
        if (gpu) powerDraw += parseInt(gpu.specs.powerDraw) || 220;

        if (psu) {
          const cap = parseInt(psu.specs.wattage) || 500;
          if (powerDraw > cap) {
            warnings.push(`Insufficient Power: Estimated draw is ${powerDraw}W, which exceeds the ${cap}W limit of "${psu.name}".`);
          } else if (powerDraw * 1.2 > cap) {
            warnings.push(`Low Wattage Headroom: Estimated draw is ${powerDraw}W, which is tight for a ${cap}W PSU.`);
          }
        }

        setCompatibility({
          compatible: warnings.length === 0,
          warnings,
          estimatedWattage: powerDraw
        });
      } finally {
        setCheckingCompat(false);
      }
    }

    checkCompatibility();
  }, [selectedParts]);

  const handleSelectPart = (category: string, product: Product) => {
    setSelectedParts(prev => ({ ...prev, [category]: product }));
    setActiveCategoryModal(null);
  };

  const handleRemovePart = (category: string) => {
    setSelectedParts(prev => ({ ...prev, [category]: null }));
  };

  const handleAddAllToCart = () => {
    Object.values(selectedParts).forEach(part => {
      if (part) {
        addToCart(part);
      }
    });
    setAddedAllAlert(true);
    setTimeout(() => setAddedAllAlert(false), 4000);
  };

  const totalPrice = Object.values(selectedParts).reduce((acc, part) => {
    return acc + (part ? part.price : 0);
  }, 0);

  const categories = ['CPU', 'Motherboard', 'GPU', 'RAM', 'Storage', 'Power Supply'];

  return (
    <div className="container" style={{ paddingBottom: '6rem', paddingTop: '2rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{ color: 'var(--accent-purple)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Rig Architect</span>
        <h1 style={{ fontSize: '2.8rem', marginTop: '0.5rem' }}>Custom PC Builder</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Select compatible PC parts, check system validation, power specifications, and add all items to your cart instantly.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 0.6fr',
        gap: '3rem',
        alignItems: 'start'
      }}>
        
        {/* Components Selection Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {categories.map(cat => {
            const part = selectedParts[cat];
            return (
              <div 
                key={cat} 
                className="glass-card" 
                style={{
                  padding: '1.5rem 2rem',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '2rem',
                  border: part ? '1px solid rgba(255,255,255,0.08)' : '1px dashed var(--border-color)',
                  background: part ? 'var(--bg-card)' : 'rgba(255,255,255,0.01)'
                }}
              >
                {/* Category Identity */}
                <div style={{ minWidth: '120px' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)' }}>Component</span>
                  <h4 style={{ fontSize: '1.1rem', marginTop: '0.1rem', color: part ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{cat}</h4>
                </div>

                {/* Part Description / Action */}
                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                  {part ? (
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <img 
                        src={part.image} 
                        alt={part.name} 
                        style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{part.name}</h4>
                        <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {Object.entries(part.specs).slice(0, 2).map(([k, v]) => (
                            <span key={k}>{k.toUpperCase()}: {v}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>No part selected</span>
                  )}
                </div>

                {/* Price and Operations */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {part ? (
                    <>
                      <strong style={{ color: 'var(--accent-orange)', fontSize: '1.1rem' }}>${part.price.toFixed(2)}</strong>
                      <button 
                        onClick={() => handleRemovePart(cat)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-red)',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          padding: '0.2rem'
                        }}
                        title="Remove component"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setActiveCategoryModal(cat)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                    >
                      + Choose
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Builder Analytics Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>System Summary</h3>

            {/* Price block */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Total System Cost:</span>
              <strong style={{ fontSize: '1.6rem', color: 'var(--accent-orange)' }}>${totalPrice.toFixed(2)}</strong>
            </div>

            {/* Wattage bar */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Est. Power Draw:</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>{compatibility.estimatedWattage} W</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min((compatibility.estimatedWattage / 1000) * 100, 100)}%`,
                  height: '100%',
                  background: compatibility.estimatedWattage > 800 ? 'var(--accent-red)' : 'var(--accent-cyan)',
                  borderRadius: '3px',
                  transition: 'width 0.4s ease'
                }}></div>
              </div>
            </div>

            {/* Validation indicators */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}>Validation Engine Status</h4>
              
              {checkingCompat ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Analyzing configurations...</p>
              ) : compatibility.compatible ? (
                <div style={{ display: 'flex', gap: '0.6rem', color: 'var(--accent-green)', fontSize: '0.85rem' }}>
                  <span>✓</span>
                  <span>System Configuration Validated. All parts compatible.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', color: 'var(--accent-red)', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>⚠️</span>
                    <span>Configuration Conflicts Found ({compatibility.warnings.length})</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                    {compatibility.warnings.map((w, idx) => (
                      <li key={idx} style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '-12px', color: 'var(--accent-red)' }}>•</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Order execution */}
            <button 
              onClick={handleAddAllToCart}
              disabled={Object.values(selectedParts).filter(Boolean).length === 0}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Add Components to Cart 🛒
            </button>

            {addedAllAlert && (
              <div style={{
                marginTop: '1rem',
                padding: '0.8rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 255, 100, 0.08)',
                border: '1px solid rgba(0, 255, 100, 0.2)',
                color: '#00ff64',
                fontSize: '0.8rem',
                textAlign: 'center'
              }}>
                All parts added to shopping cart!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Choose Modal Backdrop */}
      {activeCategoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(6, 9, 19, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 200,
          padding: '2rem'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '650px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '24px',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Select {activeCategoryModal}</h3>
              <button 
                onClick={() => setActiveCategoryModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Items List */}
            <div style={{ padding: '1.5rem 2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {products
                .filter(p => p.category === activeCategoryModal)
                .map(product => (
                  <div 
                    key={product.id}
                    onClick={() => handleSelectPart(activeCategoryModal, product)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.01)',
                      transition: 'var(--transition-smooth)'
                    }}
                    className="modal-part-item"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: '0.95rem' }}>{product.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.1rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.description}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ color: 'var(--accent-orange)', fontSize: '1rem' }}>${product.price.toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
            </div>
            
            {/* Custom CSS for selections */}
            <style>{`
              .modal-part-item:hover {
                border-color: var(--accent-cyan) !important;
                background: rgba(0, 240, 255, 0.05) !important;
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
