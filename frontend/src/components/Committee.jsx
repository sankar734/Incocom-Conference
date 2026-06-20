import React from 'react';

const committee = {
  patron: [{ name: 'Dr. S. Selvaperumal', role: 'Principal', dept: 'NPR College of Engineering & Technology', phone: '' }],
  convenors: [
    { name: 'Dr. B. Velmurugan', role: 'Head of Department', dept: 'Department of Management Studies (MBA)', phone: '' },
    { name: 'Dr. S. Banuchitra', role: 'Head of Department', dept: 'Department of Computer Applications (MCA)', phone: '' },
  ],
  faculty: [
    { name: 'Dr. V. Tamilselvi', role: 'HoD(i/c) – MBA', dept: 'Management Studies', phone: '+91-99438 19028' },
    { name: 'Dr. B. N. Bobinath', role: 'HoD(i/c) – MCA', dept: 'Computer Applications', phone: '+91-99942 75042' },
    { name: 'Mr. V. S. Arjun Athithya', role: 'Assistant Professor – MBA', dept: 'Management Studies', phone: '+91-97874 63622' },
    { name: 'Mrs. R. Shariga', role: 'Assistant Professor – MBA', dept: 'Management Studies', phone: '+91-96296 08666' },
  ],
  students: [
    { name: 'Ms. N. Dhanalakshmi', role: 'II Year – MBA', dept: 'Management Studies', phone: '+91-63805 13669' },
    { name: 'Mr. D. Madhesh Kumar', role: 'I Year – MBA', dept: 'Management Studies', phone: '+91-93452 47230' },
    { name: 'Ms. M. S. Shruthika', role: 'I Year – MBA', dept: 'Management Studies', phone: '+91-89038 74444' },
    { name: 'Mr. S. Sankar', role: 'I Year – MCA', dept: 'Computer Applications', phone: '+91-93602 27685' },
    { name: 'Mrs. P. N. Madhumitha', role: 'I Year – MCA', dept: 'Computer Applications', phone: '+91-93426 31343' },
  ],
};

const avatarColors = ['from-navy-700 to-teal-500', 'from-teal-500 to-teal-700', 'from-gold-500 to-gold-600', 'from-navy-600 to-navy-800'];

function PersonCard({ person, index, variant = 'default' }) {
  const initials = person.name.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0,2).map(w=>w[0]).join('');
  const color = avatarColors[index % avatarColors.length];
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex gap-4">
      <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white font-mono font-bold text-sm`}>{initials}</div>
      <div className="min-w-0">
        <h4 className="font-bold text-navy-800 text-sm leading-tight mb-0.5 truncate">{person.name}</h4>
        <p className="text-teal-600 text-xs font-semibold mb-0.5">{person.role}</p>
        <p className="text-slate-400 text-xs truncate">{person.dept}</p>
        {person.phone && <p className="text-gold-600 text-xs font-mono mt-1">{person.phone}</p>}
      </div>
    </div>
  );
}

export default function Committee() {
  return (
    <section id="committee" className="py-24 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="section-label">Organizing Team</span>
          <h2 className="section-title">Conference Committee</h2>
          <div className="section-divider mx-auto" />
          <p className="text-slate-500 text-sm">Organized by: Dept. of Management Studies (MBA) &amp; Computer Application (MCA), NPR CET</p>
        </div>

        {/* Patron */}
        <div className="mb-10">
          <h3 className="font-display font-bold text-lg text-navy-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gold-500 rounded-full" /> Patron
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {committee.patron.map((p, i) => <PersonCard key={p.name} person={p} index={i} />)}
          </div>
        </div>

        {/* Convenors */}
        <div className="mb-10">
          <h3 className="font-display font-bold text-lg text-navy-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-navy-700 rounded-full" /> Convenors
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {committee.convenors.map((p, i) => <PersonCard key={p.name} person={p} index={i+1} />)}
          </div>
        </div>

        {/* Faculty Coordinators */}
        <div className="mb-10">
          <h3 className="font-display font-bold text-lg text-navy-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-teal-500 rounded-full" /> Faculty Coordinators
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {committee.faculty.map((p, i) => <PersonCard key={p.name} person={p} index={i} />)}
          </div>
        </div>

        {/* Student Coordinators */}
        <div>
          <h3 className="font-display font-bold text-lg text-navy-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-slate-400 rounded-full" /> Student Coordinators
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {committee.students.map((p, i) => <PersonCard key={p.name} person={p} index={i+2} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
