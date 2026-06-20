import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const dates = [
  { icon:'📄', label:'Last Date for Paper Submission', date:'10.04.2026', day:'Friday',   bg:'from-teal-500 to-teal-600' },
  { icon:'📬', label:'Notification of Acceptance',     date:'13.04.2026', day:'Monday',   bg:'from-navy-600 to-navy-800' },
  { icon:'🎓', label:'Conference Date',                date:'21.04.2026', day:'Tuesday',  bg:'from-gold-500 to-gold-600' },
];

const VENUE_MAP_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d77.9!3d10.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zTlBSIENvbGxlZ2U!5e0!3m2!1sen!2sin!4v1';

export default function ImportantDates() {
  const [showVenue, setShowVenue] = useState(false);

  return (
    <section id="dates" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="section-label">Timeline</span>
          <h2 className="section-title">Important Dates</h2>
          <div className="section-divider mx-auto" />
        </div>

        {/* Timeline cards */}
        <div className="relative max-w-3xl mx-auto mb-16">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 via-navy-700 to-gold-500 -translate-x-1/2" />
          {dates.map((d, i) => (
            <div key={d.label} className={`relative flex items-center gap-6 mb-10 last:mb-0 ${i%2===0?'md:flex-row':'md:flex-row-reverse'}`}>
              <div className="flex-1">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{d.icon}</span>
                    <span className="text-xs font-bold tracking-wider uppercase text-slate-400">{d.day}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-navy-800 mb-1">{d.label}</h3>
                  <p className="font-mono font-black text-3xl text-navy-900">{d.date}</p>
                </div>
              </div>
              <div className={`hidden md:flex flex-shrink-0 w-12 h-12 bg-gradient-to-br ${d.bg} rounded-full items-center justify-center text-white font-bold z-10 shadow-lg`}>{i+1}</div>
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>

        {/* Venue section with clickable hall */}
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-3xl p-8 md:p-10 text-white mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display font-bold text-2xl text-gold-400 mb-3">Conference Venue</h3>
              <div className="space-y-2 mb-5">
                <p className="text-white font-bold text-lg">Dr. APJ. Abdul Kalam Hall</p>
                <p className="text-white/70 text-sm">NPR College of Engineering and Technology</p>
                <p className="text-white/60 text-sm">Natham, Dindigul (Dist.) – 624 401, Tamil Nadu</p>
                <p className="text-white/60 text-sm">Conference Date: <span className="text-gold-400 font-bold">21.04.2026 (Tuesday)</span></p>
                <p className="text-white/60 text-sm">Mode: <span className="text-teal-400 font-bold">Hybrid (Online + Offline)</span></p>
              </div>
              <button onClick={() => setShowVenue(!showVenue)}
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-5 py-2.5 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-gold-500/30">
                📍 {showVenue ? 'Hide Location Map' : 'View Location on Map'}
              </button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h4 className="font-bold text-gold-400 mb-3 text-sm uppercase tracking-wide">Hybrid Mode Details</h4>
              <div className="space-y-3">
                {[
                  {icon:'🏛️', label:'Physical Attendance', desc:'Present your paper in person at Dr. APJ. Abdul Kalam Hall'},
                  {icon:'💻', label:'Virtual Attendance', desc:'Join via Zoom/Google Meet — link sent after registration'},
                  {icon:'🎙️', label:'Presentation', desc:'12–16 slides · 10 minutes presentation + 5 min Q&A'},
                  {icon:'📚', label:'Publication', desc:'ISBN Book + selected papers in Scopus-indexed journals'},
                ].map(i => (
                  <div key={i.label} className="flex gap-3 items-start">
                    <span className="text-lg flex-shrink-0">{i.icon}</span>
                    <div>
                      <p className="text-white/85 font-semibold text-xs">{i.label}</p>
                      <p className="text-white/50 text-xs">{i.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          {showVenue && (
            <div className="mt-6 rounded-2xl overflow-hidden border border-white/10">
              <div className="bg-white/5 px-4 py-2 flex items-center gap-2 border-b border-white/10">
                <span className="text-sm">📍</span>
                <span className="text-white/70 text-sm font-medium">NPR College of Engineering and Technology, Natham, Dindigul</span>
                <a href="https://maps.google.com/?q=NPR+College+of+Engineering+Natham+Dindigul" target="_blank" rel="noreferrer"
                  className="ml-auto text-teal-400 text-xs font-bold hover:text-teal-300 transition-colors">Open in Google Maps ↗</a>
              </div>
              <div className="w-full h-64 bg-slate-700 flex items-center justify-center">
                <div className="text-center px-4">
                  <div className="text-4xl mb-3">🗺️</div>
                  <p className="text-white font-bold text-base mb-1">Dr. APJ. Abdul Kalam Hall</p>
                  <p className="text-white/60 text-sm mb-3">NPR College of Engineering and Technology<br/>Natham, Dindigul – 624 401, Tamil Nadu</p>
                  <a href="https://maps.google.com/?q=NPR+College+of+Engineering+Natham+Dindigul+Tamil+Nadu"
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold px-5 py-2 rounded-full text-sm transition-all">
                    📍 Get Directions on Google Maps
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Publication details */}
        <div id="publication" className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-teal-600">Publication</span>
            <h3 className="font-display font-bold text-3xl text-navy-800 mt-2 mb-3">Publication Details</h3>
            <div className="w-12 h-1 bg-gradient-to-r from-gold-500 to-teal-500 rounded-full mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {icon:'📚', title:'ISBN Edited Book', desc:'Selected papers published in an edited book with ISBN. Soft copy shared with authors via email.'},
              {icon:'📖', title:'Hard Copy Available', desc:'Hard copy of the ISBN book available at ₹1,000/- per copy in addition to registration fee.'},
              {icon:'🔬', title:'Scopus-Indexed Journals', desc:'High-quality, peer-reviewed papers may be considered for Scopus-indexed journal publication.'},
              {icon:'✅', title:'Double-Blind Review', desc:'All papers undergo rigorous double-blind peer review by the Editorial Board.'},
            ].map(p => (
              <div key={p.title} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <span className="text-3xl flex-shrink-0">{p.icon}</span>
                <div>
                  <h4 className="font-bold text-navy-800 mb-1">{p.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/register" className="btn-primary inline-flex">Submit Your Paper →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
