import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MTTF_LOGO from "../../assets/MTTF_REC.jfif";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function DonationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const selectedAmount = customAmount ? Number(customAmount) : Number(amount);

  let cashfreeSdkPromise;
  const loadCashfreeSdk = () => {
    if (window.Cashfree) return Promise.resolve(window.Cashfree);
    if (!cashfreeSdkPromise) {
      cashfreeSdkPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.async = true;
        script.onload = () => window.Cashfree ? resolve(window.Cashfree) : reject(new Error("SDK unavailable"));
        script.onerror = () => reject(new Error("SDK failed to load"));
        document.body.appendChild(script);
      });
    }
    return cashfreeSdkPromise;
  };

  const handleDonate = async () => {
    setError("");
    if (!form.name || !form.email || !form.phone) { setError("Please fill in all required fields."); return; }
    if (!selectedAmount || selectedAmount < 1) { setError("Please enter a valid donation amount."); return; }
    setPaying(true);
    try {
      const res = await fetch(`${API}/donations/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorName: form.name, donorEmail: form.email, donorPhone: form.phone, amount: selectedAmount, message: form.message }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to create donation order.");

      const Cashfree = await loadCashfreeSdk();
      const cashfree = Cashfree({ mode: data.order.cashfreeEnvironment === "production" ? "production" : "sandbox" });
      await cashfree.checkout({ paymentSessionId: data.order.paymentSessionId, redirectTarget: "_self" });
    } catch (err) {
      setError(err.message || "Payment could not be started. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  return (
    <>
      <style>{`
        .don-wrap { min-height:100vh; background:#f8faff; font-family:'Plus Jakarta Sans',sans-serif; }
        .don-header { position:fixed; top:0; left:0; right:0; z-index:100; background:rgba(255,255,255,0.96); backdrop-filter:blur(12px); border-bottom:1px solid rgba(37,99,235,0.08); padding:0 32px; height:60px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 1px 12px rgba(37,99,235,0.06); }
        .don-logo { display:flex; align-items:center; gap:12px; }
        .don-logo img { height:40px; width:auto; object-fit:contain; }
        .don-logo-label { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#2563eb; border-left:1px solid rgba(37,99,235,0.2); padding-left:12px; }
        .don-back { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:500; letter-spacing:1px; text-transform:uppercase; color:#64748b; background:none; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:color 0.2s; }
        .don-back:hover { color:#2563eb; }
        .don-hero { background:linear-gradient(135deg,#0b1329 0%,#1e3a8a 60%,#2563eb 100%); padding:110px 24px 60px; text-align:center; }
        .don-hero h1 { font-size:clamp(28px,4vw,44px); font-weight:800; color:#fff; letter-spacing:-0.02em; margin-bottom:12px; }
        .don-hero h1 em { font-style:normal; color:#60a5fa; }
        .don-hero p { font-size:15px; color:rgba(255,255,255,0.6); font-weight:300; max-width:480px; margin:0 auto; }
        .don-content { max-width:640px; margin:-32px auto 0; padding:0 24px 80px; position:relative; z-index:2; }
        .don-card { background:#fff; border:1px solid rgba(37,99,235,0.12); border-radius:16px; box-shadow:0 4px 24px rgba(37,99,235,0.06); overflow:hidden; }
        .don-card-header { padding:28px 32px 24px; border-bottom:1px solid rgba(37,99,235,0.08); background:linear-gradient(135deg,rgba(37,99,235,0.04),rgba(37,99,235,0.01)); }
        .don-card-header h2 { font-size:18px; font-weight:700; color:#0b1329; margin-bottom:4px; }
        .don-card-header p { font-size:13px; color:#475569; font-weight:300; }
        .don-card-body { padding:28px 32px; }
        .don-section-label { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#2563eb; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .don-section-label::after { content:''; flex:1; height:1px; background:rgba(37,99,235,0.12); }
        .don-preset-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px; }
        @media(max-width:480px){ .don-preset-grid { grid-template-columns:repeat(2,1fr); } }
        .don-preset-btn { padding:14px 8px; border:1.5px solid rgba(37,99,235,0.2); background:#fff; border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; color:#0b1329; cursor:pointer; transition:all 0.2s; text-align:center; }
        .don-preset-btn:hover { border-color:#2563eb; background:rgba(37,99,235,0.04); }
        .don-preset-btn.active { border-color:#2563eb; background:rgba(37,99,235,0.08); color:#2563eb; }
        .don-custom-wrap { position:relative; margin-bottom:24px; }
        .don-custom-prefix { position:absolute; left:16px; top:50%; transform:translateY(-50%); font-size:18px; font-weight:600; color:#64748b; }
        .don-custom-input { width:100%; padding:14px 16px 14px 34px; border:1.5px solid rgba(37,99,235,0.2); border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:20px; font-weight:700; color:#0b1329; outline:none; transition:border-color 0.2s; background:#f8faff; }
        .don-custom-input:focus { border-color:#2563eb; background:#fff; }
        .don-field { margin-bottom:16px; }
        .don-label { display:block; font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#475569; margin-bottom:8px; }
        .don-input { width:100%; padding:12px 16px; border:1.5px solid rgba(37,99,235,0.15); border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#0b1329; outline:none; transition:border-color 0.2s; background:#fff; }
        .don-input:focus { border-color:#2563eb; }
        .don-textarea { width:100%; padding:12px 16px; border:1.5px solid rgba(37,99,235,0.15); border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#0b1329; outline:none; resize:vertical; min-height:80px; transition:border-color 0.2s; }
        .don-textarea:focus { border-color:#2563eb; }
        .don-total { display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-top:2px solid rgba(37,99,235,0.1); margin:8px 0 20px; }
        .don-total-label { font-size:14px; font-weight:600; color:#0b1329; }
        .don-total-val { font-size:24px; font-weight:800; color:#2563eb; }
        .don-btn { width:100%; padding:16px; background:#2563eb; border:none; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; cursor:pointer; border-radius:999px; display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.3s; box-shadow:0 4px 16px rgba(37,99,235,0.3); }
        .don-btn:hover:not(:disabled) { background:#1d4ed8; transform:translateY(-1px); box-shadow:0 8px 28px rgba(37,99,235,0.45); }
        .don-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .don-spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:donSpin 0.7s linear infinite; }
        .don-error { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; font-size:12px; padding:10px 14px; margin-top:12px; border-radius:8px; text-align:center; }
        .don-badges { display:flex; align-items:center; justify-content:center; gap:20px; margin-top:18px; padding-top:18px; border-top:1px solid rgba(37,99,235,0.08); }
        .don-badge { display:flex; align-items:center; gap:5px; font-size:10px; color:#94a3b8; font-weight:500; }
        @keyframes donSpin { to { transform:rotate(360deg); } }
      `}</style>

      <div className="don-wrap">
        <header className="don-header">
          <div className="don-logo">
            <img src={MTTF_LOGO} alt="MTTF" />
            <span className="don-logo-label">Donate</span>
          </div>
          <button className="don-back" onClick={() => navigate("/")}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Site
          </button>
        </header>

        <div className="don-hero">
          <h1>Support <em>MTTF</em></h1>
          <p>Your contribution helps us advance mathematics and technology education across India and beyond.</p>
        </div>

        <div className="don-content">
          <div className="don-card">
            <div className="don-card-header">
              <h2>Make a Donation</h2>
              <p>100% of your donation goes toward MTTF programs and initiatives.</p>
            </div>
            <div className="don-card-body">

              <div className="don-section-label">Choose Amount</div>
              <div className="don-preset-grid">
                {PRESET_AMOUNTS.map((a) => (
                  <button key={a}
                    className={`don-preset-btn ${amount === String(a) && !customAmount ? "active" : ""}`}
                    onClick={() => { setAmount(String(a)); setCustomAmount(""); }}>
                    {fmt(a)}
                  </button>
                ))}
              </div>
              <div className="don-custom-wrap">
                <span className="don-custom-prefix">₹</span>
                <input className="don-custom-input" type="number" min="1"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setAmount(""); }} />
              </div>

              <div className="don-section-label">Your Information</div>
              <div className="don-field">
                <label className="don-label">Full Name *</label>
                <input className="don-input" type="text" placeholder="John Doe" required
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="don-field">
                <label className="don-label">Email Address *</label>
                <input className="don-input" type="email" placeholder="example@gmail.com" required
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="don-field">
                <label className="don-label">Phone Number *</label>
                <input className="don-input" type="tel" placeholder="+91 9999999999" required
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="don-field">
                <label className="don-label">Message (Optional)</label>
                <textarea className="don-textarea" placeholder="Leave a message of support..."
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>

              <div className="don-total">
                <span className="don-total-label">Total Donation</span>
                <span className="don-total-val">{selectedAmount ? fmt(selectedAmount) : "₹0"}</span>
              </div>

              <button className="don-btn" onClick={handleDonate} disabled={paying || !selectedAmount}>
                {paying ? (
                  <><span className="don-spinner" /> Processing…</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#ef4444"/>
                    </svg>
                    Donate {selectedAmount ? fmt(selectedAmount) : ""} Now
                  </>
                )}
              </button>

              {error && <div className="don-error">{error}</div>}

              <div className="don-badges">
                <span className="don-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  SSL Secured
                </span>
                <span className="don-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Receipt on Email
                </span>
                <span className="don-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  RBI Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
