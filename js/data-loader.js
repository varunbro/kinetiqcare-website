/* ============================================
   KINETIQ CARE — Data Loader
   Shared fetch helper for public pages.
   Falls back to inline data if JSON unreachable (e.g. local file://)
   ============================================ */

window.KCData = (() => {

  // ── Fallback data (mirrors JSON files) ──────────────────────────────────
  const FALLBACK_REPORTS = [
    { id:'rpt-001', published:true, type:'exercise', title:'Knee Replacement Recovery — Phase 1', description:'Weeks 1–4 exercise programme for total knee arthroplasty. Includes 18 guided exercises with photo demonstrations.', dateDisplay:'Mar 2025', specialty:'Orthopaedic', specialtyIcon:'fa-dumbbell', fileType:'PDF', fileSizeMB:2.4, downloadUrl:'#' },
    { id:'rpt-002', published:true, type:'assessment', title:'Initial Musculoskeletal Assessment', description:'Comprehensive initial assessment including range of motion, strength testing, posture analysis and functional movement screening results.', dateDisplay:'Feb 2025', specialty:'Musculoskeletal', specialtyIcon:'fa-bone', fileType:'PDF', fileSizeMB:1.8, downloadUrl:'#' },
    { id:'rpt-003', published:true, type:'progress', title:'4-Week Progress Summary — Back Pain', description:'Monthly progress review including pain score trends, mobility improvements, functional outcome measures and upcoming programme adjustments.', dateDisplay:'Mar 2025', specialty:'Progress', specialtyIcon:'fa-chart-line', fileType:'PDF', fileSizeMB:3.1, downloadUrl:'#' },
    { id:'rpt-004', published:true, type:'guide', title:'Understanding Your Shoulder: A Patient Guide', description:'Comprehensive guide to shoulder anatomy, common conditions, and self-management strategies for rotator cuff injuries and impingement.', dateDisplay:'Jan 2025', specialty:'Education', specialtyIcon:'fa-book', fileType:'PDF', fileSizeMB:4.5, downloadUrl:'#' },
    { id:'rpt-005', published:true, type:'exercise', title:'Sports Rehab — Return to Running Programme', description:'12-week progressive return-to-running protocol for hamstring injuries. Includes sprint mechanics drills, strength work and load monitoring guidelines.', dateDisplay:'Mar 2025', specialty:'Sports', specialtyIcon:'fa-running', fileType:'PDF', fileSizeMB:1.9, downloadUrl:'#' },
    { id:'rpt-006', published:true, type:'assessment', title:'Neurological Assessment — Stroke Rehabilitation', description:'Detailed functional assessment using Barthel Index, Berg Balance Scale and NIHSS scores. Includes goal-setting summary and 3-month rehabilitation plan.', dateDisplay:'Feb 2025', specialty:'Neuro', specialtyIcon:'fa-brain', fileType:'PDF', fileSizeMB:2.2, downloadUrl:'#' },
    { id:'rpt-007', published:true, type:'guide', title:'Managing Arthritis: Daily Movement Guide', description:'Practical guide to gentle daily movements, joint protection strategies and flare-up management for rheumatoid and osteoarthritis patients.', dateDisplay:'Jan 2025', specialty:'Chronic Care', specialtyIcon:'fa-book', fileType:'PDF', fileSizeMB:2.8, downloadUrl:'#' },
    { id:'rpt-008', published:true, type:'progress', title:'Cardio Rehab — 8-Week Progress Review', description:'Bi-monthly progress report including exercise tolerance, heart rate response, dyspnoea scores and functional capacity assessments.', dateDisplay:'Feb 2025', specialty:'Cardio', specialtyIcon:'fa-heartbeat', fileType:'PDF', fileSizeMB:1.6, downloadUrl:'#' },
    { id:'rpt-009', published:true, type:'exercise', title:'Core Stability Programme — Lower Back Pain', description:'8-week progressive core strengthening programme for chronic low back pain. Includes McKenzie exercises, Pilates-based movements and breathing techniques.', dateDisplay:'Mar 2025', specialty:'Chronic Care', specialtyIcon:'fa-dumbbell', fileType:'PDF', fileSizeMB:2.1, downloadUrl:'#' }
  ];

  const FALLBACK_GALLERY = [
    { id:'gal-001', published:true, category:'sessions', title:'Live Physio Session', subtitle:'Online Consultation', icon:'🎥', imageSrc:'', span:'tall' },
    { id:'gal-002', published:true, category:'team', title:'Dr. Arjun Kapoor', subtitle:'Orthopaedic Specialist', icon:'👨‍⚕️', imageSrc:'', span:'' },
    { id:'gal-003', published:true, category:'facilities', title:'Assessment Suite', subtitle:'Virtual Facility', icon:'🏥', imageSrc:'', span:'' },
    { id:'gal-004', published:true, category:'patients', title:'Patient Success Story', subtitle:'Knee Recovery Journey', icon:'🏆', imageSrc:'', span:'wide' },
    { id:'gal-005', published:true, category:'sessions', title:'Sports Rehab Session', subtitle:'Athlete Conditioning', icon:'🏃', imageSrc:'', span:'' },
    { id:'gal-006', published:true, category:'team', title:'Dr. Shreya Patel', subtitle:'Sports Rehabilitation', icon:'👩‍⚕️', imageSrc:'', span:'' },
    { id:'gal-007', published:true, category:'facilities', title:'Virtual Consultation', subtitle:'HD Video Setup', icon:'💻', imageSrc:'', span:'' },
    { id:'gal-008', published:true, category:'events', title:'Wellness Webinar', subtitle:'Patient Education Event', icon:'🎤', imageSrc:'', span:'' },
    { id:'gal-009', published:true, category:'patients', title:"Rajesh's Recovery", subtitle:'Post-Surgery Rehab', icon:'😊', imageSrc:'', span:'' },
    { id:'gal-010', published:true, category:'sessions', title:'Neuro Rehab Session', subtitle:'Balance Training', icon:'🧠', imageSrc:'', span:'' },
    { id:'gal-011', published:true, category:'team', title:'Team Huddle', subtitle:'Clinical Review Session', icon:'👥', imageSrc:'', span:'' },
    { id:'gal-012', published:true, category:'events', title:'Healthcare Innovation Award', subtitle:'Best Virtual Physio Platform 2024', icon:'🏅', imageSrc:'', span:'' }
  ];

  // ── Base path detection ──────────────────────────────────────────────────
  // Works whether page is at root or in a subdirectory (e.g. /admin/)
  function dataPath(filename) {
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    const prefix = depth > 1 ? '../'.repeat(depth - 1) : '';
    return `${prefix}data/${filename}`;
  }

  // ── Generic JSON fetcher with fallback ──────────────────────────────────
  async function fetchJSON(filename, fallback) {
    // Check localStorage for admin draft first
    const draftKey = `kc_draft_${filename.replace('.json', '')}`;
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      try { return JSON.parse(draft); } catch(e) {}
    }
    try {
      const res = await fetch(dataPath(filename));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`[KCData] Could not fetch ${filename}, using fallback.`, e.message);
      return fallback;
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────
  async function loadReports() {
    const data = await fetchJSON('reports.json', { reports: FALLBACK_REPORTS, meta: { totalDownloads: 4200, turnaround: '24h', encryption: '256-bit' } });
    return {
      meta: data.meta,
      reports: (data.reports || data).filter(r => r.published !== false)
    };
  }

  async function loadGallery() {
    const data = await fetchJSON('gallery.json', { items: FALLBACK_GALLERY });
    return (data.items || data).filter(i => i.published !== false);
  }

  async function loadContent() {
    return fetchJSON('content.json', null);
  }

  return { loadReports, loadGallery, loadContent };
})();
