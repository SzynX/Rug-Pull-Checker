<div align="center">

# 🛡️ SENTINEL AI v8.0 EXPERT
### **Web3 Forensic Audit Tool for Crypto Assets**

![Status](https://img.shields.io/badge/Status-Operational-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-8.0_Expert-blue?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-Forensic_Logic-red?style=for-the-badge)

<p align="center">
  <b>A React-based tool designed to analyze liquidity, taxes, and holder distribution.</b>
</p>

---

[✨ Features](#-features) • [📊 Analysis Logic](#-analysis-logic) • [🚀 Setup](#-setup) • [🛠️ Tech Stack](#️-tech-stack) • [⚠️ Disclaimer](#-disclaimer)

</div>

---

## ✨ Features

*   🔍 **Forensic Evidence:** Automatically detects high sell taxes and potential honeypot traps.
*   📉 **Liquidity Ratio:** Checks the backing ratio to ensure there is enough exit liquidity.
*   👥 **Holder Analysis:** Monitors developer shares and top 10 wallet concentration.
*   🏛️ **Network Recognition:** Built-in whitelist for Ethereum, Solana, and major DEX protocols.
*   💀 **Scam Tracker:** A local "Shame List" to keep track of recently flagged addresses.

---

## 📊 The Sentinel Engine (0-1000)

The tool evaluates assets on a 1000-point security scale based on deterministic rules:

| Security Score | Status | Interaction |
| :--- | :--- | :--- |
| 🟢 **900 - 1000** | **Institutional** | Verified core infrastructure or top protocol. |
| 🟡 **650 - 899** | **Secure** | Standard risk, usual market conditions. |
| 🟠 **350 - 649** | **High Risk** | Potential for manipulation or low liquidity. |
| 🔴 **0 - 349** | **Scam Detected** | **Critical: High probability of a malicious contract.** |

---

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![Lucide](https://img.shields.io/badge/Lucide_Icons-FF00FF?style=for-the-badge&logo=lucide)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## 🚀 Setup & Installation

To run this forensic tool locally, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/SzynX/sentinel-ai.git

# 2. Navigate to the project folder
cd sentinel-ai

# 3. Install dependencies
npm install lucide-react

# 4. Start the development server
npm run dev

⚠️ Disclaimer
Please read carefully:
This tool is for educational and forensic analysis purposes only.
The scores are generated based on rule-based logic and simulations; they do not guarantee the safety of any financial asset.
Cryptocurrencies are highly volatile and risky. Always perform your own manual due diligence.
The developer (SzynX) is not responsible for any financial losses resulting from the use of this software or interaction with analyzed contracts.