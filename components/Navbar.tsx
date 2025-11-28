import React, { useEffect, useState } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onHome }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/70 to-transparent'}`}>
      <div className="flex items-center justify-between px-4 md:px-16 py-4 h-[68px]">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center space-x-8">
          <button onClick={onHome} className="text-[#E50914] text-2xl md:text-3xl font-bold cursor-pointer transition-transform tracking-tight">
            STREAMGEN
          </button>
          <ul className="hidden md:flex space-x-5 text-sm text-[#e5e5e5]">
            <li className="hover:text-gray-300 cursor-pointer transition font-medium" onClick={onHome}>Home</li>
            <li className="hover:text-gray-300 cursor-pointer transition font-normal">TV Shows</li>
            <li className="hover:text-gray-300 cursor-pointer transition font-normal">Movies</li>
            <li className="hover:text-gray-300 cursor-pointer transition font-normal">New & Popular</li>
            <li className="hover:text-gray-300 cursor-pointer transition font-normal">My List</li>
          </ul>
        </div>

        {/* Right Side: Search & Icons */}
        <div className="flex items-center space-x-6">
          <div className={`flex items-center bg-black/0 border ${showSearch ? 'bg-black/80 border-white w-full md:w-64 px-2' : 'border-transparent w-8'} transition-all duration-300 overflow-hidden rounded-none`}>
            <Search 
              className="w-5 h-5 text-white cursor-pointer min-w-[20px]" 
              onClick={() => setShowSearch(!showSearch)} 
            />
            <form onSubmit={handleSearchSubmit} className="w-full">
              <input 
                type="text" 
                placeholder="Titles, people, genres" 
                className={`bg-transparent border-none outline-none text-white text-sm ml-3 h-8 w-full ${showSearch ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setShowSearch(false)}
              />
            </form>
          </div>
          
          <div className="hidden md:flex items-center space-x-5 text-white">
            <span className="text-sm cursor-pointer font-medium">Kids</span>
            <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" />
            <div className="flex items-center space-x-2 cursor-pointer group">
              <img src="https://picsum.photos/seed/user/40/40" alt="Profile" className="w-8 h-8 rounded-sm" />
              <div className="w-0 group-hover:w-2 h-0 group-hover:h-2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white transition-all transform group-hover:rotate-180"></div>
            </div>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141414] absolute top-[68px] left-0 w-full p-4 flex flex-col space-y-4 border-t border-gray-800 animate-fade-in shadow-2xl h-screen">
             <ul className="flex flex-col space-y-4 text-lg text-gray-300 font-bold text-center mt-8">
                <li className="hover:text-white" onClick={() => { onHome(); setMobileMenuOpen(false); }}>Home</li>
                <li className="hover:text-white">TV Shows</li>
                <li className="hover:text-white">Movies</li>
                <li className="hover:text-white">New & Popular</li>
                <li className="hover:text-white">My List</li>
             </ul>
        </div>
      )}
    </nav>
  );
};