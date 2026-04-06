import React, { useState } from 'react';

const guidelines = [
  'Use Times New Roman, font size 12, with 1.5 line spacing and fully justified text.',
  'Headings must be bold with font size 14; sub-headings bold with font size 12.',
  'Abstract must not exceed 300 words using font size 12.',
  'A maximum of 5 keywords should be included in the abstract.',
  'Paper size: A4 with 2.5 cm margins on all sides. Do NOT include headers, footers, or page numbers.',
  'The paper title must be in bold, left-aligned, at the top of the first page only.',
  'Cover page must include: Paper Title, Author Name(s), Affiliation, Email ID, and Mobile Number.',
  'Papers must be submitted in DOC or DOCX format only. PDF format is NOT accepted. Files must NOT be zipped.',
  'Presentation: Minimum 12 slides and Maximum 16 slides.',
  'Cover slide must contain: Paper Title, Author(s), Name, Affiliation, Email, and Mobile Number.',
];

export default function ConferenceDetails() {
  const [expanded, setExpanded] = useState(null);
  return (
    <section id="conference-details" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="section-label">Call for Papers</span>
          <h2 className="section-title">Conference Details</h2>
          <div className="section-divider mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Guidelines */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-lg">📋</div>
              <h3 className="font-display font-bold text-2xl text-navy-800">Paper Submission Guidelines</h3>
            </div>
            <div className="bg-slate-50 border-l-4 border-teal-500 rounded-r-2xl p-1">
              {guidelines.map((g, i) => (
                <div key={i} className="flex gap-3 p-4 hover:bg-teal-50/50 transition-colors rounded-r-xl">
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{i+1}</span>
                  <p className="text-slate-700 text-sm leading-relaxed">{g}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right col - formatting & submission info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-navy-800 to-navy-600 rounded-2xl p-7 text-white">
              <h3 className="font-display font-bold text-xl mb-5 text-gold-400">Formatting Quick Reference</h3>
              <div className="space-y-3">
                {[
                  ['Font', 'Times New Roman'],
                  ['Font Size', '12pt (Body) · 14pt (Headings)'],
                  ['Line Spacing', '1.5'],
                  ['Page Size', 'A4'],
                  ['Margins', '2.5 cm all sides'],
                  ['Abstract', 'Max 300 words'],
                  ['Keywords', 'Max 5'],
                  ['Slides', '12 – 16 slides'],
                  ['File Format', 'DOC / DOCX only (no PDF, no ZIP)'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-white/10 last:border-0">
                    <span className="text-white/60 text-sm">{k}</span>
                    <span className="text-white font-medium text-sm text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gold-500/10 border border-gold-500/30 rounded-2xl p-6">
              <h4 className="font-bold text-navy-800 mb-3">📧 Paper Submission</h4>
              <p className="text-slate-600 text-sm mb-3">Submit your paper through the online portal or via email:</p>
              <a href="mailto:nprcetincocom@nprcolleges.org" className="text-teal-600 font-bold text-sm hover:underline">nprcetincocom@nprcolleges.org</a>
              <div className="mt-4 pt-4 border-t border-gold-500/20">
                <p className="text-slate-600 text-xs leading-relaxed">
                  <p className="text-xs font-bold text-slate-600 mb-2">📌 Important Notes:</p>
                    <ul className="space-y-1.5 text-xs text-slate-500 leading-relaxed">
                      <li className="flex items-start gap-2"><span className="text-teal-500 font-bold flex-shrink-0 mt-0.5">*</span><span>Applicable for a maximum of <strong>3 Authors per paper</strong>.</span></li>
                      <li className="flex items-start gap-2"><span className="text-teal-500 font-bold flex-shrink-0 mt-0.5">*</span><span>If any <strong>Academician</strong> is included as a co-author in any category, a fee of <strong>Rs. 1,000/-</strong> must be paid.</span></li>
                      <li className="flex items-start gap-2"><span className="text-teal-500 font-bold flex-shrink-0 mt-0.5">*</span><span>Fee Includes: <strong>Conference kit</strong>, refreshments, working lunch, <strong>E-participation certificate</strong> &amp; <strong>e-ISBN book copy</strong>.</span></li>
                    </ul>
                </p>
              </div>
            </div>

            <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-6">
              <h4 className="font-bold text-navy-800 mb-3">📅 Key Deadlines</h4>
              {[
                { label: 'Paper Submission', date: '10.04.2026', color: 'bg-teal-500' },
                { label: 'Acceptance Notice', date: '13.04.2026', color: 'bg-gold-500' },
                { label: 'Conference Date', date: '21.04.2026', color: 'bg-navy-700' },
              ].map(d => (
                <div key={d.label} className="flex items-center gap-3 py-2">
                  <div className={`w-2 h-2 ${d.color} rounded-full flex-shrink-0`} />
                  <span className="text-slate-600 text-sm flex-1">{d.label}</span>
                  <span className="font-mono font-bold text-navy-800 text-sm">{d.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
