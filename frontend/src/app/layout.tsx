import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "ByteForge | Premium Computer Hardware & Shop Services",
  description: "Forged for performance. Shop premium graphics cards, high-speed processors, motherboards, and book professional hardware maintenance services.",
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <CartProvider>
          {/* Background Glow Effects */}
          <div className="background-glow">
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
            <div className="glow-orb orb-3"></div>
          </div>
          
          <Header />
          <main style={{ minHeight: '80vh', paddingTop: '2.5rem' }}>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
