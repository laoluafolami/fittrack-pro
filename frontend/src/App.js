import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const API = "https://fittrack-api-2025-ghhtgdhka2fzchdt.centralus-01.azurewebsites.net/api";

const GYM_IMAGES = {
  hero: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&q=90",
  weights: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=80",
  cardio: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80",
  yoga: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=900&q=80",
  boxing: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&q=80",
  cycling: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=900&q=80",
  crossfit: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&q=80",
  gym1: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80",
  gym2: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80",
  trainer: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
};

const CLASS_IMAGES = {
  Yoga: GYM_IMAGES.yoga,
  HIIT: GYM_IMAGES.weights,
  Spinning: GYM_IMAGES.cycling,
  Zumba: GYM_IMAGES.cardio,
  CrossFit: GYM_IMAGES.crossfit,
  Pilates: GYM_IMAGES.gym1,
};

const MOCK_CLASSES = [
  { ClassID: 1, ClassName: "Morning Yoga Flow", CategoryName: "Yoga", InstructorName: "Amara Okonkwo", StartTime: "07:00", EndTime: "08:00", ScheduledDate: "2025-03-19", MaxCapacity: 15, CurrentBookings: 9, Room: "Studio A", Difficulty: "Beginner", ColorCode: "#8B5CF6" },
  { ClassID: 2, ClassName: "HIIT Blast", CategoryName: "HIIT", InstructorName: "Chukwudi Eze", StartTime: "09:00", EndTime: "10:00", ScheduledDate: "2025-03-19", MaxCapacity: 20, CurrentBookings: 18, Room: "Main Hall", Difficulty: "Intermediate", ColorCode: "#EF4444" },
  { ClassID: 3, ClassName: "Zumba Party", CategoryName: "Zumba", InstructorName: "Ngozi Adeyemi", StartTime: "17:00", EndTime: "18:00", ScheduledDate: "2025-03-19", MaxCapacity: 25, CurrentBookings: 12, Room: "Studio B", Difficulty: "All Levels", ColorCode: "#10B981" },
  { ClassID: 4, ClassName: "Power Spinning", CategoryName: "Spinning", InstructorName: "Emeka Balogun", StartTime: "06:30", EndTime: "07:30", ScheduledDate: "2025-03-20", MaxCapacity: 18, CurrentBookings: 18, Room: "Spin Room", Difficulty: "Intermediate", ColorCode: "#F59E0B" },
  { ClassID: 5, ClassName: "CrossFit Fundamentals", CategoryName: "CrossFit", InstructorName: "Chukwudi Eze", StartTime: "10:00", EndTime: "11:30", ScheduledDate: "2025-03-20", MaxCapacity: 12, CurrentBookings: 5, Room: "Main Hall", Difficulty: "Advanced", ColorCode: "#3B82F6" },
  { ClassID: 6, ClassName: "Evening Pilates", CategoryName: "Pilates", InstructorName: "Amara Okonkwo", StartTime: "18:00", EndTime: "19:00", ScheduledDate: "2025-03-21", MaxCapacity: 15, CurrentBookings: 7, Room: "Studio A", Difficulty: "Beginner", ColorCode: "#EC4899" },
];

const MOCK_STATS = {
  TotalMembers: 247,
  ActiveSubscriptions: 189,
  ClassesToday: 6,
  BookingsToday: 43,
  RevenueThisMonth: 2840000,
  ExpiringSoon: 12,
};

const MOCK_BOOKINGS = [
  { BookingID: 1, ClassName: "Morning Yoga Flow", CategoryName: "Yoga", ScheduledDate: "2025-03-19", StartTime: "07:00", EndTime: "08:00", InstructorName: "Amara Okonkwo", Status: "Confirmed", AttendanceStatus: "Pending", ColorCode: "#8B5CF6" },
  { BookingID: 2, ClassName: "HIIT Blast", CategoryName: "HIIT", ScheduledDate: "2025-03-18", StartTime: "09:00", EndTime: "10:00", InstructorName: "Chukwudi Eze", Status: "Confirmed", AttendanceStatus: "Attended", ColorCode: "#EF4444" },
];

const PLANS = [
  { PlanID: 1, PlanName: "Starter Monthly", DurationDays: 30, Price: 15000, MaxBookings: 12, Description: "Perfect for beginners. Access to all standard classes.", popular: false },
  { PlanID: 2, PlanName: "Pro Quarterly", DurationDays: 90, Price: 38000, MaxBookings: 40, Description: "Best value for committed members. Priority class booking.", popular: true },
  { PlanID: 3, PlanName: "Elite Annual", DurationDays: 365, Price: 120000, MaxBookings: 999, Description: "Unlimited access. Premium perks and personal trainer sessions.", popular: false },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };
