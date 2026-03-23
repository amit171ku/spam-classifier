import { useState, useEffect } from 'react'
import api from './api'

function Classifier({ onNewResult }) {
  const [form, setForm] = useState({ sender: '', subject: '', body: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const classify = async () => {
    if (!form.subject && !form.body) return
    setLoading(true)
    try {
      const res = await api.post('/predict', form)
      setResult(res.data)
      onNewResult()
    } catch (e) {
      alert('Server se connect nahi ho pa raha. Backend chal raha hai?')
    }
    setLoading(false)
  }

  const sendFeedback = async (correct) => {
    await api.post(`/feedback/${result.id}?is_correct=${correct}`)
    setResult(r => ({ ...r, feedbackSent: true }))
  }

  const loadSample = (type) => {
    const samples = {
      spam: { sender: 'winner@prize.xyz', subject: 'You WON $1,000,000!!!', body: 'CLAIM your prize NOW!! Send bank details urgently!!' },
      ham:  { sender: 'team@github.com', subject: 'Your weekly digest', body: 'Here is a summary of activity on your repositories this week.' },
      phishing: { sender: 'security@paypa1-verify.com', subject: 'Verify your account now', body: 'Your account is suspended. Enter your password and credit card to restore access.' }
    }
    setForm(samples[type])
    setResult(null)
  }

  const icons = { spam: '🚫', ham: '✅', phishing: '⚠️', promotional: '📢' }

  return (
    <div className="gap">
      <div className="grid-2">
        <div>
          <div className="label">Sender</div>
          <input placeholder="sender@example.com" value={form.sender}
            onChange={e => setForm(f => ({ ...f, sender: e.target.value }))} />
        </div>
        <div>
          <div className="label">Subject</div>
          <input placeholder="Email subject..." value={form.subject}
            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
        </div>
      </div>
      <div>
        <div className="label">Email Body</div>
        <textarea placeholder="Paste email body here..." value={form.body}
          onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={classify} disabled={loading}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              Analyzing...
            </span>
          ) : '🔍 Classify Email'}
        </button>
        <button className="btn btn-secondary" onClick={() => loadSample('spam')}>Spam Sample</button>
        <button className="btn btn-secondary" onClick={() => loadSample('ham')}>Ham Sample</button>
        <button className="btn btn-secondary" onClick={() => loadSample('phishing')}>Phishing Sample</button>
      </div>

      {result && (
        <div className="result-card">
          <div className="result-top">
            <div className={`verdict-icon icon-${result.verdict}`}>
              {icons[result.verdict] || '📧'}
            </div>
            <div>
              <div className={`verdict ${result.verdict}`}>
                {result.verdict.toUpperCase()}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                {result.confidence}% confidence · ML score: {result.ml_score}%
              </div>
            </div>
          </div>

          <div className="confidence-label">
            <span>Risk Level</span>
            <span>{result.confidence}%</span>
          </div>
          <div className="confidence-bar">
            <div className={`confidence-fill fill-${result.verdict}`}
              style={{ width: `${result.confidence}%` }} />
          </div>

          <div className="section-label">Why this verdict</div>
          <div className="reasons">
            {result.reasons.map((r, i) => (
              <span key={i} className={`reason-tag ${
                r.includes('keyword') || r.includes('Phishing') ? 'danger'
                : r.includes('No suspicious') ? 'normal' : 'warn'
              }`}>
                {r}
              </span>
            ))}
          </div>

          {!result.feedbackSent ? (
            <div className="feedback-row">
              <span>Was this correct?</span>
              <button className="fb-btn" onClick={() => sendFeedback(true)}>✓ Correct</button>
              <button className="fb-btn" onClick={() => sendFeedback(false)}>✗ Wrong</button>
            </div>
          ) : (
            <div style={{ marginTop: '1rem', fontSize: '13px', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✓ Feedback saved!
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function History() {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const url = filter === 'all' ? '/history' : `/history?verdict=${filter}`
    api.get(url).then(r => setLogs(r.data))
  }, [filter])

  const filtered = logs.filter(l =>
    l.subject?.toLowerCase().includes(search.toLowerCase()) ||
    l.sender?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          placeholder="🔍 Search subject or sender..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['all','spam','ham','phishing','promotional'].map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)} style={{ padding: '6px 14px', fontSize: '12px' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#475569', padding: '3rem', background: '#0f0f1a', borderRadius: '12px', border: '1px solid #1e1e2e' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
          <div style={{ fontSize: '14px' }}>No results found</div>
        </div>
      ) : (
        filtered.map(log => (
          <div className="history-item" key={log.id}>
            <div className="hi-top">
              <div className="hi-subject">{log.subject || '(no subject)'}</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className={`mini-badge badge-${log.verdict}`}>{log.verdict}</span>
                <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>{log.confidence}%</span>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
              {log.sender} · {log.created_at?.slice(0, 19)}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/stats').then(r => setStats(r.data))
  }, [])

  if (!stats) return (
    <div style={{ textAlign: 'center', color: '#475569', padding: '3rem' }}>Loading...</div>
  )

  const breakdown = [
    { key: 'spam',        label: 'Spam',        color: '#ef4444', icon: '🚫' },
    { key: 'ham',         label: 'Safe',         color: '#22c55e', icon: '✅' },
    { key: 'phishing',    label: 'Phishing',     color: '#f59e0b', icon: '⚠️' },
    { key: 'promotional', label: 'Promotional',  color: '#3b82f6', icon: '📢' },
  ]

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Checked</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Spam Detected</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>{stats.spam || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Safe Emails</div>
          <div className="stat-value" style={{ color: '#22c55e' }}>{stats.ham || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">User Accuracy</div>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.accuracy}%</div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-title">CLASSIFICATION BREAKDOWN</div>
        {breakdown.map(({ key, label, color, icon }) => {
          const count = stats[key] || 0
          const pct = stats.total ? Math.round(count / stats.total * 100) : 0
          return (
            <div key={key} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{icon}</span>
                  <span style={{ color: '#94a3b8' }}>{label}</span>
                </span>
                <span style={{ color, fontWeight: '600' }}>{count} <span style={{ color: '#475569', fontWeight: '400' }}>({pct}%)</span></span>
              </div>
              <div style={{ height: '6px', background: '#1e1e2e', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('classify')
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="app">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="header">
        <div className="header-icon">🛡️</div>
        <div>
          <h1>Spam Classifier</h1>
          <p>AI-powered email threat detection</p>
        </div>
      </div>

      <div className="tabs">
        {[
          { key: 'classify',  label: '🔍 Classify' },
          { key: 'history',   label: '📋 History'  },
          { key: 'dashboard', label: '📊 Dashboard' },
        ].map(t => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'classify'  && <Classifier onNewResult={() => setRefresh(r => r + 1)} />}
      {tab === 'history'   && <History key={refresh} />}
      {tab === 'dashboard' && <Dashboard key={refresh} />}
    </div>
  )
}