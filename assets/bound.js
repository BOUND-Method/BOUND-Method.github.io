    /* =========================================================
       HERO — INTERACTIVE BOUND MARK (3D tilt, separation, packet)
       ========================================================= */
    (function () {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        const hero = document.getElementById('hero');
        const btn = document.getElementById('markBtn');
        const scene = document.getElementById('markScene');
        const halfL = document.getElementById('markLeft');
        const halfR = document.getElementById('markRight');
        const beam = document.getElementById('markBeam');
        if (!btn || !scene) return;

        let tRX = 0, tRY = 0, mRX = 0, mRY = 0;
        let tSep = 0, mSep = 0, tBob = 0, mBob = 0;
        let hover = false, packetBusy = false;

        hero.addEventListener('mousemove', function (e) {
            const r = hero.getBoundingClientRect();
            const dx = (e.clientX - r.left) / r.width - 0.5;
            const dy = (e.clientY - r.top) / r.height - 0.5;
            tRY = Math.max(-10, Math.min(10, dx * 22));
            tRX = Math.max(-8, Math.min(8, -dy * 16));
        });
        hero.addEventListener('mouseleave', function () { tRX = 0; tRY = 0; });

        btn.addEventListener('mouseenter', function () { hover = true; tSep = 7; });
        btn.addEventListener('mouseleave', function () { hover = false; tSep = 0; });

        function firePacket() {
            if (packetBusy) return;
            packetBusy = true;
            beam.classList.add('active');

            const packet = document.createElement('span');
            packet.className = 'mark-packet run';
            scene.appendChild(packet);

            setTimeout(function () {
                beam.classList.add('verified');
                const ring = document.createElement('span');
                ring.className = 'mark-ring';
                scene.appendChild(ring);
                ring.addEventListener('animationend', function () { ring.remove(); });

                // pulse the canvas network at the mark position
                const cr = scene.getBoundingClientRect();
                const hr = hero.getBoundingClientRect();
                window.dispatchEvent(new CustomEvent('bound-pulse', {
                    detail: { x: cr.left - hr.left + cr.width / 2, y: cr.top - hr.top + cr.height / 2 }
                }));

                setTimeout(function () {
                    beam.classList.remove('verified');
                    beam.classList.remove('active');
                    packetBusy = false;
                }, 520);
            }, 620);

            packet.addEventListener('animationend', function () { packet.remove(); });
        }

        btn.addEventListener('click', firePacket);

        let t0 = 0;
        function markLoop(ts) {
            if (!t0) t0 = ts;
            const t = ts - t0;
            mRX += (tRX - mRX) * 0.08;
            mRY += (tRY - mRY) * 0.08;
            mSep += (tSep - mSep) * 0.12;
            const bobTarget = Math.sin(t * 0.0012) * 5;
            mBob += (bobTarget - mBob) * 0.06;
            const breathe = 1 + Math.sin(t * 0.0016) * 0.008;

            scene.style.transform =
                'perspective(850px) rotateX(' + mRX.toFixed(2) + 'deg) rotateY(' + mRY.toFixed(2) + 'deg) translateY(' + mBob.toFixed(2) + 'px)';
            halfL.style.transform = 'translateX(' + (-mSep).toFixed(2) + 'px) scale(' + breathe.toFixed(4) + ')';
            halfR.style.transform = 'translateX(' + (mSep).toFixed(2) + 'px) scale(' + breathe.toFixed(4) + ')';
            requestAnimationFrame(markLoop);
        }
        requestAnimationFrame(markLoop);
    })();

    /* =========================================================
       HERO — INTERACTIVE CANVAS FIELD
       boundaries bend · network follows cursor · binary streams ·
       module stacks · computation glyphs · mark echoes · packets
       ========================================================= */
    (function () {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        let width = 0, height = 0, dpr = 1, time = 0;
        const mouse = { x: -9999, y: -9999, active: false };
        let clicks = [];

        const BOUNDARY_COUNT = 5, NODE_COUNT = 42, STACK_COUNT = 6,
              BINARY_COUNT = 56, PARTICLE_COUNT = 26, SYMBOL_COUNT = 16, ECHO_COUNT = 4;

        let boundaries = [], nodes = [], stacks = [], binaries = [],
            particles = [], symbols = [], echoes = [], connections = [];

        const mathGlyphs = ['∑', '', 'λ', '→', '⇒', '∀', '∃', '', '∇', '≡', '≈', '⊗', '', '∨', '¬', '∈'];
        const codeGlyphs = ['{ }', '[ ]', '( )', '=>', '::', '->', '<>', '&&', '||', '!=', '==', '<<', '>>'];
        const flowGlyphs = ['◇', '□', '○', '△', '⬡'];

        function rand(a, b) { return Math.random() * (b - a) + a; }

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initField();
        }

        function initField() {
            boundaries = [];
            for (let i = 0; i < BOUNDARY_COUNT; i++) {
                const runners = [];
                for (let k = 0; k < 3; k++) runners.push({ y: rand(0, height), speed: rand(0.6, 1.6), digit: Math.random() > 0.5 ? '0' : '1' });
                boundaries.push({
                    x: (width / (BOUNDARY_COUNT + 1)) * (i + 1) + rand(-30, 30),
                    phase: rand(0, Math.PI * 2),
                    opacity: rand(0.14, 0.3),
                    runners: runners
                });
            }

            nodes = [];
            for (let i = 0; i < NODE_COUNT; i++) {
                nodes.push({
                    x: rand(40, width - 40), y: rand(40, height - 40),
                    vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3),
                    radius: rand(2, 5), phase: rand(0, Math.PI * 2),
                    color: ['#3b82f6', '#22d3ee', '#14b8a6', '#a855f7'][Math.floor(rand(0, 4))],
                    baseOpacity: rand(0.3, 0.7)
                });
            }

            connections = [];
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 170 && Math.random() > 0.55) connections.push({ a: nodes[i], b: nodes[j] });
                }
            }

            stacks = [];
            for (let i = 0; i < STACK_COUNT; i++) {
                const layers = [];
                const count = Math.floor(rand(3, 6));
                for (let j = 0; j < count; j++) {
                    layers.push({ w: rand(44, 84), h: rand(8, 13), color: ['#3b82f6', '#22d3ee', '#14b8a6'][j % 3] });
                }
                stacks.push({ x: rand(90, width - 90), y: rand(90, height - 110), layers: layers, phase: rand(0, Math.PI * 2) });
            }

            binaries = [];
            for (let i = 0; i < BINARY_COUNT; i++) {
                binaries.push({
                    x: rand(0, width), y: rand(0, height),
                    vx: rand(-0.4, 0.4), vy: rand(-0.7, -0.2),
                    digit: Math.random() > 0.5 ? '0' : '1',
                    size: rand(10, 16), opacity: rand(0.08, 0.32), flip: rand(60, 300)
                });
            }

            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    src: nodes[Math.floor(rand(0, nodes.length))],
                    dst: nodes[Math.floor(rand(0, nodes.length))],
                    t: rand(0, 1), speed: rand(0.002, 0.007),
                    color: ['#3b82f6', '#22d3ee', '#14b8a6'][Math.floor(rand(0, 3))],
                    size: rand(1.5, 3)
                });
            }

            symbols = [];
            const all = mathGlyphs.concat(codeGlyphs, flowGlyphs);
            for (let i = 0; i < SYMBOL_COUNT; i++) {
                symbols.push({
                    x: rand(50, width - 50), y: rand(50, height - 50),
                    vx: rand(-0.2, 0.2), vy: rand(-0.2, 0.2),
                    text: all[Math.floor(rand(0, all.length))],
                    size: rand(12, 22), opacity: rand(0.07, 0.2),
                    rot: rand(-0.3, 0.3), phase: rand(0, Math.PI * 2)
                });
            }

            echoes = [];
            for (let i = 0; i < ECHO_COUNT; i++) {
                echoes.push({
                    x: rand(80, width - 80), y: rand(80, height - 80),
                    rot: rand(-0.4, 0.4), vrot: rand(-0.0006, 0.0006),
                    scale: rand(0.28, 0.5), alpha: rand(0.08, 0.16),
                    vx: rand(-0.15, 0.15), vy: rand(-0.12, 0.12)
                });
            }
        }

        /* boundary bend offset near cursor */
        function bendOffset(b, y) {
            if (!mouse.active) return 0;
            const dx = mouse.x - b.x;
            if (Math.abs(dx) > 150) return 0;
            const prox = 1 - Math.abs(dx) / 150;
            const dy = y - mouse.y;
            const infl = Math.exp(-(dy * dy) / (2 * 95 * 95));
            const dir = dx >= 0 ? -1 : 1;
            return dir * prox * infl * 30;
        }

        function drawBoundaries() {
            boundaries.forEach(function (b) {
                const pulse = Math.sin(time * 0.012 + b.phase) * 0.12 + 0.88;
                const dxm = Math.abs(mouse.x - b.x);
                const highlight = (mouse.active && dxm < 150) ? (1 - dxm / 150) * 0.35 : 0;

                ctx.strokeStyle = 'rgba(59, 130, 246,' + ((b.opacity + highlight) * pulse).toFixed(3) + ')';
                ctx.lineWidth = 1.2;
                ctx.setLineDash([8, 6]);
                ctx.lineDashOffset = -time * 0.25;
                ctx.beginPath();
                for (let y = 0; y <= height; y += 28) {
                    const x = b.x + bendOffset(b, y);
                    if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = 'rgba(59, 130, 246,' + (0.28 + highlight).toFixed(3) + ')';
                ctx.font = '10px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.fillText('BOUNDARY', b.x, 28);

                /* binary runners sliding along the boundary */
                const boost = (mouse.active && dxm < 150) ? (1 - dxm / 150) * 2.2 : 0;
                b.runners.forEach(function (r) {
                    r.y += r.speed + boost;
                    if (r.y > height + 14) { r.y = -14; r.digit = Math.random() > 0.5 ? '0' : '1'; }
                    const x = b.x + bendOffset(b, r.y);
                    ctx.fillStyle = 'rgba(34, 211, 238,' + (0.25 + boost * 0.25).toFixed(3) + ')';
                    ctx.font = '11px JetBrains Mono, monospace';
                    ctx.fillText(r.digit, x + 8, r.y);
                });
            });
        }

        function drawConnections() {
            connections.forEach(function (c) {
                const dx = c.a.x - c.b.x, dy = c.a.y - c.b.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                const op = Math.max(0, 0.16 - d / 1200);
                ctx.strokeStyle = 'rgba(59, 130, 246,' + op.toFixed(3) + ')';
                ctx.lineWidth = 0.5;
                ctx.beginPath(); ctx.moveTo(c.a.x, c.a.y); ctx.lineTo(c.b.x, c.b.y); ctx.stroke();
            });
        }

        /* cursor joins the network: links to 3 nearest nodes */
        function drawCursorLinks() {
            if (!mouse.active) return;
            const near = nodes
                .map(function (n) { const dx = n.x - mouse.x, dy = n.y - mouse.y; return { n: n, d: Math.sqrt(dx * dx + dy * dy) }; })
                .filter(function (o) { return o.d < 240; })
                .sort(function (a, b) { return a.d - b.d; })
                .slice(0, 3);
            near.forEach(function (o) {
                const a = (1 - o.d / 240) * 0.45;
                ctx.strokeStyle = 'rgba(34, 211, 238,' + a.toFixed(3) + ')';
                ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(o.n.x, o.n.y); ctx.stroke();
            });
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.55)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2); ctx.stroke();
        }

        function drawStacks() {
            stacks.forEach(function (s) {
                const float = Math.sin(time * 0.012 + s.phase) * 3;
                s.layers.forEach(function (layer, idx) {
                    const ly = s.y + float + idx * 14;
                    const lx = s.x - layer.w / 2;
                    ctx.fillStyle = 'rgba(0,0,0,0.3)';
                    ctx.fillRect(lx + 2, ly + 2, layer.w, layer.h);
                    ctx.fillStyle = layer.color + '30';
                    ctx.fillRect(lx, ly, layer.w, layer.h);
                    ctx.strokeStyle = layer.color + '60';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(lx, ly, layer.w, layer.h);
                    ctx.fillStyle = layer.color + 'aa';
                    ctx.font = '8px JetBrains Mono, monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText('M' + (idx + 1), s.x, ly + layer.h / 2 + 3);
                });
                ctx.fillStyle = 'rgba(255,255,255,0.28)';
                ctx.font = '9px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.fillText('MODULE STACK', s.x, s.y + float + s.layers.length * 14 + 14);
            });
        }

        function drawBinaries() {
            binaries.forEach(function (b) {
                b.flip--;
                if (b.flip <= 0) { b.digit = b.digit === '0' ? '1' : '0'; b.flip = rand(80, 320); }
                b.x += b.vx; b.y += b.vy;
                if (b.y < -20) { b.y = height + 20; b.x = rand(0, width); }
                if (b.x < -20) b.x = width + 20;
                if (b.x > width + 20) b.x = -20;
                ctx.fillStyle = 'rgba(34, 211, 238,' + b.opacity.toFixed(3) + ')';
                ctx.font = b.size + 'px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.fillText(b.digit, b.x, b.y);
            });
        }

        function drawSymbols() {
            symbols.forEach(function (s) {
                s.x += s.vx; s.y += s.vy;
                if (s.x < 0 || s.x > width) s.vx *= -1;
                if (s.y < 0 || s.y > height) s.vy *= -1;
                const pulse = Math.sin(time * 0.012 + s.phase) * 0.1 + 0.9;
                ctx.save();
                ctx.translate(s.x, s.y);
                ctx.rotate(s.rot);
                ctx.fillStyle = 'rgba(148, 163, 184,' + (s.opacity * pulse).toFixed(3) + ')';
                ctx.font = s.size + 'px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(s.text, 0, 0);
                ctx.restore();
            });
        }

        /* drifting echoes of the BOUND mark (two facing brackets) */
        const HALF_OUTER = [[-50, -50], [12, -50], [50, -12], [50, 12], [12, 50], [-50, 50]];
        const HALF_INNER = [[-28, -28], [2, -28], [28, -2], [28, 2], [2, 28], [-28, 28]];
        function tracePoly(pts) {
            ctx.beginPath();
            pts.forEach(function (p, i) { if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); });
            ctx.closePath();
        }
        function drawEchoes() {
            echoes.forEach(function (e) {
                e.x += e.vx; e.y += e.vy; e.rot += e.vrot;
                if (e.x < -80) e.x = width + 80; if (e.x > width + 80) e.x = -80;
                if (e.y < -80) e.y = height + 80; if (e.y > height + 80) e.y = -80;
                ctx.save();
                ctx.translate(e.x, e.y);
                ctx.rotate(e.rot);
                ctx.scale(e.scale, e.scale);
                ctx.lineWidth = 3;
                // left (navy)
                ctx.save(); ctx.translate(-56, 0);
                ctx.strokeStyle = 'rgba(70, 120, 255,' + e.alpha.toFixed(3) + ')';
                tracePoly(HALF_OUTER); ctx.stroke();
                tracePoly(HALF_INNER); ctx.stroke();
                ctx.restore();
                // right (orange, mirrored)
                ctx.save(); ctx.translate(56, 0); ctx.scale(-1, 1);
                ctx.strokeStyle = 'rgba(255, 107, 26,' + e.alpha.toFixed(3) + ')';
                tracePoly(HALF_OUTER); ctx.stroke();
                tracePoly(HALF_INNER); ctx.stroke();
                ctx.restore();
                ctx.restore();
            });
        }

        function drawParticles() {
            particles.forEach(function (p) {
                p.t += p.speed;
                if (p.t > 1) {
                    p.t = 0;
                    p.src = nodes[Math.floor(rand(0, nodes.length))];
                    p.dst = nodes[Math.floor(rand(0, nodes.length))];
                }
                const x = p.src.x + (p.dst.x - p.src.x) * p.t;
                const y = p.src.y + (p.dst.y - p.src.y) * p.t;
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1;
            });
        }

        function drawNodes() {
            nodes.forEach(function (n) {
                const pulse = Math.sin(time * 0.02 + n.phase) * 0.3 + 0.7;
                const dx = mouse.x - n.x, dy = mouse.y - n.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                const hl = (mouse.active && d < 160) ? (1 - d / 160) * 0.5 : 0;

                const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 4);
                g.addColorStop(0, n.color);
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.globalAlpha = (n.baseOpacity + hl) * pulse * 0.35;
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.arc(n.x, n.y, n.radius * 4, 0, Math.PI * 2); ctx.fill();

                ctx.globalAlpha = Math.min(1, (n.baseOpacity + hl) * pulse + 0.15);
                ctx.fillStyle = n.color;
                ctx.beginPath(); ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1;
            });
        }

        function drawClickRipples() {
            clicks = clicks.filter(function (c) {
                c.radius += 3.2; c.opacity -= 0.016;
                if (c.opacity <= 0) return false;
                ctx.strokeStyle = 'rgba(34, 211, 238,' + c.opacity.toFixed(3) + ')';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2); ctx.stroke();
                return true;
            });
        }

        function drawOverlayText() {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            ctx.font = '11px JetBrains Mono, monospace';
            if (isLight) {
                ctx.fillStyle = 'rgba(37, 99, 235, 0.25)';
            } else {
                ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
            }
            ctx.textAlign = 'left';
            ctx.fillText('Boundary →', 20, 84);
            ctx.fillText('Contract →', 20, 104);
            ctx.fillText('Execute →', 20, 124);
            ctx.fillText('Verify', 20, 144);
            ctx.textAlign = 'right';
            ctx.fillText('01101001', width - 20, height - 84);
            ctx.fillText('10010110', width - 20, height - 64);
            ctx.fillText('11010010', width - 20, height - 44);
        }

        function updateNodes() {
            nodes.forEach(function (n) {
                if (mouse.active) {
                    const dx = mouse.x - n.x, dy = mouse.y - n.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 200 && d > 0.001) {
                        const f = (200 - d) / 200 * 0.03;
                        n.vx += (dx / d) * f;
                        n.vy += (dy / d) * f;
                    }
                }
                n.vx *= 0.985; n.vy *= 0.985;
                n.x += n.vx; n.y += n.vy;
                if (n.x < 30) n.vx += 0.08;
                if (n.x > width - 30) n.vx -= 0.08;
                if (n.y < 30) n.vy += 0.08;
                if (n.y > height - 30) n.vy -= 0.08;
            });
        }

        function impulse(x, y, strength) {
            nodes.forEach(function (n) {
                const dx = n.x - x, dy = n.y - y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 180 && d > 0.001) {
                    n.vx += (dx / d) * strength;
                    n.vy += (dy / d) * strength;
                }
            });
        }

        function render() {
            ctx.clearRect(0, 0, width, height);
            time++;
            drawOverlayText();
            drawEchoes();
            drawBoundaries();
            drawConnections();
            drawStacks();
            drawBinaries();
            drawSymbols();
            drawParticles();
            drawNodes();
            drawCursorLinks();
            drawClickRipples();
            updateNodes();
            requestAnimationFrame(render);
        }

        canvas.addEventListener('mousemove', function (e) {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
        });
        canvas.addEventListener('mouseleave', function () { mouse.active = false; mouse.x = -9999; mouse.y = -9999; });
        canvas.addEventListener('click', function (e) {
            const r = canvas.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            clicks.push({ x: x, y: y, radius: 5, opacity: 0.8 });
            impulse(x, y, 1.6);
        });
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            const r = canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - r.left;
            mouse.y = e.touches[0].clientY - r.top;
            mouse.active = true;
        }, { passive: false });
        canvas.addEventListener('touchstart', function (e) {
            const r = canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - r.left, y = e.touches[0].clientY - r.top;
            clicks.push({ x: x, y: y, radius: 5, opacity: 0.8 });
            impulse(x, y, 1.6);
        });
        canvas.addEventListener('touchend', function () { mouse.active = false; });

        /* pulse from the interactive mark */
        window.addEventListener('bound-pulse', function (e) {
            clicks.push({ x: e.detail.x, y: e.detail.y, radius: 6, opacity: 0.9 });
            impulse(e.detail.x, e.detail.y, 2.2);
        });

        window.addEventListener('resize', resize);
        resize();
        render();
    })();

    /* ===== SCROLL REVEAL ===== */
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

    /* ===== NAVBAR ===== */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.pageYOffset > 100);
    }, { passive: true });

    /* ===== THEME TOGGLE ===== */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = localStorage.getItem('bound-theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon(true);
    }
    function updateThemeIcon(isLight) {
        if (isLight) {
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
        } else {
            themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
        }
    }
    themeToggleBtn.addEventListener('click', function () {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('bound-theme', 'dark');
            updateThemeIcon(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('bound-theme', 'light');
            updateThemeIcon(true);
        }
    });

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenuBtn.addEventListener('click', function () {
        const open = mobileMenu.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', open);
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    /* ===== SMOOTH SCROLL ===== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ===== LIFECYCLE / ACCORDION / KEYBOARD ===== */
    function togglePhase(btn) {
        const isActive = btn.classList.contains('active');
        const group = btn.closest('.lifecycle-group');
        group.querySelectorAll('.lifecycle-phase').forEach(function (p) {
            p.classList.remove('active');
            p.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) { btn.classList.add('active'); btn.setAttribute('aria-expanded', 'true'); }
    }
    function toggleAccordion(btn) {
        const panel = btn.closest('.accordion-item').querySelector('.accordion-panel');
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.accordion-trigger').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
        document.querySelectorAll('.accordion-panel').forEach(function (p) { p.classList.remove('open'); });
        if (!isOpen) { btn.setAttribute('aria-expanded', 'true'); panel.classList.add('open'); }
    }
    document.querySelectorAll('.lifecycle-phase').forEach(function (phase) {
        phase.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePhase(phase); }
        });
    });
    document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
        trigger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAccordion(trigger); }
        });
    });