const spotsLeft = (c) => c.MaxCapacity - c.CurrentBookings;
const difficultyColor = { Beginner: "#10B981", Intermediate: "#F59E0B", Advanced: "#EF4444", "All Levels": "#6366F1" };

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const glass = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "20px",
};

const glassStrong = {
  background: "rgba(255,255,255,0.10)",
  backdropFilter: "blur(30px)",
  WebkitBackdropFilter: "blur(30px)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "20px",
};

// ─── INJECT GLOBAL CSS ────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brand: #C8F135;
    --brand-dim: #a8cc1a;
    --dark: #0A0A0A;
    --dark2: #111111;
    --dark3: #1a1a1a;
    --text: #F5F5F0;
    --text-muted: rgba(245,245,240,0.5);
    --red: #FF4444;
    --green: #22C55E;
    --blue: #3B82F6;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--dark);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--dark2); }
  ::-webkit-scrollbar-thumb { background: var(--brand); border-radius: 3px; }

  .bebas { font-family: 'Bebas Neue', cursive; letter-spacing: 0.03em; }

  .btn-brand {
    background: var(--brand);
    color: var(--dark);
    border: none;
    border-radius: 50px;
    padding: 14px 32px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .btn-brand:hover { background: var(--brand-dim); transform: translateY(-1px); box-shadow: 0 8px 25px rgba(200,241,53,0.3); }
  .btn-brand:active { transform: translateY(0); }

  .btn-ghost {
    background: rgba(255,255,255,0.08);
    color: var(--text);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 50px;
    padding: 12px 28px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.3); }

  .btn-sm {
    padding: 8px 18px !important;
    font-size: 13px !important;
  }

  .input-field {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 14px 18px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s;
  }
  .input-field:focus { border-color: var(--brand); }
  .input-field::placeholder { color: var(--text-muted); }

  .card-hover { transition: transform 0.25s, box-shadow 0.25s; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }

  .fade-in { animation: fadeIn 0.5s ease forwards; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .pulse-dot {
    width: 8px; height: 8px;
    background: var(--brand);
    border-radius: 50%;
    display: inline-block;
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.4); } }

  .progress-bar {
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.8s ease;
  }

  .nav-link {
    color: var(--text-muted);
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 50px;
    transition: all 0.2s;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-link:hover, .nav-link.active { color: var(--text); background: rgba(255,255,255,0.08); }
  .nav-link.active { color: var(--brand); }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }

  .stat-number {
    font-family: 'Bebas Neue', cursive;
    font-size: 42px;
    line-height: 1;
    color: var(--brand);
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .sidebar-item:hover { background: rgba(255,255,255,0.06); color: var(--text); }
  .sidebar-item.active { background: rgba(200,241,53,0.12); color: var(--brand); }

  .hero-parallax {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.1s linear;
  }

  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .mobile-full { width: 100% !important; }
  }
