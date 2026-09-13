// Vila do Conde 360º — a peça completa: abertura e trajetos, o filme dos
// quatro percursos e a apresentação da app, num só relógio.
// As duas metades vivem em âmbitos separados (os nomes repetem-se nas duas)
// e cruzam-se na cena Natureza, onde a descida da abertura encontra a do filme.
(function () {
  const { useComposition, clamp } = window;
  const W = 1920, H = 1080, NAVY = '#0A1A26';

  const AberturaPiece = (function () {
  const { useComposition, Easing, animate, clamp } = window;
  const NAVY = '#0A1A26', CREAM = '#F1F5F6', SAND = '#DCCBA8', GOLD = '#C9A227';
  const SERIF = "'Cormorant Garamond', serif", SANS = "'Karla', sans-serif", MONO = "'IBM Plex Mono', monospace";
  const W = 1920, H = 1080, VDUR = 5.04;
  const SRC = (s) => (window.OM_CLIPS && window.OM_CLIPS[s]) || s;      // versão autónoma: assets embutidos
  const ease = (from, to, start, end, e) => animate({ from, to, start, end, ease: e || Easing.easeInOutCubic });
  const OUT = Easing.easeOutCubic, INOUT = Easing.easeInOutCubic;
  const X = (f) => f * W, Y = (f) => f * H;
  const lerp = (a, b, t) => a + (b - a) * t;

  const CENTRO = [.30, .37];
  const RS = [0.5277, 0.4086];   // Relógio de Sol — o palco único

  const Sym = {
    agua: (
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8">
        <path d="M4 22 Q12 12 20 22 T36 22 T52 22 T68 22 M4 32 Q12 22 20 32 T36 32 T52 32 T68 32 M4 42 Q12 32 20 42 T36 42 T52 42 T68 42" />
        <g fill={GOLD} stroke="none"><circle cx="20" cy="22" r="2.6" /><circle cx="52" cy="22" r="2.6" /><circle cx="36" cy="32" r="2.6" /><circle cx="20" cy="42" r="2.6" /><circle cx="52" cy="42" r="2.6" /></g>
      </svg>
    ),
    sabores: (
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8">
        <path d="M0 20 A10 10 0 0 0 20 20 A10 10 0 0 0 40 20 A10 10 0 0 0 60 20 M10 30 A10 10 0 0 0 30 30 A10 10 0 0 0 50 30 M0 40 A10 10 0 0 0 20 40 A10 10 0 0 0 40 40 A10 10 0 0 0 60 40 M10 50 A10 10 0 0 0 30 50 A10 10 0 0 0 50 50" />
        <g fill={GOLD} stroke="none"><circle cx="20" cy="20" r="2.6" /><circle cx="40" cy="20" r="2.6" /><circle cx="30" cy="30" r="2.6" /><circle cx="20" cy="40" r="2.6" /><circle cx="40" cy="40" r="2.6" /></g>
      </svg>
    ),
    cultura: (
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8">
        <path d="M6 14 H58 M6 50 V26 A10 10 0 0 1 26 26 V50 M26 50 V26 A10 10 0 0 1 46 26 V50 M46 50 V26 A6 6 0 0 1 58 26 V50 M6 50 H58" />
        <g fill={GOLD} stroke="none"><circle cx="16" cy="16" r="2.6" /><circle cx="36" cy="16" r="2.6" /><circle cx="52" cy="16" r="2.6" /></g>
      </svg>
    ),
    natureza: (
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8">
        <path d="M32 6 C52 20 52 44 32 58 C12 44 12 20 32 6 Z M32 6 V58 M32 24 L44 18 M32 24 L20 18 M32 36 L46 30 M32 36 L18 30 M32 48 L42 44 M32 48 L22 44" />
        <g fill={GOLD} stroke="none"><circle cx="32" cy="24" r="2.6" /><circle cx="32" cy="36" r="2.6" /><circle cx="32" cy="48" r="2.6" /></g>
      </svg>
    )
  };

  const ROUTES = [
    { key: 'agua', name: 'Água', sub: 'Do rio ao mar', color: '#2F8FB5', tint: '#9FD8EC',
      pts: [[0.0864, 0.6205], [0.319, 0.6346], [0.664, 0.7501], [0.5616, 0.4498], RS] },
    { key: 'sabores', name: 'Sabores', sub: 'O peixe no centro', color: '#C9A227', tint: '#F0D888',
      pts: [[0.2819, 0.2383], [0.375, 0.2469], [0.4274, 0.244], [0.4417, 0.2785], [0.4799, 0.2923], RS] },
    { key: 'cultura', name: 'Cultura', sub: 'Pedra que fala', color: '#E0783C', tint: '#F2B27E',
      pts: [[0.2942, 0.212], [0.4056, 0.1988], [0.4653, 0.2034], [0.4131, 0.2783], [0.4735, 0.3613], [0.507, 0.3868], RS] },
    { key: 'natureza', name: 'Natureza', sub: 'Respira. Explora.', color: '#4E9E62', tint: '#96D6A6',
      pts: [[0.9853, 0.555], [0.7949, 0.5273], [0.5913, 0.4449], [0.5052, 0.4776], RS] }
  ];
  const NS = 'http://www.w3.org/2000/svg';
  // Catmull-Rom com pega sensível ao ângulo: numa inversão de sentido a pega
  // encurta e a curva fecha em canto redondo em vez de fazer gancho.
  function smooth(pts) {
    const p = pts.map((q) => [X(q[0]), Y(q[1])]);
    const grip = p.map((_, i) => {
      if (i === 0 || i === p.length - 1) return 1;
      const a = [p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]], b = [p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1]];
      const ang = Math.abs(Math.atan2(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1]) * 180 / Math.PI);
      return clamp(1 - (ang - 55) / 80, .1, 1);
    });
    let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      const k1 = grip[i] / 6, k2 = grip[i + 1] / 6;
      d += ` C${(p1[0] + (p2[0] - p0[0]) * k1).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) * k1).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) * k2).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) * k2).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  }
  ROUTES.forEach((r) => { r.d = smooth(r.pts); const el = document.createElementNS(NS, 'path'); el.setAttribute('d', r.d); r.len = el.getTotalLength(); });
  const ALL = [];
  ROUTES.forEach((r) => r.pts.forEach((p) => {
    const isRS = p === RS;
    if (isRS && ALL.some((a) => a.isRS)) return;
    ALL.push({ p, tint: r.tint, isRS });
  }));
  ALL.sort((a, b) => Math.hypot(a.p[0] - CENTRO[0], a.p[1] - CENTRO[1]) - Math.hypot(b.p[0] - CENTRO[0], b.p[1] - CENTRO[1]));

  const Dial = ({ r, draw, spin, opacity, sw }) => {
    const L = 2 * Math.PI * r;
    return (
      <g opacity={opacity}>
        <g transform={`rotate(${spin})`}>
          <circle r={r} stroke={SAND} strokeWidth={sw} strokeDasharray={L} strokeDashoffset={L * (1 - draw)} transform="rotate(-90)" opacity=".92" />
          {[0, 90, 180, 270].map((a) => (
            <line key={a} x1="0" y1={-r} x2="0" y2={-r + r * .14} stroke={GOLD} strokeWidth={sw * 1.7} transform={`rotate(${a})`} opacity={clamp((draw - .85) / .15, 0, 1)} />
          ))}
        </g>
      </g>
    );
  };

  // clipe preso ao relógio da composição.
  // O ficheiro é carregado por inteiro para um object URL: o seek por HTTP range
  // não é fiável (seekable fica vazio) e o vídeo congelaria no primeiro frame.
  const Clipe = ({ src, t, from, dur, opacity, rate = 1, blur = 0, scale = 1, bright = 1, playing = false }) => {
    const ref = React.useRef(null);
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
      const from = (window.OM_CLIPS && window.OM_CLIPS[src]) || src;   // versão autónoma: o clipe vem embutido
      let url = null, alive = true;
      setReady(false);
      fetch(from).then((r) => r.blob()).then((b) => {
        if (!alive) return;
        url = URL.createObjectURL(b);
        const v = ref.current; if (!v) return;
        v.src = url;
        v.load();
        const check = () => {
          if (!alive || !ref.current) return;
          const vv = ref.current;
          if (vv.seekable.length && vv.seekable.end(0) >= Math.min(dur, vv.duration || dur) - .05) setReady(true);
          else setTimeout(check, 120);
        };
        v.addEventListener('loadedmetadata', check, { once: true });
        check();
      }).catch(() => {});
      return () => { alive = false; if (url) URL.revokeObjectURL(url); };
    }, [src, dur]);
    // Em reprodução usa o motor do vídeo (forçar o tempo a cada frame engasga);
    // parado ou a exportar, fixa o frame exato do relógio da peça.
    const vis = opacity > .02;
    React.useEffect(() => {
      if (!ready) return;
      const want = clamp((t - from) * rate, 0.02, dur);
      [ref.current].forEach((v) => {
        if (!v) return;
        try {
          // no fim o clipe fica congelado: mandar tocar um vídeo terminado
          // fá-lo recomeçar do princípio, e o fundo entra em ciclo
          if (playing && vis && want < dur - .08) {
            if (v.playbackRate !== rate) v.playbackRate = rate;
            if (Math.abs(v.currentTime - want) > .3) v.currentTime = want;
            if (v.paused) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
          } else {
            if (!v.paused) v.pause();
            if (Math.abs(v.currentTime - want) > .04) v.currentTime = want;
          }
        } catch (e) {}
      });
    }, [t, from, dur, ready, playing, vis, rate]);
    return <video ref={ref} muted playsInline preload="auto"
      style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', display: 'block', opacity, pointerEvents: 'none',
        filter: `${blur > .05 ? `blur(${blur}px) ` : ''}brightness(${bright})`, transform: `scale(${scale})` }} />;
  };

  // Vive no topo, para não chocar com os nomes dos percursos em baixo.
  const Dado = ({ t, at, out }) => {
    const lines = ['Vinte palcos.', 'Quatro itinerários ao longo de três dias.', 'Todos se encontram no espetáculo final.'];
    const rule = ease(0, 1, at, at + 1.5, OUT)(t);
    if (rule <= 0 || out <= 0) return null;
    return (
      <div style={{ position: 'absolute', right: 104, top: 88, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14, opacity: out, textAlign: 'right', maxWidth: 620 }}>
        <div style={{ width: 92 * rule, height: 2, background: GOLD, opacity: .9 * rule }} />
        {lines.map((ln, i) => {
          const o = ease(0, 1, at + i * .95, at + i * .95 + 1.1, OUT)(t);
          if (o <= 0) return null;
          return (
            <span key={i} style={{
              fontFamily: i === 0 ? SERIF : SANS, fontWeight: i === 0 ? 500 : 400,
              fontSize: i === 0 ? 52 : 28, lineHeight: 1.25, letterSpacing: i === 0 ? '.005em' : '.03em', color: CREAM,
              opacity: o, transform: `translateY(${(1 - o) * 14}px)`, textShadow: '0 2px 30px rgba(7,20,29,.95), 0 1px 6px rgba(7,20,29,.8)'
            }}>{ln}</span>
          );
        })}
      </div>
    );
  };

  const Caption = ({ text, t, a, b, dur = 1.0, step = .09 }) => {
    const words = text.split(' ');
    const inP = ease(0, 1, a, a + dur, OUT)(t);
    const outP = ease(1, 0, b - 1.0, b, INOUT)(t);
    if (inP <= 0 || outP <= 0) return null;
    const rule = ease(0, 1, a + .2, a + dur * 1.9, OUT)(t);
    return (
      <React.Fragment>
      {/* véu próprio: o gradiente geral já se apagou à altura da frase */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '68%', pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(10,26,38,.9), rgba(10,26,38,.62) 30%, rgba(10,26,38,.34) 50%, rgba(10,26,38,0) 100%)',
        opacity: rule * outP }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 148, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: outP }}>
        <div style={{ width: 132 * rule, height: 2, background: GOLD, opacity: .9 * rule }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px', maxWidth: 1400 }}>
          {words.map((wd, i) => {
            const o = ease(0, 1, a + .15 + i * step, a + .15 + dur + i * step, OUT)(t);
            return (
              <span key={i} style={{
                fontFamily: SERIF, fontWeight: 500, fontSize: 60, lineHeight: 1.14, letterSpacing: '.005em', color: CREAM,
                opacity: o, transform: `translateY(${(1 - o) * 16}px)`, textShadow: '0 2px 34px rgba(7,20,29,.92), 0 1px 6px rgba(7,20,29,.7)'
              }}>{wd}</span>
            );
          })}
        </div>
      </div>
      </React.Fragment>
    );
  };

  function Piece() {
    const { T, CUES: C, authoredTotal: end, playing } = useComposition();
    const keys = [
      { t: 0, z: 1.30, c: [.36, .44] },
      { t: C.Concelho, z: 1.86, c: CENTRO },
      { t: C.NaoCabe, z: 1.0, c: [.5, .5] },
      { t: C.Contrario, z: 1.10, c: [.46, .48] },
      { t: C.Renda, z: 1.0, c: [.5, .5] },
      { t: C.Natureza, z: 1.09, c: [.5, .485] },   // empurra devagar até ao cruzamento
      { t: end, z: 1.09, c: [.5, .485] }
    ];
    let z = keys[0].z, cx = keys[0].c[0], cy = keys[0].c[1];
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (T >= a.t && T <= b.t) {
        const f = INOUT(clamp((T - a.t) / Math.max(b.t - a.t, .001), 0, 1));
        z = lerp(a.z, b.z, f); cx = lerp(a.c[0], b.c[0], f); cy = lerp(a.c[1], b.c[1], f); break;
      }
      if (T > b.t) { z = b.z; cx = b.c[0]; cy = b.c[1]; }
    }
    const tx = W / 2 - X(cx) * z, ty = H / 2 - Y(cy) * z;

    const pStart = C.Renda + .6;
    const rStart = C.Renda + 1.8;
    const rStep = 1.35;
    const rDur = 1.4;
    const fadeAt = C.Renda + 8.2;                        // logo depois do último nome, tudo se apaga
    const fadeOut = ease(1, 0, fadeAt, fadeAt + .8, INOUT)(T);

    const veil = 0;
    const dark = Math.min(
      ease(0, .82, C.Renda - 1.6, C.Renda - .7)(T),
      ease(.82, .34, C.Renda + .6, C.Renda + 3.4)(T),
      ease(.34, 0, fadeAt, fadeAt + 1.0)(T)          // abre antes de cruzar com o filme
    );
    const bright = 1 - Math.max(dark, 0);

    const dotIn = ease(0, 1, 5.4, 6.8, OUT)(T);
    const dialDraw = ease(0, 1, 6.6, 9.4)(T);
    const ringOut = ease(1, 0, C.Renda - 1.4, C.Renda - .6)(T);
    const rsDial = ease(0, 1, C.Renda + 1.0, C.Renda + 2.2)(T);

    const caps = [
      ['Um festival tem um recinto.', 1.0, 5.7, 1.9, .2],
      ['Tudo o que acontece, acontece lá dentro.', 6.7, 11.2, 1.5, .13],
      ['Vila do Conde tem 149 quilómetros quadrados.', C.Concelho + .3, C.Concelho + 4.0],
      ['Vinte e uma freguesias.', C.Concelho + 4.2, C.Concelho + 6.9],
      ['Um aqueduto com 999 arcos.', C.Concelho + 7.1, C.Concelho + 10.2],
      ['Isto não cabe num recinto.', C.NaoCabe + .5, C.NaoCabe + 3.4],
      ['Por isso fizemos o contrário.', C.Contrario + .15, C.Contrario + 3.2]
    ];

    return (
      <div data-screen-label={`t=${Math.floor(T)}s`} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: NAVY, fontFamily: SANS, color: CREAM }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${tx}px,${ty}px) scale(${z})` }}>
          <img src={SRC('assets/aerea-vc.png')} alt="" style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', display: 'block', filter: `brightness(${bright}) saturate(${.78 + .32 * bright})` }} />
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }} fill="none">
            <g transform={`translate(${X(CENTRO[0])} ${Y(CENTRO[1])})`} opacity={dotIn * ringOut}>
              <circle r={112 / z} fill={GOLD} opacity={(.16 + .14 * Math.sin(T * 1.6)) * clamp((dotIn - .3) / .7, 0, 1)} style={{ filter: `blur(${26 / z}px)` }} />
              <g transform={`scale(${1 + .05 * Math.sin(T * 1.75)})`} opacity={clamp((dotIn - .35) / .65, 0, 1)}>
                <circle r={30} stroke={SAND} strokeWidth={3.4 / z} opacity=".95" />
                <circle r={15} stroke={SAND} strokeWidth={3.4 / z} opacity=".95" />
                <path d="M0 -30 V30 M-30 0 H30 M-21.2 -21.2 L21.2 21.2 M21.2 -21.2 L-21.2 21.2" stroke={SAND} strokeWidth={2.6 / z} opacity=".9" />
                <path d="M0 -30 L21.2 -21.2 L30 0 L21.2 21.2 L0 30 L-21.2 21.2 L-30 0 L-21.2 -21.2 Z" stroke={SAND} strokeWidth={2.6 / z} opacity=".9" />
                <g fill={GOLD} stroke="none"><circle cx="0" cy="-30" r={3.4 / z} /><circle cx="30" cy="0" r={3.4 / z} /><circle cx="0" cy="30" r={3.4 / z} /><circle cx="-30" cy="0" r={3.4 / z} /></g>
              </g>
              <circle r={(5 + .9 * Math.sin(T * 1.75)) / z} fill={GOLD} />
              <Dial r={128} draw={dialDraw} spin={(T - 6.6) * 1.6} opacity={1} sw={3.8 / z} />
            </g>
            <g opacity={fadeOut}>
              {ROUTES.map((r, i) => {
                const at = rStart + i * rStep;
                const draw = ease(0, 1, at, at + rDur, OUT)(T);
                if (draw <= 0) return null;
                return (
                  <g key={r.key}>
                    <path d={r.d} stroke={r.color} strokeWidth={18} strokeLinecap="round" opacity={.34} style={{ filter: 'blur(8px)' }} strokeDasharray={r.len} strokeDashoffset={(1 - draw) * r.len} />
                    <path d={r.d} stroke={NAVY} strokeWidth={7.5} strokeLinecap="round" opacity={.45} strokeDasharray={r.len} strokeDashoffset={(1 - draw) * r.len} />
                    <path d={r.d} stroke={r.tint} strokeWidth={3.8} strokeLinecap="round" strokeDasharray={r.len} strokeDashoffset={(1 - draw) * r.len} />
                  </g>
                );
              })}
              {ALL.map((a, i) => {
                const at = pStart + i * .085;
                const on = ease(0, 1, at, at + .55, OUT)(T);
                const rr = a.isRS ? 10 : 5.6;
                return (
                  <g key={i} transform={`translate(${X(a.p[0])} ${Y(a.p[1])})`} opacity={on}>
                    <circle r={rr} fill={NAVY} stroke={a.isRS ? GOLD : a.tint} strokeWidth={2.4} opacity=".95" />
                    <circle r={rr * .4} fill={GOLD} />
                    {a.isRS ? (<g><circle r={54} fill={GOLD} opacity={(.14 + .12 * Math.sin(T * 1.6)) * rsDial} style={{ filter: 'blur(14px)' }} /><Dial r={42} draw={rsDial} spin={(T - C.Renda) * 1.4} opacity={rsDial} sw={2.6} /></g>) : null}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <div style={{ position: 'absolute', inset: 0, background: '#07141d', opacity: veil, pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(7,20,29,${.72 * Math.max(fadeOut, .3)}), rgba(7,20,29,${.2 * fadeOut}) 30%, rgba(7,20,29,0) 52%)`, pointerEvents: 'none' }} />

        {caps.map(([txt, a, b, dur, step], i) => <Caption key={i} text={txt} t={T} a={a} b={b} dur={dur} step={step} />)}
        <Dado t={T} at={C.Renda + .7} out={fadeOut} />

        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 132, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 62, opacity: fadeOut }}>
          {ROUTES.map((r, i) => {
            const at = rStart + i * rStep;
            const cadence = [.045, .036, .04, .033][i];      // cada nome com o seu compasso
            const dur = [1.0, .9, 1.05, .95][i];
            const o = ease(0, 1, at, at + dur + r.name.length * cadence, OUT)(T);
            const rule = ease(0, 1, at, at + .85, OUT)(T);
            const symIn = ease(0, 1, at + .12, at + .9, OUT)(T);
            return (
              <div key={r.key} style={{ width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 2, height: 48 * rule, background: 'linear-gradient(to bottom, rgba(220,203,168,0), rgba(220,203,168,.95))' }} />
                <div style={{ width: 68, height: 68, color: r.tint, opacity: symIn, filter: `drop-shadow(0 2px 10px rgba(7,20,29,.85)) blur(${(1 - symIn) * 3}px)`, transform: `scale(${lerp(.84, 1, symIn)}) rotate(${lerp(-4, 0, symIn)}deg)` }}>{Sym[r.key]}</div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  {r.name.split('').map((ch, j) => {
                    const lo = ease(0, 1, at + .34 + j * cadence, at + .34 + .7 + j * cadence, OUT)(T);
                    return (
                      <span key={j} style={{
                        display: 'inline-block', fontFamily: SERIF, fontWeight: 500, fontSize: 48, lineHeight: 1.05, color: CREAM,
                        letterSpacing: '.012em', opacity: lo,
                        transform: `translateY(${(1 - lo) * (5 + (j % 3) * 2)}px)`,
                        filter: `blur(${(1 - lo) * 6}px)`,
                        textShadow: '0 2px 26px rgba(7,20,29,.95), 0 1px 5px rgba(7,20,29,.8)'
                      }}>{ch}</span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

    return Piece;
  })();

  const FechoPiece = (function () {
  const { useComposition, Shot, Easing, animate, clamp } = window;
  const NAVY = '#0A1A26', TEAL = '#11414F', CREAM = '#F1F5F6', SAND = '#DCCBA8', GOLD = '#C9A227', MUTED = '#78909E';
  const SERIF = "'Cormorant Garamond', serif", SANS = "'Karla', sans-serif", MONO = "'IBM Plex Mono', monospace";
  const SRC = (s) => (window.OM_CLIPS && window.OM_CLIPS[s]) || s;      // versão autónoma: assets embutidos
  const W = 1920, H = 1080, PW = 360, PH = 780, PX = (W - PW) / 2, PY = (H - PH) / 2;

  const MOTION = {
    enter: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutCubic }),
    draw: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeInOutSine }),
    pop: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutBack })
  };

  const Clipe = ({ src, t, from, dur, opacity, blur = 0, scale = 1, playing = false }) => {
    const ref = React.useRef(null), back = React.useRef(null);
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
      const from = (window.OM_CLIPS && window.OM_CLIPS[src]) || src;   // versão autónoma: o clipe vem embutido
      let url = null, alive = true;
      setReady(false);
      const start = setTimeout(() => {
      fetch(from).then((r) => r.blob()).then((b) => {
        if (!alive) return;
        url = URL.createObjectURL(b);
        [ref.current, back.current].forEach((v) => { if (v) { v.src = url; v.load(); } });
        const check = () => {
          if (!alive || !ref.current) return;
          const v = ref.current;
          if (v.seekable.length && v.seekable.end(0) >= Math.min(dur, v.duration || dur) - .05) setReady(true);
          else setTimeout(check, 120);
        };
        check();
      }).catch(() => {});
      }, 250);
      return () => { alive = false; clearTimeout(start); if (url) URL.revokeObjectURL(url); };
    }, [src, dur]);
    // Em reprodução usa o motor do vídeo (forçar o tempo a cada frame engasga);
    // parado ou a exportar, fixa o frame exato do relógio da peça.
    const vis = opacity > .02;
    React.useEffect(() => {
      if (!ready) return;
      const want = clamp((t - from) * 1, 0.02, dur);
      [ref.current, back.current].forEach((v) => {
        if (!v) return;
        try {
          // no fim o clipe fica congelado: mandar tocar um vídeo terminado
          // fá-lo recomeçar do princípio, e o fundo entra em ciclo
          if (playing && vis && want < dur - .08) {
            if (v.playbackRate !== 1) v.playbackRate = 1;
            if (Math.abs(v.currentTime - want) > .3) v.currentTime = want;
            if (v.paused) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
          } else {
            if (!v.paused) v.pause();
            if (Math.abs(v.currentTime - want) > .04) v.currentTime = want;
          }
        } catch (e) {}
      });
    }, [t, from, dur, ready, playing, vis]);
    const common = { muted: true, playsInline: true, preload: 'auto' };
    return (
      <div style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none', overflow: 'hidden', background: '#07141d', filter: blur > .05 ? `blur(${blur}px)` : 'none', transform: `scale(${scale})` }}>
        <video ref={back} {...common} style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', filter: 'blur(34px) brightness(.45) saturate(.8)', transform: 'scale(1.12)' }} />
        <video ref={ref} {...common} style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'contain' }} />
      </div>
    );
  };

  const Mark = ({ size = 40, stroke = SAND, sw = 5 }) => (
    <svg width={size} height={size} viewBox="-20 -20 160 160" fill="none" stroke={stroke} strokeWidth={sw}>
      <path d="M140 100 L60 100 A40 40 0 0 1 20 60 M20 140 L20 60 A40 40 0 0 1 60 20 M-20 20 L60 20 A40 40 0 0 1 100 60 M100 -20 L100 60 A40 40 0 0 1 60 100" />
      <circle cx="60" cy="60" r="22" strokeWidth={sw * 0.8} /><path d="M60 38 V82 M38 60 H82" strokeWidth={sw * 0.8} />
      <circle cx="60" cy="60" r="7" fill={GOLD} stroke="none" />
    </svg>
  );
  const Rosette = ({ size, p = 1, rot = 0, style }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={SAND} strokeWidth=".9" style={{ transform: `rotate(${rot}deg)`, ...style }}>
      <circle cx="32" cy="32" r="30" strokeDasharray="1.5 3" strokeWidth=".6" opacity={p} />
      <circle cx="32" cy="32" r="26" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
      <circle cx="32" cy="32" r="22" strokeWidth=".5" opacity={p} />
      <path d="M16 22 H48 M16 44 V32 A8 8 0 0 1 32 32 V44 M32 44 V32 A8 8 0 0 1 48 32 V44 M16 44 H48" strokeWidth="1.2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
      <g fill={GOLD} stroke="none" opacity={p}><circle cx="24" cy="22" r="1" /><circle cx="40" cy="22" r="1" /><circle cx="32" cy="6" r=".9" /><circle cx="32" cy="58" r=".9" /><circle cx="6" cy="32" r=".9" /><circle cx="58" cy="32" r=".9" /></g>
    </svg>
  );
  const Lace = ({ id, opacity = .3 }) => (
    <defs><pattern id={id} width="80" height="40" patternUnits="userSpaceOnUse">
      <path d="M0 20 C20 0 20 0 40 20 S60 40 80 20 M0 20 C20 40 20 40 40 20 S60 0 80 20" stroke={SAND} strokeWidth=".6" strokeOpacity={opacity} fill="none" />
      <circle cx="40" cy="20" r="1.2" fill={GOLD} fillOpacity={opacity + .2} />
    </pattern></defs>
  );

  const ROUTES = [
    { name: 'Água', d: 'M40 560 C70 470 120 430 170 380 S260 300 300 250', color: '#7FB7C9' },
    { name: 'Cultura', d: 'M300 250 C270 330 300 400 260 450 S200 520 210 600', color: '#F2B27E' },
    { name: 'Sabores', d: 'M90 330 C130 370 190 360 230 400 S290 470 280 520', color: GOLD },
    { name: 'Natureza', d: 'M30 470 C90 450 150 490 210 470 S290 430 330 410', color: '#9FBF8F' }
  ];
  const FINAL = { x: 240, y: 430 };

  function Screen({ T, C }) {
    const tRoutes = MOTION.draw(0, 1, C.Percursos + .3, C.Percursos + 3.2)(T);
    const labelsIn = MOTION.enter(0, 1, C.Percursos + 2.6, C.Percursos + 3.4)(T);
    const focusScale = MOTION.enter(1, 2.4, C.Carimbar, C.Carimbar + 1.2)(T);
    const walk = MOTION.draw(0, 1, C.Carimbar + .2, C.Carimbar + 1.6)(T);
    const ring = MOTION.enter(0, 1, C.Carimbar + 1.6, C.Carimbar + 2.4)(T);
    const tap = MOTION.pop(0, 1, C.Carimbar + 2.4, C.Carimbar + 2.9)(T);
    const stampP = MOTION.draw(0, 1, C.Carimbar + 2.9, C.Carimbar + 4.2)(T);
    const stampDrop = MOTION.pop(1.8, 1, C.Carimbar + 2.9, C.Carimbar + 3.6)(T);
    const passIn = MOTION.enter(0, 1, C.Passaporte - .4, C.Passaporte + .5)(T);
    const stamps = [0, 1, 2, 3, 4, 5].map((i) => MOTION.pop(0, 1, C.Passaporte + .5 + i * .28, C.Passaporte + 1.0 + i * .28)(T));
    const bar = MOTION.draw(0, .72, C.Passaporte + .8, C.Passaporte + 2.8)(T);
    const points = Math.round(MOTION.draw(0, 280, C.Passaporte + .8, C.Passaporte + 2.8)(T));
    const prizeIn = MOTION.enter(0, 1, C.Prémio - .2, C.Prémio + .7)(T);
    const prizeGlow = MOTION.pop(0, 1, C.Prémio + .8, C.Prémio + 1.6)(T);
    const px = 40 + (170 - 40) * walk, py = 560 + (380 - 560) * walk;
    const mapOn = T < C.Carimbar + 2.9;
    const focusX = 170, focusY = 380;
    return (
      <div style={{ position: 'absolute', inset: 0, background: NAVY, overflow: 'hidden', fontFamily: SANS, color: CREAM }}>
        <div style={{ position: 'absolute', inset: 0, opacity: mapOn ? 1 : 1, transformOrigin: `${focusX}px ${focusY}px`, transform: `scale(${focusScale})` }}>
          <svg width={PW} height={PH} viewBox={`0 0 ${PW} ${PH}`} style={{ position: 'absolute', inset: 0 }} fill="none">
            <Lace id="laceS" />
            <path d="M-20 220 C60 200 140 280 210 260 S300 180 380 210 L380 0 L-20 0 Z" fill={TEAL} opacity=".55" />
            <path d="M-20 220 C60 200 140 280 210 260 S300 180 380 210" stroke="#3E7D8C" strokeWidth="1.2" />
            <rect y="260" width={PW} height="520" fill="url(#laceS)" />
            <path d="M60 270 V760 M130 270 V760 M200 270 V760 M270 270 V760 M0 340 H360 M0 420 H360 M0 500 H360 M0 580 H360 M0 660 H360" stroke={SAND} strokeOpacity=".1" />
            {ROUTES.map((r, i) => {
              const p = clamp((tRoutes - i * .12) / .64, 0, 1);
              return <path key={r.name} d={r.d} stroke={r.color} strokeWidth="2.6" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} strokeLinecap="round" />;
            })}
            {[[300, 250], [40, 560], [90, 330], [30, 470], [210, 600], [280, 520], [330, 410]].map(([x, y], i) => (
              <g key={i} opacity={clamp((tRoutes - .2 - i * .08) / .3, 0, 1)}><circle cx={x} cy={y} r="8" fill={NAVY} stroke={SAND} strokeWidth="1.2" /><circle cx={x} cy={y} r="2.2" fill={GOLD} /></g>
            ))}
            <g opacity={labelsIn}><circle cx={FINAL.x} cy={FINAL.y} r={14 + 6 * Math.sin(T * 3)} stroke={GOLD} strokeWidth="1" strokeDasharray="2 4" /><circle cx={FINAL.x} cy={FINAL.y} r="5" fill={GOLD} /></g>
            <g opacity={clamp((tRoutes - .3) / .3, 0, 1)}>
              <circle cx={focusX} cy={focusY} r="11" fill={NAVY} stroke={SAND} strokeWidth="1.2" />
              <path d={`M${focusX - 6} ${focusY - 4} H${focusX + 6} M${focusX - 6} ${focusY + 5} V${focusY - 1} A3 3 0 0 1 ${focusX} ${focusY - 1} V${focusY + 5} M${focusX} ${focusY + 5} V${focusY - 1} A3 3 0 0 1 ${focusX + 6} ${focusY - 1} V${focusY + 5}`} stroke={SAND} strokeWidth=".9" />
            </g>
            <g opacity={ring}><circle cx={focusX} cy={focusY} r={16 + 22 * ring} stroke={GOLD} strokeWidth="1" opacity={1 - ring * .6} /><circle cx={focusX} cy={focusY} r={16 + 44 * ring} stroke={GOLD} strokeWidth=".6" opacity={.6 - ring * .6} /></g>
            <g opacity={clamp((T - C.Carimbar) / .4, 0, 1) * (1 - tap)}><circle cx={px} cy={py} r="5" fill={GOLD} /><circle cx={px} cy={py} r="10" stroke={GOLD} strokeOpacity=".5" /></g>
          </svg>
          {ROUTES.map((r, i) => {
            const pos = [[300, 232], [176, 616], [96, 312], [230, 452]][i];
            return <div key={r.name} style={{ position: 'absolute', left: pos[0], top: pos[1], transform: `translate(-50%,-100%) translateY(${(1 - labelsIn) * 8}px)`, opacity: labelsIn * (1 - clamp((T - C.Carimbar) / .4, 0, 1)), fontFamily: SERIF, fontSize: 16, color: r.color, background: 'rgba(10,26,38,.82)', padding: '2px 8px', whiteSpace: 'nowrap' }}>{r.name}</div>;
          })}
        </div>
        <div style={{ position: 'absolute', top: 54, left: 18, right: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: mapOn ? 1 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mark size={28} /><span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 20, lineHeight: 1 }}>360<span style={{ color: GOLD, fontWeight: 400 }}>º</span></span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', border: '1px solid rgba(220,203,168,.35)', borderRadius: 999, fontSize: 10, letterSpacing: '.06em' }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD }} />Dia 3</div>
        </div>
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 34, background: CREAM, color: NAVY, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, transform: `translateY(${(1 - MOTION.enter(0, 1, C.Carimbar + 1.5, C.Carimbar + 2.1)(T)) * 140}px)`, opacity: 1 - tap }}>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: '#8A6C11' }}>Estás no ponto</span>
          <span style={{ fontFamily: SERIF, fontSize: 24, lineHeight: 1 }}>Ponto de carimbo</span>
          <div style={{ background: GOLD, color: NAVY, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontWeight: 600, transform: `scale(${1 + tap * .08})` }}><span>Carimbar</span><span style={{ fontFamily: MONO, fontSize: 10 }}>+40</span></div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: TEAL, opacity: clamp((T - (C.Carimbar + 2.6)) / .3, 0, 1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18 }}>
          <svg width={PW} height={PH} style={{ position: 'absolute', inset: 0 }}><Lace id="laceT" opacity=".35" /><rect width={PW} height={PH} fill="url(#laceT)" /></svg>
          <div style={{ position: 'relative', transform: `scale(${stampDrop}) rotate(-6deg)`, filter: `drop-shadow(0 ${16 * (stampDrop - 1) + 6}px 14px rgba(0,0,0,.5))` }}><Rosette size={200} p={stampP} /></div>
          <div style={{ position: 'relative', fontFamily: SERIF, fontSize: 34, lineHeight: .95, textAlign: 'center', opacity: clamp((stampP - .7) / .3, 0, 1) }}>Onde passas,<br /><em style={{ fontWeight: 400, color: SAND }}>carimbas.</em></div>
          <div style={{ position: 'relative', fontFamily: SERIF, fontSize: 44, color: GOLD, opacity: clamp((stampP - .8) / .2, 0, 1) }}>+{Math.round(40 * clamp((stampP - .8) / .2, 0, 1))}</div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: SAND, color: NAVY, transform: `translateY(${(1 - passIn) * PH}px)`, display: 'flex', flexDirection: 'column', padding: '60px 18px 0', boxShadow: '0 -20px 40px rgba(0,0,0,.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: '#8A6C11' }}>Passaporte</span><span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 34, lineHeight: .9 }}>Marinheiro</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}><span style={{ fontFamily: SERIF, fontSize: 30, lineHeight: 1 }}>{points}</span><span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8A6C11' }}>pontos</span></div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '.06em', color: '#5C4E2A' }}><span>Nível 02</span><span>Mestre aos 600</span></div>
            <div style={{ height: 2, background: 'rgba(10,26,38,.15)', position: 'relative' }}><div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${bar * 100}%`, background: NAVY }} /><div style={{ position: 'absolute', left: `${bar * 100}%`, top: -3, width: 8, height: 8, borderRadius: '50%', background: GOLD, transform: 'translateX(-50%)' }} /></div>
          </div>
          <div style={{ marginTop: 22, background: 'rgba(241,245,246,.55)', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span style={{ fontFamily: SERIF, fontSize: 20 }}>Cultura</span><span style={{ fontFamily: MONO, fontSize: 9, color: '#8A6C11' }}>{stamps.filter((s) => s > .5).length}/6</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {stamps.map((s, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
                  <svg viewBox="0 0 64 64" fill="none" stroke="#8A7952" strokeWidth="1" strokeDasharray="2 4" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}><circle cx="32" cy="32" r="28" /></svg>
                  <svg viewBox="0 0 64 64" fill="none" stroke={TEAL} strokeWidth="1.6" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: `scale(${s}) rotate(${(i % 2 ? 5 : -6) * s}deg)`, opacity: s }}><circle cx="32" cy="32" r="28" /><path d="M16 22 H48 M16 44 V32 A8 8 0 0 1 32 32 V44 M32 44 V32 A8 8 0 0 1 48 32 V44 M16 44 H48" /></svg>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 18, background: NAVY, color: CREAM, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: prizeIn, transform: `translateY(${(1 - prizeIn) * 30}px)`, boxShadow: `0 0 ${30 * prizeGlow}px rgba(201,162,39,${.6 * prizeGlow})`, border: `1px solid rgba(201,162,39,${prizeGlow})` }}>
            <Mark size={38} sw={3} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD }}>Prémio final</span><span style={{ fontFamily: SERIF, fontSize: 17, lineHeight: 1.05 }}>A renda das artesãs</span><span style={{ fontSize: 10, color: '#C0CFD7' }}>Passaporte completo · edição numerada</span></div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 70, background: NAVY, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', alignItems: 'start', paddingTop: 12, color: MUTED, fontSize: 9, letterSpacing: '.08em', textAlign: 'center' }}><span>Mapa</span><span>Percursos</span><span style={{ color: SAND }}>Passaporte</span><span>Prémios</span></div>
        </div>
      </div>
    );
  }


  const ROTAS = {
    natureza: { key: 'natureza', name: 'Natureza', motto: 'Aventura. Respira. Explora.', tint: '#96D6A6' },
    mar: { key: 'mar', name: 'Água', motto: 'Do rio ao mar.', tint: '#9FD8EC' },
    cultura: { key: 'cultura', name: 'Cultura', motto: 'Pedra que fala.', tint: '#F2B27E' },
    sabores: { key: 'sabores', name: 'Sabores', motto: 'O peixe no centro.', tint: '#F0D888' }
  };

  // ——— Sistema de texto do filme ———————————————————————————————
  // Selo de local (canto superior esquerdo), cartão de trajeto (baixo,
  // centrado) e frase de fecho. Nunca entra texto nas passagens pelo
  // telemóvel: é o momento mais forte do filme.
  const SymF = {
    mar: (
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8">
        <path d="M4 22 Q12 12 20 22 T36 22 T52 22 T68 22 M4 32 Q12 22 20 32 T36 32 T52 32 T68 32 M4 42 Q12 32 20 42 T36 42 T52 42 T68 42" />
        <g fill={GOLD} stroke="none"><circle cx="20" cy="22" r="2.6" /><circle cx="52" cy="22" r="2.6" /><circle cx="36" cy="32" r="2.6" /><circle cx="20" cy="42" r="2.6" /><circle cx="52" cy="42" r="2.6" /></g>
      </svg>
    ),
    sabores: (
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8">
        <path d="M0 20 A10 10 0 0 0 20 20 A10 10 0 0 0 40 20 A10 10 0 0 0 60 20 M10 30 A10 10 0 0 0 30 30 A10 10 0 0 0 50 30 M0 40 A10 10 0 0 0 20 40 A10 10 0 0 0 40 40 A10 10 0 0 0 60 40 M10 50 A10 10 0 0 0 30 50 A10 10 0 0 0 50 50" />
        <g fill={GOLD} stroke="none"><circle cx="20" cy="20" r="2.6" /><circle cx="40" cy="20" r="2.6" /><circle cx="30" cy="30" r="2.6" /><circle cx="20" cy="40" r="2.6" /><circle cx="40" cy="40" r="2.6" /></g>
      </svg>
    ),
    cultura: (
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8">
        <path d="M6 14 H58 M6 50 V26 A10 10 0 0 1 26 26 V50 M26 50 V26 A10 10 0 0 1 46 26 V50 M46 50 V26 A6 6 0 0 1 58 26 V50 M6 50 H58" />
        <g fill={GOLD} stroke="none"><circle cx="16" cy="16" r="2.6" /><circle cx="36" cy="16" r="2.6" /><circle cx="52" cy="16" r="2.6" /></g>
      </svg>
    ),
    natureza: (
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8">
        <path d="M32 6 C52 20 52 44 32 58 C12 44 12 20 32 6 Z M32 6 V58 M32 24 L44 18 M32 24 L20 18 M32 36 L46 30 M32 36 L18 30 M32 48 L42 44 M32 48 L22 44" />
        <g fill={GOLD} stroke="none"><circle cx="32" cy="24" r="2.6" /><circle cx="32" cy="36" r="2.6" /><circle cx="32" cy="48" r="2.6" /></g>
      </svg>
    )
  };

  const Selo = ({ T, at, out, text }) => {
    const i = MOTION.enter(0, 1, at, at + .7)(T);
    const o = MOTION.enter(1, 0, out - .5, out)(T);
    if (i <= .001 || o <= .001) return null;
    return (
      <div style={{ position: 'absolute', left: 96, top: 84, display: 'flex', alignItems: 'center', gap: 14,
        background: 'rgba(10,26,38,.8)', border: '1px solid rgba(220,203,168,.34)', padding: '11px 22px',
        opacity: i * o, transform: `translateX(${(1 - i) * -18}px)`, backdropFilter: 'blur(3px)' }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: GOLD, flex: 'none' }} />
        <span style={{ fontFamily: MONO, fontSize: 23, letterSpacing: '.2em', textTransform: 'uppercase', color: CREAM, whiteSpace: 'nowrap' }}>{text}</span>
      </div>
    );
  };

  const Cartao = ({ T, at, out, rota }) => {
    const i = MOTION.enter(0, 1, at, at + 1.0)(T);
    const o = MOTION.enter(1, 0, out - .7, out)(T);
    if (i <= .001 || o <= .001) return null;
    const rule = MOTION.enter(0, 1, at, at + .8)(T);
    const sym = MOTION.enter(0, 1, at + .18, at + 1.0)(T);
    const cad = .042;
    return (
      <React.Fragment>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '52%', pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(10,26,38,.88), rgba(10,26,38,.5) 38%, rgba(10,26,38,0) 100%)',
        opacity: i * o }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 108, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: o, pointerEvents: 'none' }}>
        <div style={{ width: 2, height: 52 * rule, background: 'linear-gradient(to bottom, rgba(220,203,168,0), rgba(220,203,168,.95))' }} />
        <div style={{ width: 78, height: 78, color: rota.tint, opacity: sym,
          filter: `drop-shadow(0 2px 14px rgba(7,20,29,.9)) blur(${(1 - sym) * 3}px)`,
          transform: `scale(${1 - .16 * (1 - sym)}) rotate(${-4 * (1 - sym)}deg)` }}>{SymF[rota.key]}</div>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {rota.name.split('').map((ch, j) => {
            const lo = MOTION.enter(0, 1, at + .34 + j * cad, at + 1.04 + j * cad)(T);
            return (
              <span key={j} style={{ display: 'inline-block', fontFamily: SERIF, fontWeight: 500, fontSize: 82, lineHeight: 1.02,
                letterSpacing: '.012em', color: CREAM, opacity: lo,
                transform: `translateY(${(1 - lo) * (6 + (j % 3) * 3)}px)`,
                filter: `blur(${(1 - lo) * 7}px)`,
                textShadow: '0 2px 34px rgba(7,20,29,.95), 0 1px 8px rgba(7,20,29,.85)' }}>{ch === ' ' ? '\u00A0' : ch}</span>
            );
          })}
        </div>
        <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: '.24em', textTransform: 'uppercase', color: SAND,
          opacity: MOTION.enter(0, 1, at + .9, at + 1.7)(T), textShadow: '0 2px 20px rgba(7,20,29,.95)' }}>{rota.motto}</span>
      </div>
      </React.Fragment>
    );
  };

  const Frase = ({ T, at, out, text, size = 88, wide = 1420 }) => {
    const o = MOTION.enter(1, 0, out - .9, out)(T);
    const rule = MOTION.enter(0, 1, at, at + .9)(T);
    if (rule <= .001 || o <= .001) return null;
    const words = text.split(' ');
    return (
      <React.Fragment>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '62%', pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(10,26,38,.9), rgba(10,26,38,.55) 34%, rgba(10,26,38,0) 100%)',
        opacity: rule * o }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, opacity: o, pointerEvents: 'none' }}>
        <div style={{ width: 132 * rule, height: 2, background: GOLD, opacity: .92 * rule }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 20px', maxWidth: wide }}>
          {words.map((wd, i) => {
            const wo = MOTION.enter(0, 1, at + .3 + i * .17, at + 1.4 + i * .17)(T);
            return (
              <span key={i} style={{ fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 1.12, letterSpacing: '.004em', color: CREAM,
                opacity: wo, transform: `translateY(${(1 - wo) * 18}px)`,
                textShadow: '0 2px 38px rgba(7,20,29,.95), 0 1px 8px rgba(7,20,29,.9)' }}>{wd}</span>
            );
          })}
        </div>
      </div>
      </React.Fragment>
    );
  };

  function Piece() {
    const { T, CUES: C, authoredTotal: end, playing } = useComposition();
    const Z = C.Aérea;                                    // início da animação noturna

    // O clipe do utilizador abre a peça e cruza-se com a vista aérea noturna:
    // apaga meio segundo antes do corte, a noite acende meio segundo depois.
    const HALF = .5, BLUR = 20, PUSH = .06;
    const outAt = (cue) => MOTION.draw(1, 0, cue - HALF, cue)(T);
    const inAt = (cue) => MOTION.draw(0, 1, cue, cue + HALF)(T);
    const veil = 0;

    const zoom = MOTION.draw(1.0, 1.1, Z - 1.2, end)(T);    // o congelamento continua a respirar
    const dim = MOTION.enter(0, .5, C.Telemóvel + .15, C.Telemóvel + 1.5)(T);
    const phoneY = MOTION.enter(H + 100, PY, C.Telemóvel, C.Telemóvel + 1.4)(T);
    const phoneOut = MOTION.enter(1, .001, C.Fecho, C.Fecho + .9)(T);
    const phoneScale = T < C.Fecho ? 1 : phoneOut;
    const titleIn = MOTION.enter(0, 1, Z + .9, Z + 2.3)(T);
    const titleOut = MOTION.enter(1, 0, C.Telemóvel - .2, C.Telemóvel + .5)(T);
    const closeIn = MOTION.enter(0, 1, C.Fecho + .6, C.Fecho + 1.6)(T);
    const tagIn = MOTION.enter(0, 1, C.Fecho + 1.2, C.Fecho + 2.2)(T);
    const sideL = MOTION.enter(0, 1, C.Percursos + .4, C.Percursos + 1.2)(T) * (T < C.Fecho ? 1 : 1 - closeIn);
    const sideText = T < C.Carimbar ? { k: '01 · Percursos', t: 'Quatro percursos pela cidade.', s: 'Água, Sabores, Cultura, Natureza.' }
      : T < C.Passaporte ? { k: '02 · Carimbos', t: 'Onde passas, carimbas.', s: 'Cada ponto vale 40 pontos.' }
      : T < C.Prémio ? { k: '03 · Passaporte', t: 'Os carimbos somam níveis.', s: 'Grumete, Marinheiro, Mestre, Capitão.' }
      : { k: '04 · Prémio', t: 'Um passaporte completo', s: 'dá direito à renda das artesãs.' };

    return (
      <div data-screen-label={`t=${Math.floor(T)}s`} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: NAVY, fontFamily: SANS, color: CREAM }}>
        {/* noite */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <div style={{ position: 'absolute', inset: 0, background: `rgba(7,20,29,${dim})` }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,20,29,.7), rgba(7,20,29,0) 40%)' }} />
          <div style={{ position: 'absolute', left: 120, bottom: 110, display: 'flex', flexDirection: 'column', gap: 14, opacity: titleIn * titleOut, transform: `translateY(${(1 - titleIn) * 24}px)` }}>
            <span style={{ fontFamily: MONO, fontSize: 25, letterSpacing: '.18em', textTransform: 'uppercase', color: GOLD, textShadow: '0 2px 16px rgba(7,20,29,.95)' }}>Vila do Conde · três dias</span>
            <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 96, lineHeight: .9, letterSpacing: '-.02em' }}>A cidade é o palco.</span>
          </div>
          <Shot from={C.Percursos} to={C.Fecho + .7}><div style={{ position: 'absolute', left: 140, top: '50%', transform: `translateY(-50%) translateX(${(1 - sideL) * -30}px)`, opacity: sideL, display: 'flex', flexDirection: 'column', gap: 16, width: 520 }}>
            <span style={{ fontFamily: MONO, fontSize: 25, letterSpacing: '.18em', textTransform: 'uppercase', color: GOLD, textShadow: '0 2px 16px rgba(7,20,29,.95)' }}>{sideText.k}</span>
            <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 56, lineHeight: .95, letterSpacing: '-.01em', textWrap: 'balance' }}>{sideText.t}</span>
            <span style={{ fontSize: 24, lineHeight: 1.4, color: '#C0CFD7' }}>{sideText.s}</span>
          </div></Shot>
          <Shot from={C.Percursos} to={C.Fecho + .7}><div style={{ position: 'absolute', right: 160, top: '50%', transform: 'translateY(-50%)', opacity: sideL * .9, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <Mark size={150} sw={2.6} />
            <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 44, lineHeight: 1 }}>360<span style={{ color: GOLD, fontWeight: 400 }}>º</span></span>
          </div></Shot>
          <div style={{ position: 'absolute', left: PX - 12, top: phoneY - 12, width: PW + 24, height: PH + 24, borderRadius: 54, background: '#0d0f12', boxShadow: '0 40px 90px rgba(0,0,0,.65), inset 0 0 0 2px #2a2e34', transform: `scale(${phoneScale})`, transformOrigin: '50% 50%', opacity: phoneScale > .05 ? 1 : 0 }}>
            <div style={{ position: 'absolute', left: 12, top: 12, width: PW, height: PH, borderRadius: 44, overflow: 'hidden', background: NAVY }}>
              <Screen T={T} C={C} />
              <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 110, height: 32, borderRadius: 20, background: '#0d0f12' }} />
              <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 120, height: 4, borderRadius: 2, background: 'rgba(241,245,246,.7)' }} />
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, opacity: closeIn, transform: `scale(${.92 + .08 * closeIn})`, background: `rgba(7,20,29,${.55 * closeIn})` }}>
            <Mark size={220} sw={3.2} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: SERIF, fontSize: 28, letterSpacing: '.14em', color: SAND }}>Vila do Conde</span>
              <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 150, lineHeight: .85, letterSpacing: '-.02em' }}>360<span style={{ color: GOLD, fontWeight: 400 }}>º</span></span>
            </div>
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 36, color: SAND, opacity: tagIn, transform: `translateY(${(1 - tagIn) * 10}px)` }}>Onde passas, carimbas.</span>
            <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: '.18em', textTransform: 'uppercase', color: CREAM, opacity: tagIn, textShadow: '0 2px 16px rgba(7,20,29,.95)' }}>viladoconde360.pt · descarrega a app</span>
          </div>
        </div>

        {/* o filme — o último fotograma congela e serve de base à apresentação */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, transform: `scale(${zoom})`, transformOrigin: '50% 50%' }}>
          <Clipe src="assets/filme.mp4" t={T} from={C.Natureza - 1.25} dur={68.3} opacity={1} blur={0} scale={1} playing={playing} />
        </div>

        {/* texto sobre o filme */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          <Selo T={T} at={C.Natureza + 2.65} out={C.Natureza + 6.25} text="Praia de Azurara" />
          <Cartao T={T} at={C.Natureza + 4.05} out={C.Natureza + 8.35} rota={ROTAS.natureza} />
          <Selo T={T} at={C.Natureza + 9.55} out={C.Natureza + 13.15} text="Passadiços de Mindelo" />

          <Selo T={T} at={C.Mar + .5} out={C.Mar + 4.1} text="Forte de São João" />
          <Cartao T={T} at={C.Mar + 1.8} out={C.Mar + 6.0} rota={ROTAS.mar} />
          <Selo T={T} at={C.Mar + 8.2} out={C.Mar + 11.8} text="Rio Ave" />

          <Selo T={T} at={C.Cultura + .4} out={C.Cultura + 3.6} text="Arcos do aqueduto" />
          <Cartao T={T} at={C.Cultura + 1.0} out={C.Cultura + 3.9} rota={ROTAS.cultura} />

          <Selo T={T} at={C.Sabores + .5} out={C.Sabores + 3.7} text="Nau Quinhentista" />
          <Cartao T={T} at={C.Sabores + 1.1} out={C.Sabores + 3.9} rota={ROTAS.sabores} />

          <Selo T={T} at={C.Festa + .5} out={C.Festa + 3.5} text="Ruas antigas" />
          <Selo T={T} at={C.Festa + 4.8} out={C.Festa + 7.8} text="Capela do Socorro" />
          <Frase T={T} at={C.Festa + 9.2} out={C.Festa + 13.8} text="Todos os caminhos se encontram na festa final." size={66} wide={1680} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: '#07141d', opacity: veil, pointerEvents: 'none' }} />
      </div>
    );
  }

    return Piece;
  })();

  function Piece() {
    const { T, CUES: C } = useComposition();
    const cut = C.Natureza;
    const p = clamp((T - (cut - 1.25)) / 1.6, 0, 1);     // 0 → 1 ao longo do cruzamento
    const s = p * p * (3 - 2 * p);                       // suaviza as duas pontas
    const sai = 1 - s;
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: NAVY }}>
        <div style={{ position: 'absolute', inset: 0, opacity: s, filter: s < .999 ? `blur(${7 * (1 - s)}px)` : 'none' }}><FechoPiece /></div>
        <div style={{ position: 'absolute', inset: 0, opacity: sai, filter: sai < .999 && sai > .001 ? `blur(${7 * s}px)` : 'none' }}><AberturaPiece /></div>
      </div>
    );
  }

  function CompletoApp() {
    React.useEffect(() => {
      const kick = () => window.dispatchEvent(new Event('resize'));
      const ids = [requestAnimationFrame(kick), setTimeout(kick, 120), setTimeout(kick, 700), setTimeout(kick, 1800)];
      return () => { cancelAnimationFrame(ids[0]); ids.slice(1).forEach(clearTimeout); };
    }, []);
    return (
      <div style={{ width: '100%', height: '100vh', background: '#07141d' }}>
        <window.CompositionStage width={W} height={H} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={NAVY}>
          <Piece />
        </window.CompositionStage>
      </div>
    );
  }
  window.CompletoApp = CompletoApp;
})();
