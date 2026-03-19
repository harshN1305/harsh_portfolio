import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=JetBrains+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --accent: #00e5ff;
    --accent2: #7b2fff;
    --accent3: #ff3d71;
    --text: #e8e8f0;
    --text-muted: #6b6b80;
    --border: rgba(255,255,255,0.06);
    --glow: 0 0 40px rgba(0,229,255,0.15);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    line-height: 1.6;
  }

  /* Noise overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent2); border-radius: 2px; }

  /* NAV */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 1.2rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    backdrop-filter: blur(20px);
    background: rgba(10,10,15,0.8);
    border-bottom: 1px solid var(--border);
    transition: all 0.3s;
  }

  .nav-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    letter-spacing: 0.1em;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
  }

  .nav-links a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.2s;
    position: relative;
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0; right: 0;
    height: 1px;
    background: var(--accent);
    transform: scaleX(0);
    transition: transform 0.2s;
  }

  .nav-links a:hover { color: var(--accent); }
  .nav-links a:hover::after { transform: scaleX(1); }

  .nav-cta {
    padding: 0.5rem 1.2rem;
    border: 1px solid var(--accent);
    border-radius: 4px;
    color: var(--accent) !important;
    font-size: 0.8rem !important;
    letter-spacing: 0.1em;
    transition: all 0.2s !important;
  }

  .nav-cta:hover {
    background: var(--accent) !important;
    color: var(--bg) !important;
  }

  .nav-cta::after { display: none !important; }

  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 4px;
  }

  .hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--text);
    transition: all 0.3s;
  }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 8rem 2rem 4rem;
    position: relative;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    animation: pulse 8s ease-in-out infinite;
  }

  .orb1 { width: 600px; height: 600px; background: var(--accent2); top: -200px; right: -100px; }
  .orb2 { width: 400px; height: 400px; background: var(--accent); bottom: -100px; left: -50px; animation-delay: 3s; }
  .orb3 { width: 300px; height: 300px; background: var(--accent3); top: 50%; left: 40%; animation-delay: 5s; }

  @keyframes pulse {
    0%, 100% { transform: scale(1) translateY(0); opacity: 0.15; }
    50% { transform: scale(1.1) translateY(-20px); opacity: 0.25; }
  }

  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .hero-content {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0.8rem;
    border: 1px solid rgba(0,229,255,0.3);
    border-radius: 100px;
    font-size: 0.75rem;
    font-family: 'JetBrains Mono', monospace;
    color: var(--accent);
    background: rgba(0,229,255,0.05);
    margin-bottom: 1.5rem;
    letter-spacing: 0.05em;
  }

  .hero-tag::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }

  .hero-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 8vw, 7rem);
    line-height: 0.95;
    letter-spacing: 0.02em;
    margin-bottom: 0.5rem;
  }

  .hero-name .line1 { display: block; color: var(--text); }
  .hero-name .line2 {
    display: block;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-role {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .hero-role span { color: var(--accent3); }

  .hero-desc {
    font-size: 1.05rem;
    color: var(--text-muted);
    max-width: 480px;
    line-height: 1.8;
    margin-bottom: 2.5rem;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-primary {
    padding: 0.8rem 2rem;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 20px rgba(0,229,255,0.2);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,229,255,0.35);
  }

  .btn-outline {
    padding: 0.8rem 2rem;
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-outline:hover {
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-2px);
  }

  /* Hero visual side */
  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .code-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    line-height: 1.8;
    width: 100%;
    max-width: 420px;
    box-shadow: var(--glow), 0 20px 60px rgba(0,0,0,0.5);
    position: relative;
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }

  .code-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border);
  }

  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .dot-r { background: #ff5f56; }
  .dot-y { background: #ffbd2e; }
  .dot-g { background: #27c93f; }

  .code-file {
    margin-left: auto;
    color: var(--text-muted);
    font-size: 0.7rem;
  }

  .c-keyword { color: #c792ea; }
  .c-func { color: #82aaff; }
  .c-str { color: #c3e88d; }
  .c-comment { color: #546e7a; font-style: italic; }
  .c-var { color: var(--accent); }
  .c-num { color: #f78c6c; }

  .floating-badge {
    position: absolute;
    padding: 0.5rem 0.9rem;
    border-radius: 8px;
    font-size: 0.72rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    border: 1px solid var(--border);
    backdrop-filter: blur(10px);
    animation: float 6s ease-in-out infinite;
  }

  .badge1 {
    background: rgba(123,47,255,0.15);
    border-color: rgba(123,47,255,0.3);
    color: #c792ea;
    top: -20px; left: -30px;
    animation-delay: 1s;
  }

  .badge2 {
    background: rgba(0,229,255,0.1);
    border-color: rgba(0,229,255,0.25);
    color: var(--accent);
    bottom: 30px; right: -40px;
    animation-delay: 3s;
  }

  .badge3 {
    background: rgba(255,61,113,0.1);
    border-color: rgba(255,61,113,0.25);
    color: var(--accent3);
    bottom: -20px; left: 20px;
    animation-delay: 2s;
  }

  /* SECTION */
  .section {
    padding: 6rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .section-label::before {
    content: '//';
    color: var(--accent2);
  }

  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    letter-spacing: 0.03em;
    color: var(--text);
    margin-bottom: 1rem;
  }

  .section-title em {
    font-style: normal;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: var(--border);
    margin: 0;
  }

  /* SKILLS */
  .skills-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 3rem;
  }

  .skill-group {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }

  .skill-group::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    transition: opacity 0.3s;
    opacity: 0;
  }

  .skill-group:nth-child(1)::before { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
  .skill-group:nth-child(2)::before { background: linear-gradient(90deg, var(--accent2), var(--accent3)); }
  .skill-group:nth-child(3)::before { background: linear-gradient(90deg, var(--accent3), var(--accent)); }
  .skill-group:nth-child(4)::before { background: linear-gradient(90deg, var(--accent), var(--accent3)); }

  .skill-group:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-4px); }
  .skill-group:hover::before { opacity: 1; }

  .skill-group-title {
    font-size: 0.72rem;
    font-family: 'JetBrains Mono', monospace;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .skill-tag {
    padding: 0.3rem 0.7rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 0.78rem;
    font-family: 'JetBrains Mono', monospace;
    color: var(--text);
    transition: all 0.2s;
  }

  .skill-tag:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(0,229,255,0.05);
  }

  /* PROJECTS */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-top: 3rem;
  }

  .project-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem;
    transition: all 0.35s;
    cursor: default;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .project-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,229,255,0.05) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .project-card:hover::after { opacity: 1; }
  .project-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.4); }

  .project-number {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3.5rem;
    line-height: 1;
    color: rgba(255,255,255,0.04);
    position: absolute;
    top: 1rem; right: 1.5rem;
    letter-spacing: 0.05em;
  }

  .project-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
  }

  .project-card:nth-child(1) .project-icon { background: rgba(0,229,255,0.1); }
  .project-card:nth-child(2) .project-icon { background: rgba(123,47,255,0.12); }
  .project-card:nth-child(3) .project-icon { background: rgba(255,61,113,0.1); }
  .project-card:nth-child(4) .project-icon { background: rgba(39,201,63,0.1); }

  .project-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.6rem;
  }

  .project-desc {
    font-size: 0.875rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 1.2rem;
    flex: 1;
  }

  .project-features {
    list-style: none;
    margin-bottom: 1.5rem;
  }

  .project-features li {
    font-size: 0.8rem;
    color: var(--text-muted);
    padding: 0.2rem 0;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    line-height: 1.5;
  }

  .project-features li::before {
    content: '→';
    color: var(--accent);
    flex-shrink: 0;
    margin-top: 1px;
  }

  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: auto;
  }

  .tech-badge {
    padding: 0.2rem 0.55rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 3px;
    font-size: 0.7rem;
    font-family: 'JetBrains Mono', monospace;
    color: var(--text-muted);
  }

  /* ABOUT */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    margin-top: 3rem;
  }

  .about-text p {
    color: var(--text-muted);
    font-size: 1rem;
    line-height: 1.9;
    margin-bottom: 1rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s;
  }

  .stat-card:hover { border-color: var(--accent); transform: translateY(-3px); }

  .stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.5rem;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.05em;
  }

  .stat-label {
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
    letter-spacing: 0.05em;
  }

  /* CONTACT */
  .contact-section {
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 6rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .contact-section::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(123,47,255,0.1) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    pointer-events: none;
  }

  .contact-inner {
    max-width: 700px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .contact-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6vw, 5rem);
    letter-spacing: 0.04em;
    margin-bottom: 1rem;
    line-height: 1;
  }

  .contact-heading span {
    display: block;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .contact-sub {
    color: var(--text-muted);
    font-size: 1rem;
    margin-bottom: 2.5rem;
    line-height: 1.7;
  }

  .contact-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .contact-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.82rem;
    font-family: 'JetBrains Mono', monospace;
    color: var(--text-muted);
    text-decoration: none;
    transition: all 0.2s;
  }

  .contact-link:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  /* FOOTER */
  .footer {
    padding: 2rem;
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-muted);
    font-family: 'JetBrains Mono', monospace;
    border-top: 1px solid var(--border);
  }

  .footer span { color: var(--accent3); }

  /* MOBILE MENU */
  .mobile-menu {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(10,10,15,0.97);
    backdrop-filter: blur(20px);
    z-index: 200;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .mobile-menu.open { transform: translateX(0); }

  .mobile-menu a {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3rem;
    letter-spacing: 0.1em;
    color: var(--text);
    text-decoration: none;
    transition: color 0.2s;
  }

  .mobile-menu a:hover { color: var(--accent); }

  .mobile-close {
    position: absolute;
    top: 1.5rem; right: 2rem;
    background: none;
    border: none;
    color: var(--text);
    font-size: 1.5rem;
    cursor: pointer;
  }

  /* ANIMATIONS */
  .fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .hero-content { grid-template-columns: 1fr; text-align: center; gap: 3rem; }
    .hero-desc { margin: 0 auto 2.5rem; }
    .hero-actions { justify-content: center; }
    .hero-tag { margin: 0 auto 1.5rem; }
    .hero-visual { order: -1; }
    .code-card { max-width: 340px; }
    .about-grid { grid-template-columns: 1fr; gap: 2rem; }
    .projects-grid { grid-template-columns: 1fr; }
    .contact-links { flex-direction: column; align-items: center; }
    .floating-badge { display: none; }
    .hero-name { font-size: clamp(3rem, 12vw, 5rem); }
    .section-title { font-size: clamp(2rem, 8vw, 3rem); }
  }
