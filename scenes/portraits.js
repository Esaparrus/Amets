/* ============================================================
   RETRATOS DE PERSONAJES – dibujados en canvas
   Basados en las imágenes pixel art de la familia de Amets
============================================================ */

const PORTRAITS = {

  /* ── LUMI: estrella dorada en cielo morado ── */
  lumi(ctx, w, h) {
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, w, h);

    /* Estrellas de fondo */
    ctx.fillStyle = '#fbbf24';
    [[.10,.10],[.88,.09],[.50,.05],[.15,.74],[.82,.71],[.92,.40],[.05,.44],[.65,.88],[.30,.86],[.72,.28],[.38,.18]].forEach(([sx,sy]) => {
      ctx.fillRect(sx*w-1, sy*h-1, 3, 3);
    });

    /* Halo */
    const g = ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*.45);
    g.addColorStop(0,'rgba(255,215,0,.55)');
    g.addColorStop(1,'rgba(255,215,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    /* Estrella de 5 puntas */
    const cx=w/2, cy=h*.52, R=w*.38, r=w*.17;
    const drawStar = (fill) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      for(let i=0;i<10;i++){
        const a=(i*Math.PI/5)-Math.PI/2;
        const rad=i%2===0?R:r;
        i===0?ctx.moveTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a)):ctx.lineTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a));
      }
      ctx.closePath();
      ctx.fill();
    };
    drawStar('#fbbf24');
    /* Brillo interior */
    const Ri=R*.52, ri=r*.52;
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    for(let i=0;i<10;i++){
      const a=(i*Math.PI/5)-Math.PI/2;
      const rad=i%2===0?Ri:ri;
      i===0?ctx.moveTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a)):ctx.lineTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();

    /* Ojos (pixel art: rectángulos) */
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(cx-w*.12, cy-h*.05, w*.075, h*.085);
    ctx.fillRect(cx+w*.045, cy-h*.05, w*.075, h*.085);

    /* Sonrisa */
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = Math.max(2, w*.038);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy+h*.07, w*.1, 0.15, Math.PI-.15);
    ctx.stroke();
  },

  /* ── AINARA: mamá, pelo oscuro, chimenea cálida ── */
  ainara(ctx, w, h) {
    /* Fondo chimenea */
    const bg = ctx.createLinearGradient(0,0,w,h);
    bg.addColorStop(0,'#7c2d12'); bg.addColorStop(.5,'#c2410c'); bg.addColorStop(1,'#f97316');
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
    const glow = ctx.createRadialGradient(w/2,h,0,w/2,h,h*.65);
    glow.addColorStop(0,'rgba(255,165,0,.55)'); glow.addColorStop(1,'rgba(255,165,0,0)');
    ctx.fillStyle = glow; ctx.fillRect(0,0,w,h);

    const cx=w/2, hy=h*.42, hr=w*.28;

    /* Pelo (detrás, hombros) */
    ctx.fillStyle = '#2c1503';
    ctx.beginPath(); ctx.ellipse(cx,hy,hr*1.2,hr*1.38,0,0,Math.PI*2); ctx.fill();
    ctx.fillRect(cx-hr*1.2,hy-hr*.2,hr*.58,h*.55);
    ctx.fillRect(cx+hr*.62,hy-hr*.2,hr*.58,h*.55);

    /* Cuello */
    ctx.fillStyle = '#f2c9a0';
    ctx.fillRect(cx-w*.08,hy+hr*.75,w*.16,h*.18);

    /* Hombros (jersey marrón) */
    ctx.fillStyle = '#92400e';
    ctx.beginPath(); ctx.ellipse(cx,h*.96,w*.54,h*.2,0,0,Math.PI*2); ctx.fill();

    /* Cara */
    ctx.fillStyle = '#f2c9a0';
    ctx.beginPath(); ctx.ellipse(cx,hy,hr*.9,hr,0,0,Math.PI*2); ctx.fill();

    /* Pelo encima (raya al centro) */
    ctx.fillStyle = '#2c1503';
    ctx.beginPath(); ctx.arc(cx,hy-hr*.5,hr*.96,Math.PI*1.05,Math.PI*1.95); ctx.fill();
    ctx.fillRect(cx-hr*.05,hy-hr*1.46,hr*.1,hr*.62);

    /* Ojos oscuros cálidos */
    ctx.fillStyle = '#2c1503';
    ctx.beginPath();
    ctx.ellipse(cx-hr*.35,hy-hr*.08,hr*.14,hr*.1,0,0,Math.PI*2);
    ctx.ellipse(cx+hr*.35,hy-hr*.08,hr*.14,hr*.1,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='white';
    ctx.beginPath();
    ctx.arc(cx-hr*.29,hy-hr*.12,hr*.04,0,Math.PI*2);
    ctx.arc(cx+hr*.41,hy-hr*.12,hr*.04,0,Math.PI*2); ctx.fill();

    /* Cejas */
    ctx.strokeStyle='#2c1503'; ctx.lineWidth=Math.max(2,w*.032); ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(cx-hr*.52,hy-hr*.28); ctx.quadraticCurveTo(cx-hr*.35,hy-hr*.37,cx-hr*.18,hy-hr*.28);
    ctx.moveTo(cx+hr*.18,hy-hr*.28); ctx.quadraticCurveTo(cx+hr*.35,hy-hr*.37,cx+hr*.52,hy-hr*.28);
    ctx.stroke();

    /* Sonrisa abierta */
    ctx.fillStyle='#c0404a';
    ctx.beginPath(); ctx.arc(cx,hy+hr*.3,hr*.44,0.18,Math.PI-.18); ctx.fill();
    ctx.fillStyle='white';
    ctx.fillRect(cx-hr*.32,hy+hr*.3,hr*.64,hr*.26);
    /* Separación dientes */
    ctx.fillStyle='#c0404a';
    ctx.fillRect(cx-hr*.01,hy+hr*.3,hr*.02,hr*.26);
    ctx.strokeStyle='#b03040'; ctx.lineWidth=Math.max(1.5,w*.026);
    ctx.beginPath(); ctx.arc(cx,hy+hr*.3,hr*.44,0.18,Math.PI-.18); ctx.stroke();

    /* Nariz */
    ctx.strokeStyle='#d4a070'; ctx.lineWidth=Math.max(1.5,w*.025);
    ctx.beginPath(); ctx.arc(cx+hr*.12,hy+hr*.1,hr*.1,Math.PI*.5,Math.PI*1.2); ctx.stroke();
  },

  /* ── ARAI: hermana mayor, pelo recogido, bosque verde ── */
  arai(ctx, w, h) {
    const bg=ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#052e16'); bg.addColorStop(.5,'#14532d'); bg.addColorStop(1,'#166534');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    /* Luz de sol */
    const light=ctx.createRadialGradient(w/2,0,0,w/2,0,h*.65);
    light.addColorStop(0,'rgba(134,239,172,.38)'); light.addColorStop(1,'rgba(134,239,172,0)');
    ctx.fillStyle=light; ctx.fillRect(0,0,w,h);
    /* Troncos */
    ctx.fillStyle='rgba(5,46,22,.75)';
    [[.06,.06],[.2,.07],[.78,.065],[.92,.06]].forEach(([bx,bw])=>ctx.fillRect(bx*w,0,bw*w,h*.6));

    const cx=w/2, hy=h*.42, hr=w*.27;

    /* Camiseta lila */
    ctx.fillStyle='#c4b5fd';
    ctx.beginPath(); ctx.ellipse(cx,h*.96,w*.56,h*.22,0,0,Math.PI*2); ctx.fill();

    /* Cuello */
    ctx.fillStyle='#f5d5b0';
    ctx.fillRect(cx-w*.07,hy+hr*.75,w*.14,h*.2);

    /* Pelo (detrás, recogido) */
    ctx.fillStyle='#a06830';
    ctx.beginPath(); ctx.ellipse(cx,hy,hr*1.05,hr*1.1,0,0,Math.PI*2); ctx.fill();
    /* Moño */
    ctx.beginPath(); ctx.arc(cx+hr*.62,hy-hr*.8,hr*.38,0,Math.PI*2); ctx.fill();
    /* Pelo hacia atrás */
    ctx.strokeStyle='#a06830'; ctx.lineWidth=hr*.18;
    ctx.beginPath();
    ctx.moveTo(cx-hr*.88,hy-hr*.3); ctx.quadraticCurveTo(cx+hr*.1,hy-hr*.9,cx+hr*.62,hy-hr*.8);
    ctx.stroke();

    /* Cara */
    ctx.fillStyle='#f5d5b0';
    ctx.beginPath(); ctx.ellipse(cx,hy,hr*.88,hr*.97,0,0,Math.PI*2); ctx.fill();

    /* Flequillo lateral */
    ctx.fillStyle='#a06830';
    ctx.beginPath(); ctx.arc(cx,hy-hr*.5,hr*.9,Math.PI*1.08,Math.PI*1.92); ctx.fill();
    ctx.fillRect(cx-hr*.9,hy-hr*.5,hr*.8,hr*.36);

    /* Ojos azules */
    ctx.fillStyle='#5090b8';
    ctx.beginPath();
    ctx.ellipse(cx-hr*.32,hy-hr*.05,hr*.16,hr*.11,0,0,Math.PI*2);
    ctx.ellipse(cx+hr*.32,hy-hr*.05,hr*.16,hr*.11,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1a3a50';
    ctx.beginPath();
    ctx.ellipse(cx-hr*.32,hy-hr*.05,hr*.09,hr*.09,0,0,Math.PI*2);
    ctx.ellipse(cx+hr*.32,hy-hr*.05,hr*.09,hr*.09,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='white';
    ctx.beginPath();
    ctx.arc(cx-hr*.27,hy-hr*.09,hr*.04,0,Math.PI*2);
    ctx.arc(cx+hr*.37,hy-hr*.09,hr*.04,0,Math.PI*2); ctx.fill();

    /* Cejas */
    ctx.strokeStyle='#7a5020'; ctx.lineWidth=Math.max(1.5,w*.028); ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(cx-hr*.52,hy-hr*.26); ctx.quadraticCurveTo(cx-hr*.32,hy-hr*.34,cx-hr*.12,hy-hr*.26);
    ctx.moveTo(cx+hr*.12,hy-hr*.26); ctx.quadraticCurveTo(cx+hr*.32,hy-hr*.34,cx+hr*.52,hy-hr*.26);
    ctx.stroke();

    /* Pendientes de perla */
    ctx.fillStyle='#f0f0f0'; ctx.strokeStyle='#d0d0d0'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.arc(cx-hr*.88,hy+hr*.08,hr*.1,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx+hr*.88,hy+hr*.08,hr*.1,0,Math.PI*2); ctx.fill(); ctx.stroke();

    /* Sonrisa */
    ctx.fillStyle='white';
    ctx.beginPath(); ctx.arc(cx,hy+hr*.35,hr*.3,0.2,Math.PI-.2); ctx.fill();
    ctx.strokeStyle='#c47060'; ctx.lineWidth=Math.max(1.5,w*.028);
    ctx.beginPath(); ctx.arc(cx,hy+hr*.35,hr*.3,0.2,Math.PI-.2); ctx.stroke();

    /* Nariz */
    ctx.strokeStyle='#d4a070'; ctx.lineWidth=Math.max(1.5,w*.025);
    ctx.beginPath(); ctx.arc(cx+hr*.1,hy+hr*.12,hr*.09,Math.PI*.5,Math.PI*1.2); ctx.stroke();
  },

  /* ── MARA: hermana pequeña, flequillo, fondo amarillo ── */
  mara(ctx, w, h) {
    ctx.fillStyle='#fde047'; ctx.fillRect(0,0,w,h);
    /* Confeti */
    const cols=['#ef4444','#3b82f6','#22c55e','#f97316','#a855f7'];
    [[.08,.08],[.85,.06],[.15,.25],[.9,.22],[.05,.5],[.92,.48],[.12,.72],[.88,.7],[.5,.04],[.45,.9],[.6,.15],[.3,.82]].forEach(([px,py],i)=>{
      ctx.fillStyle=cols[i%cols.length];
      ctx.save(); ctx.translate(px*w,py*h); ctx.rotate(((i*37)%90)*Math.PI/180);
      ctx.fillRect(-w*.028,-h*.018,w*.055,h*.035); ctx.restore();
    });

    const cx=w/2, hy=h*.5, hr=w*.32;

    /* Pelo oscuro (detrás, redondo y abundante) */
    ctx.fillStyle='#2c1208';
    ctx.beginPath(); ctx.ellipse(cx,hy,hr*1.15,hr*1.2,0,0,Math.PI*2); ctx.fill();

    /* Cuello */
    ctx.fillStyle='#f5c8a0';
    ctx.fillRect(cx-w*.09,hy+hr*.78,w*.18,h*.18);

    /* Hombros */
    ctx.fillStyle='#3b82f6';
    ctx.beginPath(); ctx.ellipse(cx,h,w*.6,h*.18,0,0,Math.PI*2); ctx.fill();

    /* Cara redonda y mofletuda */
    ctx.fillStyle='#f5c8a0';
    ctx.beginPath(); ctx.ellipse(cx,hy+hr*.08,hr,hr*1.05,0,0,Math.PI*2); ctx.fill();

    /* Mofletes sonrojados */
    ctx.fillStyle='rgba(255,140,110,.28)';
    ctx.beginPath();
    ctx.ellipse(cx-hr*.58,hy+hr*.32,hr*.3,hr*.21,0,0,Math.PI*2);
    ctx.ellipse(cx+hr*.58,hy+hr*.32,hr*.3,hr*.21,0,0,Math.PI*2); ctx.fill();

    /* Flequillo recto */
    ctx.fillStyle='#2c1208';
    ctx.beginPath(); ctx.ellipse(cx,hy-hr*.5,hr*1.1,hr*.58,0,0,Math.PI*2); ctx.fill();
    ctx.fillRect(cx-hr*1.02,hy-hr*.5,hr*2.04,hr*.52);

    /* Ojos oscuros y redondos */
    ctx.fillStyle='#1a0a00';
    ctx.beginPath();
    ctx.ellipse(cx-hr*.3,hy-hr*.05,hr*.16,hr*.16,0,0,Math.PI*2);
    ctx.ellipse(cx+hr*.3,hy-hr*.05,hr*.16,hr*.16,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='white';
    ctx.beginPath();
    ctx.arc(cx-hr*.24,hy-hr*.1,hr*.055,0,Math.PI*2);
    ctx.arc(cx+hr*.36,hy-hr*.1,hr*.055,0,Math.PI*2); ctx.fill();

    /* Sonrisa pequeña */
    ctx.fillStyle='white';
    ctx.beginPath(); ctx.arc(cx,hy+hr*.38,hr*.22,0.25,Math.PI-.25); ctx.fill();
    ctx.strokeStyle='#c47060'; ctx.lineWidth=Math.max(2,w*.034); ctx.lineCap='round';
    ctx.beginPath(); ctx.arc(cx,hy+hr*.38,hr*.22,0.25,Math.PI-.25); ctx.stroke();

    /* Nariz */
    ctx.strokeStyle='#d4a070'; ctx.lineWidth=Math.max(1.5,w*.025);
    ctx.beginPath(); ctx.arc(cx+hr*.08,hy+hr*.18,hr*.08,Math.PI*.5,Math.PI*1.2); ctx.stroke();
  },

  /* ── DAVID: papá, gorra, gafas de sol, furgoneta ── */
  david(ctx, w, h) {
    const bg=ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#7dd3fc'); bg.addColorStop(.6,'#bae6fd'); bg.addColorStop(1,'#e0f2fe');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

    /* Nubes */
    ctx.fillStyle='rgba(255,255,255,.9)';
    [[.15,.15,.22,.12],[.65,.1,.28,.13]].forEach(([cx2,cy2,rw,rh])=>{
      ctx.beginPath(); ctx.ellipse(cx2*w,cy2*h,rw*w,rh*h,0,0,Math.PI*2); ctx.fill();
    });

    /* Mini furgoneta azul esquina inferior derecha */
    const vx=w*.66, vy=h*.76;
    ctx.fillStyle='#2563eb';
    ctx.beginPath(); ctx.roundRect(vx,vy,w*.3,h*.14,4); ctx.fill();
    ctx.fillStyle='rgba(186,230,253,.82)';
    ctx.fillRect(vx+w*.02,vy+h*.015,w*.1,h*.06);
    ctx.fillStyle='#1d4ed8'; ctx.fillRect(vx,vy+h*.1,w*.3,h*.04);
    ctx.fillStyle='#111827';
    ctx.beginPath();
    ctx.arc(vx+w*.065,vy+h*.14,w*.036,0,Math.PI*2);
    ctx.arc(vx+w*.235,vy+h*.14,w*.036,0,Math.PI*2); ctx.fill();

    const cx=w/2, hy=h*.46, hr=w*.27;

    /* Camiseta amarilla */
    ctx.fillStyle='#f59e0b';
    ctx.beginPath(); ctx.ellipse(cx,h*.96,w*.56,h*.2,0,0,Math.PI*2); ctx.fill();

    /* Cuello */
    ctx.fillStyle='#e8b090';
    ctx.fillRect(cx-w*.08,hy+hr*.75,w*.16,h*.16);

    /* Cabeza */
    ctx.fillStyle='#e8b090';
    ctx.beginPath(); ctx.ellipse(cx,hy,hr*.92,hr,0,0,Math.PI*2); ctx.fill();

    /* Barba incipiente sutil */
    ctx.fillStyle='rgba(110,70,30,.22)';
    ctx.beginPath(); ctx.ellipse(cx,hy+hr*.48,hr*.82,hr*.42,0,0,Math.PI*2); ctx.fill();

    /* Gorra beige/gris – cubre la parte superior */
    ctx.fillStyle='#9ca3af';
    ctx.beginPath(); ctx.ellipse(cx,hy-hr*.45,hr*1.06,hr*.72,0,0,Math.PI*2); ctx.fill();
    ctx.fillRect(cx-hr*1.02,hy-hr*.45,hr*2.04,hr*.46);
    /* Banda de la gorra */
    ctx.fillStyle='#6b7280';
    ctx.fillRect(cx-hr*1.06,hy-hr*.04,hr*2.12,hr*.19);
    /* Visera */
    ctx.fillStyle='#4b5563';
    ctx.beginPath(); ctx.ellipse(cx,hy-hr*.04,hr*1.1,hr*.14,0,0,Math.PI);  ctx.fill();
    /* Detalle tejido gorra */
    ctx.fillStyle='#d1d5db';
    ctx.fillRect(cx-hr*.48,hy-hr*.92,hr*.13,hr*.62);
    ctx.fillRect(cx+hr*.22,hy-hr*.88,hr*.13,hr*.56);

    /* Gafas de sol redondas (montura oscura, cristal marrón) */
    const eyeY=hy+hr*.04;
    ctx.strokeStyle='#3a2510'; ctx.lineWidth=Math.max(2,w*.032); ctx.lineCap='round';
    /* Puente */
    ctx.beginPath();
    ctx.moveTo(cx-hr*.14,eyeY); ctx.lineTo(cx+hr*.14,eyeY); ctx.stroke();
    /* Patillas */
    ctx.beginPath();
    ctx.moveTo(cx-hr*.55,eyeY); ctx.lineTo(cx-hr*.96,eyeY-hr*.06);
    ctx.moveTo(cx+hr*.55,eyeY); ctx.lineTo(cx+hr*.96,eyeY-hr*.06); ctx.stroke();
    /* Cristales */
    ctx.fillStyle='rgba(100,60,25,.76)';
    ctx.beginPath();
    ctx.ellipse(cx-hr*.34,eyeY,hr*.21,hr*.18,0,0,Math.PI*2);
    ctx.ellipse(cx+hr*.34,eyeY,hr*.21,hr*.18,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#3a2510';
    ctx.beginPath();
    ctx.ellipse(cx-hr*.34,eyeY,hr*.21,hr*.18,0,0,Math.PI*2);
    ctx.ellipse(cx+hr*.34,eyeY,hr*.21,hr*.18,0,0,Math.PI*2); ctx.stroke();
    /* Brillo lentes */
    ctx.fillStyle='rgba(255,255,255,.22)';
    ctx.beginPath();
    ctx.ellipse(cx-hr*.41,eyeY-hr*.06,hr*.09,hr*.07,-.4,0,Math.PI*2);
    ctx.ellipse(cx+hr*.27,eyeY-hr*.06,hr*.09,hr*.07,-.4,0,Math.PI*2); ctx.fill();

    /* Nariz */
    ctx.strokeStyle='#c49070'; ctx.lineWidth=Math.max(1.5,w*.025);
    ctx.beginPath(); ctx.arc(cx+hr*.1,hy+hr*.26,hr*.1,Math.PI*.5,Math.PI*1.2); ctx.stroke();

    /* Sonrisa tranquila */
    ctx.strokeStyle='#c47060'; ctx.lineWidth=Math.max(2,w*.033); ctx.lineCap='round';
    ctx.beginPath(); ctx.arc(cx,hy+hr*.54,hr*.25,0.28,Math.PI-.28); ctx.stroke();
  }
};
