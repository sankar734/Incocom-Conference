import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPaymentDetails, submitPayment } from '../services/api';
import gpayQR from '../assets/gpay-qr.jpg';

const GPAY_UPI  = 'athithyaarjun@oksbi';
const GPAY_NAME = 'NPR College INCOCOM 2K26';

const FEE_TABLE = [
  { sno: '01', cat: 'Foreigners & NRI',                     fee: '$.10 / ₹940' },
  { sno: '02', cat: 'Academicians and Corporate Delegates',  fee: 'Rs.1000/-' },
  { sno: '03', cat: 'Research Scholars and PG Students',     fee: 'Rs.500/-' },
  { sno: '04', cat: 'NPR Staff',                             fee: 'Rs.500/-' },
  { sno: '05', cat: 'NPR Students',                          fee: 'Rs.300/-' },
];

const METHODS = [
  { id: 'GPay',        icon: '📱', label: 'Google Pay' },
  { id: 'PhonePe',     icon: '💜', label: 'PhonePe' },
  { id: 'Paytm',       icon: '💙', label: 'Paytm' },
  { id: 'BHIM UPI',    icon: '🇮🇳', label: 'BHIM UPI' },
  { id: 'Net Banking', icon: '🏦', label: 'Net Banking' },
  { id: 'Other UPI',   icon: '💳', label: 'Other UPI' },
];