`;

// ─── INJECT STYLES COMPONENT ─────────────────────────────────────────────────
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <div style={{
    position: "fixed", top: 24, right: 24, zIndex: 9999,
    ...glassStrong,
    padding: "16px 24px",
    display: "flex", alignItems: "center", gap: 12,
    minWidth: 300, maxWidth: 400,
    borderLeft: `4px solid ${type === "success" ? "#C8F135" : type === "error" ? "#FF4444" : "#3B82F6"}`,
    animation: "fadeIn 0.3s ease",
  }}>
    <span style={{ fontSize: 20 }}>{type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
    <span style={{ flex: 1, fontSize: 14 }}>{message}</span>
    <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 18 }}>×</button>
  </div>
);

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const LandingPage = ({ onLogin, onRegister }) => {
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ background: "var(--dark)", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px",
        background: scrollY > 60 ? "rgba(10,10,10,0.9)" : "transparent",
        backdropFilter: scrollY > 60 ? "blur(20px)" : "none",
        borderBottom: scrollY > 60 ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "all 0.3s",
      }}>
        <div className="bebas" style={{ fontSize: 28, color: "var(--brand)", letterSpacing: 3 }}>
          FIT<span style={{ color: "var(--text)" }}>TRACK</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="nav-link hide-mobile" onClick={() => document.getElementById("classes-section")?.scrollIntoView({ behavior: "smooth" })}>Classes</button>
          <button className="nav-link hide-mobile" onClick={() => document.getElementById("plans-section")?.scrollIntoView({ behavior: "smooth" })}>Pricing</button>
          <button className="btn-ghost btn-sm" onClick={onLogin}>Sign In</button>
          <button className="btn-brand btn-sm" onClick={onRegister}>Join Now</button>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div className="hero-parallax" style={{
          backgroundImage: `url(${GYM_IMAGES.hero})`,
          transform: `scale(1.1) translateY(${scrollY * 0.3}px)`,
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.7) 100%)" }} />

        {/* Accent blob */}
        <div style={{ position: "absolute", top: "20%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(200,241,53,0.15) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 48px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--brand)", letterSpacing: 2, textTransform: "uppercase" }}>Now Open · Lagos, Nigeria</span>
          </div>

          <h1 className="bebas" style={{ fontSize: "clamp(72px, 10vw, 140px)", lineHeight: 0.95, marginBottom: 28 }}>
            FORGE YOUR<br />
            <span style={{ color: "var(--brand)", WebkitTextStroke: "2px var(--brand)", WebkitTextFillColor: "transparent" }}>LIMITS</span><br />
            HERE.
          </h1>

          <p style={{ fontSize: 18, color: "rgba(245,245,240,0.7)", maxWidth: 480, lineHeight: 1.6, marginBottom: 40 }}>
            Premium gym memberships, elite classes, and a community that pushes you beyond what you thought possible.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button className="btn-brand" style={{ fontSize: 16, padding: "16px 40px" }} onClick={onRegister}>
              Start Free Trial →
            </button>
            <button className="btn-ghost" style={{ fontSize: 16, padding: "16px 40px" }} onClick={() => document.getElementById("classes-section")?.scrollIntoView({ behavior: "smooth" })}>
              View Classes
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 48, marginTop: 64, flexWrap: "wrap" }}>
            {[["247+", "Active Members"], ["12+", "Expert Trainers"], ["30+", "Weekly Classes"], ["5★", "Member Rating"]].map(([n, l]) => (
              <div key={l}>
                <div className="bebas" style={{ fontSize: 36, color: "var(--brand)" }}>{n}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: 0.5 }}>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Scroll</div>
          <div style={{ width: 1, height: 40, background: "var(--brand)", margin: "0 auto", animation: "pulse 2s infinite" }} />
        </div>
      </section>

      {/* CLASSES PREVIEW */}
      <section id="classes-section" style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--brand)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>What We Offer</div>
            <h2 className="bebas" style={{ fontSize: 64 }}>OUR CLASSES</h2>
          </div>
          <button className="btn-ghost hide-mobile" onClick={onLogin}>View Full Schedule →</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {[
            { name: "Yoga & Mindfulness", img: GYM_IMAGES.yoga, tag: "Beginner Friendly", color: "#8B5CF6" },
            { name: "HIIT Training", img: GYM_IMAGES.weights, tag: "High Intensity", color: "#EF4444" },
            { name: "Indoor Cycling", img: GYM_IMAGES.cycling, tag: "Cardio Burn", color: "#F59E0B" },
            { name: "CrossFit", img: GYM_IMAGES.crossfit, tag: "Advanced", color: "#3B82F6" },
            { name: "Zumba Dance", img: GYM_IMAGES.cardio, tag: "All Levels", color: "#10B981" },
            { name: "Pilates Core", img: GYM_IMAGES.gym1, tag: "Flexibility", color: "#EC4899" },
          ].map((c, i) => (
            <div key={i} className="card-hover" style={{ position: "relative", borderRadius: 20, overflow: "hidden", height: 260, cursor: "pointer" }} onClick={onLogin}>
              <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", top: 16, left: 16 }}>
                <span className="tag" style={{ background: `${c.color}22`, color: c.color, border: `1px solid ${c.color}44` }}>{c.tag}</span>
              </div>
              <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                <div className="bebas" style={{ fontSize: 24, marginBottom: 4 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Book a spot →</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 48px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
          {[
            { icon: "⚡", title: "Book Instantly", desc: "Reserve your spot in any class in seconds. No phone calls, no waiting." },
            { icon: "📊", title: "Track Progress", desc: "Monitor attendance, classes completed, and membership status in real-time." },
            { icon: "🔔", title: "Smart Reminders", desc: "Never miss a class with intelligent booking notifications." },
            { icon: "💳", title: "Flexible Plans", desc: "Monthly, quarterly, or annual plans that fit your lifestyle and budget." },
          ].map((f, i) => (
            <div key={i} style={{ ...glass, padding: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 10 }}>{f.title}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GYM PHOTO STRIP */}
      <section style={{ overflow: "hidden", padding: "80px 0" }}>
        <div style={{ display: "flex", gap: 16, padding: "0 48px" }}>
          {[GYM_IMAGES.gym2, GYM_IMAGES.boxing, GYM_IMAGES.trainer, GYM_IMAGES.weights].map((img, i) => (
            <div key={i} style={{ flex: "0 0 auto", width: i === 1 ? 500 : 300, height: 350, borderRadius: 20, overflow: "hidden" }}>
              <img src={img} alt="gym" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="plans-section" style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--brand)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Simple Pricing</div>
          <h2 className="bebas" style={{ fontSize: 64 }}>CHOOSE YOUR PLAN</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {PLANS.map((plan) => (
            <div key={plan.PlanID} className="card-hover" style={{
              ...glass,
              padding: 36,
              position: "relative",
              border: plan.popular ? "1px solid rgba(200,241,53,0.4)" : "1px solid rgba(255,255,255,0.08)",
            }}>
              {plan.popular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)" }}>
                  <span className="tag" style={{ background: "var(--brand)", color: "var(--dark)", fontWeight: 700, fontSize: 11 }}>MOST POPULAR</span>
                </div>
              )}
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{plan.PlanName}</div>
              <div className="bebas" style={{ fontSize: 52, color: plan.popular ? "var(--brand)" : "var(--text)", lineHeight: 1 }}>{fmt(plan.Price)}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>per {plan.DurationDays === 30 ? "month" : plan.DurationDays === 90 ? "quarter" : "year"}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>{plan.Description}</div>
              <div style={{ marginBottom: 32 }}>
                {[
                  `${plan.MaxBookings === 999 ? "Unlimited" : plan.MaxBookings} class bookings`,
                  "Access to all facilities",
                  plan.DurationDays >= 90 ? "Priority booking" : "Standard booking",
                  plan.DurationDays >= 365 ? "Personal trainer sessions" : null,
                ].filter(Boolean).map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: "var(--brand)", fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button className={plan.popular ? "btn-brand" : "btn-ghost"} style={{ width: "100%" }} onClick={onRegister}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${GYM_IMAGES.gym2})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
          <h2 className="bebas" style={{ fontSize: 64, marginBottom: 20 }}>READY TO START?</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>Join hundreds of members already transforming their fitness journey with FitTrack Pro.</p>
          <button className="btn-brand" style={{ fontSize: 18, padding: "18px 56px" }} onClick={onRegister}>Join FitTrack Today →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div className="bebas" style={{ fontSize: 24, color: "var(--brand)", letterSpacing: 3 }}>FIT<span style={{ color: "var(--text)" }}>TRACK</span></div>
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>© 2025 FitTrack Pro. Built on Azure SQL Database.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map(l => <span key={l} style={{ fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>{l}</span>)}
        </div>
      </footer>
    </div>
  );
};

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
const AuthModal = ({ mode, onClose, onSuccess }) => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "", gender: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isLogin = mode === "login";

  const handle = async () => {
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 800));
    if (!form.email || !form.password) { setError("Please fill all required fields."); setLoading(false); return; }
    const mockUser = { id: 1, name: form.firstName ? `${form.firstName} ${form.lastName}` : "Demo Member", email: form.email, role: form.email.includes("admin") ? "admin" : "member" };
    onSuccess(mockUser, "mock-jwt-token");
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...glassStrong, padding: 40, width: "100%", maxWidth: 420, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: "var(--text-muted)", fontSize: 24, cursor: "pointer" }}>×</button>

        <div className="bebas" style={{ fontSize: 36, marginBottom: 6 }}>{isLogin ? "WELCOME BACK" : "JOIN FITTRACK"}</div>
        <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>{isLogin ? "Sign in to your account" : "Create your membership account"}</div>

        {error && <div style={{ background: "rgba(255,68,68,0.12)", border: "1px solid rgba(255,68,68,0.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#FF8888" }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {!isLogin && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input className="input-field" placeholder="First name *" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
              <input className="input-field" placeholder="Last name *" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            </div>
          )}
          <input className="input-field" type="email" placeholder="Email address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="input-field" type="password" placeholder="Password *" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          {!isLogin && (
            <>
              <input className="input-field" placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <select className="input-field" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={{ cursor: "pointer" }}>
                <option value="">Gender (optional)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </>
          )}
        </div>

        <button className="btn-brand" style={{ width: "100%", marginTop: 24, padding: "16px", fontSize: 16, opacity: loading ? 0.7 : 1 }} onClick={handle} disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
          <span style={{ color: "var(--brand)", cursor: "pointer" }} onClick={() => onSuccess({ id: 1, name: "Demo Admin", email: "admin@fittrack.com", role: "admin" }, "mock-token")}>
            Try admin demo
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ user }) => {
  const stats = MOCK_STATS;

  const statCards = [
    { label: "Total Members", value: stats.TotalMembers, icon: "👥", color: "#C8F135", sub: "+12 this month" },
    { label: "Active Subs", value: stats.ActiveSubscriptions, icon: "✅", color: "#22C55E", sub: "76% retention rate" },
    { label: "Classes Today", value: stats.ClassesToday, icon: "🏋️", color: "#3B82F6", sub: "2 fully booked" },
    { label: "Revenue (MTD)", value: fmt(stats.RevenueThisMonth), icon: "💰", color: "#F59E0B", sub: "+18% vs last month", noNum: true },
  ];

  return (
    <div className="fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Good morning 👋</div>
        <h1 className="bebas" style={{ fontSize: 42 }}>WELCOME BACK, {user.name.split(" ")[0].toUpperCase()}</h1>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
        {statCards.map((s, i) => (
          <div key={i} className="card-hover" style={{ ...glass, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <span className="tag" style={{ background: `${s.color}18`, color: s.color, fontSize: 10 }}>LIVE</span>
            </div>
            <div style={s.noNum ? { fontSize: 26, fontWeight: 700, color: s.color, marginBottom: 4 } : {}}>
              {s.noNum ? s.value : <span className="stat-number" style={{ color: s.color }}>{s.value}</span>}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Today's classes */}
        <div style={{ ...glass, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Today's Classes</div>
            <span className="tag" style={{ background: "rgba(200,241,53,0.12)", color: "var(--brand)" }}>Live</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {MOCK_CLASSES.slice(0, 3).map((c) => (
              <div key={c.ClassID} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px", background: "rgba(255,255,255,0.04)", borderRadius: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                  <img src={CLASS_IMAGES[c.CategoryName] || GYM_IMAGES.gym1} alt={c.CategoryName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{c.ClassName}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{fmtTime(c.StartTime)} · {c.InstructorName.split(" ")[0]}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: spotsLeft(c) === 0 ? "var(--red)" : "var(--brand)" }}>
                    {spotsLeft(c) === 0 ? "FULL" : `${spotsLeft(c)} left`}
                  </div>
                  <div className="progress-bar" style={{ width: 60, marginTop: 4 }}>
                    <div className="progress-fill" style={{ width: `${(c.CurrentBookings / c.MaxCapacity) * 100}%`, background: spotsLeft(c) === 0 ? "var(--red)" : "var(--brand)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring memberships */}
        <div style={{ ...glass, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Expiring Soon</div>
            <span className="tag" style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>{stats.ExpiringSoon} members</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { name: "Adaeze Obi", plan: "Pro Quarterly", days: 2 },
              { name: "Tunde Fashola", plan: "Starter Monthly", days: 3 },
              { name: "Chioma Eze", plan: "Elite Annual", days: 5 },
              { name: "Emeka Nwosu", plan: "Starter Monthly", days: 6 },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "rgba(255,255,255,0.04)", borderRadius: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `hsl(${i * 60}, 60%, 45%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {m.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{m.plan}</div>
                </div>
                <span className="tag" style={{ background: m.days <= 2 ? "rgba(255,68,68,0.15)" : "rgba(245,158,11,0.15)", color: m.days <= 2 ? "#FF4444" : "#F59E0B", fontSize: 11 }}>
                  {m.days}d left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue chart */}
      <div style={{ ...glass, padding: 28, marginTop: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 24 }}>Monthly Revenue Overview</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
          {[
            { month: "Oct", val: 1800000 }, { month: "Nov", val: 2100000 },
            { month: "Dec", val: 2600000 }, { month: "Jan", val: 2200000 },
            { month: "Feb", val: 2500000 }, { month: "Mar", val: 2840000 },
          ].map((r, i) => {
            const max = 2840000;
            const pct = (r.val / max) * 100;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>{fmt(r.val / 1000000).replace("NGN", "₦").replace(".00", "")}M</div>
                <div style={{
                  width: "100%", height: `${pct}%`,
                  background: i === 5 ? "var(--brand)" : "rgba(200,241,53,0.25)",
                  borderRadius: "6px 6px 0 0",
                  minHeight: 8,
                  transition: "height 0.8s ease",
                }} />
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── CLASS SCHEDULE ───────────────────────────────────────────────────────────
const ClassSchedule = ({ user, onToast }) => {
  const [filter, setFilter] = useState("All");
  const [bookedIds, setBookedIds] = useState([1]);
  const categories = ["All", "Yoga", "HIIT", "Spinning", "Zumba", "CrossFit", "Pilates"];

  const filtered = filter === "All" ? MOCK_CLASSES : MOCK_CLASSES.filter(c => c.CategoryName === filter);

  const handleBook = (cls) => {
    if (bookedIds.includes(cls.ClassID)) { onToast("Already booked!", "info"); return; }
    if (spotsLeft(cls) === 0) { onToast("Class is full — you've been added to the waitlist!", "info"); return; }
    setBookedIds([...bookedIds, cls.ClassID]);
    onToast(`✓ Booked ${cls.ClassName} successfully!`, "success");
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="bebas" style={{ fontSize: 42, marginBottom: 8 }}>CLASS SCHEDULE</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Discover and book your next session</p>
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "8px 20px", borderRadius: 50, border: "none", cursor: "pointer",
            fontFamily: "DM Sans, sans-serif", fontWeight: 500, fontSize: 13, transition: "all 0.2s",
            background: filter === cat ? "var(--brand)" : "rgba(255,255,255,0.08)",
            color: filter === cat ? "var(--dark)" : "var(--text-muted)",
          }}>{cat}</button>
        ))}
      </div>

      {/* Class cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {filtered.map((cls) => {
          const isBooked = bookedIds.includes(cls.ClassID);
          const isFull = spotsLeft(cls) === 0;
          const fillPct = (cls.CurrentBookings / cls.MaxCapacity) * 100;

          return (
            <div key={cls.ClassID} className="card-hover" style={{ ...glass, overflow: "hidden" }}>
              {/* Image */}
              <div style={{ position: "relative", height: 180 }}>
                <img src={CLASS_IMAGES[cls.CategoryName] || GYM_IMAGES.gym1} alt={cls.ClassName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 8 }}>
                  <span className="tag" style={{ background: `${cls.ColorCode}22`, color: cls.ColorCode, border: `1px solid ${cls.ColorCode}44`, backdropFilter: "blur(8px)" }}>
                    {cls.CategoryName}
                  </span>
                  <span className="tag" style={{ background: `${difficultyColor[cls.Difficulty]}22`, color: difficultyColor[cls.Difficulty], backdropFilter: "blur(8px)" }}>
                    {cls.Difficulty}
                  </span>
                </div>
                {isBooked && (
                  <div style={{ position: "absolute", top: 12, right: 12 }}>
                    <span className="tag" style={{ background: "rgba(200,241,53,0.9)", color: "var(--dark)", fontWeight: 700 }}>✓ BOOKED</span>
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                  <div className="bebas" style={{ fontSize: 22 }}>{cls.ClassName}</div>
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {[
                    { icon: "🕐", label: `${fmtTime(cls.StartTime)} – ${fmtTime(cls.EndTime)}` },
                    { icon: "📍", label: cls.Room },
                    { icon: "👤", label: cls.InstructorName.split(" ")[0] },
                    { icon: "📅", label: new Date(cls.ScheduledDate).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" }) },
                  ].map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
                      <span>{d.icon}</span> {d.label}
                    </div>
                  ))}
                </div>

                {/* Capacity bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: "var(--text-muted)" }}>Capacity</span>
                    <span style={{ color: isFull ? "var(--red)" : "var(--brand)", fontWeight: 600 }}>
                      {cls.CurrentBookings}/{cls.MaxCapacity} {isFull ? "· FULL" : `· ${spotsLeft(cls)} spots left`}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${fillPct}%`, background: fillPct > 90 ? "var(--red)" : fillPct > 70 ? "#F59E0B" : "var(--brand)" }} />
                  </div>
                </div>

                <button
                  className={isBooked ? "btn-ghost" : "btn-brand"}
                  style={{ width: "100%", opacity: isBooked ? 0.7 : 1 }}
                  onClick={() => !isBooked && handleBook(cls)}
                >
                  {isBooked ? "✓ Booked" : isFull ? "Join Waitlist" : "Book Class"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── MY BOOKINGS ──────────────────────────────────────────────────────────────
const MyBookings = ({ onToast }) => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const cancel = (id) => {
    setBookings(bookings.map(b => b.BookingID === id ? { ...b, Status: "Cancelled" } : b));
    onToast("Booking cancelled successfully.", "info");
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="bebas" style={{ fontSize: 42, marginBottom: 8 }}>MY BOOKINGS</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Manage your upcoming and past class reservations</p>
      </div>

      {bookings.length === 0 ? (
        <div style={{ ...glass, padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <div className="bebas" style={{ fontSize: 28, marginBottom: 8 }}>NO BOOKINGS YET</div>
          <div style={{ color: "var(--text-muted)" }}>Head to the schedule to book your first class!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {bookings.map((b) => (
            <div key={b.BookingID} style={{ ...glass, padding: 24, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", opacity: b.Status === "Cancelled" ? 0.5 : 1 }}>
              <div style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                <img src={CLASS_IMAGES[b.CategoryName] || GYM_IMAGES.gym1} alt={b.CategoryName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{b.ClassName}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {new Date(b.ScheduledDate).toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })} · {fmtTime(b.StartTime)} – {fmtTime(b.EndTime)}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Instructor: {b.InstructorName}</div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="tag" style={{
                  background: b.Status === "Cancelled" ? "rgba(255,68,68,0.15)" : b.AttendanceStatus === "Attended" ? "rgba(34,197,94,0.15)" : "rgba(200,241,53,0.15)",
                  color: b.Status === "Cancelled" ? "#FF4444" : b.AttendanceStatus === "Attended" ? "#22C55E" : "var(--brand)",
                }}>
                  {b.Status === "Cancelled" ? "Cancelled" : b.AttendanceStatus === "Attended" ? "✓ Attended" : "Confirmed"}
                </span>
                {b.Status === "Confirmed" && (
                  <button className="btn-ghost btn-sm" style={{ color: "#FF8888", borderColor: "rgba(255,68,68,0.3)" }} onClick={() => cancel(b.BookingID)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MEMBERSHIP ───────────────────────────────────────────────────────────────
const Membership = ({ onToast }) => {
  const [selected, setSelected] = useState(null);
  const current = { plan: "Pro Quarterly", endDate: "2025-06-15", daysLeft: 88, status: "Active" };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="bebas" style={{ fontSize: 42, marginBottom: 8 }}>MEMBERSHIP</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Manage your plan and billing</p>
      </div>

      {/* Current plan */}
      <div style={{ ...glass, padding: 28, marginBottom: 32, borderColor: "rgba(200,241,53,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--brand)", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Current Plan</div>
            <div className="bebas" style={{ fontSize: 36, marginBottom: 4 }}>{current.plan}</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Expires {new Date(current.endDate).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="tag" style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E", fontSize: 13, marginBottom: 8, display: "inline-block" }}>● Active</span>
            <div className="bebas" style={{ fontSize: 48, color: "var(--brand)", lineHeight: 1 }}>{current.daysLeft}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>days remaining</div>
          </div>
        </div>
        <div className="progress-bar" style={{ marginTop: 20 }}>
          <div className="progress-fill" style={{ width: `${(current.daysLeft / 90) * 100}%`, background: "var(--brand)" }} />
        </div>
      </div>

      {/* Plan selector */}
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 20 }}>Upgrade or Renew Your Plan</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {PLANS.map((plan) => (
          <div key={plan.PlanID} onClick={() => setSelected(plan.PlanID)} className="card-hover" style={{
            ...glass,
            padding: 28,
            cursor: "pointer",
            border: selected === plan.PlanID ? "1px solid rgba(200,241,53,0.6)" : plan.popular ? "1px solid rgba(200,241,53,0.2)" : "1px solid rgba(255,255,255,0.08)",
            position: "relative",
            transition: "all 0.2s",
          }}>
            {plan.popular && <div style={{ position: "absolute", top: -10, left: 20 }}><span className="tag" style={{ background: "var(--brand)", color: "var(--dark)", fontWeight: 700, fontSize: 10 }}>BEST VALUE</span></div>}
            {selected === plan.PlanID && <div style={{ position: "absolute", top: 16, right: 16, color: "var(--brand)", fontWeight: 700 }}>✓</div>}
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{plan.PlanName}</div>
            <div className="bebas" style={{ fontSize: 40, color: "var(--brand)", lineHeight: 1.1 }}>{fmt(plan.Price)}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
              / {plan.DurationDays === 30 ? "month" : plan.DurationDays === 90 ? "quarter" : "year"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{plan.Description}</div>
          </div>
        ))}
      </div>

      {selected && (
        <button className="btn-brand" style={{ marginTop: 24, padding: "16px 48px", fontSize: 16 }}
          onClick={() => { onToast("🎉 Plan updated successfully!", "success"); setSelected(null); }}>
          Confirm Plan — {fmt(PLANS.find(p => p.PlanID === selected)?.Price)} →
        </button>
      )}
    </div>
  );
};

// ─── MEMBERS TABLE (Admin) ────────────────────────────────────────────────────
const MembersTable = () => {
  const members = [
    { id: 1, name: "Adaeze Obi", email: "adaeze@example.com", plan: "Pro Quarterly", status: "Active", joined: "Jan 2025", daysLeft: 12 },
    { id: 2, name: "Tunde Fashola", email: "tunde@example.com", plan: "Starter Monthly", status: "Active", joined: "Feb 2025", daysLeft: 3 },
    { id: 3, name: "Chioma Eze", email: "chioma@example.com", plan: "Elite Annual", status: "Active", joined: "Mar 2024", daysLeft: 340 },
    { id: 4, name: "Emeka Nwosu", email: "emeka@example.com", plan: "Starter Monthly", status: "Expired", joined: "Jan 2025", daysLeft: 0 },
    { id: 5, name: "Amaka Ibe", email: "amaka@example.com", plan: "Pro Quarterly", status: "Active", joined: "Feb 2025", daysLeft: 55 },
    { id: 6, name: "Kelechi Obi", email: "kelechi@example.com", plan: "Elite Annual", status: "Active", joined: "Dec 2024", daysLeft: 280 },
  ];
  const [search, setSearch] = useState("");
  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="bebas" style={{ fontSize: 42, marginBottom: 8 }}>MEMBERS</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Manage all gym members</p>
        </div>
        <input className="input-field" placeholder="🔍  Search members..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
      </div>

      <div style={{ ...glass, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["Member", "Plan", "Status", "Days Left", "Joined", "Action"].map(h => (
                  <th key={h} style={{ padding: "16px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: `hsl(${i * 60}, 60%, 40%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13 }}>{m.plan}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span className="tag" style={{ background: m.status === "Active" ? "rgba(34,197,94,0.15)" : "rgba(255,68,68,0.15)", color: m.status === "Active" ? "#22C55E" : "#FF4444" }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: m.daysLeft <= 7 ? "#F59E0B" : "var(--text)" }}>
                    {m.daysLeft === 0 ? "Expired" : `${m.daysLeft} days`}
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--text-muted)" }}>{m.joined}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <button className="btn-ghost btn-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ user, page, setPage, onLogout }) => {
  const isAdmin = user.role === "admin";
  const memberNav = [
    { id: "dashboard", label: "Dashboard", icon: "⬛" },
    { id: "schedule", label: "Class Schedule", icon: "📅" },
    { id: "bookings", label: "My Bookings", icon: "✅" },
    { id: "membership", label: "Membership", icon: "💳" },
  ];
  const adminNav = [
    { id: "dashboard", label: "Dashboard", icon: "⬛" },
    { id: "schedule", label: "Class Schedule", icon: "📅" },
    { id: "members", label: "Members", icon: "👥" },
    { id: "membership", label: "Plans", icon: "💳" },
  ];
  const nav = isAdmin ? adminNav : memberNav;

  return (
    <div style={{
      width: 240, flexShrink: 0, height: "100vh", position: "sticky", top: 0,
      background: "rgba(255,255,255,0.03)",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex", flexDirection: "column", padding: "24px 16px",
      overflowY: "auto",
    }}>
      {/* Logo */}
      <div className="bebas" style={{ fontSize: 26, color: "var(--brand)", letterSpacing: 3, padding: "8px 8px 32px" }}>
        FIT<span style={{ color: "var(--text)" }}>TRACK</span>
        <span style={{ fontSize: 10, display: "block", color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif", fontWeight: 400, letterSpacing: 0, marginTop: -4 }}>PRO</span>
      </div>

      {/* Nav */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 2, textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>Navigation</div>
        {nav.map(item => (
          <button key={item.id} className={`sidebar-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
            {page === item.id && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "var(--brand)" }} />}
          </button>
        ))}
      </div>

      {/* User card */}
      <div style={{ ...glass, padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--brand), #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "var(--dark)", flexShrink: 0 }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>{user.role}</div>
          </div>
        </div>
        <button className="btn-ghost" style={{ width: "100%", padding: "8px", fontSize: 13, color: "rgba(255,100,100,0.8)", borderColor: "rgba(255,100,100,0.2)" }} onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const AppShell = ({ user, onLogout }) => {
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard user={user} />;
      case "schedule": return <ClassSchedule user={user} onToast={showToast} />;
      case "bookings": return <MyBookings onToast={showToast} />;
      case "membership": return <Membership onToast={showToast} />;
      case "members": return <MembersTable />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--dark)" }}>
      <Sidebar user={user} page={page} setPage={setPage} onLogout={onLogout} />

      {/* Main content */}
      <div style={{ flex: 1, overflowX: "hidden" }}>
        {/* Top bar */}
        <div style={{ padding: "20px 36px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(10,10,10,0.8)", backdropFilter: "blur(20px)", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Azure SQL · Connected</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <button className="btn-ghost btn-sm" style={{ fontSize: 12 }}>🔔</button>
          </div>
        </div>

        <div style={{ padding: "36px" }}>
          {renderPage()}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing");   // landing | login | register | app
  const [user, setUser] = useState(null);

  const handleSuccess = (userData, token) => {
    setUser(userData);
    setView("app");
  };

  if (view === "app" && user) {
    return (
      <>
        <GlobalStyles />
        <AppShell user={user} onLogout={() => { setUser(null); setView("landing"); }} />
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <LandingPage onLogin={() => setView("login")} onRegister={() => setView("register")} />
      {(view === "login" || view === "register") && (
        <AuthModal mode={view === "login" ? "login" : "register"} onClose={() => setView("landing")} onSuccess={handleSuccess} />
      )}
    </>
  );
}
