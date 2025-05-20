import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <nav className="from bg-black  text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white via-gray-400 to-gray-500 bg-clip-text text-transparent">
      Bit<span className="text-amber-500">Reclaim</span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6 text-sm font-medium">
        <a href="#features" className="hover:text-amber-500 transition">Features</a>
        <a href="#how" className="hover:text-amber-500 transition">How It Works</a>
        <a href="#faq" className="hover:text-amber-500 transition">FAQ</a>
        <a href="#contact" className="hover:text-amber-500 transition">Contact</a>
        <button className="bg-amber-500 text-black px-4 py-2 rounded-md hover:brightness-90 transition">
          Get Started
        </button>
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black px-6 py-4 space-y-4 text-sm">
          <a href="#features" className="block hover:text-amber-500">Features</a>
          <a href="#how" className="block hover:text-amber-500">How It Works</a>
          <a href="#faq" className="block hover:text-amber-500">FAQ</a>
          <a href="#contact" className="block hover:text-amber-500">Contact</a>
          <button className="w-full bg-amber-500 text-black py-2 rounded-md mt-2 hover:brightness-90">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
