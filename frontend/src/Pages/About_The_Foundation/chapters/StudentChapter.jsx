import React, { useState, useEffect, useRef } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";

const advantages = [
  {
    id: "01",
    title: "Networking Opportunities",
    accent: "#2563eb",
    desc: "Student chapters provide a platform for STEM professionals to network with students, fellow professionals, and industry leaders, fostering valuable connections.",
  },
  {
    id: "02",
    title: "Knowledge Exchange",
    accent: "#60a5fa",
    desc: "Professionals can engage in knowledge-sharing sessions, workshops, and events organized by student chapters, enhancing their understanding of current trends and advancements in their field.",
  },
  {
    id: "03",
    title: "Mentorship Programs",
    accent: "#60a5fa",
    desc: "Student chapters often offer mentorship opportunities, allowing STEM professionals to guide and support the next generation of professionals, while also gaining satisfaction from contributing to their development.",
  },
  {
    id: "04",
    title: "Skill Development",
    accent: "#3b82f6",
    desc: "Participation in student chapter activities can contribute to the continuous development of professional skills, providing access to hands-on experiences and practical learning opportunities.",
  },
  {
    id: "05",
    title: "Access to Talent Pool",
    accent: "#2563eb",
    desc: "Professionals can identify and connect with talented students through student chapters, potentially discovering future collaborators, employees, or colleagues.",
  },
  {
    id: "06",
    title: "Professional Growth",
    accent: "#2563eb",
    desc: "Involvement in student chapters can contribute to a professional's personal and career development, offering leadership opportunities, exposure to diverse perspectives, and a chance to enhance leadership and communication skills.",
  },
  {
    id: "07",
    title: "Community Engagement",
    accent: "#60a5fa",
    desc: "Being part of a student chapter allows professionals to engage with the local academic community, staying informed about educational initiatives, research, and potential collaborations.",
  },
  {
    id: "08",
    title: "Stay Updated on Industry Trends",
    accent: "#60a5fa",
    desc: "Through events and activities organized by student chapters, professionals can stay abreast of the latest industry trends, research findings, and technological advancements relevant to their field.",
  },
  {
    id: "09",
    title: "Contribute to Education",
    accent: "#3b82f6",
    desc: "Professionals can actively contribute to educational initiatives and programs organized by student chapters, sharing their expertise and helping shape the future of STEM education.",
  },
  {
    id: "10",
    title: "Brand Visibility",
    accent: "#2563eb",
    desc: "Involvement with student chapters provides professionals with opportunities to enhance their personal and organizational visibility within the academic and professional community, potentially leading to increased recognition and opportunities.",
  },
];

const establishedChapter = {
  name: "Anand International College of Engineering",
  location: "Jaipur",
  date: "August 12, 2023",
  chapterId: "MSC2023001",
  description:
    "Founded the MathTech Thinking Foundation (MTTF) Student Chapter for its engineering students.",
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function AdvantageCard({ item, index }) {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${index * 0.06}s, transform 0.7s ease ${index * 0.06}s`,
        background: hovered ? "#0b1329" : "#0b1329",
        border: `1px solid ${hovered ? item.accent + "60" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "2px",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        boxShadow: hovered
          ? `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px ${item.accent}20`
          : "none",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: hovered ? "3px" : "2px",
          background: item.accent,
          transition: "width 0.3s",
        }}
      />

      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', monospace",
          fontSize: "0.58rem",
          color: item.accent,
          letterSpacing: "0.2em",
          opacity: 0.6,
        }}
      >
        {item.id} / {String(advantages.length).padStart(2, "0")}
      </div>

      <h3
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "1.2rem",
          fontWeight: 600,
          color: "rgba(255, 255, 255, 0.85)",
          letterSpacing: "0.01em",
          margin: 0,
        }}
      >
        {item.title}
      </h3>

      <div
        style={{
          height: "1px",
          background: `${item.accent}25`,
          width: hovered ? "100%" : "40%",
          transition: "width 0.4s ease",
        }}
      />

      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "0.82rem",
          color: "rgba(255, 255, 255,0.45)",
          lineHeight: 1.85,
          margin: 0,
        }}
      >
        {item.desc}
      </p>
    </div>
  );
}

