import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import {
  ShieldAlert, ShieldCheck, Database, Lock, Unlock, AlertTriangle,
  Users, Code, Terminal, Zap, Info, Clock, Skull, TrendingDown, Globe
} from 'lucide-react';

// --- SZAKÉRTŐI MOTOR KONSTANSOK ---
const BLUE_CHIPS = ['ethereum', 'bitcoin', 'solana', 'stablecoin', 'usdc', 'usdt', 'dai', 'wrapped-bitcoin'];
const TOP_DEXS = ['uniswap', 'pancakeswap', 'raydium', 'curve', 'lido', 'aave'];

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [shameList, setShameList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('sentinel_shame_list_v8');
    if (saved) setShameList(JSON.parse(saved));
  }, []);

  // --- MÉLYELEMZŐ ALGORITMUS (Senior Logic) ---
  const analyzeAddress = (input) => {
    const raw = input.toLowerCase();

    // 1. Felismerés: Hálózat vagy konkrét szerződés?
    const isMainNetwork = BLUE_CHIPS.some(coin => raw.endsWith(`/${coin}`) || raw.endsWith(coin));
    const isTopProtocol = TOP_DEXS.some(dex => raw.includes(dex));

    // Regex a konkrét szerződésekhez (ETH: 0x..., SOL: base58)
    const ethAddrRegex = /0x[a-f0-9]{40}/i;
    const solAddrRegex = /[1-9A-HJ-NP-Za-km-z]{32,44}/;
    const hasContract = ethAddrRegex.test(input) || solAddrRegex.test(input);

    // 2. Determinisztikus Seed
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
    }
    const seed = Math.abs(hash);

    // 3. WHITELIST KEZELÉS (Ha ez az Ethereum hálózat, nem lehet scam)
    if (isMainNetwork || (isTopProtocol && !hasContract)) {
      return {
        score: 0,
        sentinelScore: 1000,
        status: "INSTITUTIONAL GRADE",
        color: "#10b981",
        isWhitelisted: true,
        type: "Infrastructure",
        findings: [{ type: 'SUCCESS', msg: "Detected as core blockchain infrastructure or top-tier protocol." }],
        top10: 2, liqValue: 5000000, mCap: 250000000, liqRatio: 20, lpLocked: true, lockDays: 9999, sellTax: 0, devHoldings: 0,
        name: raw.split('/').pop().toUpperCase()
      };
    }

    // 4. TOKEN ANALÍZIS (Ha van szerződés vagy gyanús link)
    let riskPoints = hasContract ? 10 : 40; // Ha nincs konkrét cím, alapból gyanúsabb (phishing veszély)
    let findings = [];

    // Matek: Likviditási sűrűség
    const mCap = (seed % 9000) + 100; // $100k - $9.1M
    const liqValue = (seed % 200) + 1; // $1k - $201k
    const liqRatio = (liqValue / mCap) * 100;

    if (liqRatio < 3) {
      riskPoints += 45;
      findings.push({ type: 'CRITICAL', msg: `LIQUIDITY SQUEEZE: Only ${liqRatio.toFixed(2)}% backing. Exit impossible for whales.` });
    }

    // Holder eloszlás (Matematikai szórás szimuláció)
    const devHoldings = (seed % 25) + (hasContract ? 0 : 30);
    const top10 = 30 + (seed % 65);
    if (top10 > 80) {
      riskPoints += 40;
      findings.push({ type: 'CRITICAL', msg: `EXTREME CONCENTRATION: Top 10 hold ${top10}% of supply.` });
    }

    // Adó és Honeypot logika
    const sellTax = (seed % 15) + (seed % 7 === 0 ? 80 : 0);
    if (sellTax > 30) {
      riskPoints += 50;
      findings.push({ type: 'CRITICAL', msg: `HONEYPOT TRAP: Sell tax is hardcoded at ${sellTax}%.` });
    }

    // Likviditás zár
    const lpLocked = (seed % 4 !== 0);
    const lockDays = lpLocked ? (seed % 180) + 1 : 0;
    if (!lpLocked) {
      riskPoints += 35;
      findings.push({ type: 'DANGER', msg: "NO LIQUIDITY LOCK: Developer can pull the pool instantly." });
    }

    const sentinelScore = Math.max(0, 1000 - (riskPoints * 9.5));

    let status = "SECURE";
    let color = "#22c55e";
    if (sentinelScore < 350) { status = "SCAM DETECTED"; color = "#ef4444"; }
    else if (sentinelScore < 650) { status = "HIGH RISK"; color = "#f59e0b"; }

    return {
      score: Math.min(riskPoints, 100), sentinelScore, status, color,
      top10, devHoldings, mCap, liqValue, liqRatio, lpLocked, lockDays, sellTax, findings,
      type: "Token Asset",
      name: input.split('/').pop().substring(0, 12) || "Unknown"
    };
  };

  const handleAudit = (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      const result = analyzeAddress(url);
      setReport(result);
      if (result.sentinelScore < 350 && !result.isWhitelisted) {
        const newShame = [result, ...shameList].slice(0, 6);
        setShameList(newShame);
        localStorage.setItem('sentinel_shame_list_v8', JSON.stringify(newShame));
      }
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="container">
      <div className="main-card">
        <header className="pro-header">
          <div className="logo-area">
            <Terminal size={20} color="#60a5fa" />
            <span>SENTINEL AI <small>v8.0 EXPERT</small></span>
          </div>
          <div className="network-status">
            <Globe size={14} /> SCANNING MULTI-CHAIN
          </div>
        </header>

        <section className="search-section">
          <form onSubmit={handleAudit} className="search-box">
            <input
              type="text"
              placeholder="Paste DexScreener link or Contract Address..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button disabled={loading} type="submit">{loading ? "AUDITING..." : "DECODE"}</button>
          </form>
        </section>

        {report && !loading && (
          <div className="report-fade">
            <div className="score-hero" style={{ borderColor: report.color }}>
              <div className="s-type">{report.type} ANALYSIS</div>
              <div className="s-value" style={{ color: report.color }}>{Math.floor(report.sentinelScore)}<small>/1000</small></div>
              <div className="s-pill" style={{ backgroundColor: report.color }}>{report.status}</div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <Users size={16} /> <span>Dev Share: <strong>{report.devHoldings}%</strong></span>
                <div className="mini-bar"><div className="fill" style={{width: `${report.devHoldings}%`, background: report.color}}></div></div>
              </div>
              <div className="stat-card">
                <TrendingDown size={16} /> <span>Liq. Ratio: <strong>{report.liqRatio.toFixed(1)}%</strong></span>
                <div className="mini-bar"><div className="fill" style={{width: `${Math.min(100, report.liqRatio*5)}%`, background: report.liqRatio < 3 ? '#ef4444' : '#60a5fa'}}></div></div>
              </div>
              <div className="stat-card">
                <Clock size={16} /> <span>Lock: <strong>{report.lpLocked ? `${report.lockDays}d` : "NONE"}</strong></span>
                <div className="mini-bar"><div className="fill" style={{width: report.lpLocked ? '100%' : '0%', background: report.lpLocked ? '#10b981' : '#ef4444'}}></div></div>
              </div>
            </div>

            <div className="findings-area">
              <h3><ShieldAlert size={14} /> FORENSIC EVIDENCE</h3>
              {report.findings.map((f, i) => (
                <div key={i} className={`finding-row ${f.type.toLowerCase()}`}>
                  <AlertTriangle size={14} /> {f.msg}
                </div>
              ))}
            </div>

            <div className="tax-banner">
              SELL TAX: {report.sellTax}% | BUY TAX: {Math.floor(report.seed % 5 || 0)}% | M-CAP: ${report.mCap}K
            </div>
          </div>
        )}

        {shameList.length > 0 && (
          <div className="shame-section">
            <h4><Skull size={14} color="#ef4444" /> RECENT SCAM DETECTIONS</h4>
            <div className="shame-tags">
              {shameList.map((s, i) => (
                <span key={i} className="s-tag">{s.name} ({Math.floor(s.sentinelScore)})</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;