/* ============================================================
   ESCENA: MAPA DEL VIAJE
   Progreso basado en GAME.cakePieces (0-6)
============================================================ */

const MapScene = {

  zones: [
    { icon:'🏠', label:'Casa de Amets' },
    { icon:'🌿', label:'El Bosque Laberinto' },
    { icon:'🩰', label:'Escuela de Ballet' },
    { icon:'🏃', label:'El Camino Encantado' },
    { icon:'💃', label:'El Teatro Mágico' },
    { icon:'🚐', label:'La Carretera Mágica' },
    { icon:'🎂', label:'Puerta del Cumpleaños' }
  ],

  init() {
    GAME._updateCakeBar();
    this._renderZones();
    AUDIO.startMusic('menu');

    const btn = document.getElementById('btn-map-go');
    btn.onclick = () => { AUDIO.click(); GAME.next(); };
  },

  _renderZones() {
    const c    = this.cakePieces = GAME.cakePieces;
    const list = document.getElementById('map-zones');
    list.innerHTML = '';

    this.zones.forEach((z, i) => {
      const done    = i <= c;
      const current = i === c + 1 || (i === 0 && c === 0);
      const locked  = i > c + 1;

      const div = document.createElement('div');
      div.className = `zone-item${done ? ' done' : current ? ' active' : ' locked'}`;

      const statusIcon = done ? '✅' : current ? '▶️' : '🔒';

      div.innerHTML = `
        <span class="zone-icon">${z.icon}</span>
        <span class="zone-label">${z.label}</span>
        <span class="zone-status">${statusIcon}</span>
      `;
      list.appendChild(div);
    });
  }
};
