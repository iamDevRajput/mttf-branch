import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MTTF_LOGO from "../../assets/MTTF_REC.jfif";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function DonationResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get("order_id") || searchParams.get("donationId");
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const verify = async () => {
    if (!donationId) { setError("Donation ID missing."); setLoading(false); return; }
    try {
      const res = await fetch(`${API}/donations/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const statusRes = await fetch(`${API}/donations/status/${donationId}`);
        const statusData = await statusRes.json();
        if (statusData.success) setDonation(statusData.donation);
        else setError("Unable to verify donation.");
      } else {
        setDonation(data.donation);
      }
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  };

  useEffect(() => { verify(); }, [donationId]);

  useEffect(() => {
    if (!donation) return;
    const terminal = ["FAILED", "CANCELLED"].includes(donation.paymentStatus);
    const success = donation.paymentStatus === "SUCCESS";
    if (terminal || success) return;
    const interval = setInterval(() => {
      fetch(`${API}/donations/status/${donationId}`)
        .then(r => r.json())
        .then(d => { if (d.success) setDonation(d.donation); })
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [donation?.paymentStatus]);

  const view = useMemo(() => {
    if (error) return "error";
    if (!donation) return "pending";
    if (donation.paymentStatus === "SUCCESS") return "success";
    if (["FAILED", "CANCELLED"].includes(donation.paymentStatus)) return "failure";
    return "pending";
  }, [error, donation]);

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  const content = {
    success: { title: "Thank You!", message: "Your donation was successful. A receipt has been sent to your email.", tone: "#16a34a", icon: "M5 13L9 17L19 7" },
    pending: { title: "Verifying Payment", message: "Please wait while we confirm your donation.", tone: "#2563eb", icon: "M12 8v4l3 3" },
    failure: { title: "Payment Failed", message: "Your donation could not be processed. No amount was charged.", tone: "#dc2626", icon: "M6 6l12 12M18 6L6 18" },
    error: { title: "Error", message: error, tone: "#dc2626", icon: "M12 9v4M12 17h.01" },
  }[view];

  return (
    <>
      <style>{`
        .dr-shell { min-height:100vh; background:#f8faff; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; }
        .dr-header { height:60px; background:rgba(255,255,255,0.96); border-bottom:1px solid rgba(37,99,235,0.08); display:flex; align-items:center; justify-content:space-between; padding:0 32px; }
        .dr-logo { display:flex; align-items:center; gap:12px; }
        .dr-logo img { height:40px; width:auto; object-fit:contain; }
        .dr-logo-label { border-left:1px solid rgba(37,99,235,0.15); padding-left:12px; color:#2563eb; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; }
        .dr-back { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#64748b; background:none; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
        .dr-back:hover { color:#2563eb; }
        .dr-main { flex:1; display:grid; place-items:center; padding:40px 20px; background: linear-gradient(135deg,rgba(11,19,41,0.96),rgba(37,99,235,0.9)) top/100% 320px no-repeat, #f8faff; }
        .dr-card { width:min(520px,100%); background:#fff; border:1px solid rgba(37,99,235,0.12); border-radius:16px; box-shadow:0 20px 60px rgba(15,23,42,0.16); padding:36px; text-align:center; }
        .dr-icon { width:72px; height:72px; border-radius:999px; display:grid; place-items:center; margin:0 auto 22px; }
        .dr-spinner { width:22px; height:22px; border:2px solid rgba(37,99,235,0.2); border-top-color:#2563eb; border-radius:50%; animation:drSpin 0.7s linear infinite; }
        .dr-title { color:#0b1329; font-size:26px; font-weight:800; margin-bottom:10px; }
        .dr-message { color:#475569; font-size:14px; line-height:1.7; margin:0 auto 24px; max-width:380px; }
        .dr-meta { display:grid; gap:8px; padding:16px; background:#f8faff; border:1px solid rgba(37,99,235,0.08); border-radius:12px; margin-bottom:24px; text-align:left; }
        .dr-row { display:flex; justify-content:space-between; gap:16px; color:#64748b; font-size:12px; }
        .dr-row strong { color:#0b1329; font-weight:700; }
        .dr-btn { border:none; background:#2563eb; color:#fff; border-radius:999px; padding:13px 28px; font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase; cursor:pointer; box-shadow:0 10px 26px rgba(37,99,235,0.28); transition:all 0.25s; }
        .dr-btn:hover { background:#1d4ed8; transform:translateY(-1px); }
        @keyframes drSpin { to { transform:rotate(360deg); } }
      `}</style>

      <div className="dr-shell">
        <header className="dr-header">
          <div className="dr-logo">
            <img src={MTTF_LOGO} alt="MTTF" />
            <span className="dr-logo-label">Donation Status</span>
          </div>
          <button className="dr-back" onClick={() => navigate("/")}>Back to Site</button>
        </header>
        <main className="dr-main">
          <section className="dr-card">
            <div className="dr-icon" style={{ background: `${content.tone}12`, border: `1px solid ${content.tone}30` }}>
              {loading ? <span className="dr-spinner" /> : (
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path d={content.icon} stroke={content.tone} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  {view === "pending" && <circle cx="12" cy="12" r="10" stroke={content.tone} strokeWidth="1.8"/>}
                </svg>
              )}
            </div>
            <h1 className="dr-title">{loading ? "Verifying..." : content.title}</h1>
            <p className="dr-message">{loading ? "Please wait while we confirm your donation." : content.message}</p>
            {donation && (
              <div className="dr-meta">
                <div className="dr-row"><span>Donation ID</span><strong>{donation.donationId}</strong></div>
                <div className="dr-row"><span>Donor</span><strong>{donation.donorName}</strong></div>
                <div className="dr-row"><span>Amount</span><strong>{fmt(donation.amount)}</strong></div>
                <div className="dr-row"><span>Status</span><strong>{donation.paymentStatus}</strong></div>
                {donation.paymentStatus === "SUCCESS" && (
                  <div className="dr-row"><span>Receipt</span><strong>{donation.receiptSent ? "Sent to email ✓" : "Sending..."}</strong></div>
                )}
              </div>
            )}
            <button className="dr-btn" onClick={() => view === "failure" ? navigate("/donate") : navigate("/")}>
              {view === "failure" ? "Try Again" : view === "success" ? "Back to Home" : "Checking..."}
            </button>
          </section>
        </main>
      </div>
    </>
  );
}
