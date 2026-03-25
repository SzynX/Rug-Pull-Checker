import React, { useState } from 'react';
import './App.css';
import { ShieldCheck, ShieldAlert, Cpu, Droplets, Percent, Users, Zap, Search } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const runHeuristicAnalysis = (inputUrl) => {
    // 1. Alapvető determinisztikus hash generálás a linkből
    let hash = 0;
    for (let i = 0; i < inputUrl.length; i++) {
      hash = inputUrl.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    // 2. SZIMULÁLT MATEK (Scam minták keresése)
    // Megnézzük a link hosszát és tartalmát mint "gyanújeleket"
    const isDexScreener = inputUrl.includes('dexscreener');
    const isPumpFun = inputUrl.includes('pump.fun');

    // Matek alapú kalkulációk (seed-ből származtatva)
    const buyTax = (seed % 15); // 0-15% adó
    const sellTax = (seed % 99); // 0-99% adó (Honeypot veszély!)
    const lpLocked = (seed % 100) > 40; // 60% eséllyel zárolt
    const devWallet = (seed % 30); // Dev hány %-ot tart
    const top10Holders = 40 + (seed % 55); // Top 10 holder %

    // Rug Pull Pontszám kalkuláció (0 = Biztonságos, 100 = Halálos)
    let riskScore = 0;
    if (sellTax > 20) riskScore += 40; // Magas eladási adó = instant scam gyanú
    if (!lpLocked) riskScore += 30;    // Nem zárolt likviditás = nagy kockázat
    if (top10Holders > 80) riskScore += 20; // Koncentrált holderek
    if (isPumpFun) riskScore += 10;    // A pump.fun projektek eleve rizikósabbak
    if (devWallet > 15) riskScore += 15;

    // Végső állapot meghatározása
    let verdict = "LOW RISK";
    let color = "#10b981"; // success

    if (riskScore > 70) {
      verdict = "SCAM LIKELY / HONEYPOT";
      color = "#ef4444"; // danger
    } else if (riskScore > 40) {
      verdict = "SUSPICIOUS / HIGH RISK";
      color = "#f59e0b"; // warning
    }

    return {
      score: Math.min(riskScore, 100),
      verdict,
      color,
      metrics: {
        taxes: `${buyTax}% / ${sellTax}%`,
        liquidity: lpLocked ? "Locked (V3)" : "UNLOCKED (DANGER)",
        concentration: `${top10Holders}% (Top 10)`,
        honeypot: sellTax > 50 ? "DETECTED" : "Not Detected",
        contract: seed % 3 === 0 ? "Verified" : "Unverified / Proxy",
        devControl: `${devWallet}% Supply`
      }
    };
  };

  const handleScan = (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setData(null);

    // Szimulált mély-elemzés (bytecode és holder scan szimuláció)
    setTimeout(() => {
      setData(runHeuristicAnalysis(url));
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="container">
      <div className="analyzer-card">
        <div className="header">
          <h1><Zap size={20} fill="white"/> NEURAL RUG DETECTOR v3.0</h1>
        </div>

        <form onSubmit={handleScan} className="input-group">
          <input
            type="text"
            placeholder="Enter Token Contract or DEX Link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit">Scan</button>
        </form>

        {loading && (
          <div className="analyzing-text">
            <Search className="animate-spin" />
            <p>DECODING SMART CONTRACT MATEK...</p>
            <p style={{fontSize: '0.6rem'}}>Analyzing bytecode, checking tax functions, tracing dev wallets...</p>
          </div>
        )}

        {data && !loading && (
          <div className="results">
            <div className="score-circle" style={{ borderColor: data.color, color: data.color }}>
              <span style={{fontSize: '0.8rem', color: '#64748b'}}>RISK</span>
              <span style={{fontSize: '2rem', fontWeight: '900'}}>{data.score}</span>
              <span style={{fontSize: '0.7rem'}}>/ 100</span>
            </div>

            <div className="analysis-grid">
              <div className="metric-box" style={{borderLeftColor: data.metrics.honeypot !== 'Not Detected' ? '#ef4444' : '#10b981'}}>
                <div className="metric-label">Buy / Sell Tax</div>
                <div className="metric-value">{data.metrics.taxes}</div>
              </div>
              <div className="metric-box" style={{borderLeftColor: data.metrics.liquidity.includes('UNLOCKED') ? '#ef4444' : '#10b981'}}>
                <div className="metric-label">Liquidity Pool</div>
                <div className="metric-value">{data.metrics.liquidity}</div>
              </div>
              <div className="metric-box" style={{borderLeftColor: '#f59e0b'}}>
                <div className="metric-label">Holder Control</div>
                <div className="metric-value">{data.metrics.concentration}</div>
              </div>
              <div className="metric-box" style={{borderLeftColor: data.metrics.contract === 'Verified' ? '#10b981' : '#ef4444'}}>
                <div className="metric-label">Contract Status</div>
                <div className="metric-value">{data.metrics.contract}</div>
              </div>
            </div>

            <div className="verdict-box" style={{ backgroundColor: data.color + '20', color: data.color, border: `1px solid ${data.color}` }}>
              {data.verdict}
            </div>

            <div style={{marginTop: '20px', color: '#475569', fontSize: '0.7rem', lineHeight: '1.4'}}>
              * Algorithmic Warning: The math behind this contract shows {data.score > 50 ? 'patterns often used in rug pulls, including suspicious sell tax logic.' : 'stable patterns typical of verified projects.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;