`;

const projects = [
  {
    icon: "🎓",
    title: "Learning Management System",
    desc: "A fully responsive LMS built with React.js and Firebase, designed to deliver educational content at scale.",
    features: [
      "Course enrollment & progress tracking",
      "Interactive quizzes & assessments",
      "Real-time data sync with Firebase",
    ],
    tech: ["React.js", "JavaScript", "Firebase", "HTML", "CSS"],
  },
  {
    icon: "🤖",
    title: "ChatAI",
    desc: "An AI-powered chat application with real-time messaging capabilities and intelligent response generation.",
    features: [
      "Real-time messaging infrastructure",
      "User authentication system",
      "AI API integration for smart responses",
    ],
    tech: ["React.js", "JavaScript", "REST API", "HTML", "CSS"],
  },
  {
    icon: "💸",
    title: "Expensso",
    desc: "A company expense management dashboard with data visualization and financial reporting features.",
    features: [
      "Add & track company expenses",
      "Generate detailed financial reports",
      "Visual data analytics & charts",
    ],
    tech: ["React.js", "JavaScript", "HTML", "CSS"],
  },
  {
    icon: "🛒",
    title: "E-Commerce Platform",
    desc: "A full-stack online shopping platform with complete product management, cart, and order systems.",
    features: [
      "JWT-based auth & authorization",
      "Product listing with category filtering",
      "Shopping cart & order management",
      "REST API with Node.js & Express.js",
    ],
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript"],
  },
];

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <style>{styles}</style>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        {["about", "skills", "projects", "contact"].map((s) => (
          <a key={s} onClick={() => scrollTo(s)} style={{ cursor: "pointer" }}>
            {s.toUpperCase()}
          </a>
        ))}
      </div>

      {/* NAV */}
      <nav className="nav" style={{ borderColor: scrolled ? "rgba(255,255,255,0.08)" : "transparent" }}>
        <div className="nav-logo">HN</div>
        <ul className="nav-links">
          {["about", "skills", "projects"].map((s) => (
            <li key={s}>
              <a onClick={() => scrollTo(s)} style={{ cursor: "pointer" }}>
                {s}
              </a>
            </li>
          ))}
          <li>
            <a onClick={() => scrollTo("contact")} className="nav-cta" style={{ cursor: "pointer" }}>
              Contact
            </a>
          </li>
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(true)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <div className="hero-orb orb1" />
          <div className="hero-orb orb2" />
          <div className="hero-orb orb3" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-tag">Available for opportunities</div>
            <h1 className="hero-name">
              <span className="line1">HARSH</span>
              <span className="line2">NAVADIYA</span>
            </h1>
            <p className="hero-role">
              <span>{"<"}</span>Full-Stack Developer<span>{" />"}</span>
            </p>
            <p className="hero-desc">
              Building robust, scalable web applications with modern technologies. 
              Passionate about clean code, great UX, and end-to-end solutions.
            </p>
            <div className="hero-actions">
              <a href="mailto:harshnavadiya123@gmail.com" className="btn-primary">
                ✉ Get In Touch
              </a>
              <a onClick={() => scrollTo("projects")} className="btn-outline" style={{ cursor: "pointer" }}>
                View Projects →
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-badge badge1">⚡ React.js</div>
            <div className="code-card">
              <div className="code-header">
                <div className="dot dot-r" />
                <div className="dot dot-y" />
                <div className="dot dot-g" />
                <span className="code-file">developer.js</span>
              </div>
              <div>
                <span className="c-keyword">const </span>
                <span className="c-var">developer</span> = {"{"}
                <br />
                &nbsp;&nbsp;<span className="c-str">"name"</span>:{" "}
                <span className="c-str">"Harsh Navadiya"</span>,
                <br />
                &nbsp;&nbsp;<span className="c-str">"role"</span>:{" "}
                <span className="c-str">"Full-Stack Dev"</span>,
                <br />
                &nbsp;&nbsp;<span className="c-str">"stack"</span>: [
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="c-str">"React"</span>,{" "}
                <span className="c-str">"Node.js"</span>,
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="c-str">"MongoDB"</span>,{" "}
                <span className="c-str">"Express"</span>
                <br />
                &nbsp;&nbsp;],
                <br />
                &nbsp;&nbsp;<span className="c-str">"location"</span>:{" "}
                <span className="c-str">"Surat, India"</span>,
                <br />
                &nbsp;&nbsp;<span className="c-str">"openToWork"</span>:{" "}
                <span className="c-keyword">true</span>
                <br />
                {"}"};
                <br />
                <br />
                <span className="c-comment">// Always learning, always building</span>
                <br />
                <span className="c-func">buildSomethingAmazing</span>(developer);
              </div>
            </div>
            <div className="floating-badge badge2">🍃 MongoDB</div>
            <div className="floating-badge badge3">🚀 Node.js</div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ABOUT */}
      <section id="about">
        <div className="section">
          <div className="section-label fade-in">about me</div>
          <h2 className="section-title fade-in">THE DEVELOPER <em>BEHIND THE CODE</em></h2>

          <div className="about-grid">
            <div className="about-text fade-in">
              <p>
                I'm a Full-Stack Developer based in Surat, India, with a BE in Computer Science from Mahatma Gandhi Institute of Technical Education. I specialize in building end-to-end web applications using the MERN stack.
              </p>
              <p>
                My approach to development is rooted in problem-solving and attention to detail — I enjoy crafting experiences that are both technically sound and visually compelling. From RESTful APIs to responsive UIs, I handle it all.
              </p>
              <p>
                I thrive in environments that encourage initiative and growth, where I can contribute meaningfully to the team's vision while continuing to evolve as a developer.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                {["Problem-Solving", "Attention to Detail", "Communication", "Team Leadership", "Quick Learner"].map(s => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>

            <div className="stats-grid fade-in">
              {[
                { num: "4+", label: "Projects Built" },
                { num: "MERN", label: "Core Stack" },
                { num: "6+", label: "Technologies" },
                { num: "∞", label: "Drive to Learn" },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* SKILLS */}
      <section id="skills">
        <div className="section">
          <div className="section-label fade-in">tech stack</div>
          <h2 className="section-title fade-in">TOOLS & <em>TECHNOLOGIES</em></h2>

          <div className="skills-wrapper">
            {[
              {
                title: "Frontend",
                tags: ["HTML5", "CSS3", "JavaScript (ES6+)", "React.js", "Tailwind CSS"],
              },
              {
                title: "Backend & Database",
                tags: ["Node.js", "Express.js", "MongoDB", "REST APIs", "JWT Auth"],
              },
              {
                title: "Tools & Build",
                tags: ["NPM", "Vite", "Webpack", "GitHub", "Firebase"],
              },
              {
                title: "Deployment",
                tags: ["Netlify", "Firebase Hosting", "Git", "Version Control"],
              },
            ].map((group) => (
              <div key={group.title} className="skill-group fade-in">
                <div className="skill-group-title">{group.title}</div>
                <div className="skill-tags">
                  {group.tags.map((t) => (
                    <span key={t} className="skill-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* PROJECTS */}
      <section id="projects">
        <div className="section">
          <div className="section-label fade-in">portfolio</div>
          <h2 className="section-title fade-in">FEATURED <em>PROJECTS</em></h2>

          <div className="projects-grid">
            {projects.map((p, i) => (
              <div key={p.title} className="project-card fade-in">
                <div className="project-number">0{i + 1}</div>
                <div className="project-icon">{p.icon}</div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
                <ul className="project-features">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="project-tech">
                  {p.tech.map((t) => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="contact-inner">
          <div className="section-label fade-in" style={{ justifyContent: "center" }}>get in touch</div>
          <div className="contact-heading fade-in">
            LET'S BUILD
            <span>SOMETHING GREAT</span>
          </div>
          <p className="contact-sub fade-in">
            Open to new roles, freelance projects, and exciting collaborations. 
            If you have an idea or opportunity, let's talk.
          </p>
          <a href="mailto:harshnavadiya123@gmail.com" className="btn-primary fade-in" style={{ margin: "0 auto", display: "inline-flex" }}>
            ✉ harshnavadiya123@gmail.com
          </a>
          <div className="contact-links fade-in">
            <a href="tel:8866603884" className="contact-link">
              📞 +91 8866603884
            </a>
            <a href="https://www.linkedin.com/in/harsh-navadiya-63749630b/" target="_blank" rel="noreferrer" className="contact-link">
              💼 LinkedIn
            </a>
            <a href="https://github.com/harshN1305" target="_blank" rel="noreferrer" className="contact-link">
              🐙 GitHub
            </a>
            <span className="contact-link">
              📍 Surat, India
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>Designed & Built by <span>Harsh Navadiya</span> · {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}
