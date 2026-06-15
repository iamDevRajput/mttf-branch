import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── Asset imports — filenames matched exactly to your file tree ──
import brainLogo from '../assets/home/brain-logo.png';
import mttfLogo from '../assets/home/mttf-logo.png';
import communityImg from '../assets/home/community.jpg';
import g1Img from '../assets/home/g1.jpeg';
import g2Img from '../assets/home/g2.jpeg';
import g3Img from '../assets/home/g3.jpeg';

import adityaCollege from '../assets/home/aditya-college.webp';
import appwars from '../assets/home/appwars.webp';
import cpuLogo from '../assets/home/CPU.webp';
import ctUniversity from '../assets/home/ct-university.webp';
import dasmeshCollege from '../assets/home/dasmesh-girls-college.webp';
import pinaki from '../assets/home/pinaki.webp';
import poornima from '../assets/home/poornima.png';
import puLogo from '../assets/home/PU.webp';
import shardhaUniversity from '../assets/home/shardhaUniversityUzbekistan.webp';
import synaptic from '../assets/home/synaptic.webp';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  :root {
    --mttf-primary: #2563eb;
    --mttf-primary-light: #60a5fa;
    --mttf-accent: #3b82f6;
    --mttf-accent-light: #93c5fd;
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-500: #64748b;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-900: #0f172a;
    --slate-950: #0b0f19;
    --divider: #f1f5f9;
  }

  .lux-section-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--mttf-primary);
    margin-bottom: 16px;
    background: rgba(37, 99, 235, 0.06);
    padding: 6px 14px;
    border-radius: 9999px;
    border: 1px solid rgba(37, 99, 235, 0.1);
  }

  .lux-section-eyebrow-line {
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--mttf-primary);
    opacity: 0.8;
  }

  .lux-serif-heading {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800;
    line-height: 1.2;
    color: var(--slate-900);
    letter-spacing: -0.02em;
  }

  .lux-serif-heading em {
    font-style: normal;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
  }

  .lux-body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 400;
    color: var(--slate-500);
    line-height: 1.625;
  }

  .lux-gold-rule {
    width: 48px;
    height: 3px;
    background: linear-gradient(90deg, var(--mttf-primary), var(--mttf-accent));
    border-radius: 9999px;
    margin: 16px 0;
  }

  /* ── Welcome ── */
  .lux-welcome {
    background: var(--slate-50);
    padding: 96px 24px;
    position: relative;
    overflow: hidden;
  }

  .lux-welcome-deco {
    display: none;
  }

  .lux-welcome-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 64px;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .lux-welcome-heading { font-size: clamp(36px, 5vw, 56px); }

  .lux-welcome-card {
    border: 1px solid var(--slate-100);
    background: #ffffff;
    padding: 24px 28px;
    margin: 24px 0;
    position: relative;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  }

  .lux-welcome-card::before {
    content: '';
    position: absolute;
    top: 12px; left: 0;
    width: 4px; height: calc(100% - 24px);
    background: linear-gradient(to bottom, var(--mttf-primary), var(--mttf-accent));
    border-radius: 0 4px 4px 0;
  }

  .lux-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    background: var(--slate-900);
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
  }

  .lux-btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .lux-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
    color: #ffffff;
  }
  .lux-btn-primary:hover::before { opacity: 1; }
  .lux-btn-primary span, .lux-btn-primary svg { position: relative; z-index: 1; }
  .lux-btn-primary svg { transition: transform 0.2s ease; }
  .lux-btn-primary:hover svg { transform: translateX(3px); }

  .lux-welcome-panel {
    border: 1px solid var(--slate-100);
    background: #ffffff;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    position: relative;
    min-height: 400px;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  }

  .lux-welcome-panel::after, .lux-welcome-panel::before {
    display: none;
  }

  .lux-welcome-community-img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
    border-radius: 16px;
    border: 1px solid var(--slate-100);
  }

  .lux-icon-ring {
    width: 96px; height: 96px;
    border: 1px solid var(--slate-100);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: var(--slate-50);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  }

  .lux-icon-ring::before {
    display: none;
  }

  .lux-icon-ring img {
    width: 56px; height: 56px;
    object-fit: contain;
  }

  .lux-badge-pill {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--mttf-primary);
    border: 1px solid rgba(37, 99, 235, 0.15);
    padding: 6px 16px;
    background: rgba(37, 99, 235, 0.04);
    border-radius: 9999px;
  }

  /* ── Services ── */
  .lux-services {
    background: #ffffff;
    padding: 96px 24px;
  }

  .lux-services-inner { max-width: 1200px; margin: 0 auto; }

  .lux-services-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 56px;
    gap: 40px;
  }

  .lux-services-heading { font-size: clamp(32px, 4.5vw, 48px); }

  .lux-services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    background: transparent;
    border: none;
  }

  .lux-service-card {
    background: #ffffff;
    border: 1px solid var(--slate-100);
    border-radius: 20px;
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: default;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);
  }

  .lux-service-card::after {
    display: none;
  }

  .lux-service-card:hover {
    background: #ffffff;
    border-color: rgba(37, 99, 235, 0.25);
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.06);
  }

  .lux-service-num {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: var(--mttf-primary-light);
    opacity: 0.6;
    position: absolute;
    top: 24px; right: 28px;
  }

  .lux-service-icon {
    width: 52px; height: 52px;
    border-radius: 12px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(37, 99, 235, 0.05);
    transition: all 0.3s ease;
  }

  .lux-service-card:hover .lux-service-icon {
    background: rgba(37, 99, 235, 0.12);
    transform: scale(1.05);
  }

  .lux-service-icon svg { width: 28px; height: 28px; }

  .lux-service-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--slate-900);
    letter-spacing: -0.01em;
  }

  .lux-service-subtitle {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--mttf-primary-light);
  }

  .lux-service-desc {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: var(--slate-500);
    line-height: 1.6;
  }

  .lux-service-more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--mttf-primary);
    margin-top: auto;
    opacity: 0;
    transform: translateY(6px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .lux-service-card:hover .lux-service-more { opacity: 1; transform: translateY(0); }

  /* ── Partners ── */
  .lux-partners {
    background: #0b1329;
    padding: 96px 24px;
    position: relative;
    overflow: hidden;
  }

  .lux-partners::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.2), transparent);
  }

  .lux-partners-inner { max-width: 1200px; margin: 0 auto; }

  .lux-partners-top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
    margin-bottom: 72px;
  }

  .lux-partners-heading {
    font-size: clamp(30px, 4vw, 44px);
    color: #ffffff;
  }

  .lux-partners-heading em {
    font-style: normal;
    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .lux-partners-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: #94a3b8;
    line-height: 1.625;
    margin-bottom: 24px;
  }

  .lux-btn-outline-gold {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    background: transparent;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .lux-btn-outline-gold:hover {
    background: #ffffff;
    border-color: #ffffff;
    color: var(--slate-950);
    transform: translateY(-2px);
  }

  .lux-partners-right-label {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 20px;
  }

  .lux-partner-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    background: transparent;
    border: none;
  }

  .lux-partner-item {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    gap: 12px;
    min-height: 120px;
  }

  .lux-partner-item:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(37, 99, 235, 0.3);
    transform: translateY(-3px);
  }

  .lux-partner-photo {
    width: 48px; height: 48px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    object-fit: contain;
    background: #ffffff;
    display: block;
    padding: 4px;
    transition: all 0.3s ease;
  }

  .lux-partner-item:hover .lux-partner-photo {
    border-color: var(--mttf-primary-light);
    transform: scale(1.05);
  }

  .lux-partner-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
    transition: color 0.3s ease;
  }

  .lux-partner-item:hover .lux-partner-name { color: #ffffff; }

  .lux-brand-strip {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 56px;
    margin-top: 24px;
  }

  .lux-brand-strip-label {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
    margin-bottom: 24px;
    text-align: center;
  }

  .lux-brand-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    background: transparent;
    border: none;
  }

  .lux-brand-item {
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    text-align: center;
  }

  .lux-brand-item:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .lux-brand-item img {
    width: 40px; height: 40px;
    object-fit: contain;
    opacity: 0.4;
    transition: opacity 0.3s ease;
    background: #ffffff;
    border-radius: 8px;
    padding: 3px;
    display: block;
  }

  .lux-brand-item:hover img { opacity: 1; }

  /* ── Glimpses ── */
  .lux-glimpses {
    background: var(--slate-50);
    padding: 96px 24px;
  }

  .lux-glimpses-inner { max-width: 1200px; margin: 0 auto; }

  .lux-glimpses-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 48px;
    gap: 32px;
  }

  .lux-glimpses-heading { font-size: clamp(30px, 4vw, 44px); }

  .lux-glimpse-slide {
    border: 1px solid var(--slate-100);
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  }

  .lux-glimpse-track {
    display: flex;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .lux-glimpse-frame {
    min-width: 100%;
    height: 460px;
    position: relative;
    overflow: hidden;
  }

  .lux-glimpse-frame img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.8s ease;
  }

  .lux-glimpse-slide:hover .lux-glimpse-frame img {
    transform: scale(1.03);
  }

  .lux-glimpse-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0) 60%);
    z-index: 1;
  }

  .lux-glimpse-label {
    position: absolute;
    bottom: 40px;
    left: 48px;
    z-index: 2;
  }

  .lux-glimpse-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.01em;
    display: block;
    margin-bottom: 6px;
  }

  .lux-glimpse-sub {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--mttf-primary-light);
  }

  .lux-slider-nav { display: flex; align-items: center; gap: 8px; }

  .lux-arrow-btn {
    width: 44px; height: 44px;
    border: 1px solid var(--slate-200);
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    color: var(--slate-700);
    transition: all 0.25s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }

  .lux-arrow-btn:hover {
    background: var(--slate-900);
    border-color: var(--slate-900);
    color: #ffffff;
    transform: scale(1.05);
  }

  .lux-glimpse-indicators {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 24px;
  }

  .lux-glimpse-dot {
    height: 4px;
    background: rgba(15, 23, 42, 0.1);
    transition: all 0.4s ease;
    cursor: pointer;
    width: 12px;
    border: none;
    padding: 0;
    border-radius: 9999px;
  }

  .lux-glimpse-dot.active { background: var(--mttf-primary); width: 28px; }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .lux-services-grid { grid-template-columns: repeat(2, 1fr); }
    .lux-brand-grid { grid-template-columns: repeat(4, 1fr); }
  }

  @media (max-width: 768px) {
    .lux-welcome-inner { grid-template-columns: 1fr; gap: 48px; }
    .lux-services-header { flex-direction: column; align-items: flex-start; }
    .lux-services-grid { grid-template-columns: 1fr 1fr; }
    .lux-partners-top { grid-template-columns: 1fr; gap: 48px; }
    .lux-partner-grid { grid-template-columns: repeat(3, 1fr); }
    .lux-brand-grid { grid-template-columns: repeat(3, 1fr); }
    .lux-glimpses-header { flex-direction: column; align-items: flex-start; }
  }

  @media (max-width: 480px) {
    .lux-services-grid { grid-template-columns: 1fr; }
    .lux-brand-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

/* ── Inline SVG icons ── */
const AiIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8z" stroke="#5067AA" strokeWidth="1.5"/>
    <path d="M14 20c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6" stroke="#5067AA" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 17l-3-3M17 23l-3 3M23 17l3-3M23 23l3 3" stroke="#5067AA" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="20" cy="20" r="2.5" fill="#5067AA"/>
  </svg>
);

const DataAnalyticsIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="27" width="6" height="6" rx="1" fill="#27AE60"/>
    <rect x="17" y="20" width="6" height="13" rx="1" fill="#27AE60"/>
    <rect x="27" y="13" width="6" height="20" rx="1" fill="#27AE60"/>
    <path d="M8 24l9-8 10 4 8-10" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="24" r="2" fill="#27AE60"/>
    <circle cx="17" cy="16" r="2" fill="#27AE60"/>
    <circle cx="27" cy="20" r="2" fill="#27AE60"/>
    <circle cx="35" cy="10" r="2" fill="#27AE60"/>
  </svg>
);

const BioinformaticsIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 8c0 6 12 6 12 12S14 26 14 32" stroke="#8E44AD" strokeWidth="2" strokeLinecap="round"/>
    <path d="M26 8c0 6-12 6-12 12s12 6 12 12" stroke="#8E44AD" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="14" x2="28" y2="14" stroke="#8E44AD" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="10" y1="20" x2="30" y2="20" stroke="#8E44AD" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="26" x2="28" y2="26" stroke="#8E44AD" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BusinessIntelligenceIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="14" height="18" rx="2" stroke="#F39C12" strokeWidth="1.5"/>
    <path d="M14 12V9a2 2 0 012-2h8a2 2 0 012 2v3" stroke="#F39C12" strokeWidth="1.5"/>
    <path d="M22 22h8M22 26h6" stroke="#F39C12" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="27" cy="28" r="5" stroke="#F39C12" strokeWidth="1.5"/>
    <path d="M30.5 31.5l3 3" stroke="#F39C12" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="18" x2="18" y2="18" stroke="#F39C12" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="22" x2="18" y2="22" stroke="#F39C12" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const QuantumIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="3" fill="#8E44AD"/>
    <ellipse cx="20" cy="20" rx="13" ry="5" stroke="#8E44AD" strokeWidth="1.5"/>
    <ellipse cx="20" cy="20" rx="13" ry="5" stroke="#8E44AD" strokeWidth="1.5" transform="rotate(60 20 20)"/>
    <ellipse cx="20" cy="20" rx="13" ry="5" stroke="#8E44AD" strokeWidth="1.5" transform="rotate(120 20 20)"/>
    <circle cx="33" cy="20" r="2" fill="#8E44AD"/>
    <circle cx="26.5" cy="8.9" r="2" fill="#8E44AD"/>
    <circle cx="13.5" cy="8.9" r="2" fill="#8E44AD"/>
  </svg>
);

const ComputingIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="9" width="26" height="18" rx="2" stroke="#27AE60" strokeWidth="1.5"/>
    <line x1="7" y1="31" x2="33" y2="31" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="27" x2="20" y2="31" stroke="#27AE60" strokeWidth="1.5"/>
    <path d="M12 16l3 3-3 3M18 22h5" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MTTFHomepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const services = [
    { id: 1, icon: <AiIcon />, title: "Artificial Intelligence", subtitle: "AI & ML Solutions", description: "Explore AI and ML solutions, leveraging advanced algorithms to drive innovation and intelligent decision-making.", number: "01" },
    { id: 2, icon: <DataAnalyticsIcon />, title: "Data Analytics", subtitle: "Data-Driven Insights", description: "Utilize data-driven insights to make informed decisions, optimize processes, and improve business strategies.", number: "02" },
    { id: 3, icon: <BioinformaticsIcon />, title: "Bioinformatics", subtitle: "Biological Data Science", description: "Integrate biological data with computational techniques to uncover insights in healthcare, genomics, and life sciences.", number: "03" },
    { id: 4, icon: <BusinessIntelligenceIcon />, title: "Business Intelligence", subtitle: "BI Tools & Insights", description: "Enhance decision-making with BI tools, transforming raw data into actionable insights for better business strategies.", number: "04" },
    { id: 5, icon: <QuantumIcon />, title: "Quantum Computing", subtitle: "Quantum Technologies", description: "Unlock the power of quantum mechanics to solve complex problems faster and more efficiently with emerging quantum technologies.", number: "05" },
    { id: 6, icon: <ComputingIcon />, title: "Computing", subtitle: "Core Tech Skills", description: "Dive into core computing principles, from algorithms to system architecture, empowering future-ready tech skills.", number: "06" },
  ];

  const partners = [
    { name: "Aditya College",        img: adityaCollege },
    { name: "AppWars",               img: appwars },
    { name: "CPU",                   img: cpuLogo },
    { name: "CT University",         img: ctUniversity },
    { name: "Dasmesh Girls College", img: dasmeshCollege },
    { name: "Pinaki",                img: pinaki },
    { name: "Poornima",              img: poornima },
    { name: "Punjab University",     img: puLogo },
    { name: "Shardha University",    img: shardhaUniversity },
    { name: "Synaptic",              img: synaptic },
  ];

  const glimpses = [
    { id: 1, title: "Community Gathering", sub: "Annual Meetup 2024", img: g1Img },
    { id: 2, title: "Workshop 2024",       sub: "Skill Development",  img: g2Img },
    { id: 3, title: "Tech Meetup",         sub: "Innovation Hub",     img: g3Img },
  ];

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % glimpses.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + glimpses.length) % glimpses.length);

  return (
    <>
      <style>{styles}</style>

      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* ── Welcome ── */}
        <section className="lux-welcome">
          <div className="lux-welcome-deco">M</div>
          <div className="lux-welcome-inner">

            <div>
              <div className="lux-section-eyebrow">
                <span className="lux-section-eyebrow-line" />
                Welcome
                <span className="lux-section-eyebrow-line" />
              </div>
              <h1 className="lux-serif-heading lux-welcome-heading">
                Welcome to <br /><em>MTTF</em>
              </h1>
              <div className="lux-gold-rule" />
              <div className="lux-welcome-card">
                <p className="lux-body" style={{ fontSize: "15px" }}>
                  Join our vibrant community dedicated to fostering growth, innovation, and collaboration.
                  We bring together passionate individuals to create meaningful impact through technology and shared learning experiences.
                </p>
              </div>
              <button className="lux-btn-primary">
                <span>Explore More</span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1 6.5H12M7.5 2L12 6.5L7.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Right panel */}
            <div className="lux-welcome-panel">
              <div className="lux-icon-ring">
                <img src={mttfLogo} alt="MTTF Logo" />
              </div>
              <img
                src={communityImg}
                alt="MTTF Community"
                className="lux-welcome-community-img"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div style={{ textAlign: "center" }}>
                <p className="lux-serif-heading" style={{ fontSize: "26px", marginBottom: "12px" }}>
                  MathTech Thinking Foundation
                </p>
                <div className="lux-gold-rule" style={{ margin: "0 auto 16px" }} />
              </div>
              <span className="lux-badge-pill">1000+ Active Members</span>
            </div>

          </div>
        </section>

        {/* ── Services ── */}
        <section className="lux-services">
          <div className="lux-services-inner">
            <div className="lux-services-header">
              <div>
                <div className="lux-section-eyebrow">
                  <span className="lux-section-eyebrow-line" />
                  What We Offer
                </div>
                <h2 className="lux-serif-heading lux-services-heading">
                  Our <em>Services</em>
                </h2>
              </div>
              <p className="lux-body" style={{ maxWidth: "360px", fontSize: "14px", textAlign: "right" }}>
                Discover our innovative services designed to boost technology and career growth
              </p>
            </div>
            <div className="lux-services-grid">
              {services.map(service => (
                <div key={service.id} className="lux-service-card">
                  <span className="lux-service-num">{service.number}</span>
                  <div className="lux-service-icon">{service.icon}</div>
                  <div>
                    <p className="lux-service-title">{service.title}</p>
                    <p className="lux-service-subtitle" style={{ marginTop: "6px" }}>{service.subtitle}</p>
                  </div>
                  <p className="lux-service-desc">{service.description}</p>
                  <button className="lux-service-more">
                    More Info
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1 5.5H10M6.5 2L10 5.5L6.5 9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Partners ── */}
        <section className="lux-partners">
          <div className="lux-partners-inner">
            <div className="lux-partners-top">

              <div>
                <div className="lux-section-eyebrow" style={{ color: "rgba(96,165,250,0.9)" }}>
                  <span className="lux-section-eyebrow-line" />
                  Team · Customer · Community
                </div>
                <h2 className="lux-serif-heading lux-partners-heading">
                  We Work With the <br /><em>Best Partners</em>
                </h2>
                <div className="lux-gold-rule" style={{ opacity: 0.3 }} />
                <p className="lux-partners-text">
                  While we are at the forefront and specialize in design-build, we constantly collaborate with a number of delivery methods and are confident we can find the process that will best help you meet your goals.
                </p>
                <button className="lux-btn-outline-gold">
                  Read More
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1 5.5H10M6.5 2L10 5.5L6.5 9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div>
                <p className="lux-partners-right-label">Our Business Partners</p>
                <div className="lux-partner-grid">
                  {partners.map((p, i) => (
                    <div key={i} className="lux-partner-item">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="lux-partner-photo"
                        onError={e => { e.target.style.opacity = '0.2'; }}
                      />
                      <span className="lux-partner-name">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Brand strip */}
            <div className="lux-brand-strip">
              <p className="lux-brand-strip-label">Brands We've Collaborated With</p>
              <div className="lux-brand-grid">
                {partners.map((p, i) => (
                  <div key={i} className="lux-brand-item">
                    <img
                      src={p.img}
                      alt={p.name}
                      onError={e => { e.target.style.opacity = '0.1'; }}
                    />
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Glimpses ── */}
        <section className="lux-glimpses">
          <div className="lux-glimpses-inner">
            <div className="lux-glimpses-header">
              <div>
                <div className="lux-section-eyebrow">
                  <span className="lux-section-eyebrow-line" />
                  Gallery
                </div>
                <h2 className="lux-serif-heading lux-glimpses-heading">
                  <em>Glimpses</em>
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                <p className="lux-body" style={{ fontSize: "13px" }}>
                  Moments from our events and activities
                </p>
                <div className="lux-slider-nav">
                  <button className="lux-arrow-btn" onClick={prevSlide}>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="lux-arrow-btn" onClick={nextSlide}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="lux-glimpse-slide">
              <div
                className="lux-glimpse-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {glimpses.map(glimpse => (
                  <div key={glimpse.id} className="lux-glimpse-frame">
                    <img
                      src={glimpse.img}
                      alt={glimpse.title}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div className="lux-glimpse-overlay" />
                    <div className="lux-glimpse-label">
                      <span className="lux-glimpse-title">{glimpse.title}</span>
                      <span className="lux-glimpse-sub">{glimpse.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lux-glimpse-indicators">
              {glimpses.map((_, i) => (
                <button
                  key={i}
                  className={`lux-glimpse-dot${currentSlide === i ? " active" : ""}`}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default MTTFHomepage;