// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import nprLogo from '../assets/npr-logo.jpg';

// const NAV = [
//   { label:'Home',            href:'/#home' },
//   { label:'About College',   href:'/#about-college' },
//   { label:'About Dept',      href:'/#about-dept' },
//   { label:'Conference',      href:'/#conference-details' },
//   { label:'Sub Themes',      href:'/#sub-themes' },
//   { label:'Committee',       href:'/#committee' },
//   { label:'Dates',           href:'/#dates' },
//   { label:'Register',        to:'/register', highlight:true },
// ];

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [open, setOpen]         = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', fn);
//     return () => window.removeEventListener('scroll', fn);
//   }, []);

//   useEffect(() => setOpen(false), [location]);

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-900/98 backdrop-blur-lg shadow-xl shadow-black/20' : 'bg-transparent'}`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6">
//         <div className="flex items-center justify-between h-16">

//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
//             <img src={nprLogo} alt="NPR" className="h-9 w-auto object-contain bg-white rounded-lg p-0.5 shadow" />
//             <div className="hidden sm:block">
//               <div className="font-display font-bold text-gold-400 text-sm leading-tight">INCOCOM 2K26</div>
//               <div className="text-white/45 text-[10px]">NPR CET · Dindigul</div>
//             </div>
//           </Link>

//           {/* Desktop links */}
//           <div className="hidden xl:flex items-center gap-4">
//             {NAV.map(item => (
//               item.to ? (
//                 <Link key={item.label} to={item.to}
//                   className={item.highlight
//                     ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-black text-xs px-5 py-2 rounded-full hover:shadow-lg hover:shadow-gold-500/30 transition-all'
//                     : 'nav-link text-xs'}>
//                   {item.label}
//                 </Link>
//               ) : (
//                 <a key={item.label} href={item.href} className="nav-link text-xs">{item.label}</a>
//               )
//             ))}
//             <Link to="/admin/login" className="nav-link text-xs opacity-40 hover:opacity-70">Admin</Link>
//           </div>

//           {/* Mobile burger */}
//           <button onClick={()=>setOpen(!open)} className="xl:hidden p-2 text-white" aria-label="Toggle menu">
//             <div className="w-5 space-y-1.5">
//               <span className={`block h-0.5 bg-white transition-all duration-300 ${open?'rotate-45 translate-y-2':''}`} />
//               <span className={`block h-0.5 bg-white transition-all duration-300 ${open?'opacity-0':''}`} />
//               <span className={`block h-0.5 bg-white transition-all duration-300 ${open?'-rotate-45 -translate-y-2':''}`} />
//             </div>
//           </button>
//         </div>

//         {/* Mobile menu */}
//         {open && (
//           <div className="xl:hidden bg-navy-900/98 backdrop-blur-lg border-t border-white/10 py-3 animate-slide-down">
//             {NAV.map(item => (
//               item.to ? (
//                 <Link key={item.label} to={item.to} onClick={()=>setOpen(false)}
//                   className={`block px-4 py-2.5 text-sm font-medium ${item.highlight?'text-gold-400 font-bold':'text-white/80 hover:text-gold-400'} transition-colors`}>
//                   {item.label}
//                 </Link>
//               ) : (
//                 <a key={item.label} href={item.href} onClick={()=>setOpen(false)}
//                   className="block px-4 py-2.5 text-white/80 hover:text-gold-400 text-sm font-medium transition-colors">
//                   {item.label}
//                 </a>
//               )
//             ))}
//             <Link to="/admin/login" onClick={()=>setOpen(false)} className="block px-4 py-2.5 text-white/40 hover:text-white/70 text-sm transition-colors">Admin Panel</Link>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }




import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import nprLogo from '../assets/npr-logo.jpg';

const NAV = [
  { label:'Home',            href:'#home' },
  { label:'About College',   href:'#about-college' },
  { label:'About Dept',      href:'#about-dept' },
  { label:'Conference',      href:'#conference-details' },
  { label:'Sub Themes',      href:'#sub-themes' },
  { label:'Committee',       href:'#committee' },
  { label:'Dates',           href:'#dates' },
  { label:'Register',        to:'/register' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Active section highlight
  useEffect(() => {
    const handleScroll = () => {
      NAV.forEach(item => {
        if (item.href) {
          const section = document.querySelector(item.href);
          if (section) {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;

            if (window.scrollY >= top && window.scrollY < bottom) {
              setActive(item.href);
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-navy-900/98 backdrop-blur-lg shadow-xl shadow-black/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img src={nprLogo} alt="NPR" className="h-9 w-auto object-contain bg-white rounded-lg p-0.5 shadow" />
            <div className="hidden sm:block">
              <div className="font-display font-bold text-gold-400 text-sm leading-tight  text-[15px]">INCOCOM 2K26</div>
              <div className="text-white/45 text-[10px]">NPR CET · Dindigul</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-4">
            {NAV.map(item => (
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:scale-105 transition-all"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    active === item.href
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:scale-105'
                  }`}
                >
                  {item.label}
                </a>
              )
            ))}

            <Link to="/admin/login" className="px-3 py-2 text-xs text-white/40 hover:text-white/70">
              Admin
            </Link>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setOpen(!open)} className="xl:hidden p-2 text-white">
            <div className="w-5 space-y-1.5">
              <span className={`block h-0.5 bg-white ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-white ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-white ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="xl:hidden bg-navy-900/98 backdrop-blur-lg border-t border-white/10 py-3">
            {NAV.map(item => (
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm font-semibold bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full mx-3 my-1 text-center"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2 text-sm font-semibold mx-3 my-1 text-center rounded-full ${
                    active === item.href
                      ? 'bg-blue-500 text-white'
                      : 'bg-gradient-to-r from-pink-500 to-orange-400 text-white'
                  }`}
                >
                  {item.label}
                </a>
              )
            ))}

            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-white/50 text-center text-sm"
            >
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}