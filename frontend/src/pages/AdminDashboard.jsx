import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDashboardStats, getAllRegistrations, updateStatus, exportExcelUrl, downloadPaperUrl, screenshotViewUrl, BASE } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS = {
  pending_payment:   { label: 'Pending Payment',   bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-400' },
  payment_submitted: { label: 'Pmt Submitted',      bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500' },
  payment_verified:  { label: 'Verified ✓',         bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500' },
  rejected:          { label: 'Rejected',            bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-400' },
};

const FILTERS = [
  ['', 'All'],
  ['pending_payment',   'Pending Payment'],
  ['payment_submitted', 'Pmt Submitted'],
  ['payment_verified',  'Verified'],
  ['rejected',          'Rejected'],
];

function Badge({ status }) {
  const c = STATUS[status] || { label: status, bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}

function StatCard({ label, value, icon, bg }) {
  return (
    <div className={`${bg} rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-2xl">{icon}</span>
        <span className="font-mono font-black text-3xl">{value ?? 0}</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-wide opacity-70 leading-tight">{label}</p>
    </div>
  );
}

function authorFull(r) {
  return [r.salutation, r.firstName, r.initial ? r.initial + '.' : '', r.lastName].filter(Boolean).join(' ');
}

function fileSize(b) {
  if (!b) return '';
  return b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;
}

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [stats,    setStats]    = useState(null);
  const [regs,     setRegs]     = useState([]);
  const [filter,   setFilter]   = useState('');
  const [search,   setSearch]   = useState('');
  const [loadS,    setLoadS]    = useState(true);
  const [loadR,    setLoadR]    = useState(true);
  const [errS,     setErrS]     = useState('');
  const [errR,     setErrR]     = useState('');
  const [modal,    setModal]    = useState(false);
  const [selected, setSelected] = useState(null);
  const [form,     setForm]     = useState({ status: '', adminRemarks: '' });
  const [saving,   setSaving]   = useState(false);
  const [ssModal,  setSsModal]  = useState(false);   // screenshot modal
  const [ssUrl,    setSsUrl]    = useState('');
  const [ssLoading,setSsLoading]= useState(false);

  const fetchStats = useCallback(async () => {
    setLoadS(true); setErrS('');
    try {
      const r = await getDashboardStats();
      if (r.data?.success) setStats(r.data.stats);
      else setErrS('Could not load stats');
    } catch (e) {
      setErrS(e.response?.data?.message || 'Backend not reachable');
      toast.error('Stats failed — is backend running?');
    } finally { setLoadS(false); }
  }, []);

  const fetchRegs = useCallback(async () => {
    setLoadR(true); setErrR('');
    try {
      const r = await getAllRegistrations(filter ? { status: filter } : {});
      if (r.data?.success) setRegs(r.data.data || []);
      else setErrR('Could not load registrations');
    } catch (e) {
      setErrR(e.response?.data?.message || 'Backend not reachable');
      toast.error('Data failed — is backend running?');
    } finally { setLoadR(false); }
  }, [filter]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchRegs();  }, [fetchRegs]);

  const filtered = regs.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.paperTitle?.toLowerCase().includes(q) ||
      r.registrationId?.toLowerCase().includes(q) ||
      r.collegeName?.toLowerCase().includes(q) ||
      r.paymentDetails?.transactionId?.toLowerCase().includes(q)
    );
  });

  const openModal = reg => {
    setSelected(reg);
    setForm({ status: reg.status, adminRemarks: reg.adminRemarks || '' });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.status) { toast.error('Select a status'); return; }
    setSaving(true);
    try {
      const r = await updateStatus(selected._id, form);
      if (r.data?.success) {
        toast.success(r.data.message || 'Status updated!');
        setModal(false);
        fetchStats();
        fetchRegs();
      } else toast.error(r.data?.message || 'Update failed');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const fetchWithAuth = async (url, filename, inline = false) => {
    const tok = localStorage.getItem('adminToken');
    try {
      const r = await fetch(url, { headers: { Authorization: `Bearer ${tok}` } });
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      const blob = await r.blob();
      if (inline) {
        const objUrl = URL.createObjectURL(blob);
        setSsUrl(objUrl);
        setSsModal(true);
        setSsLoading(false);
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
        toast.success(`Downloaded: ${filename}`);
      }
    } catch (e) {
      toast.error(e.message || 'File not found');
      setSsLoading(false);
    }
  };

  const handleDownloadPaper = reg => {
    fetchWithAuth(downloadPaperUrl(reg._id), reg.paperFile?.originalName || 'paper');
  };

  const handleViewScreenshot = reg => {
    if (!reg.paymentDetails?.screenshotFile) { toast.error('No screenshot uploaded'); return; }
    setSsLoading(true);
    setSsModal(true);
    setSsUrl('');
    fetchWithAuth(screenshotViewUrl(reg._id), reg.paymentDetails.screenshotOriginal || 'screenshot', true);
  };

  const handleExportExcel = () => {
    const url = exportExcelUrl(filter);
    fetchWithAuth(url, `INCOCOM2K26_${filter || 'All'}_${new Date().toISOString().slice(0,10)}.csv`);
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav className="bg-navy-900 sticky top-0 z-40 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center font-display font-black text-navy-900 text-sm shadow">NPR</div>
            <div>
              <div className="font-display font-bold text-white text-sm leading-tight">INCOCOM 2K26</div>
              <div className="text-white/40 text-xs">Admin Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/55 text-xs">{admin?.email}</span>
            </div>
            <button onClick={handleExportExcel}
              className="flex items-center gap-1.5 text-xs font-bold bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg transition-all shadow">
              📥 Export CSV
            </button>
            <button onClick={() => { fetchStats(); fetchRegs(); }}
              className="text-white/55 hover:text-white text-xs border border-white/15 hover:border-white/30 px-3 py-1.5 rounded-lg transition-all">
              🔄 Refresh
            </button>
            <button onClick={handleLogout}
              className="text-white/55 hover:text-white text-xs border border-white/20 hover:border-red-400 hover:text-red-400 px-3 py-1.5 rounded-lg transition-all">
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Title */}
        <div className="mb-8">
          <h1 className="font-display font-black text-2xl text-navy-900">Paper Registrations Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">INCOCOM 2K26 · View submissions, verify payments, download files, export data</p>
        </div>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        {errS ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex gap-3 items-start">
            <span className="text-xl flex-shrink-0">❌</span>
            <div>
              <p className="font-bold text-red-700">{errS}</p>
              <p className="text-red-500 text-xs mt-1">Make sure backend is running: <code className="bg-red-100 px-1 rounded">cd backend && nodemon server.js</code></p>
              <button onClick={fetchStats} className="mt-2 text-sm text-red-600 font-bold underline">Retry →</button>
            </div>
          </div>
        ) : loadS ? (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            <StatCard label="Total"          value={stats?.total}              icon="📊" bg="bg-white border border-slate-100 text-navy-800 shadow-sm" />
            <StatCard label="Pending Payment" value={stats?.pending_payment}   icon="⏳" bg="bg-amber-50 border border-amber-100 text-amber-800" />
            <StatCard label="Pmt Submitted"  value={stats?.payment_submitted}  icon="📤" bg="bg-blue-50 border border-blue-100 text-blue-800" />
            <StatCard label="Verified"       value={stats?.payment_verified}   icon="✅" bg="bg-green-50 border border-green-100 text-green-800" />
            <StatCard label="Rejected"       value={stats?.rejected}           icon="❌" bg="bg-red-50 border border-red-100 text-red-800" />
          </div>
        )}

        {/* ── Filters ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-5 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === val ? 'bg-navy-800 text-white border-navy-800 shadow' : 'bg-white text-slate-500 border-slate-200 hover:border-navy-300 hover:text-navy-700'}`}>
                {label}{val === '' && stats ? ` (${stats.total})` : ''}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm pointer-events-none">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 w-56"
                placeholder="Search name, ID, email, txn..." />
            </div>
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-navy-800">Registrations</h2>
            <span className="text-slate-400 text-sm">{loadR ? '…' : `${filtered.length} record${filtered.length !== 1 ? 's' : ''}`}</span>
          </div>

          {errR && !loadR && (
            <div className="m-6 bg-red-50 border border-red-200 rounded-xl p-5 flex gap-3 items-start">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <div>
                <p className="font-bold text-red-700">{errR}</p>
                <p className="text-red-500 text-xs mt-1">Ensure backend + MongoDB are running</p>
                <button onClick={fetchRegs} className="mt-2 text-sm text-red-600 font-bold underline">Retry →</button>
              </div>
            </div>
          )}

          {loadR && (
            <div className="p-6 space-y-2">
              {[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />)}
            </div>
          )}

          {!loadR && !errR && filtered.length === 0 && (
            <div className="py-20 text-center">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-slate-400 font-medium">
                {search ? `No results for "${search}"` : filter ? `No ${STATUS[filter]?.label} submissions` : 'No submissions yet'}
              </p>
            </div>
          )}

          {!loadR && !errR && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['#', 'Reg ID', 'Author', 'Institution', 'Paper Title', 'Cat / Fee', 'Authors', 'Paper', 'Txn ID', 'Screenshot', 'Date', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((reg, idx) => (
                    <tr key={reg._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3 py-3 text-slate-300 text-xs">{idx + 1}</td>

                      <td className="px-3 py-3">
                        <span className="font-mono text-xs font-bold text-teal-600 whitespace-nowrap">{reg.registrationId}</span>
                      </td>

                      <td className="px-3 py-3">
                        <div className="font-semibold text-navy-800 text-xs whitespace-nowrap">{authorFull(reg)}</div>
                        <div className="text-slate-400 text-xs">{reg.email}</div>
                        <div className="text-slate-400 text-xs">📱 {reg.phone}</div>
                      </td>

                      <td className="px-3 py-3">
                        <div className="text-xs text-slate-600 max-w-[130px] truncate font-medium">{reg.collegeName}</div>
                        <div className="text-xs text-slate-400">{reg.city}, {reg.district}</div>
                        <div className="text-xs text-slate-400 truncate">{reg.department}</div>
                      </td>

                      <td className="px-3 py-3 max-w-[180px]">
                        <div className="text-xs text-navy-700 font-medium line-clamp-2">{reg.paperTitle}</div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">{reg.subTheme}</div>
                      </td>

                      <td className="px-3 py-3">
                        <div className="text-xs font-semibold text-navy-700">{reg.category?.split(' ')[0]}</div>
                        <div className="text-xs font-mono font-bold text-teal-600">
                          {reg.category === 'Foreigners & NRI' ? '₹850' :
                           reg.category === 'Academicians and Corporate Delegates' ? '₹1000' :
                           reg.category === 'NPR Students' ? '₹300' : '₹500'}
                        </div>
                      </td>

                      <td className="px-3 py-3 text-center">
                        <span className="text-xs font-bold text-navy-700 bg-navy-100 px-2 py-0.5 rounded-full">
                          {1 + (reg.coAuthors?.length || 0)}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        {reg.paperFile?.originalName ? (
                          <button onClick={() => handleDownloadPaper(reg)}
                            className="flex items-center gap-1 text-xs text-teal-600 hover:text-white bg-teal-50 hover:bg-teal-500 border border-teal-200 hover:border-teal-500 px-2 py-1 rounded-lg transition-all font-semibold whitespace-nowrap">
                            ⬇ {reg.paperFile.originalName.split('.').pop().toUpperCase()}
                          </button>
                        ) : <span className="text-xs text-slate-300 italic">None</span>}
                      </td>

                      <td className="px-3 py-3">
                        {reg.paymentDetails?.transactionId ? (
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg whitespace-nowrap">
                            {reg.paymentDetails.transactionId}
                          </span>
                        ) : <span className="text-xs text-slate-300 italic">—</span>}
                      </td>

                      <td className="px-3 py-3">
                        {reg.paymentDetails?.screenshotFile ? (
                          <button onClick={() => handleViewScreenshot(reg)}
                            className="flex items-center gap-1 text-xs text-purple-600 hover:text-white bg-purple-50 hover:bg-purple-500 border border-purple-200 hover:border-purple-500 px-2 py-1 rounded-lg transition-all font-semibold whitespace-nowrap">
                            👁 View
                          </button>
                        ) : <span className="text-xs text-slate-300 italic">None</span>}
                      </td>

                      <td className="px-3 py-3 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(reg.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </td>

                      <td className="px-3 py-3"><Badge status={reg.status} /></td>

                      <td className="px-3 py-3">
                        <button onClick={() => openModal(reg)}
                          className="bg-navy-800 hover:bg-teal-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-bold whitespace-nowrap shadow-sm">
                          Manage →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Manage Modal ────────────────────────────────────────────────── */}
      {modal && selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col">

            {/* Modal header */}
            <div className="bg-gradient-to-br from-navy-800 to-navy-900 p-6 rounded-t-3xl flex-shrink-0">
              <div className="flex gap-3 justify-between items-start">
                <div className="min-w-0">
                  <p className="text-gold-400 font-mono text-xs font-bold mb-1">{selected.registrationId}</p>
                  <p className="font-bold text-white text-base leading-snug line-clamp-2">{selected.paperTitle}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-white/60 text-sm">{authorFull(selected)}</span>
                    <Badge status={selected.status} />
                  </div>
                </div>
                <button onClick={() => setModal(false)}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors text-sm">✕</button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-4">

              {/* Author details */}
              <div>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-teal-500 rounded" /> Main Author
                </p>
                <div className="bg-slate-50 rounded-xl p-4 grid sm:grid-cols-2 gap-x-8 gap-y-1 text-xs">
                  {[
                    ['Salutation', selected.salutation],
                    ['Full Name',  authorFull(selected)],
                    ['Designation', selected.designation],
                    ['Department',  selected.department],
                    ['College',     selected.collegeName],
                    ['City / District', `${selected.city}, ${selected.district}`],
                    ['Phone',       selected.phone],
                    ['Email',       selected.email],
                    ['Category',    selected.category],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2 border-b border-slate-100 py-1 last:border-0">
                      <span className="text-slate-400 w-28 flex-shrink-0">{k}</span>
                      <span className="font-semibold text-navy-800 break-all">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Co-authors */}
              {selected.coAuthors?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-navy-400 rounded" /> Co-Authors ({selected.coAuthors.length})
                  </p>
                  <div className="space-y-1.5">
                    {selected.coAuthors.map((ca, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl px-4 py-2.5 text-xs flex flex-wrap gap-x-3 gap-y-0.5">
                        <span className="font-bold text-navy-700">{ca.salutation} {ca.firstName} {ca.initial ? ca.initial + '.' : ''} {ca.lastName}</span>
                        {ca.designation && <span className="text-slate-400">· {ca.designation}</span>}
                        {ca.collegeName && <span className="text-slate-400">· {ca.collegeName}</span>}
                        {ca.email      && <span className="text-teal-500">· {ca.email}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Paper + file */}
              <div>
                <p className="text-xs font-bold text-gold-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-gold-500 rounded" /> Paper Details
                </p>
                <div className="bg-slate-50 rounded-xl p-4 space-y-1.5 text-xs">
                  {[
                    ['Sub-Theme', selected.subTheme],
                    ['Keywords',  selected.keywords || 'N/A'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2 border-b border-slate-100 pb-1.5">
                      <span className="text-slate-400 w-20 flex-shrink-0">{k}</span>
                      <span className="font-semibold text-navy-800">{v}</span>
                    </div>
                  ))}

                  {/* Paper file download */}
                  <div className="flex gap-2 items-center border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400 w-20 flex-shrink-0">Paper File</span>
                    {selected.paperFile?.originalName ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-navy-800">{selected.paperFile.originalName}</span>
                        {selected.paperFile.size > 0 && <span className="text-slate-400">({fileSize(selected.paperFile.size)})</span>}
                        <button onClick={() => handleDownloadPaper(selected)}
                          className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-all">
                          ⬇ Download
                        </button>
                      </div>
                    ) : <span className="text-slate-400 italic">No file uploaded</span>}
                  </div>

                  {/* Abstract */}
                  <details className="cursor-pointer">
                    <summary className="text-teal-500 font-semibold hover:text-teal-700 select-none">▼ View Abstract</summary>
                    <p className="text-slate-600 mt-2 leading-relaxed max-h-36 overflow-y-auto bg-white p-3 rounded-lg border border-slate-100">{selected.abstract}</p>
                  </details>
                </div>
              </div>

              {/* Payment details */}
              {selected.paymentDetails?.transactionId && (
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-blue-500 rounded" /> Payment Details
                  </p>
                  <div className={`rounded-xl p-4 space-y-1.5 text-xs ${selected.status === 'payment_verified' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                    {[
                      ['Method',         selected.paymentDetails.method || '—'],
                      ['Transaction ID', selected.paymentDetails.transactionId],
                      ['Amount Paid',    selected.paymentDetails.amount ? `₹ ${selected.paymentDetails.amount}/-` : '—'],
                      ['Category',       selected.category || '—'],
                      ['Paid At',        selected.paymentDetails.paidAt ? new Date(selected.paymentDetails.paidAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-2 border-b border-black/5 pb-1.5 last:border-0">
                        <span className="text-slate-500 w-28 flex-shrink-0">{k}</span>
                        <span className={`font-bold ${k === 'Transaction ID' ? 'font-mono text-blue-700 text-sm' : 'text-navy-800'}`}>{v}</span>
                      </div>
                    ))}

                    {/* Screenshot */}
                    <div className="flex gap-2 items-center pt-1">
                      <span className="text-slate-500 w-28 flex-shrink-0">Screenshot</span>
                      {selected.paymentDetails.screenshotFile ? (
                        <div className="flex items-center gap-2">
                          <span className="text-navy-800 font-semibold">{selected.paymentDetails.screenshotOriginal || 'screenshot'}</span>
                          <button onClick={() => handleViewScreenshot(selected)}
                            className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-all">
                            👁 View Screenshot
                          </button>
                        </div>
                      ) : <span className="text-slate-400 italic">Not uploaded</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Status update */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Update Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer text-sm">
                    <option value="">— Select new status —</option>
                    <option value="pending_payment">⏳ Pending Payment</option>
                    <option value="payment_submitted">📤 Payment Submitted (Awaiting Verification)</option>
                    <option value="payment_verified">✅ Payment Verified – Confirmed</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Admin Remarks <span className="font-normal text-slate-400">(will be sent to author via email)</span>
                  </label>
                  <textarea value={form.adminRemarks} onChange={e => setForm(f => ({ ...f, adminRemarks: e.target.value }))}
                    rows={3} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 bg-slate-50 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none text-sm"
                    placeholder="Optional remarks for the author..." />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 p-6 pt-0 flex-shrink-0 border-t border-slate-100">
              <button onClick={() => setModal(false)}
                className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:border-slate-400 text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.status}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all">
                {saving
                  ? <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Saving…
                    </span>
                  : '✓ Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Screenshot Modal ─────────────────────────────────────────────── */}
      {ssModal && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) { setSsModal(false); if (ssUrl) URL.revokeObjectURL(ssUrl); setSsUrl(''); } }}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">🖼️</span>
                <span className="font-bold text-navy-800 text-sm">Payment Screenshot</span>
              </div>
              <button onClick={() => { setSsModal(false); if (ssUrl) URL.revokeObjectURL(ssUrl); setSsUrl(''); }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-slate-500 transition-colors text-sm">✕</button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-100 p-4 min-h-[300px]">
              {ssLoading && (
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Loading screenshot…</p>
                </div>
              )}
              {!ssLoading && ssUrl && ssUrl !== 'pdf' && (
                <img src={ssUrl} alt="Payment screenshot"
                  className="max-w-full max-h-full object-contain rounded-xl shadow-lg" />
              )}
              {!ssLoading && !ssUrl && (
                <div className="text-center">
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="text-slate-500 text-sm">Could not load screenshot</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
