'use client';

import { useState, useEffect } from 'react';
import { useCart, Product } from '../context/CartContext';

export default function Shop() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load from API with fallback
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.warn('Backend offline. Loading local shop products catalog.');
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
            id: "gpu-rx7800",
            name: "AMD Radeon RX 7800 XT 16GB",
            category: "GPU",
            price: 499.99,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
            description: "High-performance RDNA 3 graphics card boasting 16GB VRAM, outperforming in rasterization.",
            specs: { memory: "16GB GDDR6", interface: "PCIe 4.0", psuRecommended: "700W", powerDraw: "263W" }
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
        setFilteredProducts(fallback);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filter application
  useEffect(() => {
    let result = products;

    if (search.trim() !== '') {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(result);
  }, [search, selectedCategory, products]);

  const categories = ['All', 'CPU', 'Motherboard', 'GPU', 'RAM', 'Storage', 'Power Supply'];

  return (
    <div className="container" style={{ paddingBottom: '6rem', paddingTop: '2rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{ color: 'var(--accent-orange)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Elite Selection</span>
        <h1 style={{ fontSize: '2.8rem', marginTop: '0.5rem' }}>Hardware Components</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Select premium PC parts backed by warranty and component compatibility verification.</p>
      </div>

      {/* Search & Filters */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {/* Search */}
        <input 
          type="text" 
          placeholder="Search processors, graphics cards, SSDs..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            fontSize: '1.05rem',
            outline: 'none',
            backdropFilter: 'blur(10px)',
            transition: 'var(--transition-smooth)'
          }}
          className="search-input"
        />

        {/* Categories Grid */}
        <div style={{
          display: 'flex',
          gap: '0.8rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'var(--accent-orange)' : 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                padding: '0.5rem 1.2rem',
                borderRadius: '30px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {cat}s
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '5rem 0' }}>
          <div style={{
            border: '3px solid rgba(255,255,255,0.05)',
            borderTop: '3px solid var(--accent-orange)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Retrieving warehouse records...</p>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
          <h3>No products found</h3>
          <p style={{ marginTop: '0.5rem' }}>Try adjusting your search filters.</p>
        </div>
      ) : (
        /* Products Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2.5rem'
        }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="glass-card" 
              style={{
                padding: '1.5rem',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                position: 'relative'
              }}
            >
              <div style={{
                height: '180px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(6, 9, 19, 0.8)',
                  backdropFilter: 'blur(4px)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--accent-cyan)'
                }}>{product.category}</span>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.15rem', lineHeight: '1.3' }}>{product.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <span 
                      key={key} 
                      style={{
                        fontSize: '0.65rem',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {key.toUpperCase()}: {val}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-orange)' }}>${product.price.toFixed(2)}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>★ {product.rating}</span>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Add +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