function ChapterCard() {
  const [ref, visible] = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        position: "relative",
        background: "linear-gradient(160deg, #0b1329 0%, #0b1329 100%)",
        border: `1px solid ${hovered ? "rgba(37, 99, 235,0.5)" : "rgba(37, 99, 235,0.25)"}`,
        borderRadius: "2px",
        padding: "3rem",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(37, 99, 235,0.15)"
          : "0 20px 40px rgba(0,0,0,0.3)",
        transition: "all 0.4s ease, opacity 0.8s ease, transform 0.8s ease",
        maxWidth: "780px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #2563eb, #60a5fa, #2563eb)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "-1rem",
          bottom: "-1rem",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "9rem",
          fontWeight: 700,
          color: "rgba(37, 99, 235,0.04)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        MTTF
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            border: "1px solid rgba(37, 99, 235,0.3)",
            padding: "0.3rem 0.85rem",
            marginBottom: "2rem",
            background: "rgba(37, 99, 235,0.06)",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#2563eb",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#2563eb",
            }}
          >
            Chapter ID: {establishedChapter.chapterId}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.85)",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
            lineHeight: 1.2,
          }}
        >
          {establishedChapter.name}
        </h3>

        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.85rem",
            color: "#2563eb",
            marginBottom: "1.5rem",
            opacity: 0.8,
          }}
        >
          {establishedChapter.location}
        </div>

        <div
          style={{
            height: "1px",
            background: "rgba(37, 99, 235,0.15)",
            marginBottom: "1.5rem",
          }}
        />

        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255,0.5)",
            lineHeight: 1.85,
            margin: "0 0 2rem",
          }}
        >
          {establishedChapter.description}
        </p>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {[
            ["Founded", establishedChapter.date],
            ["Type", "Student Chapter"],
            ["Domain", "Engineering"],
          ].map(([label, val]) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255,0.25)",
                  marginBottom: "0.25rem",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255,0.75)",
                }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudentChapter() {
  const [heroRef, heroVisible] = useInView(0.05);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1329]">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes floatDot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 0.8; }
        }
        @keyframes rotateSlow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0b1329; }
        ::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 2px; }
      `}</style>

      <Header />

      <main className="flex-grow">
        {/* ── HERO ── */}
        <section
          ref={heroRef}
          style={{
            position: "relative",
            minHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "6rem 2rem",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* Background Elements */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(rgba(37, 99, 235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235,0.04) 1px, transparent 1px)`,
              backgroundSize: "72px 72px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "700px",
              height: "500px",
              background: "radial-gradient(ellipse, rgba(37, 99, 235,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "440px",
              height: "440px",
              border: "1px solid rgba(37, 99, 235,0.05)",
              borderRadius: "50%",
              animation: "rotateSlow 50s linear infinite",
              pointerEvents: "none",
            }}
          />

          {/* Hero content */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 1s ease, transform 1s ease",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                border: "1px solid rgba(37, 99, 235,0.25)",
                padding: "0.4rem 1.25rem",
                marginBottom: "2.5rem",
                background: "rgba(37, 99, 235,0.04)",
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563eb" }} />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#2563eb",
                }}
              >
                MathTech Thinking Foundation
              </span>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563eb" }} />
            </div>

            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(3rem, 8vw, 6.5rem)",
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              Student
              <br />
              <span
                style={{
                  fontStyle: "italic",
                  background: "linear-gradient(120deg, #2563eb 0%, #60a5fa 40%, #2563eb 80%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "shimmer 4s linear infinite",
                }}
              >
                Chapters
              </span>
            </h1>

            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "1.05rem",
                color: "rgba(255, 255, 255,0.45)",
                maxWidth: "560px",
                margin: "1.5rem auto 3rem",
                lineHeight: 1.8,
              }}
            >
              STEM Student Chapters create a vibrant bridge between academia and industry —
              empowering professionals and students through shared knowledge, mentorship,
              and collaborative growth.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                border: "1px solid rgba(37, 99, 235,0.15)",
                background: "rgba(37, 99, 235,0.03)",
                maxWidth: "560px",
                margin: "0 auto",
              }}
            >
              {[
                ["10", "Advantages"],
                ["01", "Est. Chapter"],
                ["2023", "Founded"],
              ].map(([val, label], i) => (
                <div
                  key={label}
                  style={{
                    flex: "1 1 140px",
                    padding: "1.25rem 1rem",
                    textAlign: "center",
                    borderRight: i < 2 ? "1px solid rgba(37, 99, 235,0.15)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "2rem",
                      fontWeight: 600,
                      color: "#2563eb",
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans', monospace",
                      fontSize: "0.55rem",
                      color: "rgba(255, 255, 255,0.25)",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginTop: "0.2rem",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INTRO STRIP ── */}
        <div
          style={{
            borderTop: "1px solid rgba(37, 99, 235,0.12)",
            borderBottom: "1px solid rgba(37, 99, 235,0.12)",
            background: "rgba(37, 99, 235,0.03)",
            padding: "3rem 2rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              fontStyle: "italic",
              color: "rgba(255, 255, 255,0.55)",
              maxWidth: "860px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            "Advantages of STEM Student Chapters for Professionals — where
            knowledge-sharing, mentorship, and innovation converge to shape the future of science
            and technology."
          </p>
        </div>

        {/* ── ADVANTAGES GRID ── */}
        <section style={{ maxWidth: "1300px", margin: "0 auto", padding: "6rem 2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "4rem",
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.85)",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Advantages for Professionals
            </h2>
            <div style={{ flex: 1, height: "1px", background: "rgba(37, 99, 235,0.15)" }} />
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', monospace",
                fontSize: "0.6rem",
                color: "rgba(37, 99, 235,0.5)",
                letterSpacing: "0.15em",
              }}
            >
              10 AREAS
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {advantages.map((item, i) => (
              <div key={item.id} style={{ background: "#0b1329", padding: "1px" }}>
                <AdvantageCard item={item} index={i} />
              </div>
            ))}
          </div>
        </section>

        {/* ── ESTABLISHED CHAPTERS ── */}
        <section
          style={{
            background: "#0b1329",
            borderTop: "1px solid rgba(37, 99, 235,0.1)",
            padding: "6rem 2rem",
          }}
        >
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#2563eb",
                  marginBottom: "1rem",
                  opacity: 0.7,
                }}
              >
                Active Network
              </div>
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.85)",
                  letterSpacing: "-0.02em",
                  marginBottom: "1rem",
                }}
              >
                Established Chapters
              </h2>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.88rem",
                  color: "rgba(255, 255, 255,0.35)",
                  maxWidth: "500px",
                  margin: "0 auto",
                  lineHeight: 1.85,
                }}
              >
                Our growing network of MTTF Student Chapters spanning academic institutions
                dedicated to advancing STEM education.
              </p>
            </div>
            <ChapterCard />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}