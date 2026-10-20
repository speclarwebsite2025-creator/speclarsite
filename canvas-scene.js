/* ==========================================================================
   SPECLAR CYBERSECURITY — INTERACTIVE THREAT MESH CANVAS
   Real-Time Visualizer for VAPT Probes, 24/7 SOC Ingest & GRC Checkpoints
   Compatible with IBM Carbon White & Gray 100 Themes
   ========================================================================== */

(function () {
  'use strict';

  function initThreatMesh() {
    const canvas = document.getElementById('hero-threat-mesh');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let W, H;
    let dpr = window.devicePixelRatio || 1;
    let mouse = { x: -1000, y: -1000, active: false };
    let animId;

    function resize() {
      W = canvas.width = container.clientWidth * dpr;
      H = canvas.height = container.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    // Nodes definition
    const nodeTypes = [
      { name: 'VAPT Probing Node', code: 'VAPT-AP1', color: '#da1e28', radius: 6 },
      { name: '24/7 SOC Ingest', code: 'SOC-CORE', color: '#0f62fe', radius: 7 },
      { name: 'EDR Telemetry Hub', code: 'EDR-XDR', color: '#0f62fe', radius: 5 },
      { name: 'GRC Audit Control', code: 'GRC-ISO', color: '#198038', radius: 6 },
      { name: 'Cloud WAF Perimeter', code: 'WAF-EDGE', color: '#8a3ffc', radius: 5 },
      { name: 'K8s Cluster Monitor', code: 'K8S-POD', color: '#0f62fe', radius: 5 },
      { name: 'API Security Gateway', code: 'API-GW', color: '#da1e28', radius: 5.5 }
    ];

    const nodes = nodeTypes.map((t, idx) => ({
      ...t,
      x: 40 + (idx % 3) * ((container.clientWidth - 80) / 2) + (Math.random() * 40 - 20),
      y: 40 + Math.floor(idx / 3) * ((container.clientHeight - 80) / 2) + (Math.random() * 30 - 15),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      pulse: Math.random() * Math.PI * 2
    }));

    // Mouse tracking
    container.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    container.addEventListener('mouseleave', () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function draw(timestamp) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Subtle Background Grid
      const gridSize = 32;
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 98, 254, 0.04)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Update and connect nodes
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;
        n1.pulse += 0.03;

        // Bounce
        if (n1.x < 30 || n1.x > width - 30) n1.vx *= -1;
        if (n1.y < 30 || n1.y > height - 30) n1.vy *= -1;

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.35;
            ctx.strokeStyle = isDark ? `rgba(120, 169, 255, ${alpha})` : `rgba(15, 98, 254, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            // Data packet pulse animation
            const packetPos = (Math.sin(timestamp * 0.002 + i + j) + 1) / 2;
            const px = n1.x + (n2.x - n1.x) * packetPos;
            const py = n1.y + (n2.y - n1.y) * packetPos;
            ctx.fillStyle = isDark ? '#78a9ff' : '#0f62fe';
            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Mouse connection
        if (mouse.active) {
          const mdx = n1.x - mouse.x;
          const mdy = n1.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140) {
            const mAlpha = (1 - mdist / 140) * 0.6;
            ctx.strokeStyle = `rgba(15, 98, 254, ${mAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Draw Nodes & Labels
      nodes.forEach((n) => {
        // Outer pulsing aura
        const aura = Math.sin(n.pulse) * 4 + n.radius + 3;
        ctx.fillStyle = isDark ? 'rgba(15, 98, 254, 0.15)' : 'rgba(15, 98, 254, 0.08)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, aura, 0, Math.PI * 2);
        ctx.fill();

        // Node center
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner white dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Monospace code label
        ctx.font = '10px "IBM Plex Mono", monospace';
        ctx.fillStyle = isDark ? '#c6c6c6' : '#525252';
        ctx.fillText(n.code, n.x + 12, n.y + 4);
      });

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
  }

  document.addEventListener('DOMContentLoaded', initThreatMesh);
})();
