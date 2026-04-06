import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import nprLogo from '../assets/npr-logo.jpg';

function CountUnit({ value, label }) {
  return (
    <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-3 sm:p-4 text-center min-w-[64px] sm:min-w-[76px]">
      <span className="block font-mono text-2xl sm:text-3xl font-bold text-gold-400 leading-none">{String(value??0).padStart(2,'0')}</span>
      <span className="block text-[0.58rem] text-white/45 uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

export default function Hero() {
  const [time, setTime] = useState({d:0,h:0,m:0,s:0});
  useEffect(() => {
    const target = new Date('2026-04-21T09:00:00');
    const tick = () => {
      const diff = target - Date.now();
      if (diff<=0) return setTime({d:0,h:0,m:0,s:0});
      setTime({ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) });
    };
    tick(); const id=setInterval(tick,1000); return()=>clearInterval(id);
  }, []);

  return (
    <section id="home" className="min-h-screen bg-hero-gradient flex items-center justify-center text-center px-4 pt-20 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 hero-grid-bg" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-80 h-80 sm:w-96 sm:h-96 bg-teal-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/5 w-72 h-72 sm:w-80 sm:h-80 bg-gold-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">

        {/* ── College Logo + Name ── */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-up">
          <img src={nprLogo} alt="NPR College of Engineering and Technology"
            className="h-16 sm:h-20 w-auto object-contain rounded-xl shadow-lg shadow-black/30 flex-shrink-0 bg-white p-1" />
        </div>

        {/* ── Below logo: INCOCOM + college name ── */}
        <div className="mb-6 animate-fade-up" style={{animationDelay:'0.05s'}}>
          <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/35 text-gold-400 text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
            INCOCOM 2K26 · 6th International Conference
          </div>
          <h2 className="font-display font-black text-white text-base sm:text-lg leading-tight mb-1">
            NPR College of Engineering and Technology
          </h2>
          <p className="text-white/50 text-xs">An Autonomous Institution · NBA &amp; NAAC 'A' Grade · ISO 9001:2015 · Anna University, Chennai</p>
          <p className="text-gold-400/80 text-xs mt-0.5">Natham, Dindigul (Dist.) – 624 401, Tamil Nadu</p>
        </div>

        {/* ── Conference Title ── */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-2 animate-fade-up" style={{animationDelay:'0.1s'}}>
          Contemporary <span className="text-gradient">Management</span><br/>
          &amp; <span className="text-gradient">Computing</span>
        </h1>
        <p className="text-white/75 text-lg sm:text-xl font-medium mb-4 animate-fade-up" style={{animationDelay:'0.15s'}}>(INCOCOM 2K26)</p>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-2 animate-fade-up" style={{animationDelay:'0.18s'}}>
          <span className="bg-teal-500/20 border border-teal-500/35 text-teal-300 text-xs font-bold px-4 py-1.5 rounded-full">Hybrid Mode</span>
          <span className="bg-teal-500/20 border border-teal-500/35 text-teal-300 text-xs font-bold px-4 py-1.5 rounded-full">21 April 2026 · Tuesday</span>
        </div>
        <p className="text-gold-400 font-medium text-sm mb-8 animate-fade-up" style={{animationDelay:'0.2s'}}>
          📍 Dr. APJ. Abdul Kalam Hall, NPR CET, Dindigul
        </p>

        {/* ── Countdown ── */}
        <div className="flex gap-2 sm:gap-3 justify-center flex-wrap mb-8 animate-fade-up" style={{animationDelay:'0.25s'}}>
          {[{v:time.d,l:'Days'},{v:time.h,l:'Hours'},{v:time.m,l:'Mins'},{v:time.s,l:'Secs'}].map(u=>(
            <CountUnit key={u.l} value={u.v} label={u.l} />
          ))}
        </div>

        {/* ── CTAs ── */}
        <div className="flex flex-wrap gap-3 justify-center mb-12 animate-fade-up" style={{animationDelay:'0.3s'}}>
          <Link to="/register" className="btn-primary text-base px-10 py-4 shadow-xl shadow-gold-500/25">✦ Register / Submit Paper</Link>
          <a href="#conference-details" className="btn-outline text-base">Call for Papers →</a>
        </div>

        {/* ── Key dates strip ── */}
        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto animate-fade-up" style={{animationDelay:'0.35s'}}>
          {[
            {label:'Paper Deadline',date:'10.04.2026'},
            {label:'Acceptance',date:'13.04.2026'},
            {label:'Conference',date:'21.04.2026'},
          ].map(d=>(
            <div key={d.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-white/45 text-[10px] uppercase tracking-wide mb-1">{d.label}</div>
              <div className="font-mono font-bold text-gold-400 text-sm">{d.date}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