export default function PaymentPage() {
  const { registrationId } = useParams();
  const navigate = useNavigate();

  const [reg,      setReg]      = useState(null);
  const [fee,      setFee]      = useState({ amount: 500, display: 'Rs.500/-' });
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [method,   setMethod]   = useState('GPay');
  const [txnId,    setTxnId]    = useState('');
  const [txnErr,   setTxnErr]   = useState('');
  const [ss,       setSs]       = useState(null);      // screenshot file
  const [ssPreview,setSsPreview]= useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [receipt,  setReceipt]  = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    getPaymentDetails(registrationId)
      .then(r => { setReg(r.data.data); setFee(r.data.fee || { amount: 500, display: 'Rs.500/-' }); setLoading(false); })
      .catch(e => { setError(e.response?.data?.message || 'Failed to load registration details.'); setLoading(false); });
  }, [registrationId]);

  const aName = r => [r.salutation, r.firstName, r.initial ? r.initial + '.' : '', r.lastName].filter(Boolean).join(' ');

  const handleSs = e => {
    const f = e.target.files[0]; if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['jpg','jpeg','png','webp','pdf'].includes(ext)) { toast.error('Upload JPG, PNG, or PDF only'); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error('Max 10 MB allowed'); return; }
    setSs(f);
    if (ext !== 'pdf') {
      const rd = new FileReader();
      rd.onload = ev => setSsPreview(ev.target.result);
      rd.readAsDataURL(f);
    } else { setSsPreview('pdf'); }
    toast.success('Screenshot attached ✓');
  };

  const handleSubmit = async () => {
    if (!txnId.trim() || txnId.trim().length < 4) { setTxnErr('Enter your Transaction ID from the payment app'); return; }
    setTxnErr('');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('registrationId', registrationId);
      fd.append('transactionId',  txnId.trim().toUpperCase());
      fd.append('method',         method);
      if (ss) fd.append('screenshotFile', ss);
      const r = await submitPayment(fd);
      toast.success('Payment submitted! Receipt sent to your email 📧');
      setReceipt(r.data.receipt);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Submission failed. Try again.');
    } finally { setSubmitting(false); }
  };

  /* ── Loading ────────────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-slate-50 to-teal-50/20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Loading payment details…</p>
      </div>
    </div>
  );

  /* ── Error ──────────────────────────────────────────────────────────────── */
  if (error) return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 bg-slate-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="font-display font-bold text-2xl text-navy-800 mb-2">Cannot Load Payment</h2>
        <p className="text-slate-500 text-sm mb-3">{error}</p>
        {error.toLowerCase().includes('expired') || error.toLowerCase().includes('not found') ? (
          <p className="text-amber-600 text-xs bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mb-5">
            ⏱ Your registration session may have expired (30 min limit). Please register again to proceed.
          </p>
        ) : null}
        <button onClick={() => navigate('/register')} className="btn-primary mx-auto">← Back to Registration</button>
      </div>
    </div>
  );

  /* ── Receipt / Success ──────────────────────────────────────────────────── */
  if (receipt) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/20 pt-24 pb-16 px-4 print:pt-8 print:bg-white">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden print:shadow-none">

          {/* Header */}
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-green-500/30">✓</div>
            <h1 className="font-display font-black text-2xl text-gold-400 mb-1">Payment Submitted!</h1>
            <p className="text-white/55 text-sm">Our team will verify within 24 hours</p>
          </div>

          {/* Email banner */}
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-center gap-2 text-blue-700 text-sm font-medium">
            <span className="text-lg">📧</span>
            Receipt &amp; confirmation sent to <strong className="ml-1">{receipt.email}</strong>
          </div>

          <div className="p-7 space-y-5">
            {/* Payment summary */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <h3 className="font-bold text-green-800 text-xs uppercase tracking-wider mb-4">Payment Summary</h3>
              <div className="space-y-2.5">
                {[
                  ['Registration ID',    receipt.registrationId],
                  ['Transaction ID',     receipt.transactionId],
                  ['Payment Method',     receipt.method],
                  ['Category',           receipt.category],
                  ['Amount',             `₹ ${receipt.amount}/-`],
                  ['Screenshot',         receipt.screenshotUploaded ? '✅ Uploaded' : '—'],
                  ['Submission Time',    receipt.paidAt ? new Date(receipt.paidAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }) : '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-start gap-4">
                    <span className="text-green-600 text-xs font-semibold w-36 flex-shrink-0">{k}</span>
                    <span className={`font-bold text-right break-all ${k === 'Transaction ID' ? 'font-mono text-blue-700 text-sm' : 'text-green-900 text-sm'}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Paper details */}
            <div className="bg-slate-50 rounded-2xl p-5">
              <h3 className="font-bold text-navy-700 text-xs uppercase tracking-wider mb-4">Paper Details</h3>
              <div className="space-y-2 text-xs">
                {[
                  ['Author',      receipt.authorName],
                  ['Institution', receipt.collegeName],
                  ['Paper Title', receipt.paperTitle],
                  ['Sub-Theme',   receipt.subTheme],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 border-b border-slate-100 pb-1.5 last:border-0">
                    <span className="text-slate-400 w-20 flex-shrink-0">{k}</span>
                    <span className="text-navy-800 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conference banner */}
            <div className="bg-navy-900 rounded-2xl p-4 text-center">
              <p className="text-gold-400 font-bold text-base mb-1">📅 Conference: 21st April 2026 (Tuesday)</p>
              <p className="text-white/60 text-xs">Dr. APJ. Abdul Kalam Hall · NPR CET, Natham, Dindigul</p>
              <p className="text-white/50 text-xs mt-1">Mode: Hybrid (Online + Offline)</p>
            </div>

            {/* Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700 leading-relaxed">
              <strong>📌 What happens next?</strong><br/>
              Our team will verify your payment within <strong>24 hours</strong>. Once verified, you will receive a final confirmation email. Please save your Transaction ID <strong className="font-mono">{receipt.transactionId}</strong> for reference.
            </div>

            <div className="flex flex-wrap gap-3 justify-center pt-1">
              <button onClick={() => window.print()} className="btn-primary text-sm py-2.5 px-6">🖨️ Print Receipt</button>
              <Link to="/" className="btn-outline bg-navy-800 border-navy-800 text-sm py-2.5 px-6">← Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Main Payment Page ──────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/10 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        <div className="text-center mb-6">
          <span className="section-label">Secure Payment</span>
          <h1 className="section-title">Complete Your Registration</h1>
          <div className="section-divider mx-auto" />
          <p className="text-slate-500 text-sm">Pay via GPay QR code or UPI ID, then submit your Transaction ID and screenshot.</p>
        </div>

        {/* ── Registration summary ───────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-start gap-3 pb-4 mb-4 border-b border-white/10">
            <div className="w-11 h-11 bg-gold-500 rounded-xl flex items-center justify-center font-bold text-navy-900 text-base flex-shrink-0 shadow">
              {reg?.firstName?.[0]}{reg?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-base leading-tight truncate">{aName(reg)}</p>
              <p className="text-white/50 text-xs mt-0.5">{reg?.designation} · {reg?.collegeName}</p>
              <p className="text-gold-400 font-mono text-xs mt-0.5">{reg?.registrationId}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white/45 text-xs">{reg?.category?.split(' ').slice(0,2).join(' ')}</p>
              <p className="font-mono font-black text-gold-400 text-2xl">₹ {fee.amount}/-</p>
            </div>
          </div>
          <div className="space-y-1 text-xs text-white/60">
            <p>📄 <span className="font-medium text-white/80 line-clamp-1">{reg?.paperTitle}</span></p>
            <p>🎯 <span className="truncate">{reg?.subTheme}</span></p>
          </div>
        </div>

        {/* ── Fee table ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-navy-800 px-5 py-3">
            <h3 className="font-bold text-gold-400 text-sm tracking-wide">Registration Fee Chart</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 w-10">S/No</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500">Category</th>
                <th className="px-4 py-2.5 text-right text-xs font-bold text-slate-500 w-28">Fees*</th>
              </tr>
            </thead>
            <tbody>
              {FEE_TABLE.map(({ sno, cat, fee: f }) => {
                const isYours = reg?.category === cat;
                return (
                  <tr key={sno} className={`border-t border-slate-100 ${isYours ? 'bg-teal-50' : ''}`}>
                    <td className="px-4 py-2.5 text-xs font-bold text-slate-400">{sno}</td>
                    <td className="px-4 py-2.5 font-medium text-navy-800 text-sm">
                      {cat}
                      {isYours && <span className="ml-2 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">YOUR CATEGORY</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-teal-600 text-sm">{f}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-600 mb-2">📌 Important Notes:</p>
            <ul className="space-y-1.5 text-xs text-slate-500 leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-teal-500 font-bold flex-shrink-0 mt-0.5">①</span><span>Applicable for a maximum of <strong>3 Authors per paper</strong>.</span></li>
              <li className="flex items-start gap-2"><span className="text-teal-500 font-bold flex-shrink-0 mt-0.5">②</span><span>If any <strong>Academician</strong> is included as a co-author in any category, a fee of <strong>Rs. 1,000/-</strong> must be paid.</span></li>
              <li className="flex items-start gap-2"><span className="text-teal-500 font-bold flex-shrink-0 mt-0.5">③</span><span>Fee Includes: <strong>Conference kit</strong>, refreshments, working lunch, <strong>E-participation certificate</strong> &amp; <strong>e-ISBN book copy</strong>.</span></li>
            </ul>
          </div>
        </div>

        {/* ── GPay QR + UPI ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-black text-blue-600 text-sm shadow">G</div>
            <div>
              <p className="font-bold text-white text-sm">Pay via GPay / UPI</p>
              <p className="text-blue-200 text-xs">Scan QR Code or enter UPI ID in your payment app</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-6 items-start">
              {/* Actual QR image */}
              <div className="text-center">
                <div className="inline-block p-2.5 bg-white border-4 border-slate-200 rounded-2xl shadow-md">
                  <img src={gpayQR} alt="INCOCOM 2K26 GPay QR Code"
                    className="w-44 h-44 object-contain rounded-xl" />
                </div>
                <p className="text-xs text-slate-500 mt-2.5 font-medium">Scan with GPay / PhonePe / BHIM / Any UPI App</p>
                <p className="text-xs text-slate-400 mt-0.5">INCOCOM 2K26 · NPR College</p>
              </div>

              {/* UPI ID + steps */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">UPI / GPay ID</p>
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                    <span className="font-mono font-bold text-blue-700 text-sm flex-1 break-all">{GPAY_UPI}</span>
                    <button onClick={() => { navigator.clipboard.writeText(GPAY_UPI).then(() => toast.success('UPI ID copied!')); }}
                      className="text-blue-500 hover:text-white text-xs font-bold bg-blue-100 hover:bg-blue-500 px-2.5 py-1 rounded-lg transition-all flex-shrink-0">
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Payee Name</p>
                  <p className="font-semibold text-navy-800 text-sm">{GPAY_NAME}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Amount to Pay</p>
                  <p className="font-mono font-black text-3xl text-teal-600">₹ {fee.amount}/-</p>
                  <p className="text-slate-400 text-xs">({fee.display} · {reg?.category})</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed">
                  <strong className="block mb-1">📋 How to pay:</strong>
                  1️⃣ Scan QR code or enter UPI ID above<br/>
                  2️⃣ Pay exactly <strong>₹{fee.amount}/-</strong><br/>
                  3️⃣ <strong>Take a screenshot</strong> of the success screen<br/>
                  4️⃣ Note the <strong>Transaction ID</strong><br/>
                  5️⃣ Fill the form below and submit
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Payment Confirmation Form ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h3 className="font-display font-bold text-xl text-navy-800">Confirm Your Payment</h3>

          {/* Method selector */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Payment Method Used</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {METHODS.map(m => (
                <button key={m.id} type="button" onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all ${method === m.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <span className="text-xl">{m.icon}</span>
                  <span className={`text-[10px] font-bold leading-tight text-center ${method === m.id ? 'text-teal-700' : 'text-slate-500'}`}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Transaction ID / UPI Reference No. <span className="text-red-500">*</span>
            </label>
            <input value={txnId}
              onChange={e => { setTxnId(e.target.value.toUpperCase()); setTxnErr(''); }}
              className={`w-full px-4 py-3.5 border-2 rounded-xl font-mono text-sm text-navy-800 bg-slate-50 focus:outline-none focus:bg-white transition-all ${txnErr ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'}`}
              placeholder="e.g. 4156789320GPAY  or  316528940741" />
            {txnErr && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠ {txnErr}</p>}
            <p className="text-slate-400 text-xs mt-1.5">📍 Find this in your UPI app → Transaction History → tap the payment</p>
          </div>

          {/* Screenshot upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Upload Payment Screenshot <span className="text-slate-400 font-normal">(Recommended · JPG / PNG / PDF)</span>
            </label>
            <input type="file" accept="image/*,.pdf" onChange={handleSs} ref={fileRef} id="ssInput" className="hidden" />

            {ssPreview ? (
              <div className="border-2 border-teal-300 bg-teal-50 rounded-2xl p-4">
                {ssPreview === 'pdf' ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📄</span>
                    <div>
                      <p className="font-semibold text-navy-700 text-sm">{ss?.name}</p>
                      <p className="text-teal-500 text-xs">{ss ? Math.round(ss.size / 1024) + ' KB' : ''} · PDF uploaded ✓</p>
                    </div>
                    <button onClick={() => { setSs(null); setSsPreview(null); }} className="ml-auto text-red-400 hover:text-red-600 text-xs font-bold">✕ Remove</button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-navy-700 text-sm">✅ Screenshot uploaded</p>
                      <button onClick={() => { setSs(null); setSsPreview(null); }} className="text-red-400 hover:text-red-600 text-xs font-bold">✕ Remove</button>
                    </div>
                    <img src={ssPreview} alt="Payment screenshot preview"
                      className="w-full max-h-52 object-contain rounded-xl border border-teal-200 shadow-sm" />
                    <p className="text-teal-600 text-xs mt-2">{ss?.name} · {ss ? Math.round(ss.size / 1024) + ' KB' : ''}</p>
                  </div>
                )}
              </div>
            ) : (
              <label htmlFor="ssInput"
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50 rounded-2xl py-9 px-4 cursor-pointer transition-all">
                <span className="text-4xl mb-2 opacity-30">📸</span>
                <p className="font-medium text-slate-500 text-sm">Click to upload payment screenshot</p>
                <p className="text-slate-400 text-xs mt-1">JPG · PNG · PDF · Max 10 MB</p>
              </label>
            )}
          </div>

          {/* Submit */}
          <button type="button" onClick={handleSubmit} disabled={submitting || !txnId.trim()}
            className="w-full btn-primary justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gold-500/15">
            {submitting
              ? <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting…
                </span>
              : '✓ Submit Payment Confirmation'}
          </button>

          <p className="text-center text-slate-400 text-xs">
            🔒 Secure · Need help?{' '}
            <a href="tel:+919943819028" className="text-teal-500 font-medium hover:underline">+91-99438 19028</a>
            {' '}·{' '}
            <a href="mailto:nprcetincocom@nprcolleges.org" className="text-teal-500 hover:underline">nprcetincocom@nprcolleges.org</a>
          </p>
        </div>
      </div>
    </div>
  );
}
