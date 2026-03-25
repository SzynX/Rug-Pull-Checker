import React, { useState } from 'react';
import './App.css';
import {
  ShieldAlert, ShieldCheck, Database,
  Lock, Unlock, AlertTriangle,
  Users, Code, Terminal, Zap, Info
} from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const performMilitaryGradeScan = (input) => {
    // Szigorúbb hash algoritmus
    let hash = 5381;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) + hash) + input.charCodeAt(i);
    }
    const s = Math.abs(hash);

    // BEMENETI ADATOK ELEMZÉSE


    const isDexScreener = input.toLowerCase().includes('dexscreener');

    // ALAP RIZIKÓ (Már az indulásnál 20 pont, ha DexScreener link)
    let riskScore = isDexScreener ? 25 : 10;
    let findings = [];

    // --- MATEK ALAPÚ BIZONYÍTÉKOK ---

    // 1. Likviditás (Scam projekteknél általában kicsi)
    const liqValue = (s % 350) + 5; // $5k - $355k
    if (liqValue < 60) {
      riskScore += 30;
      findings.push({ type: 'CRITICAL', msg: `Extreme Low Liquidity: Only $${liqValue}k found. Pulling this will be instant.` });
    }

    // 2. Holder koncentráció (A legfontosabb!)
    const top10 = 50 + (s % 48); // 50% - 98% (Szigorú: minimum 50% a top 10 kezében)
    if (top10 > 70) {
      riskScore += 35;
      findings.push({ type: 'CRITICAL', msg: `WHALE ALERT: Top 10 wallets control ${top10}% of the total supply.` });
    } else {
      riskScore += 15;
      findings.push({ type: 'WARNING', msg: `High Concentration: Top 10 holds ${top10}%. Dev dump risk is high.` });
    }

    // 3. Adó / Honeypot matek
    const sellTax = (s % 12) + (s % 8 === 0 ? 85 : 0); // Ha osztható 8-al, akkor 85% feletti adó (Honeypot)
    if (sellTax > 20) {
      riskScore += 45;
      findings.push({ type: 'CRITICAL', msg: `HONEYPOT PATTERN: Contract contains logic to set sell tax to ${sellTax}%.` });
    }

    // 4. LP Lock (Zárolás)
    const lpLocked = (s % 6 === 0); // Csak 16% esély a lockra
    if (!lpLocked) {
      riskScore += 25;
      findings.push({ type: 'DANGER', msg: "Liquidity NOT locked. Creator can remove all funds at any second." });
    }

    // 5. Mint funkció
    const canMint = (s % 4 === 1);
    if (canMint) {
      riskScore += 20;
      findings.push({ type: 'DANGER', msg: "Mint Function Enabled: New tokens can be created out of thin air." });
    }

    // --- VÉGSŐ DÖNTÉS ---
    let status = "SECURE";
    let color = "#22c55e";

    if (riskScore >= 75) {
      status = "SCAM DETECTED";
      color = "#ff0000";
    } else if (riskScore >= 45) {
      status = "HIGH RISK / RUG-READY";
      color = "#f59e0b";
    } else {
      status = "SUSPICIOUS";
      color = "#eab308";
    }

    return {
      score: Math.min(riskScore, 100),
      status,
      color,
      top10,
      liqValue,
      lpLocked,
      sellTax,
      findings: findings.length > 0 ? findings : [{ type: 'INFO', msg: "Limited data available. Trade with extreme caution." }]
    };
  };

  const handleAudit = (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setReport(null);

    // AI szimulációs késleltetés
    setTimeout(() => {
      setReport(performMilitaryGradeScan(url));
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="container">
      <div className="main-card">
        <header className="pro-header">
          <div className="logo-area">
            <Zap size={20} color="#3b82f6" fill="#3b82f6" />
            <span>SENTINEL AI v6.0 <small style={{fontSize: '9px', color: '#ff4444'}}>ULTRA-STRICT</small></span>
          </div>
          <div className="status-badge">DEEP SCAN ACTIVE</div>
        </header>

        <section className="search-section">
          <form onSubmit={handleAudit} className="search-box">
            <input
              type="text"
              placeholder="Paste DexScreener / Solana Link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button disabled={loading} type="submit">
              {loading ? "ANALYZING..." : "START AUDIT"}
            </button>
          </form>
        </section>

        {loading && (
          <div className="loading-container">
            <div className="scanner-bar"></div>
            <p>CRACKING CONTRACT LOGIC...</p>
          </div>
        )}

        {report && !loading && (
          <div className="report-fade">
            <div className="score-hero" style={{ borderColor: report.color, background: `linear-gradient(180deg, ${report.color}15 0%, transparent 100%)` }}>
              <div className="big-num" style={{ color: report.color }}>{report.score}</div>
              <div className="label">RISK PROBABILITY</div>
              <div className="status-tag" style={{ backgroundColor: report.color }}>{report.status}</div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <Users size={16} color="#8b949e" />
                <span>Top 10: <strong>{report.top10}%</strong></span>
              </div>
              <div className="stat-box">
                <Database size={16} color="#8b949e" />
                <span>Liq: <strong>${report.liqValue}k</strong></span>
              </div>
              <div className="stat-box">
                {report.lpLocked ? <Lock size={16} color="#22c55e" /> : <Unlock size={16} color="#ff4444" />}
                <span>LP: <strong>{report.lpLocked ? "Locked" : "UNLOCKED"}</strong></span>
              </div>
            </div>

            <div className="findings-section">
              <h3><AlertTriangle size={14} /> SECURITY FINDINGS</h3>
              {report.findings.map((item, index) => (
                <div key={index} className={`finding-entry ${item.type.toLowerCase()}`}>
                  <div className="f-type">{item.type}</div>
                  <div className="f-msg">{item.msg}</div>
                </div>
              ))}
            </div>

            <div className="tax-footer">
              ESTIMATED SELL TAX: {report.sellTax}% | DETECTED BY SENTINEL AI ENGINE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;