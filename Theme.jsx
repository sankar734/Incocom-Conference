import React from 'react';

const mgmtThemes = [
  'Strategic Management & Business Transformation',
  'HR Management & HR Analytics',
  'Marketing Management & Consumer Behaviour',
  'Financial Management & Financial Engineering',
  'International Business, Trade & Global Markets',
  'Supply Chain & Logistics Management',
  'Brand Building & Corporate Reputation',
  'Innovation, Entrepreneurship & Start-ups',
  'Inclusive Growth & Sustainable Development',
  'Tourism & Hospitality Management',
];

const techThemes = [
  'Artificial Intelligence Applications in Finance, Marketing & HR',
  'Business Analytics, Big Data & Competitive Advantage',
  'IT Disruptions & Contemporary Business Issues',
  'E-Governance & Digital Public Services',
  'Innovation in E-Business & Digital Business Models',
  'Enterprise Resource Planning (ERP) Systems',
  'Banking Technology & FinTech Innovations',
  'Blockchain Technology & Business Applications',
  'Content Management Systems & Digital Platforms',
  'Social Media Management & Digital Marketing Analytics',
  'Neuro Marketing & Technology-Driven Consumer Insights',
  'Business Aggregators & Platform-Based Economies',
];

export default function SubThemes() {
  return (
    <section id="sub-themes" className="py-24 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-hidden">
      <div className="absolute inset-0 hero-grid-bg opacity-50" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="section-label gold">Conference Sub-Themes</span>
          <h2 className="section-title light">Areas of Research</h2>
          <div className="section-divider mx-auto" />
          <p className="text-white/60 max-w-2xl mx-auto">Submit papers across two interdisciplinary tracks combining management science with cutting-edge computing technologies.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Management Track */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-2xl">📊</div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">Management &amp; Business Domains</h3>
                <p className="text-white/50 text-xs mt-0.5">{mgmtThemes.length} sub-themes</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {mgmtThemes.map((t, i) => (
                <li key={i} className="flex gap-3 items-start group">
                  <span className="flex-shrink-0 w-5 h-5 bg-teal-500/20 border border-teal-500/30 rounded text-teal-400 text-[10px] flex items-center justify-center font-bold mt-0.5 group-hover:bg-teal-500 group-hover:text-white transition-all">{i+1}</span>
                  <span className="text-white/75 text-sm leading-relaxed group-hover:text-white transition-colors">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Computing Track */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-2xl">💻</div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">Computing, Analytics &amp; Digital Transformation</h3>
                <p className="text-white/50 text-xs mt-0.5">{techThemes.length} sub-themes</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {techThemes.map((t, i) => (
                <li key={i} className="flex gap-3 items-start group">
                  <span className="flex-shrink-0 w-5 h-5 bg-gold-500/20 border border-gold-500/30 rounded text-gold-400 text-[10px] flex items-center justify-center font-bold mt-0.5 group-hover:bg-gold-500 group-hover:text-navy-900 transition-all">{i+1}</span>
                  <span className="text-white/75 text-sm leading-relaxed group-hover:text-white transition-colors">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
