import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export const THEME_DATA = {
  'ai-analytics': {
    slug: 'ai-analytics',
    title: 'AI, Analytics & Data Science',
    icon: '🤖',
    color: 'from-purple-600 to-indigo-700',
    accent: 'purple',
    tagline: 'Exploring Artificial Intelligence Applications in Business and Management',
    description: 'This track focuses on the transformative potential of Artificial Intelligence, Machine Learning, and Advanced Analytics in reshaping business functions including Finance, HR, Marketing, and Operations.',
    topics: [
      'AI Applications in Finance, Risk Analysis and Fraud Detection',
      'Machine Learning Models for Business Forecasting',
      'Natural Language Processing in Customer Service & HR',
      'Predictive Analytics for Marketing and Consumer Behavior',
      'Deep Learning in Image Recognition for Retail & Healthcare',
      'AI-Driven Decision Support Systems',
      'Big Data Analytics for Business Intelligence',
      'Data Visualization and Dashboard Design',
      'Neural Networks in Financial Market Prediction',
      'Responsible AI and Ethical Frameworks',
    ],
    papers: 'Original research, case studies, and review papers in AI/ML/Analytics',
  },
  'finance-hr-marketing': {
    slug: 'finance-hr-marketing',
    title: 'Finance, HR & Marketing Strategy',
    icon: '📊',
    color: 'from-blue-600 to-cyan-600',
    accent: 'blue',
    tagline: 'Strategic Management across Finance, Human Resources and Marketing',
    description: 'This track covers contemporary issues and innovations across the core business domains of Finance, Human Resource Management, and Marketing Strategy in a rapidly changing global environment.',
    topics: [
      'Strategic Financial Management and Capital Markets',
      'HR Analytics and Talent Management',
      'Consumer Behavior and Digital Marketing',
      'Brand Building and Reputation Management',
      'International Business and Global Trade',
      'Financial Engineering and Derivatives',
      'Employee Engagement and Organizational Culture',
      'Social Media Marketing and Influencer Strategy',
      'Mergers, Acquisitions and Corporate Finance',
      'Neuromarketing and Consumer Insights',
    ],
    papers: 'Empirical studies, case analysis, and conceptual papers in business management',
  },
  'strategy-entrepreneurship': {
    slug: 'strategy-entrepreneurship',
    title: 'Strategy, Entrepreneurship & Sustainable Development',
    icon: '🚀',
    color: 'from-green-600 to-teal-600',
    accent: 'teal',
    tagline: 'Innovation, Start-ups and Sustainable Growth Models',
    description: 'Focusing on strategic management, entrepreneurship ecosystems, startup ecosystems, and models of inclusive and sustainable development for emerging economies.',
    topics: [
      'Strategic Management and Business Transformation',
      'Startup Ecosystems and Incubation Models',
      'Innovation Management and Disruptive Technologies',
      'Sustainable Development Goals (SDG) in Business',
      'Supply Chain Sustainability and Green Logistics',
      'Social Entrepreneurship and Impact Investing',
      'Rural Development and Inclusive Growth',
      'Tourism and Hospitality Management',
      'Corporate Social Responsibility (CSR)',
      'Family Business Governance and Succession',
    ],
    papers: 'Research on strategy, innovation, sustainability and entrepreneurship',
  },
  'blockchain-erp': {
    slug: 'blockchain-erp',
    title: 'Blockchain & ERP Systems',
    icon: '⛓️',
    color: 'from-orange-600 to-red-600',
    accent: 'orange',
    tagline: 'Distributed Ledger Technologies and Enterprise Resource Planning',
    description: 'Covering the latest developments in Blockchain technology, smart contracts, and Enterprise Resource Planning systems that are transforming business operations.',
    topics: [
      'Blockchain in Supply Chain Transparency',
      'Smart Contracts and Decentralized Applications',
      'Cryptocurrency and Digital Asset Management',
      'ERP Implementation: SAP, Oracle, Microsoft Dynamics',
      'ERP Customization and Integration Challenges',
      'Blockchain in Healthcare Record Management',
      'NFTs and Digital Ownership Models',
      'Hyperledger and Enterprise Blockchain Platforms',
      'ERP and AI Integration for Process Automation',
      'DeFi (Decentralized Finance) Applications',
    ],
    papers: 'Technical papers, implementation case studies in Blockchain and ERP',
  },
  'fintech': {
    slug: 'fintech',
    title: 'FinTech Innovations',
    icon: '💳',
    color: 'from-yellow-500 to-orange-500',
    accent: 'yellow',
    tagline: 'Financial Technology Reshaping Banking and Payments',
    description: 'Exploring the fintech revolution including digital payments, mobile banking, robo-advisors, insurtech, and the regulatory landscape governing these innovations.',
    topics: [
      'Digital Payments and UPI Ecosystem (India Focus)',
      'Open Banking and API-driven Financial Services',
      'Robo-Advisors and Automated Wealth Management',
      'RegTech: Regulatory Technology and Compliance',
      'InsurTech: Innovation in Insurance Sector',
      'BNPL (Buy Now Pay Later) Business Models',
      'Central Bank Digital Currencies (CBDCs)',
      'Financial Inclusion through Mobile Banking',
      'Peer-to-Peer Lending and Crowdfunding',
      'AI in Credit Scoring and Loan Processing',
    ],
    papers: 'Research on financial technology, digital banking and payment innovations',
  },
  'e-governance': {
    slug: 'e-governance',
    title: 'E-Governance & Digital Transformation',
    icon: '🏛️',
    color: 'from-indigo-600 to-purple-700',
    accent: 'indigo',
    tagline: 'Digital Government Services and IT-Driven Public Administration',
    description: 'Focusing on digital transformation of government services, IT disruptions in contemporary business, digital business models, and innovations in public administration.',
    topics: [
      'E-Governance Platforms and Digital Service Delivery',
      'Digital India Initiatives and Success Stories',
      'Smart City Infrastructure and IoT Integration',
      'Cybersecurity in Government Systems',
      'Digital Business Models and Platform Economies',
      'IT Disruptions and Contemporary Business Issues',
      'Content Management Systems and Digital Platforms',
      'Social Media Analytics for Policy Making',
      'Open Data and Transparency in Governance',
      'AI in Public Administration and Service Delivery',
    ],
    papers: 'Policy research, case studies in e-governance and digital public services',
  },
};

