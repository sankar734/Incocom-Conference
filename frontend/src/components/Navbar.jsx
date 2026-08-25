import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import nprLogo from '../assets/npr-logo.jpg';

const NAV = [
  { label: 'Home',            href: '/#home',              hash: '#home' },
  { label: 'About College',   href: '/#about-college',     hash: '#about-college' },
  { label: 'About Dept',      href: '/#about-dept',        hash: '#about-dept' },
  { label: 'Conference',      href: '/#conference-details',hash: '#conference-details' },
  { label: 'Sub Themes',      href: '/#sub-themes',        hash: '#sub-themes' },
  { label: 'Committee',       href: '/#committee',         hash: '#committee' },
  { label: 'Dates',           href: '/#dates',             hash: '#dates' },
  { label: 'Track Status',    to: '/track' },
  { label: 'Register',        to: '/register',             isCta: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState('');
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Active section highlight when on home page
  useEffect(() => {
    if (location.pathname !== '/') {
      setActive('');
      return;
    }
    const handleScroll = () => {
      NAV.forEach(item => {
        if (item.hash) {
          const section = document.querySelector(item.hash);
          if (section) {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;

            if (window.scrollY >= top && window.scrollY < bottom) {
              setActive(item.hash);
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => setOpen(false), [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-navy-900/98 backdrop-blur-lg shadow-xl shadow-black/30 border-b border-white/10 py-1.5' 
        : 'bg-navy-950/85 backdrop-blur-md border-b border-white/10 py-2 sm:py-2.5'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 group">
            <img 
              src={nprLogo} 
              alt="NPR Logo" 
              className="h-9 sm:h-10 w-auto object-contain bg-white rounded-lg p-0.5 shadow-md transition-transform group-hover:scale-105" 
            />
            <div className="flex flex-col justify-center">
              <span className="font-display font-black text-gold-400 text-sm sm:text-base leading-tight tracking-wide">
                INCOCOM 2K26
              </span>
              <span className="text-white/60 text-[10px] sm:text-xs leading-none mt-0.5">
                NPR CET · Dindigul
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1.5 2xl:gap-2">
            {NAV.map(item => {
              const isCurrent = item.to ? location.pathname === item.to : active === item.hash;
              
              if (item.to) {
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                        : item.isCta
                        ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white shadow-md hover:scale-105 hover:shadow-orange-500/25'
                        : 'bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:scale-105 shadow-sm'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                      : 'bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:scale-105 shadow-sm'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

            {/* Admin Link */}
            <Link 
              to="/admin/login" 
              className="inline-flex items-center justify-center ml-1 px-3 py-1.5 rounded-full text-xs font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setOpen(!open)} 
            className="xl:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors focus:outline-none" 
            aria-label="Toggle Navigation Menu"
          >
            <div className="w-6 space-y-1.5 flex flex-col items-center justify-center">
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 rounded-full ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 rounded-full ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 rounded-full ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div className="xl:hidden bg-navy-950/98 backdrop-blur-2xl border-t border-white/10 mt-2 py-4 px-3 rounded-2xl shadow-2xl space-y-2 animate-slide-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NAV.map(item => {
                const isCurrent = item.to ? location.pathname === item.to : active === item.hash;

                if (item.to) {
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={`block w-full py-2.5 px-4 text-center text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                          : item.isCta
                          ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white font-bold'
                          : 'bg-gradient-to-r from-pink-500 to-orange-400 text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block w-full py-2.5 px-4 text-center text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : 'bg-gradient-to-r from-pink-500 to-orange-400 text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/10 text-center">
              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="inline-block py-2 px-6 text-xs text-white/50 hover:text-white transition-colors"
              >
                🔐 Admin Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}