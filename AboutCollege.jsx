import React from 'react';

const stats = [
  { val: '20+', label: 'Years of Excellence' },
  { val: 'NBA', label: 'Accredited Programs' },
  { val: "NAAC 'A'", label: 'Grade Accredited' },
  { val: '5000+', label: 'Alumni Network' },
];

const achievements = [
  { icon: '🏆', title: 'NBA Accreditation', desc: 'B.E. - CSE, ECE, EEE & Mechanical Engineering programs accredited by NBA' },
  { icon: '⭐', title: "NAAC 'A' Grade", desc: 'Accredited by National Assessment and Accreditation Council with A Grade' },
  { icon: '📜', title: 'UGC Recognized', desc: 'Recognized by UGC under 2(f), approved by AICTE, New Delhi' },
  { icon: '🎓', title: 'Anna University Affiliated', desc: 'Affiliated to Anna University, Chennai – one of India\'s premier technical universities' },
  { icon: '🔬', title: 'Research & Innovation', desc: 'Active Innovation Cell and research programs with industry collaboration' },
  { icon: '🌐', title: 'Global Connections', desc: 'MoUs with international universities and industry partners across the globe' },
];

export default function AboutCollege() {
  return (
    <section id="about-college" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="section-label">Our Institution</span>
          <h2 className="section-title">About the College</h2>
          <div className="section-divider mx-auto" />
          <p className="text-slate-600 max-w-3xl mx-auto text-base leading-relaxed">
            NPR College of Engineering and Technology, an autonomous institution affiliated to Anna University, Chennai,
            stands as a beacon of technical education in the Dindigul district of Tamil Nadu. Founded with a vision to
            nurture innovation and excellence, the college has consistently produced industry-ready graduates.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-6 bg-gradient-to-br from-navy-800 to-navy-600 rounded-2xl text-white shadow-lg shadow-navy-800/20">
              <div className="font-display font-black text-3xl text-gold-400 mb-1">{s.val}</div>
              <div className="text-white/70 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-2xl p-8">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-display font-bold text-2xl text-navy-800 mb-3">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed">To be a premier institution of higher learning that fosters knowledge, innovation, and entrepreneurship to produce globally competent engineers and managers who contribute meaningfully to society.</p>
          </div>
          <div className="bg-gradient-to-br from-gold-500/10 to-gold-600/5 border border-gold-500/20 rounded-2xl p-8">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-display font-bold text-2xl text-navy-800 mb-3">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">To provide quality technical education through innovative teaching-learning processes, industry collaboration, and research activities that create ethical, skilled, and socially responsible professionals.</p>
          </div>
        </div>

        {/* Achievements */}
        <h3 className="font-display font-bold text-2xl text-navy-800 mb-6 text-center">Accreditations & Achievements</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((a) => (
            <div key={a.title} className="flex gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-2xl flex-shrink-0">{a.icon}</span>
              <div>
                <h4 className="font-bold text-navy-800 mb-1">{a.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
