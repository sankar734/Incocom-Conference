import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import nprLogo from '../assets/npr-logo.jpg';

const NAV = [
  { label: 'Home',          href: '/#home',              hash: '#home' },
  { label: 'About College', href: '/#about-college',     hash: '#about-college' },
  { label: 'About Dept',    href: '/#about-dept',        hash: '#about-dept' },
  { label: 'Conference',    href: '/#conference-details',hash: '#conference-details' },
  { label: 'Sub Themes',    href: '/#sub-themes',        hash: '#sub-themes' },
  { label: 'Committee',     href: '/#committee',         hash: '#committee' },
  { label: 'Dates',         href: '/#dates',             hash: '#dates' },
  { label: 'Track Status',  to: '/track' },
  { label: 'Register',      to: '/register',             highlight: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState('');
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Active section highlight for home page
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
        ? 'bg-navy-900/95 backdrop-blur-lg shadow-xl shadow-black/30 border-b border-white/10' 
        : 'bg-navy-950/80 backdrop-blur-md border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img src={nprLogo} alt="NPR" className="h-10 sm:h-11 w-auto object-contain bg-white rounded-lg p-0.5 shadow transition-transform group-hover:scale-105" />
            <div>
              <div className="font-display font-black text-gold-400 text-sm sm:text-base leading-tight tracking-wide">INCOCOM 2K26</div>
              <div className="text-white/50 text-[10px] sm:text-xs">NPR CET · Dindigul</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-2">
            {NAV.map(item => (
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className={item.highlight
                    ? "px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 hover:shadow-lg hover:shadow-gold-500/25 hover:scale-105 transition-all ml-2"
                    : `px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                        location.pathname === item.to
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                    active === item.hash
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </a>
              )
            ))}

            <Link to="/admin/login" className="px-3 py-2 text-xs font-medium text-white/40 hover:text-white/80 transition-colors ml-1">
              Admin
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 space-y-1.5">
              <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="xl:hidden bg-navy-900/98 backdrop-blur-xl border-t border-white/10 py-4 px-2 animate-slide-down space-y-1 rounded-b-2xl shadow-2xl">
            {NAV.map(item => (
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 text-sm font-bold rounded-xl text-center transition-all ${
                    item.highlight
                      ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 shadow-md my-2'
                      : location.pathname === item.to
                      ? 'bg-teal-500/20 text-teal-300'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-semibold text-center rounded-xl transition-all ${
                    active === item.hash
                      ? 'bg-teal-500 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              )
            ))}

            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-white/40 hover:text-white/70 text-center text-xs pt-2"
            >
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}