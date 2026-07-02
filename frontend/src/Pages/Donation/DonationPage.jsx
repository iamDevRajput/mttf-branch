import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MTTF_LOGO from "../../assets/MTTF_REC.jfif";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const PRESET_AMOUNTS = [
  { amount: 500,    label: "₹500",     tag: "Learning Support" },
  { amount: 1000,   label: "₹1,000",   tag: "Student Development" },
  { amount: 2500,   label: "₹2,500",   tag: "Skill Development" },
  { amount: 5000,   label: "₹5,000",   tag: "Innovation Support" },
  { amount: 10000,  label: "₹10,000",  tag: "STEM Champion" },
  { amount: 25000,  label: "₹25,000",  tag: "Research Patron" },
  { amount: 50000,  label: "₹50,000",  tag: "Education Sponsor" },
  { amount: 100000, label: "₹1,00,000+", tag: "Visionary Partner" },
];

const DONATION_CATEGORIES = [
  { value: "Student Scholarships",           icon: "🎓", desc: "Fund deserving students" },
  { value: "AI & Data Science Education",    icon: "🤖", desc: "AI & computing training" },
  { value: "Research & Innovation",          icon: "🔬", desc: "Support research projects" },
  { value: "Digital Learning Infrastructure",icon: "💻", desc: "Build digital classrooms" },
  { value: "Faculty Development",            icon: "👩‍🏫", desc: "Empower educators" },
  { value: "Rural STEM Education",           icon: "🌾", desc: "Reach underserved areas" },
  { value: "Women in STEM",                  icon: "👩‍🔬", desc: "Gender equity in STEM" },
  { value: "Innovation & Entrepreneurship",  icon: "🚀", desc: "Foster startups & ideas" },
  { value: "Library & Knowledge Resources",  icon: "📚", desc: "Expand knowledge access" },
  { value: "General Fund (Greatest Need)",   icon: "💛", desc: "Where impact is greatest" },
];

const WHY_DONATE = [
  { icon: "🎓", title: "Student Scholarships",        desc: "Provide scholarships to deserving students who lack financial support." },
  { icon: "📐", title: "STEM Education",              desc: "Deliver affordable and accessible STEM education nationwide." },
  { icon: "🤖", title: "AI & Data Science",           desc: "Conduct AI, Data Science, and Scientific Computing training programmes." },
  { icon: "🔬", title: "Research & Innovation",       desc: "Support academic research, innovation, and scientific excellence." },
  { icon: "👩‍🏫", title: "Faculty Development",       desc: "Organise FDPs, workshops, and conferences for educators." },
  { icon: "🌾", title: "Rural Outreach",              desc: "Promote STEM awareness in rural and underserved communities." },
  { icon: "💻", title: "Digital Infrastructure",      desc: "Expand digital learning platforms and educational resources." },
  { icon: "🤝", title: "Partnerships",                desc: "Build partnerships that advance education and sustainable development." },
];

const CREDENTIALS = [
  { label: "Section 8 Company", sub: "Not-for-Profit" },
  { label: "Udyam-Registered", sub: "MSME" },
  { label: "Section 12AB", sub: "Registered" },
  { label: "Section 80G", sub: "Tax Benefit Approved" },
];

const CORPORATE_OPPORTUNITIES = [
  "Scholarships", "AI & Data Science Labs", "STEM Innovation Centres",
  "Faculty Development Programmes", "Research Projects",
  "Community Education Initiatives", "Digital Classrooms", "Skill Development Centres",
];

