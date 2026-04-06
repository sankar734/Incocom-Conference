import React from 'react';
import { Link } from 'react-router-dom';
import nprLogo from '../assets/npr-logo.jpg';

const facultyCoords = [
  {name:'Dr. V. Tamilselvi',role:'HoD(i/c) – MBA',phone:'+91-99438 19028'},
  {name:'Dr. B. N. Bobinath',role:'HoD(i/c) – MCA',phone:'+91-99942 75042'},
  {name:'Mr. V. S. Arjun Athithya',role:'AP – MBA',phone:'+91-97874 63622'},
  {name:'Mrs. R. Shariga',role:'AP – MBA',phone:'+91-96296 08666'},
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white pt-14 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={nprLogo} alt="NPR" className="h-14 w-auto object-contain bg-white rounded-xl p-1 shadow-lg shadow-black/20" />
              <div>
                <div className="font-display font-black text-gold-400 text-lg">INCOCOM 2K26</div>
                <div className="text-white/45 text-xs">6th International Conference</div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-3 max-w-sm">
              Contemporary Management &amp; Computing · April 21, 2026 · Hybrid Mode<br/>
              Dr. APJ. Abdul Kalam Hall, NPR CET, Dindigul
            </p>
            <p className="text-white/40 text-xs">NBA &amp; NAAC 'A' Grade · ISO 9001:2015 · Affiliated to Anna University, Chennai</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-1.5">
              {[['/#about-college','About College'],['/#about-dept','About Department'],['/#conference-details','Conference Details'],['/#sub-themes','Sub Themes'],['/#committee','Committee'],['/#dates','Important Dates'],['/register','Register Now']].map(([href,label])=>(
                <li key={label}>{href.startsWith('/')&&!href.startsWith('/#')?<Link to={href} className="text-white/50 hover:text-gold-400 text-sm transition-colors">{label}</Link>:<a href={href} className="text-white/50 hover:text-gold-400 text-sm transition-colors">{label}</a>}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Contact</h4>
            <div className="space-y-3">
              {facultyCoords.map(f=>(
                <div key={f.name}>
                  <p className="text-white/80 font-semibold text-xs">{f.name}</p>
                  <p className="text-white/45 text-xs">{f.role}</p>
                  <a href={`tel:${f.phone.replace(/\s/g,'')}`} className="text-gold-400 text-xs font-mono hover:underline">{f.phone}</a>
                </div>
              ))}
              <div className="pt-2 border-t border-white/10">
                <a href="mailto:nprcetincocom@nprcolleges.org" className="text-teal-400 text-xs hover:underline block break-all">nprcetincocom@nprcolleges.org</a>
                <a href="https://www.nprcet.edu.in" target="_blank" rel="noreferrer" className="text-teal-400 text-xs hover:underline block mt-1">www.nprcet.edu.in</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">© 2026 INCOCOM 2K26 · NPR College of Engineering and Technology · All rights reserved</p>
          <p className="text-white/25 text-xs">Organized by Dept. of MBA &amp; MCA · Natham, Dindigul, Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
}
