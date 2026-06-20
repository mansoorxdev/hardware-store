const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database
const products = [
  // CPUs
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
  // Motherboards
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
  // GPUs
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
  // RAM
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
    id: "ram-gskill-64",
    name: "G.Skill Trident Z5 RGB 64GB (2x32GB) 6400MHz",
    category: "RAM",
    price: 219.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
    description: "Flagship dual-channel DDR5 RAM designed for extreme performance on Z790/X670 mainboards.",
    specs: { capacity: "64GB (2x32GB)", speed: "6400 MHz", type: "DDR5", latency: "CL32" }
  },
  // Storage
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
    id: "ssd-crucial-4tb",
    name: "Crucial T500 4TB NVMe M.2 SSD",
    category: "Storage",
    price: 289.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
    description: "Massive 4TB high-speed PCIe Gen4 NVMe solid-state drive with integrated low-profile heatsink.",
    specs: { capacity: "4TB", interface: "PCIe Gen 4.0 x4", readSpeed: "7000 MB/s", formFactor: "M.2 2280" }
  },
  // Power Supplies
  {
    id: "psu-corsair-rm1000",
    name: "Corsair RM1000x 1000W 80+ Gold",
    category: "Power Supply",
    price: 189.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
    description: "Fully modular ATX power supply, certified 80 PLUS Gold efficiency with zero-RPM fan mode.",
    specs: { wattage: "1000W", efficiency: "80+ Gold", modular: "Fully Modular", rails: "Single +12V" }
  },
  {
    id: "psu-seasonic-750",
    name: "Seasonic Focus GX-750 750W 80+ Gold",
    category: "Power Supply",
    price: 119.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
    description: "Compact high-performance 750W power supply. Fully modular design with premium components.",
    specs: { wattage: "750W", efficiency: "80+ Gold", modular: "Fully Modular", rails: "Single +12V" }
  }
];

const services = [
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

// In-memory logs
const orders = [];
const bookings = [];

// API Endpoints
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.post('/api/orders', (req, res) => {
  const { cart, billing } = req.body;
  if (!cart || cart.length === 0 || !billing) {
    return res.status(400).json({ error: "Missing cart details or billing information." });
  }

  const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const newOrder = {
    orderId,
    cart,
    billing,
    status: 'Processing',
    timestamp: new Date()
  };

  orders.push(newOrder);
  console.log(`[Order Placed] ID: ${orderId}, Total items: ${cart.length}`);
  res.json({ success: true, orderId, message: "Order placed successfully! We've sent details to your email." });
});

app.post('/api/bookings', (req, res) => {
  const { serviceId, name, email, date, details } = req.body;
  if (!serviceId || !name || !email || !date) {
    return res.status(400).json({ error: "Missing required booking details (service, name, email, date)." });
  }

  const selectedService = services.find(s => s.id === serviceId);
  if (!selectedService) {
    return res.status(404).json({ error: "Service not found." });
  }

  const bookingId = 'BKG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const newBooking = {
    bookingId,
    service: selectedService,
    name,
    email,
    date,
    details,
    status: 'Scheduled',
    timestamp: new Date()
  };

  bookings.push(newBooking);
  console.log(`[Service Booked] ID: ${bookingId}, Service: ${selectedService.name}, Customer: ${name}`);
  res.json({ success: true, bookingId, message: `Booking confirmed for ${selectedService.name} on ${date}.` });
});

// PC Builder Compatibility Validator Endpoint
app.post('/api/compatibility', (req, res) => {
  const { parts } = req.body; // Array of product objects or IDs
  
  if (!parts || !Array.isArray(parts)) {
    return res.status(400).json({ error: "Invalid parts array provided." });
  }

  const warnings = [];
  const selectedCpu = parts.find(p => p.category === 'CPU');
  const selectedMb = parts.find(p => p.category === 'Motherboard');
  const selectedGpu = parts.find(p => p.category === 'GPU');
  const selectedPsu = parts.find(p => p.category === 'Power Supply');

  // 1. Socket Check
  if (selectedCpu && selectedMb) {
    if (selectedCpu.specs.socket !== selectedMb.specs.socket) {
      warnings.push(`Socket Mismatch: CPU "${selectedCpu.name}" uses ${selectedCpu.specs.socket}, but motherboard "${selectedMb.name}" has socket ${selectedMb.specs.socket}.`);
    }
  }

  // 2. Power Wattage Check
  if (selectedPsu) {
    let totalEstPower = 0;
    // Base system draw
    totalEstPower += 50; 
    
    if (selectedCpu) {
      const cpuPower = parseInt(selectedCpu.specs.power) || 100;
      totalEstPower += cpuPower;
    }
    if (selectedGpu) {
      const gpuPower = parseInt(selectedGpu.specs.powerDraw) || 200;
      totalEstPower += gpuPower;
    }

    const psuCapacity = parseInt(selectedPsu.specs.wattage) || 500;
    
    if (totalEstPower > psuCapacity) {
      warnings.push(`Insufficent Power: Your components draw an estimated ${totalEstPower}W, exceeding the ${psuCapacity}W rating of "${selectedPsu.name}".`);
    } else if (totalEstPower * 1.25 > psuCapacity) {
      warnings.push(`Low Wattage Headroom: Estimated draw is ${totalEstPower}W. We recommend at least 20-30% headroom (current headroom is only ${Math.round((1 - totalEstPower/psuCapacity)*100)}%).`);
    }
  }

  res.json({
    compatible: warnings.length === 0,
    warnings,
    estimatedWattage: parts.reduce((acc, curr) => {
      if (curr.category === 'CPU') return acc + (parseInt(curr.specs.power) || 100);
      if (curr.category === 'GPU') return acc + (parseInt(curr.specs.powerDraw) || 200);
      return acc + 10; // other components draw minimal power
    }, 50)
  });
});

app.listen(PORT, () => {
  console.log(`ByteForge Backend running on port ${PORT}`);
});
