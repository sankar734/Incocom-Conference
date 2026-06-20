import React from 'react';
import { Link } from 'react-router-dom';

const THEME_CARDS = [
  { slug:'ai-analytics',            icon:'🤖', title:'AI, Analytics & Data Science',               desc:'ML, Big Data, Predictive Analytics, NLP, Deep Learning in business contexts', color:'from-purple-600 to-indigo-700', topics:['AI in Finance','Business Analytics','Big Data','Machine Learning','Data Visualization'] },
  { slug:'finance-hr-marketing',    icon:'📊', title:'Finance, HR & Marketing Strategy',           desc:'Strategic finance, HR analytics, consumer behavior, brand management, digital marketing', color:'from-blue-600 to-cyan-600',    topics:['Financial Management','HR Analytics','Consumer Behaviour','Brand Building','International Business'] },
  { slug:'strategy-entrepreneurship',icon:'🚀', title:'Strategy, Entrepreneurship & Sustainability',desc:'Innovation ecosystems, startups, sustainable development, supply chain, CSR', color:'from-green-600 to-teal-600',   topics:['Strategic Management','Entrepreneurship','Sustainable Development','Supply Chain','Tourism & Hospitality'] },
  { slug:'blockchain-erp',          icon:'⛓️', title:'Blockchain & ERP Systems',                  desc:'Distributed ledgers, smart contracts, enterprise systems, SAP/Oracle implementations', color:'from-orange-600 to-red-600',   topics:['Blockchain Technology','Smart Contracts','ERP Systems','Hyperledger','Digital Assets'] },
  { slug:'fintech',                 icon:'💳', title:'FinTech Innovations',                        desc:'Digital payments, open banking, robo-advisors, InsurTech, CBDC, financial inclusion', color:'from-yellow-500 to-orange-500', topics:['Digital Banking','UPI Ecosystem','FinTech','InsurTech','Mobile Payments'] },
  { slug:'e-governance',            icon:'🏛️', title:'E-Governance & Digital Transformation',     desc:'Smart cities, digital services, IT disruptions, platform economies, content management', color:'from-indigo-600 to-purple-700', topics:['E-Governance','Digital India','Smart Cities','IT Disruptions','Digital Business Models'] },
  { slug:'other',                   icon:'🌐', title:'Other',                                     desc:'Research areas not covered under the above themes but relevant to the conference scope', color:'from-slate-500 to-slate-700',  topics:['Interdisciplinary Research','Emerging Topics','Cross-domain Studies','Novel Research'] },
];

export default function SubThemes() {
  return (
    <section id="sub-themes" className="py-24 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-hidden">
      <div className="absolute inset-0 hero-grid-bg opacity-40" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="section-label gold">Research Tracks</span>
          <h2 className="section-title light">Conference Sub-Themes</h2>
          <div className="section-divider mx-auto" />
          <p className="text-white/55 max-w-2xl mx-auto text-sm">Click any theme card to explore detailed research topics and submit your paper under that track.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEME_CARDS.map((theme) => (
            <Link key={theme.slug} to={`/themes/${theme.slug}`}
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/25 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 cursor-pointer block">

              {/* Icon + gradient bar */}
              <div className={`w-14 h-14 bg-gradient-to-br ${theme.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {theme.icon}
              </div>

              <h3 className="font-display font-bold text-white text-base leading-tight mb-2 group-hover:text-gold-300 transition-colors">{theme.title}</h3>
              <p className="text-white/55 text-xs leading-relaxed mb-4">{theme.desc}</p>

              {/* Topic pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {theme.topics.slice(0,3).map(t => (
                  <span key={t} className="bg-white/10 text-white/65 text-[10px] px-2 py-0.5 rounded-full font-medium">{t}</span>
                ))}
                {theme.topics.length > 3 && (
                  <span className="bg-white/10 text-white/45 text-[10px] px-2 py-0.5 rounded-full">+{theme.topics.length-3} more</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-teal-400 text-xs font-bold group-hover:text-gold-400 transition-colors">Explore Track →</span>
                <span className="text-white/25 text-xs">Click to view</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
