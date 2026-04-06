import React from 'react';

const courses = [
  { name: 'MBA', full: 'Master of Business Administration', duration: '2 Years', seats: '120', focus: 'Finance, Marketing, HR, Operations, Entrepreneurship' },
  { name: 'MCA', full: 'Master of Computer Applications', duration: '2 Years', seats: '60', focus: 'Software Engineering, AI/ML, Data Science, Cloud Computing' },
];

const labs = [
  { icon: '💻', name: 'Computer Lab', desc: 'High-end workstations with latest software tools' },
  { icon: '🤖', name: 'AI & Analytics Lab', desc: 'Dedicated lab for ML, Data Science & Business Analytics' },
  { icon: '📊', name: 'ERP Lab', desc: 'SAP and Oracle ERP simulation environment' },
  { icon: '🔒', name: 'Cybersecurity Lab', desc: 'Network security and ethical hacking practice environment' },
];

export default function AboutDepartment() {
  return (
    <section id="about-dept" className="py-24 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="section-label">Organizing Departments</span>
          <h2 className="section-title">Department Overview</h2>
          <div className="section-divider mx-auto" />
          <p className="text-slate-600 max-w-3xl mx-auto text-base">
            The conference is jointly organized by the Department of Management Studies (MBA) and
            Department of Computer Applications (MCA) — two pillars of interdisciplinary academic excellence at NPR CET.
          </p>
        </div>

        {/* Courses */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {courses.map((c) => (
            <div key={c.name} className="bg-white rounded-2xl p-8 shadow-md border border-slate-100">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 bg-gradient-to-br from-navy-700 to-teal-500 rounded-2xl flex items-center justify-center font-display font-black text-white text-xl">{c.name}</div>
                <div>
                  <h3 className="font-display font-bold text-xl text-navy-800">{c.full}</h3>
                  <p className="text-slate-500 text-sm">Duration: {c.duration} · Intake: {c.seats} students</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed"><strong>Focus Areas:</strong> {c.focus}</p>
            </div>
          ))}
        </div>

        {/* Faculty strength */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {[{ val:'10+', label:'Faculty Members'}, {val:'6+', label:'PhD Holders'}, {val:'250+', label:'Research Papers'}].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 text-center border border-slate-100 shadow-sm">
              <div className="font-display font-black text-2xl text-teal-500 mb-1">{s.val}</div>
              <div className="text-slate-600 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Labs */}
        <h3 className="font-display font-bold text-2xl text-navy-800 mb-6 text-center">Labs & Infrastructure</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {labs.map(l => (
            <div key={l.name} className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <span className="text-4xl block mb-3">{l.icon}</span>
              <h4 className="font-bold text-navy-800 mb-2">{l.name}</h4>
              <p className="text-slate-500 text-sm">{l.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
