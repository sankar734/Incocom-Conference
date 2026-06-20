import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { submitRegistration } from '../services/api';

const SALUTATIONS = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];

const CATEGORIES = [
  { value: 'Foreigners & NRI',                     sno: '01', fee: '$10 / ₹940',  label: 'Foreigners & NRI' },
  { value: 'Academicians and Corporate Delegates',  sno: '02', fee: 'Rs.1000/-',   label: 'Academicians & Corporate Delegates' },
  { value: 'Research Scholars and PG Students',     sno: '03', fee: 'Rs.500/-',    label: 'Research Scholars & PG Students' },
  { value: 'NPR Staff',                             sno: '04', fee: 'Rs.500/-',    label: 'NPR Staff' },
  { value: 'NPR Students',                          sno: '05', fee: 'Rs.300/-',    label: 'NPR Students' },
];

const SUB_THEMES = [
  { group: 'Management & Business Domains', themes: [
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
  ]},
  { group: 'Computing, Analytics & Digital Transformation', themes: [
    'AI Applications in Finance, Marketing & HR',
    'Business Analytics, Big Data & Competitive Advantage',
    'IT Disruptions & Contemporary Business Issues',
    'E-Governance & Digital Public Services',
    'E-Business & Digital Business Models',
    'Enterprise Resource Planning (ERP) Systems',
    'Banking Technology & FinTech Innovations',
    'Blockchain Technology & Business Applications',
    'Content Management Systems & Digital Platforms',
    'Social Media Management & Digital Marketing Analytics',
    'Neuro Marketing & Consumer Insights',
    'Business Aggregators & Platform-Based Economies',
  ]},
  { group: 'Other', themes: [
    'Other',
  ]},
];

const EMPTY_CA = { salutation: '', firstName: '', lastName: '', designation: '', department: '', collegeName: '', email: '' };
const STEPS    = ['Personal Info', 'Co-Authors', 'Paper Details', 'Review', 'Terms & Pay'];

const wc = str => str.trim() ? str.trim().split(/\s+/).length : 0;