export default function ThemeDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const theme = THEME_DATA[slug];

  if (!theme) return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-slate-50">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="font-display font-bold text-2xl text-navy-800 mb-3">Theme Not Found</h2>
        <Link to="/#sub-themes" className="btn-primary inline-flex">← Back to Themes</Link>
      </div>
    </div>
  );

  const accentMap = {
    purple:'teal', blue:'blue', teal:'teal', orange:'orange', yellow:'yellow', indigo:'indigo'
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${theme.color} py-16 px-4 relative overflow-hidden`}>
        <div className="absolute inset-0 hero-grid-bg opacity-30" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            ← Back
          </button>
          <div className="text-6xl sm:text-7xl mb-4">{theme.icon}</div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white mb-3">{theme.title}</h1>
          <p className="text-white/75 text-base sm:text-lg max-w-2xl mx-auto mb-6">{theme.tagline}</p>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-5 py-2 rounded-full">
            INCOCOM 2K26 · Research Track
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Description */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
          <h2 className="font-display font-bold text-2xl text-navy-800 mb-4">About This Track</h2>
          <p className="text-slate-600 leading-relaxed text-base">{theme.description}</p>
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-500 text-sm"><strong className="text-navy-700">Accepted Papers:</strong> {theme.papers}</p>
          </div>
        </div>

        {/* Topics */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
          <h2 className="font-display font-bold text-2xl text-navy-800 mb-6">Research Topics</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {theme.topics.map((t, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{i+1}</span>
                <span className="text-slate-700 text-sm leading-relaxed">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`bg-gradient-to-br ${theme.color} rounded-2xl p-8 text-center text-white`}>
          <h3 className="font-display font-bold text-2xl mb-2">Submit Your Research</h3>
          <p className="text-white/75 text-sm mb-6">We invite high-quality research papers for INCOCOM 2K26 under this track.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="bg-white/20 border border-white/30 hover:bg-white/30 text-white font-bold px-8 py-3 rounded-full transition-all">
              Submit Paper →
            </Link>
            <a href="/#conference-details" className="border border-white/30 hover:bg-white/15 text-white/80 hover:text-white font-medium px-6 py-3 rounded-full transition-all">
              View Guidelines
            </a>
          </div>
          <p className="text-white/50 text-xs mt-4">Deadline: 10.04.2026 · Conference: 21.04.2026</p>
        </div>
      </div>
    </div>
  );
}