export default function DonationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [category, setCategory] = useState("");
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
    if (!selectedAmount || selectedAmount < 1) { setError("Please select or enter a valid donation amount."); return; }
    setPaying(true);
    try {
      const res = await fetch(`${API}/donations/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: form.name,
          donorEmail: form.email,
          donorPhone: form.phone,
          amount: selectedAmount,
          message: form.message,
          donationCategory: category || "General Fund (Greatest Need)",
        }),
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

        /* ─── Base ─── */
        .dp-wrap { min-height:100vh; background:#f8faff; font-family:'Plus Jakarta Sans',sans-serif; color:#0b1329; }

        /* ─── Header ─── */
        .dp-header {
          position:fixed; top:0; left:0; right:0; z-index:100;
          background:rgba(255,255,255,0.96); backdrop-filter:blur(14px);
          border-bottom:1px solid rgba(37,99,235,0.08);
          padding:0 40px; height:64px;
          display:flex; align-items:center; justify-content:space-between;
          box-shadow:0 1px 16px rgba(37,99,235,0.06);
        }
        .dp-header-logo { display:flex; align-items:center; gap:14px; }
        .dp-header-logo img { height:42px; width:auto; object-fit:contain; }
        .dp-header-logo-tag {
          font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase;
          color:#2563eb; border-left:1px solid rgba(37,99,235,0.25); padding-left:14px; line-height:1.5;
        }
        .dp-back-btn {
          display:flex; align-items:center; gap:6px;
          font-size:11px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase;
          color:#64748b; background:none; border:none; cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif; transition:color 0.2s;
        }
        .dp-back-btn:hover { color:#2563eb; }

        /* ─── Hero ─── */
        .dp-hero {
          background:linear-gradient(135deg,#060d1f 0%,#0b1e4a 45%,#1e3a8a 75%,#2563eb 100%);
          padding:128px 24px 80px;
          text-align:center; position:relative; overflow:hidden;
        }
        .dp-hero::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(ellipse 70% 60% at 50% 60%, rgba(37,99,235,0.25) 0%, transparent 70%);
          pointer-events:none;
        }
        .dp-hero-eyebrow {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.15);
          border-radius:999px; padding:6px 18px;
          font-size:10px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase;
          color:rgba(255,255,255,0.7); margin-bottom:24px;
        }
        .dp-hero h1 {
          font-size:clamp(32px,5vw,58px); font-weight:900; color:#fff;
          letter-spacing:-0.03em; line-height:1.1; margin-bottom:18px;
        }
        .dp-hero h1 em { font-style:normal; color:#60a5fa; }
        .dp-hero-sub {
          font-size:clamp(14px,2vw,17px); color:rgba(255,255,255,0.6);
          font-weight:300; max-width:620px; margin:0 auto 36px; line-height:1.8;
        }
        .dp-hero-badges {
          display:flex; align-items:center; justify-content:center; gap:20px; flex-wrap:wrap;
        }
        .dp-hero-badge {
          display:flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12);
          border-radius:999px; padding:8px 16px;
          font-size:11px; font-weight:500; color:rgba(255,255,255,0.65);
        }

        /* ─── Sections shared ─── */
        .dp-section { padding:72px 24px; }
        .dp-section.alt { background:#fff; }
        .dp-section.dark { background:linear-gradient(135deg,#060d1f,#0b1e4a); color:#fff; }
        .dp-inner { max-width:1160px; margin:0 auto; }
        .dp-section-eyebrow {
          font-size:9px; font-weight:700; letter-spacing:3px; text-transform:uppercase;
          color:#2563eb; margin-bottom:12px;
        }
        .dp-section.dark .dp-section-eyebrow { color:#60a5fa; }
        .dp-section-title { font-size:clamp(24px,3vw,36px); font-weight:800; letter-spacing:-0.02em; margin-bottom:16px; }
        .dp-section-desc { font-size:15px; color:#475569; font-weight:300; line-height:1.8; max-width:680px; }
        .dp-section.dark .dp-section-desc { color:rgba(255,255,255,0.55); }

        /* ─── About section ─── */
        .dp-about-grid { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
        @media(max-width:900px){ .dp-about-grid { grid-template-columns:1fr; gap:32px; } }
        .dp-credentials { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:28px; }
        .dp-cred-card {
          background:linear-gradient(135deg,rgba(37,99,235,0.05),rgba(37,99,235,0.02));
          border:1.5px solid rgba(37,99,235,0.15); border-radius:12px; padding:16px 18px;
        }
        .dp-cred-label { font-size:13px; font-weight:700; color:#0b1329; }
        .dp-cred-sub { font-size:11px; color:#2563eb; font-weight:500; margin-top:2px; }
        .dp-about-text p { font-size:15px; color:#475569; line-height:1.8; font-weight:300; margin-bottom:14px; }
        .dp-about-text p:last-child { margin-bottom:0; }

        /* ─── Why Donate grid ─── */
        .dp-why-grid {
          display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-top:48px;
        }
        @media(max-width:1100px){ .dp-why-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:600px){ .dp-why-grid { grid-template-columns:1fr; } }
        .dp-why-card {
          background:#fff; border:1px solid rgba(37,99,235,0.1);
          border-radius:14px; padding:24px 22px;
          box-shadow:0 2px 12px rgba(37,99,235,0.04);
          transition:transform 0.25s,box-shadow 0.25s;
        }
        .dp-why-card:hover { transform:translateY(-4px); box-shadow:0 10px 32px rgba(37,99,235,0.1); }
        .dp-why-icon { font-size:28px; margin-bottom:12px; }
        .dp-why-title { font-size:14px; font-weight:700; color:#0b1329; margin-bottom:6px; }
        .dp-why-desc { font-size:12px; color:#64748b; line-height:1.7; font-weight:300; }

        /* ─── Category chooser ─── */
        .dp-cat-grid {
          display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-top:40px;
        }
        @media(max-width:1100px){ .dp-cat-grid { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:700px){ .dp-cat-grid { grid-template-columns:repeat(2,1fr); } }
        .dp-cat-btn {
          padding:16px 12px; border:1.5px solid rgba(37,99,235,0.18);
          background:#fff; border-radius:12px; cursor:pointer; text-align:center;
          transition:all 0.2s; font-family:'Plus Jakarta Sans',sans-serif;
        }
        .dp-cat-btn:hover { border-color:#2563eb; background:rgba(37,99,235,0.03); }
        .dp-cat-btn.active { border-color:#2563eb; background:rgba(37,99,235,0.08); box-shadow:0 0 0 3px rgba(37,99,235,0.1); }
        .dp-cat-icon { font-size:22px; margin-bottom:7px; }
        .dp-cat-name { font-size:11px; font-weight:700; color:#0b1329; line-height:1.4; }
        .dp-cat-desc { font-size:10px; color:#94a3b8; margin-top:3px; }
        .dp-cat-btn.active .dp-cat-name { color:#2563eb; }

        /* ─── Giving levels ─── */
        .dp-levels-grid {
          display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-top:40px;
        }
        @media(max-width:1100px){ .dp-levels-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:600px){ .dp-levels-grid { grid-template-columns:1fr; } }
        .dp-level-card {
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12);
          border-radius:14px; padding:22px 20px; cursor:pointer;
          transition:all 0.2s; text-align:center;
        }
        .dp-level-card:hover { background:rgba(255,255,255,0.09); border-color:rgba(255,255,255,0.2); }
        .dp-level-card.active { background:rgba(37,99,235,0.25); border-color:rgba(96,165,250,0.5); box-shadow:0 0 0 3px rgba(37,99,235,0.2); }
        .dp-level-amount { font-size:22px; font-weight:800; color:#fff; letter-spacing:-0.02em; margin-bottom:6px; }
        .dp-level-tag { font-size:10px; font-weight:600; color:rgba(255,255,255,0.5); text-transform:uppercase; letter-spacing:1.5px; }
        .dp-level-card.active .dp-level-tag { color:#93c5fd; }
        .dp-custom-note {
          text-align:center; margin-top:16px;
          font-size:12px; color:rgba(255,255,255,0.4); font-weight:300;
        }

        /* ─── Donation Form ─── */
        .dp-form-wrap { max-width:660px; margin:0 auto; padding:0 24px 80px; }
        .dp-form-card {
          background:#fff; border:1px solid rgba(37,99,235,0.12);
          border-radius:20px; box-shadow:0 8px 40px rgba(37,99,235,0.08); overflow:hidden;
          margin-top:-40px; position:relative; z-index:2;
        }
        .dp-form-top {
          background:linear-gradient(135deg,rgba(37,99,235,0.06),rgba(37,99,235,0.02));
          padding:28px 32px 24px; border-bottom:1px solid rgba(37,99,235,0.08);
        }
        .dp-form-top h2 { font-size:20px; font-weight:800; color:#0b1329; margin-bottom:4px; }
        .dp-form-top p { font-size:13px; color:#64748b; font-weight:300; }
        .dp-form-body { padding:28px 32px 32px; }
        @media(max-width:600px){ .dp-form-top,.dp-form-body { padding-left:20px; padding-right:20px; } }

        .dp-section-label {
          font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase;
          color:#2563eb; margin-bottom:16px; display:flex; align-items:center; gap:8px;
        }
        .dp-section-label::after { content:''; flex:1; height:1px; background:rgba(37,99,235,0.12); }

        /* amount presets */
        .dp-preset-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:16px; }
        @media(max-width:580px){ .dp-preset-grid { grid-template-columns:repeat(2,1fr); } }
        .dp-preset-btn {
          padding:13px 6px; border:1.5px solid rgba(37,99,235,0.18); background:#fff;
          border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif;
          font-size:14px; font-weight:700; color:#0b1329; cursor:pointer;
          transition:all 0.2s; text-align:center; line-height:1.2;
        }
        .dp-preset-btn span { display:block; font-size:9px; font-weight:500; color:#94a3b8; margin-top:3px; text-transform:uppercase; letter-spacing:1px; }
        .dp-preset-btn:hover { border-color:#2563eb; background:rgba(37,99,235,0.04); }
        .dp-preset-btn.active { border-color:#2563eb; background:rgba(37,99,235,0.08); color:#2563eb; }
        .dp-preset-btn.active span { color:#93c5fd; }

        .dp-custom-wrap { position:relative; margin-bottom:24px; }
        .dp-custom-prefix {
          position:absolute; left:16px; top:50%; transform:translateY(-50%);
          font-size:18px; font-weight:600; color:#64748b;
        }
        .dp-custom-input {
          width:100%; padding:14px 16px 14px 34px;
          border:1.5px solid rgba(37,99,235,0.18); border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:20px; font-weight:700;
          color:#0b1329; outline:none; transition:border-color 0.2s; background:#f8faff;
        }
        .dp-custom-input:focus { border-color:#2563eb; background:#fff; }

        /* category select in form */
        .dp-cat-select {
          width:100%; padding:12px 16px; border:1.5px solid rgba(37,99,235,0.15);
          border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px;
          color:#0b1329; outline:none; background:#fff; margin-bottom:20px;
          transition:border-color 0.2s;
        }
        .dp-cat-select:focus { border-color:#2563eb; }

        /* form fields */
        .dp-field { margin-bottom:16px; }
        .dp-label { display:block; font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#475569; margin-bottom:8px; }
        .dp-input {
          width:100%; padding:12px 16px; border:1.5px solid rgba(37,99,235,0.15);
          border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif;
          font-size:14px; color:#0b1329; outline:none; transition:border-color 0.2s; background:#fff;
        }
        .dp-input:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.06); }
        .dp-textarea {
          width:100%; padding:12px 16px; border:1.5px solid rgba(37,99,235,0.15);
          border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px;
          color:#0b1329; outline:none; resize:vertical; min-height:80px; transition:border-color 0.2s;
        }
        .dp-textarea:focus { border-color:#2563eb; }

        /* total & CTA */
        .dp-total {
          display:flex; justify-content:space-between; align-items:center;
          padding:16px 0; border-top:2px solid rgba(37,99,235,0.1); margin:8px 0 20px;
        }
        .dp-total-left { display:flex; flex-direction:column; }
        .dp-total-label { font-size:14px; font-weight:600; color:#0b1329; }
        .dp-total-cat { font-size:11px; color:#94a3b8; margin-top:2px; }
        .dp-total-val { font-size:28px; font-weight:900; color:#2563eb; letter-spacing:-0.02em; }
        .dp-donate-btn {
          width:100%; padding:17px; background:linear-gradient(135deg,#2563eb,#1d4ed8);
          border:none; color:#fff; font-family:'Plus Jakarta Sans',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          cursor:pointer; border-radius:999px; display:flex; align-items:center;
          justify-content:center; gap:10px; transition:all 0.3s;
          box-shadow:0 4px 20px rgba(37,99,235,0.35);
        }
        .dp-donate-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 32px rgba(37,99,235,0.5); }
        .dp-donate-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .dp-spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:dpSpin 0.7s linear infinite; }
        .dp-error { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; font-size:12px; padding:10px 14px; margin-top:12px; border-radius:8px; text-align:center; }
        .dp-trust-row { display:flex; align-items:center; justify-content:center; gap:22px; margin-top:18px; padding-top:18px; border-top:1px solid rgba(37,99,235,0.08); flex-wrap:wrap; }
        .dp-trust-badge { display:flex; align-items:center; gap:5px; font-size:10px; color:#94a3b8; font-weight:500; }

        /* ─── Corporate ─── */
        .dp-corp-grid { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:start; margin-top:20px; }
        @media(max-width:900px){ .dp-corp-grid { grid-template-columns:1fr; gap:32px; } }
        .dp-corp-opp-list { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:24px; }
        @media(max-width:600px){ .dp-corp-opp-list { grid-template-columns:1fr; } }
        .dp-corp-opp-item {
          display:flex; align-items:center; gap:10px;
          padding:13px 16px; background:rgba(37,99,235,0.04);
          border:1px solid rgba(37,99,235,0.12); border-radius:10px;
          font-size:13px; font-weight:500; color:#334155;
        }
        .dp-corp-opp-dot { width:6px; height:6px; border-radius:50%; background:#2563eb; flex-shrink:0; }
        .dp-corp-cta {
          margin-top:28px; display:inline-flex; align-items:center; gap:8px;
          padding:14px 28px; background:#0b1329; border:none; color:#fff;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:2px; text-transform:uppercase; border-radius:999px; cursor:pointer;
          transition:all 0.25s; box-shadow:0 4px 16px rgba(11,19,41,0.2);
        }
        .dp-corp-cta:hover { background:#2563eb; box-shadow:0 8px 24px rgba(37,99,235,0.35); }
        .dp-corp-info { background:rgba(37,99,235,0.04); border:1px solid rgba(37,99,235,0.12); border-radius:16px; padding:28px; }
        .dp-corp-info-title { font-size:16px; font-weight:700; color:#0b1329; margin-bottom:16px; }
        .dp-corp-info-row { display:flex; align-items:flex-start; gap:12px; margin-bottom:14px; }
        .dp-corp-info-row:last-child { margin-bottom:0; }
        .dp-corp-info-icon { font-size:20px; flex-shrink:0; margin-top:1px; }
        .dp-corp-info-text strong { display:block; font-size:13px; font-weight:700; color:#0b1329; }
        .dp-corp-info-text span { font-size:12px; color:#64748b; font-weight:300; line-height:1.6; }

        /* ─── Transparency & Tax ─── */
        .dp-trans-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:40px; }
        @media(max-width:700px){ .dp-trans-grid { grid-template-columns:1fr; } }
        .dp-trans-card {
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12);
          border-radius:16px; padding:28px;
        }
        .dp-trans-icon { font-size:30px; margin-bottom:14px; }
        .dp-trans-title { font-size:16px; font-weight:700; color:#fff; margin-bottom:10px; }
        .dp-trans-desc { font-size:13px; color:rgba(255,255,255,0.5); line-height:1.8; font-weight:300; }
        .dp-trans-pill {
          display:inline-flex; align-items:center; gap:6px; margin-top:14px;
          background:rgba(96,165,250,0.12); border:1px solid rgba(96,165,250,0.3);
          border-radius:999px; padding:6px 14px; font-size:10px; font-weight:600;
          letter-spacing:1.5px; text-transform:uppercase; color:#93c5fd;
        }

        /* ─── Final CTA banner ─── */
        .dp-final-cta {
          background:linear-gradient(135deg,#2563eb,#1d4ed8);
          padding:72px 24px; text-align:center;
        }
        .dp-final-cta h2 { font-size:clamp(24px,3.5vw,40px); font-weight:900; color:#fff; letter-spacing:-0.02em; margin-bottom:14px; }
        .dp-final-cta p { font-size:15px; color:rgba(255,255,255,0.7); font-weight:300; max-width:540px; margin:0 auto 32px; line-height:1.8; }
        .dp-final-cta-btn {
          display:inline-flex; align-items:center; gap:10px;
          padding:16px 36px; background:#fff; border:none;
          color:#2563eb; font-family:'Plus Jakarta Sans',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          border-radius:999px; cursor:pointer; transition:all 0.25s;
          box-shadow:0 4px 24px rgba(0,0,0,0.15);
        }
        .dp-final-cta-btn:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(0,0,0,0.2); }

        @keyframes dpSpin { to { transform:rotate(360deg); } }
        @keyframes dpFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .dp-fadein { animation:dpFadeUp 0.5s both; }
      `}</style>

      <div className="dp-wrap">

        {/* ─── Fixed Header ─── */}
        <header className="dp-header">
          <div className="dp-header-logo">
            <img src={MTTF_LOGO} alt="MTTF" />
            <span className="dp-header-logo-tag">Donate</span>
          </div>
          <button className="dp-back-btn" onClick={() => navigate("/")}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Site
          </button>
        </header>

        {/* ─── HERO ─── */}
        <section className="dp-hero">
          <div className="dp-hero-eyebrow">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
            Donate to MTTF
          </div>
          <h1>Empower Education.<br/><em>Inspire Innovation.</em><br/>Transform Lives.</h1>
          <p className="dp-hero-sub">
            Your contribution helps us advance mathematics, technology, science, and education
            across India — creating opportunities for every learner, researcher, and educator.
          </p>
          <div className="dp-hero-badges">
            <span className="dp-hero-badge">🔒 SSL Secured &amp; RBI Compliant</span>
            <span className="dp-hero-badge">🧾 80G Tax Benefits Available</span>
            <span className="dp-hero-badge">📧 Instant Receipt on Email</span>
            <span className="dp-hero-badge">✅ Section 12AB Registered</span>
          </div>
        </section>

        {/* ─── ABOUT MTTF ─── */}
        <section className="dp-section alt">
          <div className="dp-inner">
            <div className="dp-about-grid">
              <div>
                <div className="dp-section-eyebrow">About the Foundation</div>
                <div className="dp-section-title">MathTech Thinking Foundation</div>
                <div className="dp-credentials">
                  {CREDENTIALS.map(c => (
                    <div key={c.label} className="dp-cred-card">
                      <div className="dp-cred-label">{c.label}</div>
                      <div className="dp-cred-sub">{c.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="dp-about-text">
                <p>
                  MathTech Thinking Foundation (MTTF) is a <strong>Section 8 (Not-for-Profit) Company</strong> dedicated
                  to promoting excellence in Science, Technology, Engineering, and Mathematics (STEM).
                </p>
                <p>
                  We collaborate with educational institutions, researchers, industry leaders, government agencies, and
                  communities to deliver impactful programmes in education, research, innovation, and professional development.
                </p>
                <p>
                  Our mission is to make quality education, scientific research, and emerging technologies
                  <strong> accessible to everyone</strong>, regardless of their background.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WHY DONATE ─── */}
        <section className="dp-section">
          <div className="dp-inner">
            <div className="dp-section-eyebrow">Why Donate?</div>
            <div className="dp-section-title">Your Support Creates Lasting Impact</div>
            <p className="dp-section-desc">
              Every contribution enables us to build programmes that transform lives and strengthen communities.
            </p>
            <div className="dp-why-grid">
              {WHY_DONATE.map(w => (
                <div key={w.title} className="dp-why-card dp-fadein">
                  <div className="dp-why-icon">{w.icon}</div>
                  <div className="dp-why-title">{w.title}</div>
                  <div className="dp-why-desc">{w.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CHOOSE IMPACT AREA ─── */}
        <section className="dp-section alt">
          <div className="dp-inner">
            <div className="dp-section-eyebrow">Choose Your Impact</div>
            <div className="dp-section-title">Support the Initiative That Matters Most to You</div>
            <p className="dp-section-desc">
              Direct your gift to the programme closest to your heart. Every rupee goes exactly where you choose.
            </p>
            <div className="dp-cat-grid">
              {DONATION_CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  className={`dp-cat-btn ${category === cat.value ? "active" : ""}`}
                  onClick={() => setCategory(cat.value)}
                >
                  <div className="dp-cat-icon">{cat.icon}</div>
                  <div className="dp-cat-name">{cat.value}</div>
                  <div className="dp-cat-desc">{cat.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SUGGESTED GIVING LEVELS ─── */}
        <section className="dp-section dark">
          <div className="dp-inner">
            <div className="dp-section-eyebrow">Every Contribution Matters</div>
            <div className="dp-section-title" style={{color:"#fff"}}>Suggested Giving Levels</div>
            <p className="dp-section-desc">
              Whether you give once or become a recurring donor, your generosity creates opportunities
              for learning, research, and innovation. Choose a level below or enter a custom amount.
            </p>
            <div className="dp-levels-grid">
              {PRESET_AMOUNTS.map(p => (
                <div
                  key={p.amount}
                  className={`dp-level-card ${String(amount) === String(p.amount) && !customAmount ? "active" : ""}`}
                  onClick={() => { setAmount(String(p.amount)); setCustomAmount(""); }}
                >
                  <div className="dp-level-amount">{p.label}</div>
                  <div className="dp-level-tag">{p.tag}</div>
                </div>
              ))}
            </div>
            <div className="dp-custom-note">Or scroll down to enter a custom amount in the donation form ↓</div>
          </div>
        </section>

        {/* ─── DONATION FORM ─── */}
        <section style={{background:"linear-gradient(180deg,#060d1f 0%,#f8faff 120px)", paddingBottom:0}}>
          <div className="dp-form-wrap">
            <div className="dp-form-card dp-fadein">
              <div className="dp-form-top">
                <h2>Make a Donation</h2>
                <p>100% of your donation goes toward MTTF programmes and initiatives.</p>
              </div>
              <div className="dp-form-body">

                {/* Amount */}
                <div className="dp-section-label">Choose Amount</div>
                <div className="dp-preset-grid">
                  {PRESET_AMOUNTS.map(p => (
                    <button
                      key={p.amount}
                      className={`dp-preset-btn ${String(amount) === String(p.amount) && !customAmount ? "active" : ""}`}
                      onClick={() => { setAmount(String(p.amount)); setCustomAmount(""); }}
                    >
                      {p.label}
                      <span>{p.tag}</span>
                    </button>
                  ))}
                </div>
                <div className="dp-custom-wrap">
                  <span className="dp-custom-prefix">₹</span>
                  <input
                    className="dp-custom-input"
                    type="number" min="1"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={e => { setCustomAmount(e.target.value); setAmount(""); }}
                  />
                </div>

                {/* Category */}
                <div className="dp-section-label">Donation Purpose</div>
                <select
                  className="dp-cat-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">General Fund (Greatest Need)</option>
                  {DONATION_CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.icon} {c.value}</option>
                  ))}
                </select>

                {/* Donor Info */}
                <div className="dp-section-label">Your Information</div>
                <div className="dp-field">
                  <label className="dp-label">Full Name *</label>
                  <input className="dp-input" type="text" placeholder="John Doe" required
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="dp-field">
                  <label className="dp-label">Email Address *</label>
                  <input className="dp-input" type="email" placeholder="example@gmail.com" required
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="dp-field">
                  <label className="dp-label">Phone Number *</label>
                  <input className="dp-input" type="tel" placeholder="+91 9999999999" required
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="dp-field">
                  <label className="dp-label">Message (Optional)</label>
                  <textarea className="dp-textarea" placeholder="Leave a message of support…"
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>

                {/* Total */}
                <div className="dp-total">
                  <div className="dp-total-left">
                    <span className="dp-total-label">Total Donation</span>
                    <span className="dp-total-cat">{category || "General Fund (Greatest Need)"}</span>
                  </div>
                  <span className="dp-total-val">{selectedAmount ? fmt(selectedAmount) : "₹0"}</span>
                </div>

                <button className="dp-donate-btn" onClick={handleDonate} disabled={paying || !selectedAmount}>
                  {paying ? (
                    <><span className="dp-spinner" /> Processing…</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#ef4444"/>
                      </svg>
                      Donate {selectedAmount ? fmt(selectedAmount) : ""} Now
                    </>
                  )}
                </button>

                {error && <div className="dp-error">{error}</div>}

                <div className="dp-trust-row">
                  <span className="dp-trust-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    SSL Secured
                  </span>
                  <span className="dp-trust-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/></svg>
                    Receipt on Email
                  </span>
                  <span className="dp-trust-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="currentColor" strokeWidth="1.5"/></svg>
                    RBI Compliant
                  </span>
                  <span className="dp-trust-badge">
                    🧾 80G Tax Benefit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CORPORATE & INSTITUTIONAL ─── */}
        <section className="dp-section alt">
          <div className="dp-inner">
            <div className="dp-section-eyebrow">Corporate &amp; Institutional</div>
            <div className="dp-section-title">Partner With Us for Greater Impact</div>
            <div className="dp-corp-grid">
              <div>
                <p style={{fontSize:15,color:"#475569",lineHeight:1.8,fontWeight:300,marginBottom:16}}>
                  Organizations can partner with MTTF to support high-impact initiatives through
                  <strong> Corporate Social Responsibility (CSR)</strong>, institutional collaborations,
                  sponsorships, and philanthropic giving.
                </p>
                <p style={{fontSize:15,color:"#475569",lineHeight:1.8,fontWeight:300,marginBottom:24}}>
                  Together, we can build scalable solutions that create measurable social impact
                  across education, research, and skill development.
                </p>
                <div style={{fontWeight:700,fontSize:14,color:"#0b1329",marginBottom:12}}>Partnership Opportunities</div>
                <div className="dp-corp-opp-list">
                  {CORPORATE_OPPORTUNITIES.map(opp => (
                    <div key={opp} className="dp-corp-opp-item">
                      <span className="dp-corp-opp-dot" />
                      {opp}
                    </div>
                  ))}
                </div>
                <button className="dp-corp-cta" onClick={() => navigate("/contact")}>
                  Contact for Partnership
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6H11M7 2L11 6L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="dp-corp-info">
                <div className="dp-corp-info-title">Why Partner with MTTF?</div>
                {[
                  { icon:"🎯", title:"Measurable Impact", desc:"Every programme is tracked with clear outcomes and reports." },
                  { icon:"📊", title:"CSR Compliance",    desc:"All donations are eligible under CSR guidelines for eligible companies." },
                  { icon:"🏆", title:"Brand Visibility",  desc:"Co-branding opportunities across events, publications, and platforms." },
                  { icon:"🌐", title:"National Reach",     desc:"Programmes spanning multiple states and institutions across India." },
                ].map(item => (
                  <div key={item.title} className="dp-corp-info-row">
                    <span className="dp-corp-info-icon">{item.icon}</span>
                    <div className="dp-corp-info-text">
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── TRANSPARENCY & TAX ─── */}
        <section className="dp-section dark">
          <div className="dp-inner">
            <div className="dp-section-eyebrow">Accountability &amp; Benefits</div>
            <div className="dp-section-title" style={{color:"#fff"}}>Transparency You Can Trust</div>
            <p className="dp-section-desc">
              We are committed to responsible governance and accountability. Every donation is managed
              with integrity and directed toward programmes that create measurable outcomes.
            </p>
            <div className="dp-trans-grid">
              <div className="dp-trans-card">
                <div className="dp-trans-icon">🔍</div>
                <div className="dp-trans-title">Transparent Governance</div>
                <div className="dp-trans-desc">
                  We maintain transparent financial practices and strive to ensure that every
                  contribution delivers meaningful educational and societal impact.
                  Annual reports are published and available to all stakeholders.
                </div>
                <span className="dp-trans-pill">✓ Verified Non-Profit</span>
              </div>
              <div className="dp-trans-card">
                <div className="dp-trans-icon">🧾</div>
                <div className="dp-trans-title">Tax Benefits under 80G</div>
                <div className="dp-trans-desc">
                  MathTech Thinking Foundation is registered under <strong style={{color:"#93c5fd"}}>Section 12AB</strong> and
                  approved under <strong style={{color:"#93c5fd"}}>Section 80G</strong> of the Income Tax Act, 1961.
                  Eligible donations may qualify for tax deduction benefits under applicable provisions of Indian law.
                </div>
                <span className="dp-trans-pill">✓ 80G Approved</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="dp-final-cta">
          <h2>Donate Today. Create Tomorrow.</h2>
          <p>
            Every learner empowered, every researcher supported, every educator inspired,
            and every innovation nurtured begins with the generosity of people like you.
          </p>
          <button
            className="dp-final-cta-btn"
            onClick={() => document.querySelector(".dp-form-card")?.scrollIntoView({ behavior: "smooth", block: "center" })}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#ef4444"/>
            </svg>
            Donate Now
          </button>
        </section>

      </div>
    </>
  );
}