function StepBar({ current }) {
  return (
    <div className="flex items-center justify-center mb-8 px-2">
      {STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 transition-all duration-300
              ${i < current ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
              : i === current ? 'bg-navy-800 text-white ring-4 ring-navy-100 shadow-lg'
              : 'bg-slate-200 text-slate-400'}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-[9px] sm:text-[11px] mt-1 font-semibold hidden xs:block whitespace-nowrap ${i === current ? 'text-navy-800' : i < current ? 'text-teal-600' : 'text-slate-400'}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-all duration-500 ${i < current ? 'bg-teal-500' : 'bg-slate-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-slate-400 text-xs mt-1">{hint}</p>}
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}

const inp = err => `w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 rounded-xl text-slate-800 bg-slate-50 focus:outline-none focus:bg-white transition-all text-sm ${err ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'}`;
const sel = err => `w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 rounded-xl text-slate-800 bg-slate-50 focus:outline-none focus:bg-white cursor-pointer text-sm ${err ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'}`;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const [terms, setTerms] = useState({ t1: false, t2: false, t3: false });

  const [author, setAuthor] = useState({
    salutation: '', firstName: '', lastName: '',
    designation: '', department: '', collegeName: '', collegeAddress: '', district: '',
    phone: '', email: '', category: '',
  });
  const [coAuthors, setCoAuthors] = useState([]);
  const [paper, setPaper] = useState({ paperTitle: '', subTheme: '', keywords: '', abstract: '' });
  const [file, setFile]   = useState(null);

  const setA = f => e => { setAuthor(a => ({ ...a, [f]: e.target.value })); if (errors[f]) setErrors(er => ({ ...er, [f]: '' })); };
  const setP = f => e => { setPaper(p => ({ ...p, [f]: e.target.value }));  if (errors[f]) setErrors(er => ({ ...er, [f]: '' })); };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!author.salutation)          e.salutation  = 'Select salutation';
      if (!author.firstName.trim())    e.firstName   = 'First name required';
      if (!author.lastName.trim())     e.lastName    = 'Last name required';
      if (!author.designation.trim())  e.designation = 'Designation required';
      if (!author.department.trim())   e.department  = 'Department required';
      if (!author.collegeName.trim())  e.collegeName = 'College name required';
      if (!author.collegeAddress.trim())  e.collegeAddress = 'College address required';
      if (!author.district.trim())     e.district    = 'District required';
      if (!author.phone.trim() || !/^\+?[\d\s\-]{10,}$/.test(author.phone)) e.phone = 'Valid phone number required';
      if (!author.email.trim() || !/\S+@\S+\.\S+/.test(author.email)) e.email = 'Valid email required';
      if (!author.category)            e.category    = 'Select registration category';
    }
    if (step === 1) {
      coAuthors.forEach((ca, i) => {
        if (!ca.salutation)          e[`co_${i}_salutation`]  = 'Required';
        if (!ca.firstName?.trim())   e[`co_${i}_firstName`]   = 'Required';
        if (!ca.lastName?.trim())    e[`co_${i}_lastName`]    = 'Required';
        if (!ca.collegeName?.trim()) e[`co_${i}_collegeName`] = 'Required';
        if (ca.email && !/\S+@\S+\.\S+/.test(ca.email)) e[`co_${i}_email`] = 'Valid email';
      });
    }
    if (step === 2) {
      if (!paper.paperTitle.trim())  e.paperTitle = 'Paper title required';
      if (!paper.subTheme)           e.subTheme   = 'Select a sub-theme';
      const w = wc(paper.abstract);
      if (w < 50)  e.abstract = 'Abstract must be at least 50 words';
      if (w > 300) e.abstract = 'Abstract must not exceed 300 words';
    }
    if (step === 4) {
      if (!terms.t1 || !terms.t2 || !terms.t3) e.terms = 'Please agree to all terms and conditions to proceed';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const addCA = () => {
    if (coAuthors.length >= 2) { toast.error('Maximum 2 co-authors (3 total including you)'); return; }
    setCoAuthors(c => [...c, { ...EMPTY_CA }]);
  };
  const removeCA = i => setCoAuthors(c => c.filter((_, idx) => idx !== i));
  const updateCA = (i, f, v) => {
    setCoAuthors(c => c.map((ca, idx) => idx === i ? { ...ca, [f]: v } : ca));
    if (errors[`co_${i}_${f}`]) setErrors(e => ({ ...e, [`co_${i}_${f}`]: '' }));
  };

  const handleFile = e => {
    const f = e.target.files[0]; if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['doc','docx'].includes(ext)) { toast.error('Only .doc or .docx files allowed'); return; }
    if (f.size > 15 * 1024 * 1024) { toast.error('File must be under 15 MB'); return; }
    setFile(f); toast.success('File selected ✓');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(author).forEach(([k, v]) => fd.append(k, v));
      fd.append('coAuthors', JSON.stringify(coAuthors));
      Object.entries(paper).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('paperFile', file);

      const res = await submitRegistration(fd);
      toast.success('Registration submitted! Going to payment...');
      setTimeout(() => navigate(`/payment/${res.data.data.registrationId}`), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Try again.';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const selectedCategory = CATEGORIES.find(c => c.value === author.category);
  const wordCount = wc(paper.abstract);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 pt-20 sm:pt-24 pb-16 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <span className="section-label">Paper Submission</span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy-800 mt-2">Register for INCOCOM 2K26</h1>
          <div className="section-divider mx-auto" />
          <p className="text-slate-500 text-xs sm:text-sm mt-2">21 April 2026 · NPR College of Engineering and Technology, Dindigul</p>
        </div>

        <StepBar current={step} />

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100">
            <div className="h-full bg-gradient-to-r from-teal-500 to-navy-600 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8">

            {/* ── STEP 0: Personal Info ─────────────────────────────────── */}
            {step === 0 && (
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-navy-800 mb-1">Personal Information</h2>
                <p className="text-slate-400 text-xs sm:text-sm mb-5 sm:mb-7">Main author details. Phone number will also be used for WhatsApp notifications.</p>

                {/* Name row – mobile: salutation full width, then first+last side by side */}
                <div className="space-y-4 mb-5">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Salutation" required error={errors.salutation}>
                      <select value={author.salutation} onChange={setA('salutation')} className={sel(errors.salutation)}>
                        <option value="">—</option>
                        {SALUTATIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                    <div className="hidden sm:block" /> {/* spacer on desktop */}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="First Name" required error={errors.firstName}>
                      <input value={author.firstName} onChange={setA('firstName')} className={inp(errors.firstName)} placeholder="First name" />
                    </Field>
                    <Field label="Last Name" required error={errors.lastName}>
                      <input value={author.lastName} onChange={setA('lastName')} className={inp(errors.lastName)} placeholder="Last name" />
                    </Field>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Designation" required error={errors.designation}>
                    <input value={author.designation} onChange={setA('designation')} className={inp(errors.designation)} placeholder="e.g. Assistant Professor" />
                  </Field>
                  <Field label="Department" required error={errors.department}>
                    <input value={author.department} onChange={setA('department')} className={inp(errors.department)} placeholder="e.g. Management Studies" />
                  </Field>
                </div>

                <div className="mb-4">
                  <Field label="College / Institution Name" required error={errors.collegeName}>
                    <input value={author.collegeName} onChange={setA('collegeName')} className={inp(errors.collegeName)} placeholder="Full institution name" />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Field label="College Address" required error={errors.collegeAddress}>
                    <input value={author.collegeAddress} onChange={setA('collegeAddress')} className={inp(errors.collegeAddress)} placeholder="Full college address" />
                  </Field>
                  <Field label="District" required error={errors.district}>
                    <input value={author.district} onChange={setA('district')} className={inp(errors.district)} placeholder="District" />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <Field label="Phone Number" required error={errors.phone} hint="Also used for WhatsApp notifications">
                    <input value={author.phone} onChange={setA('phone')} className={inp(errors.phone)} placeholder="+91 XXXXX XXXXX" type="tel" />
                  </Field>
                  <Field label="Email ID" required error={errors.email}>
                    <input value={author.email} onChange={setA('email')} className={inp(errors.email)} placeholder="your@email.com" type="email" />
                  </Field>
                </div>

                {/* Registration Category */}
                <div>
                  <Field label="Registration Category" required error={errors.category}>
                    <div className="space-y-2 mt-1">
                      {/* Mobile: card layout | Desktop: table */}
                      <div className="block sm:hidden space-y-2">
                        {CATEGORIES.map((cat) => {
                          const selected = author.category === cat.value;
                          return (
                            <div key={cat.value}
                              onClick={() => { setAuthor(a => ({ ...a, category: cat.value })); setErrors(e => ({ ...e, category: '' })); }}
                              className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex items-center gap-3 ${selected ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-slate-50 hover:border-teal-300'}`}>
                              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${selected ? 'bg-teal-500 border-teal-500' : 'border-slate-300'}`}>
                                {selected && <span className="text-white text-xs font-bold">✓</span>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-navy-800 text-sm leading-tight">{cat.label}</p>
                              </div>
                              <span className="font-mono font-bold text-teal-600 text-sm flex-shrink-0">{cat.fee}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Desktop: table */}
                      <div className="hidden sm:block overflow-hidden rounded-2xl border-2 border-slate-200">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-navy-800 text-white">
                              <th className="px-3 py-2.5 text-left text-xs font-bold w-10">S/No</th>
                              <th className="px-3 py-2.5 text-left text-xs font-bold">Category</th>
                              <th className="px-3 py-2.5 text-right text-xs font-bold w-24">Fee*</th>
                              <th className="px-3 py-2.5 text-center text-xs font-bold w-14">Select</th>
                            </tr>
                          </thead>
                          <tbody>
                            {CATEGORIES.map((cat) => {
                              const selected = author.category === cat.value;
                              return (
                                <tr key={cat.value}
                                  onClick={() => { setAuthor(a => ({ ...a, category: cat.value })); setErrors(e => ({ ...e, category: '' })); }}
                                  className={`cursor-pointer border-t border-slate-100 transition-all ${selected ? 'bg-teal-50 border-teal-200' : 'hover:bg-slate-50'}`}>
                                  <td className="px-3 py-3 text-xs font-bold text-slate-500">{cat.sno}</td>
                                  <td className="px-3 py-3 font-semibold text-navy-800 text-sm">{cat.label}</td>
                                  <td className="px-3 py-3 text-right font-mono font-bold text-teal-600 text-sm">{cat.fee}</td>
                                  <td className="px-3 py-3 text-center">
                                    <div className={`w-5 h-5 rounded-full border-2 mx-auto flex items-center justify-center transition-all ${selected ? 'bg-teal-500 border-teal-500' : 'border-slate-300'}`}>
                                      {selected && <span className="text-white text-xs font-bold">✓</span>}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {errors.category && <p className="text-red-500 text-xs flex items-center gap-1">⚠ {errors.category}</p>}
                      {selectedCategory && (
                        <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-2.5 flex items-center gap-2 flex-wrap">
                          <span className="text-teal-500 font-bold">✓</span>
                          <span className="text-teal-700 text-sm font-medium">Selected: <strong>{selectedCategory.label}</strong></span>
                          <span className="ml-auto font-mono font-bold text-teal-600">{selectedCategory.fee}</span>
                        </div>
                      )}
                      <p className="text-slate-400 text-xs leading-relaxed px-1">
                        <ul className="space-y-1.5 text-xs text-slate-500 leading-relaxed">
                            <li className="flex items-start gap-2"><span className="text-teal-500 font-bold flex-shrink-0 mt-0.5">1</span><span>Applicable for a maximum of <strong>3 Authors per paper</strong>.</span></li>
                            <li className="flex items-start gap-2"><span className="text-teal-500 font-bold flex-shrink-0 mt-0.5">2</span><span>If any <strong>Academician</strong> is included as a co-author in any category, a fee of <strong>Rs. 1,000/-</strong> must be paid.</span></li>
                            <li className="flex items-start gap-2"><span className="text-teal-500 font-bold flex-shrink-0 mt-0.5">3</span><span>Fee Includes: <strong>Conference kit</strong>, refreshments, working lunch, <strong>E-participation certificate</strong> &amp; <strong>e-ISBN book copy</strong>.</span></li>
                        </ul> 
                      </p>
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {/* ── STEP 1: Co-Authors ────────────────────────────────────── */}
            {step === 1 && (
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-navy-800 mb-1">Co-Authors</h2>
                <p className="text-slate-400 text-xs sm:text-sm mb-5">Maximum <strong>3 authors total</strong> (including you). Add up to 2 co-authors below.</p>

                {/* Main author pill */}
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 sm:p-4 mb-5 flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {author.firstName?.[0]}{author.lastName?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-navy-800 text-sm truncate">{author.salutation} {author.firstName} {author.lastName}
                      <span className="ml-2 bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">Main Author</span>
                    </p>
                    <p className="text-teal-600 text-xs truncate">{author.designation} · {author.collegeName}</p>
                  </div>
                </div>

                {coAuthors.map((ca, i) => (
                  <div key={i} className="border-2 border-slate-200 rounded-2xl p-4 sm:p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-sm bg-navy-100 text-navy-700 px-3 py-1 rounded-full">Co-Author {i + 1}</span>
                      <button onClick={() => removeCA(i)} className="w-7 h-7 bg-red-100 hover:bg-red-200 text-red-500 rounded-full flex items-center justify-center text-sm transition-colors">✕</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <Field label="Salutation" required error={errors[`co_${i}_salutation`]}>
                        <select value={ca.salutation} onChange={e => updateCA(i, 'salutation', e.target.value)} className={sel(errors[`co_${i}_salutation`])}>
                          <option value="">—</option>
                          {SALUTATIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </Field>
                      <div className="hidden sm:block" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <Field label="First Name" required error={errors[`co_${i}_firstName`]}>
                        <input value={ca.firstName} onChange={e => updateCA(i, 'firstName', e.target.value)} className={inp(errors[`co_${i}_firstName`])} placeholder="First name" />
                      </Field>
                      <Field label="Last Name" required error={errors[`co_${i}_lastName`]}>
                        <input value={ca.lastName} onChange={e => updateCA(i, 'lastName', e.target.value)} className={inp(errors[`co_${i}_lastName`])} placeholder="Last name" />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <Field label="Designation">
                        <input value={ca.designation} onChange={e => updateCA(i, 'designation', e.target.value)} className={inp(false)} placeholder="e.g. Professor" />
                      </Field>
                      <Field label="Department">
                        <input value={ca.department} onChange={e => updateCA(i, 'department', e.target.value)} className={inp(false)} placeholder="Department" />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="College Name" required error={errors[`co_${i}_collegeName`]}>
                        <input value={ca.collegeName} onChange={e => updateCA(i, 'collegeName', e.target.value)} className={inp(errors[`co_${i}_collegeName`])} placeholder="Institution name" />
                      </Field>
                      <Field label="Email ID" error={errors[`co_${i}_email`]}>
                        <input value={ca.email} onChange={e => updateCA(i, 'email', e.target.value)} className={inp(errors[`co_${i}_email`])} placeholder="email@example.com" type="email" />
                      </Field>
                    </div>
                  </div>
                ))}

                {coAuthors.length < 2 && (
                  <button onClick={addCA}
                    className="w-full border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50 hover:bg-teal-100 text-teal-600 hover:text-teal-700 rounded-2xl py-4 sm:py-5 flex items-center justify-center gap-2 sm:gap-3 font-semibold text-sm transition-all group">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 bg-teal-500 group-hover:bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold transition-colors">+</span>
                    Add Co-Author {coAuthors.length + 1} of 2
                    <span className="text-teal-400 text-xs font-normal hidden sm:inline">({2 - coAuthors.length} remaining)</span>
                  </button>
                )}
                {coAuthors.length === 0 && <p className="text-center text-slate-400 text-sm mt-3">No co-authors? Click Continue to skip.</p>}
              </div>
            )}

            {/* ── STEP 2: Paper Details ─────────────────────────────────── */}
            {step === 2 && (
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-navy-800 mb-1">Paper Details</h2>
                <p className="text-slate-400 text-xs sm:text-sm mb-5 sm:mb-7">Provide your research paper information.</p>
                <div className="space-y-4 sm:space-y-5">
                  <Field label="Paper Title" required error={errors.paperTitle}>
                    <input value={paper.paperTitle} onChange={setP('paperTitle')} className={inp(errors.paperTitle)} placeholder="Full title of your research paper" />
                  </Field>

                  <Field label="Conference Sub-Theme" required error={errors.subTheme}>
                    <select value={paper.subTheme} onChange={setP('subTheme')} className={sel(errors.subTheme)}>
                      <option value="">— Select a Sub-Theme —</option>
                      {SUB_THEMES.map(g => (
                        <optgroup key={g.group} label={g.group}>
                          {g.themes.map(t => <option key={t} value={t}>{t}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </Field>

                  <Field label="Keywords" hint="Up to 5 keywords, comma separated">
                    <input value={paper.keywords} onChange={setP('keywords')} className={inp(false)} placeholder="e.g. Machine Learning, Finance, Analytics" />
                  </Field>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-sm font-semibold text-slate-700">Abstract <span className="text-red-500">*</span></label>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${wordCount > 300 ? 'bg-red-100 text-red-600' : wordCount > 250 ? 'bg-amber-100 text-amber-600' : wordCount >= 50 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>{wordCount}/300 words</span>
                    </div>
                    <textarea value={paper.abstract} onChange={setP('abstract')} rows={6}
                      className={`${inp(errors.abstract)} resize-none leading-relaxed`}
                      placeholder="Paste your abstract here (50–300 words)..." />
                    {errors.abstract && <p className="text-red-500 text-xs mt-1">⚠ {errors.abstract}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Upload Paper <span className="font-normal text-slate-400 text-xs">(DOC / DOCX only · Max 15 MB)</span></label>
                    <input type="file" accept=".doc,.docx" onChange={handleFile} className="hidden" id="paperFileInput" />
                    <label htmlFor="paperFileInput"
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-6 sm:py-8 px-4 cursor-pointer transition-all ${file ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-slate-50 hover:border-teal-400 hover:bg-teal-50'}`}>
                      {file ? (
                        <><span className="text-3xl sm:text-4xl mb-2">📄</span><p className="font-semibold text-navy-700 text-sm text-center">{file.name}</p><p className="text-teal-500 text-xs mt-1">{(file.size / 1024).toFixed(0)} KB · Tap to change</p></>
                      ) : (
                        <><span className="text-3xl sm:text-4xl mb-2 opacity-30">📁</span><p className="font-medium text-slate-500 text-sm">Tap to upload paper file</p><p className="text-slate-400 text-xs mt-1">.doc · .docx · Max 15 MB</p></>
                      )}
                    </label>
                    {file && <button onClick={() => setFile(null)} className="mt-1.5 text-xs text-red-400 hover:text-red-600 transition-colors">✕ Remove file</button>}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Review & Submit ────────────────────────────────── */}
            {step === 3 && (
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-navy-800 mb-1">Review & Submit</h2>
                <p className="text-slate-400 text-xs sm:text-sm mb-5">Verify all details. After submission you'll go directly to payment.</p>

                <div className="mb-4">
                  <h3 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-5 h-0.5 bg-teal-500 rounded"/>Main Author</h3>
                  <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                    {[
                      ['Name',       `${author.salutation} ${author.firstName} ${author.lastName}`],
                      ['Category',   selectedCategory?.label || '—'],
                      ['Fee',        selectedCategory?.fee || '—'],
                      ['Designation',author.designation],
                      ['Department', author.department],
                      ['College',    author.collegeName],
                      ['Location',   `${author.collegeAddress}, ${author.district}`],
                      ['Phone',      author.phone],
                      ['Email',      author.email],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-2 py-1 border-b border-slate-100 last:border-0">
                        <span className="text-slate-400 text-xs w-20 flex-shrink-0 font-medium">{k}</span>
                        <span className="text-navy-800 text-xs font-semibold break-all">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {coAuthors.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-navy-600 uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-5 h-0.5 bg-navy-400 rounded"/>Co-Authors ({coAuthors.length})</h3>
                    {coAuthors.map((ca, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-3 mb-2 text-xs">
                        <span className="font-bold text-navy-700">{ca.salutation} {ca.firstName} {ca.lastName}</span>
                        <span className="text-slate-400 ml-2">· {ca.designation} · {ca.collegeName}</span>
                        {ca.email && <span className="text-slate-400 ml-2 break-all">· {ca.email}</span>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gold-600 uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-5 h-0.5 bg-gold-500 rounded"/>Paper Details</h3>
                  <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 space-y-2">
                    {[['Title', paper.paperTitle], ['Sub-Theme', paper.subTheme], ['Keywords', paper.keywords || 'Not provided'], ['File', file ? file.name : 'Not uploaded']].map(([k, v]) => (
                      <div key={k} className="flex gap-3 py-1.5 border-b border-slate-100 last:border-0">
                        <span className="text-slate-400 text-xs w-16 sm:w-20 flex-shrink-0 font-medium">{k}</span>
                        <span className="text-navy-800 text-xs font-semibold break-words">{v}</span>
                      </div>
                    ))}
                    <div className="pt-1"><p className="text-slate-400 text-xs font-medium mb-1">Abstract ({wordCount} words)</p><p className="text-navy-700 text-xs leading-relaxed line-clamp-3">{paper.abstract}</p></div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 text-sm text-amber-700">
                  💳 After submission you'll go directly to the <strong>payment page</strong>. Registration fee: <strong className="text-amber-800">{selectedCategory?.fee}</strong>
                </div>
              </div>
            )}

            {/* ── STEP 4: Terms & Conditions ────────────────────────────── */}
            {step === 4 && (
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-navy-800 mb-1">Terms &amp; Conditions</h2>
                <p className="text-slate-400 text-xs sm:text-sm mb-6">Please read and agree to all conditions before proceeding to payment.</p>

                <div className="space-y-4 mb-6">
                  {[
                    {
                      key: 't1',
                      icon: '👥',
                      title: 'Maximum 3 Authors Per Paper',
                      desc: 'Applicable for a maximum of 3 Authors per paper. The registration fee covers the main author and up to 2 co-authors.',
                    },
                    {
                      key: 't2',
                      icon: '🎓',
                      title: 'Academician Co-Author Fee',
                      desc: 'If any Academician is included as a co-author in any category, a fee of Rs. 1,000/- must be paid.',
                    },
                    {
                      key: 't3',
                      icon: '🎁',
                      title: 'Fee Inclusions',
                      desc: 'Fee Includes Conference kit, refreshments, working lunch, E-participation certificate & e-ISBN book copy.',
                    },
                  ].map(({ key, icon, title, desc }) => {
                    const checked = terms[key];
                    return (
                      <div
                        key={key}
                        onClick={() => { setTerms(t => ({ ...t, [key]: !t[key] })); setErrors(e => ({ ...e, terms: '' })); }}
                        className={`cursor-pointer rounded-2xl border-2 p-4 transition-all flex items-start gap-4 select-none
                          ${checked ? 'border-teal-500 bg-teal-50 shadow-sm shadow-teal-100' : 'border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/40'}`}
                      >
                        <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all
                          ${checked ? 'bg-teal-500 border-teal-500' : 'border-slate-300 bg-white'}`}>
                          {checked && <span className="text-white text-xs font-black">✓</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-navy-800 text-sm flex items-center gap-2">
                            <span>{icon}</span>{title}
                          </p>
                          <p className="text-slate-500 text-xs mt-1 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {errors.terms && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-red-600 text-sm mb-4">
                    <span>⚠</span> {errors.terms}
                  </div>
                )}

                {terms.t1 && terms.t2 && terms.t3 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2 text-green-700 text-sm mb-4 animate-pulse-once">
                    <span>✅</span> <span>All terms agreed. Click <strong>Agree &amp; Proceed to Payment</strong> below.</span>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 leading-relaxed">
                  💳 Registration fee: <strong className="text-amber-800">{selectedCategory?.fee}</strong> · After agreeing, you'll proceed to the payment page.
                </div>
              </div>
            )}


            <div className="flex justify-between mt-6 sm:mt-8 pt-5 border-t border-slate-100 gap-3">
              {step > 0
                ? <button onClick={back} className="flex items-center gap-2 px-4 sm:px-6 py-2.5 border-2 border-slate-200 text-slate-600 font-semibold rounded-full hover:border-navy-400 hover:text-navy-700 transition-all text-sm">← Back</button>
                : <div />}
              {step < STEPS.length - 1
                ? <button onClick={next} className="btn-primary">
                    {step === 3 ? 'Review Terms →' : 'Continue →'}
                  </button>
                : (
                  <button onClick={() => { if (validate()) handleSubmit(); }} disabled={loading} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center">
                    {loading
                      ? <span className="flex items-center gap-2 justify-center"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Submitting...</span>
                      : '✓ Agree & Proceed to Payment'}
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
