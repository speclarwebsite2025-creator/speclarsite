/* ==========================================================================
   SPECLAR CYBERSECURITY — IBM CARBON DESIGN SYSTEM CONTROLLER
   Carbon Tabs · Data Table Filter · Theme Switcher · Accordion · Terminal
   ========================================================================== */

(function () {
  'use strict';

  // Helper selectors
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* --------------------------------------------------------------------------
     1. THEME SWITCHER (Carbon Gray 100 vs Carbon Gray 10)
     -------------------------------------------------------------------------- */
  function initThemeSwitcher() {
    const themeBtn = qs('#btn-theme-toggle');
    if (!themeBtn) return;

    const savedTheme = localStorage.getItem('cds-theme') || 'white';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'white' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('cds-theme', next);
    });
  }

  /* --------------------------------------------------------------------------
     2. UI SHELL / NAVIGATION (Drawer & Overlay)
     -------------------------------------------------------------------------- */
  function initNavigation() {
    const menuTrigger = qs('#menu-trigger');
    const sideNav = qs('#side-nav');
    const overlay = qs('#overlay');
    const navLinks = qsa('.cds--side-nav__link, .cds--header__nav-link');

    if (!menuTrigger || !sideNav || !overlay) return;

    function toggleMenu() {
      const isOpen = sideNav.classList.toggle('is-open');
      overlay.classList.toggle('is-visible', isOpen);
    }

    function closeMenu() {
      sideNav.classList.remove('is-open');
      overlay.classList.remove('is-visible');
    }

    menuTrigger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        closeMenu();
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. CARBON TABS (Service Capabilities Switcher)
     -------------------------------------------------------------------------- */
  function initCarbonTabs() {
    const tabs = qsa('.cds--tab');
    const panels = qsa('.cds--tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab-target');

        tabs.forEach(t => t.classList.remove('is-selected'));
        panels.forEach(p => p.classList.remove('is-active'));

        tab.classList.add('is-selected');
        const targetPanel = qs(`#${targetId}`);
        if (targetPanel) {
          targetPanel.classList.add('is-active');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. CARBON DATA TABLE (Search & Category Filtering)
     -------------------------------------------------------------------------- */
  function initDataTable() {
    const searchInput = qs('#table-search-input');
    const rows = qsa('.cds--data-table tbody tr');
    const filterButtons = qsa('[data-table-filter]');

    if (!rows.length) return;

    let activeFilter = 'all';

    function applyFilters() {
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

      rows.forEach(row => {
        const rowCategory = row.getAttribute('data-category') || '';
        const rowText = row.innerText.toLowerCase();

        const matchesCategory = activeFilter === 'all' || rowCategory === activeFilter;
        const matchesQuery = !query || rowText.includes(query);

        if (matchesCategory && matchesQuery) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        activeFilter = btn.getAttribute('data-table-filter');
        applyFilters();
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. CARBON ACCORDIONS (Expand/Collapse)
     -------------------------------------------------------------------------- */
  function initAccordions() {
    const items = qsa('.cds--accordion__item');

    items.forEach(item => {
      const heading = item.querySelector('.cds--accordion__heading');
      if (!heading) return;

      heading.addEventListener('click', () => {
        const wasExpanded = item.classList.contains('is-expanded');
        // Optional: close other accordions
        // items.forEach(i => i.classList.remove('is-expanded'));
        if (!wasExpanded) {
          item.classList.add('is-expanded');
        } else {
          item.classList.remove('is-expanded');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. LIVE SECURITY TERMINAL (Carbon CLI Emulator)
     -------------------------------------------------------------------------- */
  function initTerminal() {
    const termBody = qs('#terminal-body');
    const termInput = qs('#terminal-input');
    if (!termBody || !termInput) return;

    const commands = {
      help: () => `
Available Commands:
  • <span class="cds--snippet__output-success">services</span>    - Overview of core services (VAPT, SOC, GRC)
  • <span class="cds--snippet__output-success">vapt</span>        - In-depth offensive security & manual testing scope
  • <span class="cds--snippet__output-success">soc</span>         - 24/7 Managed SOC, SIEM & 15-min incident response SLA
  • <span class="cds--snippet__output-success">grc</span>         - ISO 27001:2022, SOC 2 Type II, CERT-In & DPDPA advisory
  • <span class="cds--snippet__output-success">status</span>      - Display current security studio telemetry & active audit nodes
  • <span class="cds--snippet__output-success">cve</span>         - Query active zero-day & critical vulnerability radar
  • <span class="cds--snippet__output-success">scan</span>        - Initiate simulated VAPT perimeter surface scan
  • <span class="cds--snippet__output-success">certifications</span> - Display ISO 27001, SOC 2 Type II & CERT-In compliance
  • <span class="cds--snippet__output-success">contact</span>     - Display direct secure dispatch pgp & intake channel
  • <span class="cds--snippet__output-success">clear</span>       - Clear current terminal console
`,
      services: () => `
<span class="cds--snippet__output-success">[SPECLAR SERVICES OVERVIEW]</span>
1. <strong style="color:#da1e28;">VAPT:</strong> Web, Mobile (iOS/Android), Cloud, API, Network & Red Teaming. 100% manual validation.
2. <strong style="color:#0f62fe;">24/7 SOC:</strong> Real-time SIEM/EDR monitoring, Threat Hunting, &lt; 15-min Incident Response SLA.
3. <strong style="color:#198038;">GRC:</strong> ISO/IEC 27001:2022, SOC 2 Type I/II, CERT-In Audit, India DPDPA 2023, vCISO Advisory.
`,
      vapt: () => `
<span class="cds--snippet__output-warn">[OFFENSIVE VAPT SERVICES]</span>
- Scope: Web Apps, REST/GraphQL APIs, iOS/Android Binaries, AWS/Azure/GCP, Active Directory
- Benchmark: OWASP Top 10 2024, OWASP ASVS v4.0.3, SANS Top 25
- Deliverables: Dual Executive & Dev Technical Report with Curl PoC Scripts
- Guarantee: 0 False Positives + Free 30-Day Re-testing
`,
      soc: () => `
<span class="cds--snippet__output-success">[24/7 MANAGED SOC & MDR]</span>
- SIEM Engines: Microsoft Sentinel, Splunk Cloud, Elastic, Wazuh
- EDR Integration: CrowdStrike Falcon, SentinelOne, Microsoft Defender for Endpoint
- SLA: &lt; 15 Minute Triage and Host Isolation Guarantee
- Coverage: 24/7/365 Dedicated Eyes-on-Glass Security Analysts
`,
      grc: () => `
<span class="cds--snippet__output-success">[GRC & COMPLIANCE ADVISORY]</span>
- ISO/IEC 27001:2022: ISMS Design, Policy Formulation, Risk Register, Audit Facilitation
- SOC 2 Type I & II: Trust Services Criteria Gating, Automated Evidence Collection (Vanta/Drata)
- CERT-In: Mandate Compliance, 6-Hour Incident Notification Playbooks, Annual Security Audits
- DPDPA 2023: Consent Architecture, Data Fiduciary Obligations, Cross-Border Transfer Assessment
`,
      status: () => `
<span class="cds--snippet__output-success">[OK] SPECLAR X-FORCE RADAR ACTIVE</span>
- Telemetry: Real-time Threat Intelligence Feed Connected
- Active Nodes: Cloud Defenses (AWS/GCP/Azure), API Gateways, Smart Contracts
- MTTR (Mean Time to Remediation Verification): &lt; 24 Hours
- System Load: 14% | Encryption: Ed25519 / TLS 1.3
`,
      cve: () => `
<span class="cds--snippet__output-warn">[ALERT] ACTIVE INTEL ADVISORIES</span>
- CVE-2024-38856: Apache OFBiz Pre-Auth RCE (Critical 9.8) - Patched & Monitored
- CVE-2024-4577: PHP CGI Argument Injection RCE (Critical 9.8) - Virtual Patch Verified
- Zero-Day Research: 4 Private Disclosures in Coordination with Vendor PSIRT
`,
      scan: () => `
<span class="cds--snippet__prompt">[SYSTEM] Initializing perimeter scan on target simulation...</span>
[+] Phase 1: Subdomain enumeration & ASN footprinting complete (142 hosts found)
[+] Phase 2: TLS cipher-suite & SSL pinning verification passed
[+] Phase 3: Web Application Firewall (WAF) posture: Cloudflare Enterprise Active
<span class="cds--snippet__output-success">[RESULT] Scan clean. 0 unauthenticated endpoints exposed. Full audit recommended.</span>
`,
      certifications: () => `
<span class="cds--snippet__output-success">[VERIFIED] AUDIT CAPABILITY STANDARDS</span>
- ISO/IEC 27001:2022 Lead Auditor Certified Team
- CREST & OSCP / OSCE Red Team Specialists
- CERT-In Empanelled Audit Standards Alignment
- OWASP Top 10 2024 & ASVS v4.0.3 Benchmark Compliance
`,
      contact: () => `
<span class="cds--snippet__output-success">[SECURE DISPATCH & LEADERSHIP]</span>
- Executive Email: ceo@speclar.com
- Direct Line / Incident Hotline: +91 9345827775
- Corporate HQ: West Mambalam, Chennai, Tamil Nadu, 600033, India
`,
      clear: () => {
        termBody.innerHTML = '';
        return '';
      }
    };

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = termInput.value.trim().toLowerCase();
        termInput.value = '';

        if (!rawCmd) return;

        const cmdP = document.createElement('p');
        cmdP.innerHTML = `<span class="cds--snippet__prompt">speclar@carbon-terminal:~$</span> ${rawCmd}`;
        termBody.appendChild(cmdP);

        if (commands[rawCmd]) {
          const res = commands[rawCmd]();
          if (res) {
            const outP = document.createElement('p');
            outP.innerHTML = res;
            termBody.appendChild(outP);
          }
        } else {
          const errP = document.createElement('p');
          errP.className = 'cds--snippet__output-err';
          errP.textContent = `Command not recognized: "${rawCmd}". Type "help" for list of commands.`;
          termBody.appendChild(errP);
        }

        termBody.scrollTop = termBody.scrollHeight;
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. MODAL DIALOG (Universal Modal Controller)
     -------------------------------------------------------------------------- */
  function initModal() {
    const openBtns = qsa('[data-modal-target]');
    const closeBtns = qsa('.cds--modal__close, [data-modal-close]');

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-modal-target');
        const targetModal = qs(`#${targetId}`);
        if (targetModal) {
          targetModal.classList.add('is-visible');
        }
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.cds--modal');
        if (modal) modal.classList.remove('is-visible');
      });
    });

    qsa('.cds--modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('is-visible');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. SERVICE SCOPING & TIMELINE ESTIMATOR (Calculator)
     -------------------------------------------------------------------------- */
  function initServiceEstimator() {
    const serviceBtns = qsa('[data-calc-service]');
    const urgencyBtns = qsa('[data-calc-urgency]');
    const slider = qs('#calc-scope-slider');
    const scopeValBadge = qs('#calc-scope-val');
    const timelineVal = qs('#calc-out-timeline');
    const teamVal = qs('#calc-out-team');
    const reportTypeVal = qs('#calc-out-report');
    const applyBtn = qs('#btn-apply-scope');

    if (!slider) return;

    let selectedService = 'vapt';
    let selectedUrgency = 'standard';
    let scopeCount = parseInt(slider.value, 10);

    const serviceData = {
      vapt: {
        units: 'Targets (Web / Apps / APIs)',
        baseDays: 5,
        perUnitDays: 1.5,
        teamBase: '1 Senior OSCP Lead',
        teamScale: '2 Senior OSCP Ethical Hackers + 1 Security Architect',
        deliverables: 'Dual Executive & Dev Technical Report with PoC Exploit Scripts'
      },
      soc: {
        units: 'Monitored Assets / Endpoints (x10)',
        baseDays: 3,
        perUnitDays: 0.5,
        teamBase: 'Tier-1 & Tier-2 SOC Analysts 24/7',
        teamScale: 'Dedicated 24/7 SIEM/EDR Threat Hunters + IR Commander',
        deliverables: 'Real-Time Incident Triage & Weekly Threat Exposure Briefing'
      },
      grc: {
        units: 'Framework Controls / In-Scope Departments',
        baseDays: 10,
        perUnitDays: 2.0,
        teamBase: '1 ISO/SOC2 Lead Auditor',
        teamScale: 'Lead GRC Consultant + Technical Policy Architect',
        deliverables: 'Gap Analysis Matrix, Risk Register, and Final Audit Readiness Attestation'
      }
    };

    function recalculate() {
      const data = serviceData[selectedService];
      scopeCount = parseInt(slider.value, 10);

      if (scopeValBadge) {
        scopeValBadge.textContent = `${scopeCount} ${data.units}`;
      }

      let days = Math.round(data.baseDays + scopeCount * data.perUnitDays);
      if (selectedUrgency === 'express') {
        days = Math.max(3, Math.round(days * 0.6));
      } else if (selectedUrgency === 'retainer') {
        days = 'Continuous / 365 Days';
      }

      if (timelineVal) {
        timelineVal.innerHTML = typeof days === 'number' ? `${days} <span>Business Days</span>` : `${days}`;
      }

      if (teamVal) {
        teamVal.textContent = scopeCount > 8 ? data.teamScale : data.teamBase;
      }

      if (reportTypeVal) {
        reportTypeVal.textContent = data.deliverables;
      }
    }

    serviceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        serviceBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        selectedService = btn.getAttribute('data-calc-service');
        recalculate();
      });
    });

    urgencyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        urgencyBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        selectedUrgency = btn.getAttribute('data-calc-urgency');
        recalculate();
      });
    });

    slider.addEventListener('input', recalculate);
    recalculate();

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const intakeForm = qs('#intake-form');
        const selService = qs('#sel-service');
        const inpScope = qs('#inp-scope');
        const selUrgency = qs('#sel-urgency');

        if (selService) {
          selService.value = selectedService === 'vapt' ? 'vapt' : selectedService === 'soc' ? 'cloud' : 'compliance';
        }
        if (selUrgency) {
          selUrgency.value = selectedUrgency === 'express' ? 'immediate' : selectedUrgency === 'retainer' ? 'continuous' : 'scheduled';
        }
        if (inpScope) {
          inpScope.value = `Estimated Scope: ${scopeCount} ${serviceData[selectedService].units} under ${selectedService.toUpperCase()} engagement. Target SLA: ${selectedUrgency.toUpperCase()}.`;
        }

        if (intakeForm) {
          intakeForm.scrollIntoView({ behavior: 'smooth' });
          const orgInput = qs('#inp-org');
          if (orgInput) orgInput.focus();
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     9. THREE PILLARS NAVIGATION QUICK-JUMP
     -------------------------------------------------------------------------- */
  function initPillarCards() {
    const cards = qsa('.cds--pillar-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
        const targetTab = card.getAttribute('data-target-tab');
        if (targetTab) {
          const tabBtn = qs(`[data-tab-target="${targetTab}"]`);
          if (tabBtn) tabBtn.click();
          const capSection = qs('#capabilities');
          if (capSection) capSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     10. 24/7 MANAGED SOC TELEMETRY SIMULATOR
     -------------------------------------------------------------------------- */
  function initSocSimulator() {
    const feed = qs('#soc-live-feed');
    if (!feed) return;

    const sampleEvents = [
      { type: 'SSH BRUTE-FORCE', target: 'Bastion-01 (10.0.4.12)', action: 'IP Auto-Banned in WAF', status: 'CONTAINED', cls: 'safe' },
      { type: 'BOLA ANOMALY', target: '/api/v1/user/tokens', action: 'Rate-Limited & Alert Sent', status: 'MITIGATED', cls: 'safe' },
      { type: 'PRIVILEGE ESCALATION', target: 'K8s Pod auth-svc', action: 'Isolated & Snapshot Saved', status: 'TRIAGED', cls: 'alert' },
      { type: 'SUSPICIOUS OAUTH', target: 'Azure AD Admin Consent', action: 'Token Revoked via SOAR', status: 'RESOLVED', cls: 'safe' },
      { type: 'MALWARE C2 BEACON', target: 'Workstation WS-409', action: 'Host Quarantined via EDR', status: 'ISOLATED', cls: 'alert' },
      { type: 'IMDSv2 EXFIL QUERY', target: 'AWS Lambda (Worker)', action: 'IAM Role Restrained', status: 'BLOCKED', cls: 'safe' }
    ];

    let eventIdx = 0;

    setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const ev = sampleEvents[eventIdx % sampleEvents.length];
      eventIdx++;

      const row = document.createElement('div');
      row.className = 'cds--soc-event-row';
      row.innerHTML = `
        <span style="color:#8d8d8d;">${timeStr}</span>
        <span style="color:#f87171; font-weight:600;">${ev.type}</span>
        <span style="color:#c6c6c6;">${ev.target}</span>
        <span style="color:#38bdf8;">${ev.action}</span>
        <span class="cds--tag cds--tag-${ev.cls === 'safe' ? 'green' : 'red'}" style="padding:2px 6px;">${ev.status}</span>
      `;

      feed.insertBefore(row, feed.firstChild);
      if (feed.children.length > 8) {
        feed.removeChild(feed.lastChild);
      }
    }, 3800);
  }

  /* --------------------------------------------------------------------------
     11. INTERACTIVE GRC COMPLIANCE GAP CHECKER
     -------------------------------------------------------------------------- */
  function initGrcChecker() {
    const checkboxes = qsa('.cds--grc-checkbox-item input[type="checkbox"]');
    const progressBar = qs('#grc-progress-fill');
    const scoreVal = qs('#grc-score-num');
    const statusText = qs('#grc-status-text');
    const stdButtons = qsa('[data-grc-std]');

    if (!checkboxes.length || !progressBar) return;

    function updateScore() {
      const total = checkboxes.length;
      const checked = [...checkboxes].filter(c => c.checked).length;
      const pct = Math.round((checked / total) * 100);

      progressBar.style.width = `${pct}%`;
      if (scoreVal) scoreVal.textContent = `${pct}%`;

      if (statusText) {
        if (pct === 100) {
          statusText.textContent = 'Audit Ready (Low Residual Risk) ✓';
          statusText.style.color = '#198038';
          progressBar.style.backgroundColor = '#198038';
        } else if (pct >= 60) {
          statusText.textContent = 'Moderate Readiness — Remediation Required';
          statusText.style.color = '#0f62fe';
          progressBar.style.backgroundColor = '#0f62fe';
        } else {
          statusText.textContent = 'Critical Gaps Detected — High Non-Compliance Risk';
          statusText.style.color = '#da1e28';
          progressBar.style.backgroundColor = '#da1e28';
        }
      }
    }

    checkboxes.forEach(cb => {
      cb.addEventListener('change', updateScore);
    });

    stdButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        stdButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        // Reset or toggle preset patterns for different standards
        const std = btn.getAttribute('data-grc-std');
        if (std === 'iso') {
          checkboxes.forEach((c, idx) => c.checked = idx % 2 === 0);
        } else if (std === 'soc2') {
          checkboxes.forEach((c, idx) => c.checked = idx < 3);
        } else {
          checkboxes.forEach((c, idx) => c.checked = idx % 3 === 0);
        }
        updateScore();
      });
    });

    updateScore();
  }

  /* --------------------------------------------------------------------------
     12. VAPT SAMPLE FINDING INSPECTOR
     -------------------------------------------------------------------------- */
  function initFindingInspector() {
    const tabs = qsa('[data-finding-tab]');
    const views = qsa('[data-finding-view]');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetView = tab.getAttribute('data-finding-tab');
        tabs.forEach(t => t.classList.remove('is-selected'));
        views.forEach(v => v.style.display = 'none');

        tab.classList.add('is-selected');
        const viewEl = qs(`[data-finding-view="${targetView}"]`);
        if (viewEl) viewEl.style.display = 'block';
      });
    });
  }

  /* --------------------------------------------------------------------------
     13. INTERACTIVE FAQ ACCORDION
     -------------------------------------------------------------------------- */
  function initFaq() {
    const items = qsa('.cds--faq-item');
    items.forEach(item => {
      const trigger = item.querySelector('.cds--faq-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        items.forEach(i => i.classList.remove('is-open'));
        if (!isOpen) {
          item.classList.add('is-open');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     14. CLIENT CASE STUDIES FILTER
     -------------------------------------------------------------------------- */
  function initCaseFilter() {
    const filterBtns = qsa('[data-case-filter]');
    const cards = qsa('.cds--case-card');

    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-case-filter');
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        cards.forEach(card => {
          const cardCat = card.getAttribute('data-case-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     15. FRAMER-STYLE SCROLL OBSERVER (Viewport Entrance Animations)
     -------------------------------------------------------------------------- */
  function initFramerScrollObserver() {
    const animElements = qsa('.framer-reveal, .framer-scale, .framer-fade');
    if (!animElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animElements.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     16. SCROLL PROGRESS INDICATOR BAR
     -------------------------------------------------------------------------- */
  function initScrollProgressBar() {
    const progressBar = qs('#scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = `${scrolled}%`;
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     17. CARBON TOAST NOTIFICATIONS
     -------------------------------------------------------------------------- */
  function showToast(title, message, type = 'success') {
    let container = qs('#cds-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cds-toast-container';
      container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 100000; display: flex; flex-direction: column; gap: 12px; pointer-events: none; max-width: 420px; width: calc(100vw - 48px);';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const borderColor = type === 'success' ? '#24a148' : (type === 'error' ? '#da1e28' : '#0f62fe');
    toast.style.cssText = `background: var(--cds-layer-01, #161616); color: var(--cds-text-primary, #ffffff); border-left: 4px solid ${borderColor}; border: 1px solid var(--cds-border-subtle, rgba(255,255,255,0.1)); border-left-width: 4px; border-left-color: ${borderColor}; padding: 16px 20px; box-shadow: 0 12px 32px rgba(0,0,0,0.35); pointer-events: auto; transform: translateY(20px); opacity: 0; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); font-family: var(--cds-font-sans); border-radius: 4px;`;

    toast.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
        <div>
          <div style="font-family: var(--cds-font-mono); font-size: 0.6875rem; letter-spacing: 1px; color: ${borderColor}; font-weight: 600; text-transform: uppercase;">${title}</div>
          <div style="font-size: 0.8125rem; margin-top: 4px; line-height: 1.4; color: var(--cds-text-secondary);">${message}</div>
        </div>
        <button style="background: none; border: none; color: var(--cds-text-helper); cursor: pointer; font-size: 14px; padding: 0 4px;" onclick="this.closest('#cds-toast-container > div').remove()">✕</button>
      </div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(10px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 6000);
  }

  /* --------------------------------------------------------------------------
     8. GOOGLE SHEETS / EXCEL LEAD DISPATCH & FORM HANDLING
     -------------------------------------------------------------------------- */
  // Live Google Apps Script Web App URL (Speclar Website Leads):
  const GOOGLE_SHEET_WEBAPP_URL = window.SPECLAR_GOOGLE_SHEET_URL || 'https://script.google.com/macros/s/AKfycbx3WBzt0mgqqtRc2xEvnu8-kQ1k9aSGEMvReKbRHewqoIIYpf7b-DPTokTM_by_RsMh/exec';

  async function postLeadToGoogleSheet(data) {
    if (!GOOGLE_SHEET_WEBAPP_URL) {
      console.info('[SPECLAR Lead Capture] Logged locally. (Paste your Google Apps Script URL into app.js to sync with Google Sheet):', data);
      return;
    }
    try {
      await fetch(GOOGLE_SHEET_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log('[SPECLAR Lead Capture] Successfully dispatched to Google Sheet.');
    } catch (err) {
      console.warn('[SPECLAR Lead Capture] Network sync notification:', err);
    }
  }

  function initForm() {
    // 1. Home Page Screen 13: Statement of Work (SOW) Intake Form
    const form = qs('#intake-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        const payload = {
          timestamp: new Date().toLocaleString(),
          source: 'Home Page // SOW Intake Form',
          organization: qs('#inp-org')?.value || 'N/A',
          email: qs('#inp-email')?.value || 'N/A',
          phone: qs('#inp-phone')?.value || 'N/A',
          service: qs('#sel-service')?.value || 'vapt',
          urgency: qs('#sel-urgency')?.value || 'scheduled',
          scope: qs('#inp-scope')?.value || 'N/A'
        };

        btn.disabled = true;
        btn.innerHTML = 'Securing Scoping Transmission...';

        postLeadToGoogleSheet(payload);

        setTimeout(() => {
          btn.innerHTML = 'Transmission Verified & Logged ✓';
          btn.style.backgroundColor = 'var(--cds-support-success)';

          setTimeout(() => {
            form.reset();
            btn.disabled = false;
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
            showToast('Scope Transmitted to Architects', 'Your scoping parameters have been logged. A Lead Security Architect will contact you within 4 hours with an executed Bilateral MNDA.', 'success');
          }, 1200);
        }, 800);
      });
    }

    // 2. Contact Page: Fast Engagement Scoping Form
    const quickForm = qs('#contact-quick-form');
    if (quickForm) {
      quickForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = quickForm.querySelector('button[type="submit"]');
        const originalText = btn ? btn.innerHTML : '';

        const payload = {
          timestamp: new Date().toLocaleString(),
          source: 'Contact Page // Fast Scope Form',
          organization: qs('#quick-org')?.value || 'N/A',
          email: qs('#quick-email')?.value || 'N/A',
          phone: qs('#quick-phone')?.value || 'N/A',
          service: qs('#quick-service')?.value || 'vapt',
          urgency: 'Immediate',
          scope: qs('#quick-scope')?.value || 'N/A'
        };

        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<span>Securing Scope Transmission...</span>';
        }

        postLeadToGoogleSheet(payload);

        setTimeout(() => {
          if (btn) {
            btn.innerHTML = '<span>✓ Scope Dispatched! Architect Contacting You.</span>';
            btn.style.background = '#24a148';
          }
          quickForm.reset();
          showToast('Inquiry Transmitted', 'Your requirements have been logged in the dispatch queue. An Architect will respond within 4 hours.', 'success');

          setTimeout(() => {
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = originalText || '<span>Submit Fast Scope Inquiry →</span>';
              btn.style.background = '';
            }
          }, 4000);
        }, 800);
      });
    }

    // 3. Fast Scoping Call Modal (Across all pages)
    const modalPrimaryBtn = qs('#assessment-modal .cds--modal__footer button.cds--btn--primary');
    if (modalPrimaryBtn) {
      modalPrimaryBtn.addEventListener('click', () => {
        const emailInput = qs('#mod-email');
        const nameInput = qs('#mod-name');
        const phoneInput = qs('#mod-phone');
        const assetInput = qs('#mod-asset');

        if (emailInput && emailInput.value) {
          const email = emailInput.value;
          const payload = {
            timestamp: new Date().toLocaleString(),
            source: 'Modal // Fast Scoping Call',
            organization: nameInput?.value || 'N/A',
            email: email,
            phone: phoneInput?.value || 'N/A',
            service: assetInput?.value || 'vapt',
            urgency: 'Immediate (Fast Call)',
            scope: 'Requested Fast Scoping Call with bilateral MNDA mandate'
          };

          postLeadToGoogleSheet(payload);

          emailInput.value = '';
          if (nameInput) nameInput.value = '';
          if (phoneInput) phoneInput.value = '';

          const modal = qs('#assessment-modal');
          if (modal) modal.classList.remove('is-visible');
          showToast('Bilateral MNDA Initiated', `Fast scoping call scheduled for ${email}. Lead Security Architect dispatched.`, 'success');
        } else {
          showToast('Input Required', 'Please provide a valid corporate work email address.', 'error');
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     INITIALIZE ON DOM CONTENT LOADED
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initNavigation();
    initCarbonTabs();
    initDataTable();
    initAccordions();
    initTerminal();
    initModal();
    initForm();
    initServiceEstimator();
    initPillarCards();
    initSocSimulator();
    initGrcChecker();
    initFindingInspector();
    initFaq();
    initCaseFilter();
    initFramerScrollObserver();
    initScrollProgressBar();
  });
})();

