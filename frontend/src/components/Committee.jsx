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
    { name: 'Ms. P. N. Madhumitha', role: 'I Year – MCA', dept: 'Computer Applications', phone: '+91-93426 31343' },
  ],
};

const avatarColors = [
  'from-navy-700 to-teal-600', 
  'from-teal-600 to-teal-800', 
  'from-gold-500 to-amber-600', 
  'from-navy-600 to-indigo-800'
];

function getInitials(fullName) {
  // Remove titles like Dr., Mr., Mrs., Ms., Prof., etc.
  const nameWithoutTitle = fullName.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.|Dr|Mr|Mrs|Ms|Prof)\s+/i, '').trim();
  
  // Split into tokens
  const tokens = nameWithoutTitle.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 'NC';
  
  if (tokens.length === 1) {
    return tokens[0].replace(/[^A-Za-z]/g, '').substring(0, 2).toUpperCase();
  }
  
  // First initial (e.g., 'S.' -> 'S')
  const firstChar = tokens[0].replace(/[^A-Za-z]/g, '')[0] || '';
  
  // First letter of the primary name
  const mainNameToken = tokens.find(t => !t.endsWith('.') && t.length > 1) || tokens[tokens.length - 1];
  const secondChar = mainNameToken.replace(/[^A-Za-z]/g, '')[0] || '';
  
  return (firstChar + secondChar).toUpperCase() || nameWithoutTitle.substring(0, 2).toUpperCase();
}

function PersonCard({ person, index }) {
  const initials = getInitials(person.name);
  const color = avatarColors[index % avatarColors.length];
  
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex items-start gap-3.5 sm:gap-4">
      <div className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white font-mono font-bold text-xs sm:text-sm tracking-wider shadow-sm`}>
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-bold text-navy-800 text-xs sm:text-sm leading-tight mb-1" title={person.name}>
          {person.name}
        </h4>
        <p className="text-teal-600 text-[11px] sm:text-xs font-semibold mb-0.5">{person.role}</p>
        <p className="text-slate-400 text-[10px] sm:text-xs leading-snug">{person.dept}</p>
        {person.phone && (
          <a href={`tel:${person.phone}`} className="inline-block text-gold-600 hover:text-gold-700 text-[11px] sm:text-xs font-mono font-medium mt-1 transition-colors">
            {person.phone}
          </a>
        )}
      </div>
    </div>
  );
}

export default function Committee() {
  return (
    <section id="committee" className="py-20 sm:py-24 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <span className="section-label">Organizing Team</span>
          <h2 className="section-title">Conference Committee</h2>
          <div className="section-divider mx-auto" />
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto">
            Organized by: Department of Management Studies (MBA) &amp; Department of Computer Applications (MCA), NPR CET
          </p>
        </div>

        {/* Patron */}
        <div className="mb-8 sm:mb-10">
          <h3 className="font-display font-bold text-base sm:text-lg text-navy-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gold-500 rounded-full" /> Chief Patron
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {committee.patron.map((p, i) => <PersonCard key={p.name} person={p} index={i} />)}
          </div>
        </div>

        {/* Convenors */}
        <div className="mb-8 sm:mb-10">
          <h3 className="font-display font-bold text-base sm:text-lg text-navy-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-navy-700 rounded-full" /> Convenors
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-3xl">
            {committee.convenors.map((p, i) => <PersonCard key={p.name} person={p} index={i + 1} />)}
          </div>
        </div>

        {/* Faculty Coordinators */}
        <div className="mb-8 sm:mb-10">
          <h3 className="font-display font-bold text-base sm:text-lg text-navy-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-teal-500 rounded-full" /> Faculty Coordinators
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {committee.faculty.map((p, i) => <PersonCard key={p.name} person={p} index={i} />)}
          </div>
        </div>

        {/* Student Coordinators */}
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-navy-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-slate-400 rounded-full" /> Student Coordinators
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {committee.students.map((p, i) => <PersonCard key={p.name} person={p} index={i + 2} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
