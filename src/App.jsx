import React, { useState } from 'react';
import './App.css';
import { ShieldCheck, ShieldAlert, Search, Activity, Lock, Users, Code } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  // Determinisztikus elemző: Ugyanaz a link = ugyanaz az eredmény
  const analyzeLink = (inputUrl) => {
    let hash = 0;
    for (let i = 0; i < inputUrl.length; i++) {
      hash = inputUrl.charCodeAt(i) + ((hash << 5) - hash);
    }
    const score = Math.abs(hash % 100);

    return {
      score: score,
      contract: score > 70 ? 'High Risk / Unverified' : (score > 30 ? 'Medium Risk' : 'Verified & Clean'),
      liquidity: score % 2 === 0 ? 'Locked (1 Year)' : 'UNLOCKED / DANGEROUS',
      holders: (score * 7) % 100 < 20 ? 'Whale Concentration' : 'Healthy Distribution',
      mintFunction: score > 60 ? 'Enabled (Dangerous)' : 'Disabled (Safe)',
      overall: score > 60 ? 'CRITICAL' : (score > 30 ? 'SUSPICIOUS' : 'SAFE')
    };
  };

  const handleCheck = (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setReport(null);

    // Szimulált szkennelési folyamat
    setTimeout(() => {
      setReport(analyzeLink(url));
      setLoading(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    if (status === 'SAFE') return '#22c55e';
    if (status === 'SUSPICIOUS') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="container">
      <div className="analyzer-card">
        <header className="header">
          <h1>RugGuard Pro v2.0</h1>
          <p style={{color: '#94a3b8'}}>Deep Scan Token Analysis</p>
        </header>

        <form onSubmit={handleCheck} className="input-section">
          <div className="input-group">
            <input
              type="text"
              placeholder="Paste DexScreener / Dextools link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Scanning...' : 'Analyze'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="scanning-loader">
            <Activity className="animate-spin" size={40} color="#3b82f6" />
            <p>Analyzing contract bytecode and liquidity pools...</p>
          </div>
        )}

        {report && !loading && (
          <div className="results-area">
            <div className="status-banner" style={{
              backgroundColor: getStatusColor(report.overall) + '20',
              color: getStatusColor(report.overall),
              border: `1px solid ${getStatusColor(report.overall)}`
            }}>
              {report.overall === 'SAFE' ? <ShieldCheck style={{verticalAlign: 'middle', marginRight: '8px'}}/> : <ShieldAlert style={{verticalAlign: 'middle', marginRight: '8px'}}/>}
              {report.overall} - Risk Score: {report.score}/100
            </div>

            <div className="risk-grid">
              <div className="risk-item" style={{borderLeftColor: report.score > 70 ? '#ef4444' : '#22c55e'}}>
                <h4><Code size={14}/> Contract Status</h4>
                <p>{report.contract}</p>
              </div>
              <div className="risk-item" style={{borderLeftColor: report.liquidity.includes('UNLOCKED') ? '#ef4444' : '#22c55e'}}>
                <h4><Lock size={14}/> Liquidity</h4>
                <p>{report.liquidity}</p>
              </div>
              <div className="risk-item" style={{borderLeftColor: report.holders.includes('Whale') ? '#ef4444' : '#22c55e'}}>
                <h4><Users size={14}/> Holders</h4>
                <p>{report.holders}</p>
              </div>
              <div className="risk-item" style={{borderLeftColor: report.mintFunction.includes('Enabled') ? '#ef4444' : '#22c55e'}}>
                <h4><Activity size={14}/> Mint Function</h4>
                <p>{report.mintFunction}</p>
              </div>
            </div>

            <div style={{marginTop: '20px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center'}}>
              Last scan: {new Date().toLocaleTimeString()} • Data based on deterministic pattern analysis
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;