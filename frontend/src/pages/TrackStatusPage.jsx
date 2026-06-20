import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getRegistrationStatus } from '../services/api';

const statusConfig = {
  under_review: { label: 'Under Review', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: '🔍', desc: 'Your paper is being reviewed by the conference committee. You will be notified by 13.04.2026.' },
  accepted: { label: 'Accepted – Proceed to Payment', color: 'bg-green-100 text-green-700 border-green-300', icon: '✅', desc: 'Congratulations! Your paper has been accepted. Please proceed to payment to confirm your registration.' },
  rejected: { label: 'Not Selected', color: 'bg-red-100 text-red-700 border-red-300', icon: '❌', desc: 'Thank you for your submission. Unfortunately, your paper was not selected for this conference.' },
  payment_pending: { label: 'Payment Pending', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: '💳', desc: 'Your paper is accepted. Please complete the payment to confirm your participation.' },
  payment_done: { label: 'Confirmed – Payment Complete', color: 'bg-teal-100 text-teal-700 border-teal-300', icon: '🎉', desc: 'Your registration is confirmed. See you at INCOCOM 2K26 on April 21, 2026!' },
};

export default function TrackStatusPage() {
  const location = useLocation();
  const [regId, setRegId] = useState(location.state?.registrationId || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showSuccess, setShowSuccess] = useState(location.state?.success || false);

  const search = async () => {
    if (!regId.trim()) { toast.error('Please enter a Registration ID'); return; }
    setLoading(true); setSearched(true);
    try {
      const res = await getRegistrationStatus(regId.trim());
      setData(res.data.data);
    } catch {
      setData(null);
      toast.error('Registration ID not found. Please check and try again.');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (location.state?.registrationId) {
      search();
      setShowSuccess(true);
    }
  }, []);

  const status = data ? statusConfig[data.status] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-label">Paper Status</span>
          <h1 className="section-title">Track Your Submission</h1>
          <div className="section-divider mx-auto" />
        </div>

        {/* Success banner */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-bold text-green-800 text-lg mb-1">Registration Submitted Successfully!</h3>
            <p className="text-green-700 text-sm">Your paper has been submitted. Please wait for confirmation from the Conference Committee.<br/>You will be notified via email and WhatsApp by <strong>13.04.2026</strong>.</p>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-6">
          <label className="form-label">Enter Your Registration ID</label>
          <div className="flex gap-3">
            <input value={regId} onChange={e => setRegId(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()}
              className="form-input flex-1" placeholder="e.g. INCO-2K26-XXXXXXXX" />
            <button onClick={search} disabled={loading} className="btn-primary whitespace-nowrap">
              {loading ? '...' : 'Track →'}
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-2">Your Registration ID was sent to your email and WhatsApp after submission.</p>
        </div>

        {/* Result */}
        {searched && !loading && data && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-mono mb-1">{data.registrationId}</p>
                <h3 className="font-display font-bold text-xl text-navy-800">{data.paperTitle}</h3>
                <p className="text-slate-500 text-sm">{data.authorName} · {data.collegeName}</p>
              </div>
            </div>

            {status && (
              <div className={`flex items-start gap-4 p-5 rounded-2xl border ${status.color} mb-6`}>
                <span className="text-3xl flex-shrink-0">{status.icon}</span>
                <div>
                  <p className="font-bold text-lg mb-1">{status.label}</p>
                  <p className="text-sm opacity-80 leading-relaxed">{status.desc}</p>
                  {data.adminRemarks && <p className="mt-2 text-sm font-medium">Remarks: {data.adminRemarks}</p>}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-3">
              {[
                { label: 'Submitted', date: new Date(data.submittedAt).toLocaleDateString('en-IN'), done: true },
                { label: 'Under Review', date: 'Conference Committee', done: data.status !== 'under_review' || true },
                { label: 'Decision', date: '13.04.2026', done: ['accepted','rejected','payment_pending','payment_done'].includes(data.status) },
                { label: 'Payment', date: 'After acceptance', done: ['payment_done'].includes(data.status) },
                { label: 'Conference', date: '21.04.2026', done: data.status === 'payment_done' },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step.done ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {step.done ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm font-medium flex-1 ${step.done ? 'text-navy-800' : 'text-slate-400'}`}>{step.label}</span>
                  <span className="text-xs text-slate-400">{step.date}</span>
                </div>
              ))}
            </div>

            {/* Payment CTA */}
            {(data.status === 'accepted' || data.status === 'payment_pending') && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link to={`/payment/${data.registrationId}`} className="btn-primary w-full justify-center text-center">
                  💳 Proceed to Payment
                </Link>
              </div>
            )}
          </div>
        )}

        {searched && !loading && !data && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-navy-800 mb-2">Registration Not Found</h3>
            <p className="text-slate-500 text-sm">Please check your Registration ID and try again, or contact us at nprcetincocom@nprcolleges.org</p>
          </div>
        )}
      </div>
    </div>
  );
}
