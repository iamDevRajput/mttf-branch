import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, BookOpen, TrendingUp } from 'lucide-react';
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import rkUppal from "../../../assets/r_k_uppal.webp";

const Advisors = () => {
  const advisors = [
     {
    name: 'Prof. R K Uppal',
    role: 'Professor Emeritus & Principal',
    expertise: 'Management Education & Research',
    image: rkUppal,
    bio: 'Professor Emeritus and Principal at GGS College of Management and Technology, Punjab, with extensive academic leadership and research expertise in management studies.',
    achievements: [
      'Professor Emeritus at GGS College',
      'Experienced academic leader',
      'Active researcher and contributor'
    ],
    linkedin: 'https://www.linkedin.com/in/r-k-uppal-ph-d-d-litt-professor-emeritus-and-research-professor-423005208/'
  },

  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 12, stiffness: 100 } },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital,wght@0,700;0,900;1,600&display=swap');

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulseGold {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.25; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateSlow    { from { transform: translate(-50%,-50%) rotate(0deg);   } to { transform: translate(-50%,-50%) rotate(360deg);  } }
        @keyframes rotateReverse { from { transform: translate(-50%,-50%) rotate(0deg);   } to { transform: translate(-50%,-50%) rotate(-360deg); } }
        @keyframes scaleIn       { from { transform: scale(0); opacity:0; } to { transform: scale(1); opacity:1; } }
        @keyframes lineGrow      { from { width: 0; } to { width: 10rem; } }

        .advisors-main {
          flex: 1;
          background: linear-gradient(158deg, #f8fafc 0%, #EDE5CC 55%, #E4D5A8 100%);
          padding: 6rem 1.5rem 5rem;
          position: relative;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .gold-rule { height:1px; background:linear-gradient(90deg,transparent,#2563eb70,transparent); }

        .eyebrow {
          font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; letter-spacing:0.22em;
          color:#2563eb; text-transform:uppercase; font-weight:500;
          display:flex; align-items:center; gap:0.5rem; justify-content:center; margin-bottom:1rem;
        }
        .eyebrow-line { display:inline-block; width:28px; height:1px; background:#2563eb; }

        .advisor-card {
          background: #FAF8F2;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
          height: 100%;
        }
        .advisor-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #2563eb, #60a5fa, transparent);
          transition: width 0.45s cubic-bezier(0.23,1,0.32,1);
          z-index: 2;
        }
        .advisor-card:hover::before { width: 100%; }
        .advisor-card:hover {
          border-color: #2563eb;
          box-shadow: 0 24px 52px rgba(37, 99, 235,0.14);
          background: #FEFCF7;
        }

        .btn-gold {
          display:inline-flex; align-items:center; gap:0.5rem;
          padding:0.85rem 2.4rem; background:#2563eb; color:#fff;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:0.75rem; font-weight:500;
          letter-spacing:0.14em; text-transform:uppercase;
          border:1px solid #2563eb; border-radius:2px;
          cursor:pointer; transition:all 0.35s ease;
        }
        .btn-gold:hover { background:#1d4ed8; border-color:#1d4ed8; transform:translateY(-2px); box-shadow:0 10px 24px rgba(37, 99, 235,0.28); }

        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:#f8fafc; }
        ::-webkit-scrollbar-thumb { background:#2563eb; border-radius:2px; }
      `}</style>

      <Header />

      <main className="advisors-main">
        {/* Rotating rings */}
        <div style={{ position:'absolute', top:'50%', left:'50%', width:'600px', height:'600px', border:'1px solid rgba(37, 99, 235,0.07)', borderRadius:'50%', animation:'rotateSlow 50s linear infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'50%', left:'50%', width:'900px', height:'900px', border:'1px dashed rgba(37, 99, 235,0.04)', borderRadius:'50%', animation:'rotateReverse 75s linear infinite', pointerEvents:'none' }} />
        {/* Warm glow */}
        <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translateX(-50%)', width:'800px', height:'500px', background:'radial-gradient(ellipse,rgba(37, 99, 235,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
        {/* Gold grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(37, 99, 235,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(37, 99, 235,0.04) 1px,transparent 1px)`, backgroundSize:'72px 72px', pointerEvents:'none' }} />

        {/* Corner brackets */}
        {[
          { top:'1.5rem', left:'1.5rem', borderTop:'1px solid #2563eb', borderLeft:'1px solid #2563eb' },
          { top:'1.5rem', right:'1.5rem', borderTop:'1px solid #2563eb', borderRight:'1px solid #2563eb' },
          { bottom:'1.5rem', left:'1.5rem', borderBottom:'1px solid #2563eb', borderLeft:'1px solid #2563eb' },
          { bottom:'1.5rem', right:'1.5rem', borderBottom:'1px solid #2563eb', borderRight:'1px solid #2563eb' },
        ].map((s,i) => <div key={i} style={{ position:'absolute', width:48, height:48, opacity:0.4, ...s }} />)}

        <div style={{ maxWidth:'1200px', margin:'0 auto', position:'relative', zIndex:1 }}>

          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity:0, y:-24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7 }}
            style={{ textAlign:'center', marginBottom:'4.5rem' }}
          >
            {/* Icon badge */}
            <motion.div
              initial={{ scale:0, opacity:0 }}
              animate={{ scale:1, opacity:1 }}
              transition={{ delay:0.2, type:'spring', stiffness:200 }}
              style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'64px', height:'64px', background:'#F5EFD8', border:'1px solid #E8D89A', borderRadius:'4px', marginBottom:'1.75rem', color:'#2563eb' }}
            >
              <Award size={28} />
            </motion.div>

            {/* Eyebrow */}
            <div className="eyebrow">
              <span className="eyebrow-line" />
              Distinguished Experts
              <span className="eyebrow-line" />
            </div>

            <h1 style={{ fontFamily:"'Plus Jakarta Sans',serif", fontSize:'clamp(2.6rem,6vw,5rem)', fontWeight:900, lineHeight:1.05, letterSpacing:'-0.025em', color:'#1C1208', marginBottom:'0.4rem' }}>
              Our
            </h1>
            <h1 style={{ fontFamily:"'Plus Jakarta Sans',serif", fontSize:'clamp(2.6rem,6vw,5rem)', fontWeight:900, lineHeight:1.05, letterSpacing:'-0.025em', marginBottom:'1.25rem', fontStyle:'italic', background:'linear-gradient(135deg,#2563eb 0%,#8B6D38 40%,#60a5fa 100%)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 4s linear infinite' }}>
              Advisors
            </h1>

            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1rem', color:'#6B5C3E', maxWidth:'540px', margin:'0 auto 2rem', lineHeight:1.78, fontWeight:300 }}>
              Distinguished experts providing strategic guidance, wisdom, and vision to drive our mission forward
            </p>

            {/* Animated gold rule */}
            <motion.div
              initial={{ width:0 }}
              animate={{ width:'10rem' }}
              transition={{ delay:0.5, duration:0.8 }}
              style={{ height:'1px', background:'linear-gradient(90deg,transparent,#2563eb,transparent)', margin:'0 auto' }}
            />
          </motion.div>

          {/* ── Advisors Grid ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display:'flex', justifyContent:'center', gap:'1.5rem' }}
          >
            {advisors.map((advisor, index) => (
              <motion.div
  key={index}
  variants={itemVariants}
  whileHover={{ y:-6 }}
  style={{ display:'flex', width:'360px' }}
>
                <AdvisorCard advisor={advisor} index={index} />
              </motion.div>
            ))}
          </motion.div>

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.8 }}
            style={{ marginTop:'5rem' }}
          >
            <div style={{ maxWidth:'640px', margin:'0 auto', background:'linear-gradient(158deg,#1C1208 0%,#2E1F08 100%)', border:'1px solid #3D2A0A', borderRadius:'4px', padding:'3.5rem 3rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#2563eb,transparent)' }} />
              {[
                { top:'1rem', left:'1rem', borderTop:'1px solid #2563eb40', borderLeft:'1px solid #2563eb40' },
                { top:'1rem', right:'1rem', borderTop:'1px solid #2563eb40', borderRight:'1px solid #2563eb40' },
                { bottom:'1rem', left:'1rem', borderBottom:'1px solid #2563eb40', borderLeft:'1px solid #2563eb40' },
                { bottom:'1rem', right:'1rem', borderBottom:'1px solid #2563eb40', borderRight:'1px solid #2563eb40' },
              ].map((s,i) => <div key={i} style={{ position:'absolute', width:32, height:32, ...s }} />)}

              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'0.65rem', letterSpacing:'0.22em', color:'#2563eb', textTransform:'uppercase', fontWeight:500, marginBottom:'1.25rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                <span style={{ display:'inline-block', width:20, height:1, background:'#2563eb' }} />
                Advisory Board
                <span style={{ display:'inline-block', width:20, height:1, background:'#2563eb' }} />
              </div>

              <h3 style={{ fontFamily:"'Plus Jakarta Sans',serif", fontSize:'clamp(1.5rem,2.5vw,2.2rem)', fontWeight:700, color:'#f8fafc', letterSpacing:'-0.02em', margin:'0 0 1rem' }}>
                Join Our{' '}
                <span style={{ fontStyle:'italic', background:'linear-gradient(135deg,#2563eb,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  Advisory Board
                </span>
              </h3>

              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'0.9rem', color:'rgba(247,243,234,0.55)', maxWidth:'420px', margin:'0 auto 2rem', lineHeight:1.78, fontWeight:300 }}>
                We're always looking for passionate experts to guide our mission
              </p>

              <motion.button
                whileHover={{ scale:1.03 }}
                whileTap={{ scale:0.97 }}
                className="btn-gold"
              >
                Get in Touch
              </motion.button>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

// ── Advisor Card ──
function AdvisorCard({ advisor, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="advisor-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width:'100%' }}
    >
      {/* Clipped top-right corner */}
      <div style={{ position:'absolute', top:0, right:0, width:20, height:20, background:hovered?'#2563eb':'#E8DFC4', clipPath:'polygon(100% 0,0 0,100% 100%)', transition:'background 0.3s', zIndex:2 }} />

      {/* Card number */}
      <div style={{ position:'absolute', top:'1.1rem', left:'1.4rem', fontFamily:"'Plus Jakarta Sans',serif", fontSize:'0.68rem', color:'#2563eb', letterSpacing:'0.15em', fontWeight:600, zIndex:2 }}>
        {String(index+1).padStart(2,'0')}
      </div>

      <div style={{ padding:'2rem 2rem 2rem' }}>
        {/* Profile image */}
        <div style={{ position:'relative', width:'80px', height:'80px', margin:'1rem auto 1.5rem' }}>
          {/* Gold ring on hover */}
          <div style={{ position:'absolute', inset:'-3px', borderRadius:'50%', border:`2px solid ${hovered?'#2563eb':'#E8D89A'}`, transition:'border-color 0.35s' }} />
          <img
            src={advisor.image}
            alt={advisor.name}
            style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover', display:'block', position:'relative', zIndex:1 }}
          />
          {/* Briefcase badge */}
          <div style={{ position:'absolute', bottom:'-4px', right:'-4px', width:'26px', height:'26px', background:'#2563eb', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #FAF8F2', zIndex:2 }}>
            <Briefcase size={11} color="#fff" />
          </div>
        </div>

        {/* Name & role */}
        <div style={{ textAlign:'center', marginBottom:'1rem' }}>
          <h3 style={{ fontFamily:"'Plus Jakarta Sans',serif", fontSize:'1.2rem', fontWeight:700, color:'#1C1208', margin:'0 0 0.3rem', letterSpacing:'-0.01em' }}>
            {advisor.name}
          </h3>
          <p style={{ fontFamily:"'Plus Jakarta Sans',serif", fontSize:'0.88rem', fontWeight:600, color:'#2563eb', margin:'0 0 0.4rem', letterSpacing:'0.03em' }}>
            {advisor.role}
          </p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'0.75rem', color:'#9C8B6E', fontStyle:'italic', fontWeight:300 }}>
            <BookOpen size={12} color="#2563eb" />
            {advisor.expertise}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height:'1px', background:hovered?'linear-gradient(90deg,transparent,#2563eb50,transparent)':'#EDE4CC', marginBottom:'1rem', transition:'background 0.3s' }} />

        {/* Bio */}
        <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'0.82rem', color:'#6B5C3E', lineHeight:1.8, marginBottom:'1.25rem', fontWeight:300 }}>
          {advisor.bio}
        </p>

        {/* Achievements */}
        <div style={{ marginBottom:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.65rem', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'0.62rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'#2563eb', fontWeight:500 }}>
            <TrendingUp size={12} color="#2563eb" />
            Key Achievements
          </div>
          {advisor.achievements.map((ach, i) => (
            <motion.div
              key={i}
              initial={{ opacity:0, x:-16 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.3 + i*0.08 }}
              style={{ display:'flex', alignItems:'flex-start', gap:'0.6rem', marginBottom:'0.45rem' }}
            >
              <span style={{ marginTop:'0.45rem', width:5, height:5, borderRadius:'50%', background:'#2563eb', flexShrink:0, display:'inline-block' }} />
              <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'0.8rem', color:'#7A6040', fontWeight:300, lineHeight:1.6 }}>
                {ach}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom gold rule on hover */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,#2563eb,transparent)', opacity:hovered?1:0, transition:'opacity 0.35s' }} />
    </div>
  );
}

export default Advisors;