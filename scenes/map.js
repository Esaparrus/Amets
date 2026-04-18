/* ============================================================
   ESCENA: MAPA DEL VIAJE
   Muestra el progreso entre zonas y el pastel
============================================================ */

const MapScene = {

  /* Definición de todas las zonas */
  zones: [
    { icon: '🏠', label: 'Casa de Amets',        step: 0  },
    { icon: '🌿', label: 'El Bosque Laberinto',  step: 3  },
    { icon: '🩰', label: 'Escuela de Ballet',    step: 4  },
    { icon: '🏃', label: 'El Camino Encantado',  step: 6  },
    { icon: '💃', label: 'El Teatro Mágico',     step: 7  },
    { icon: '🚐', label: 'La Carretera Mágica',  step: 9  },
    { icon: '🎂', label: 'Puerta del Cumpleaños',step: 11 }
  ],

  init() {
    GAME._updateCakeBar();
    this._renderZones();

    const btn = document.getElementById('btn-map-go');
    btn.onclick = () => GAME.next();
  },

  _renderZones() {
    const container = document.getElementById('map-zones');
    container.innerHTML = '';

    this.zones.forEach(z => {
      const done   = GAME.step >  z.step;
      const active = GAME.step === z.step || (GAME.step > z.step - 1 && !done);
      const locked = !done && !active;

      /* La zona "activa" es la que viene justo después del step actual */
      const isCurrent = this._isCurrentZone(z);

      const div = document.createElement('div');
      div.className = 'zone-item' + (done ? ' done' : isCurrent ? ' active' : ' locked');

      const status = done ? '✅' : isCurrent ? '▶️' : '🔒';

      div.innerHTML = `
        <span class="zone-icon">${z.icon}</span>
        <span class="zone-label">${z.label}</span>
        <span class="zone-status">${status}</span>
      `;
      container.appendChild(div);
    });
  },

  /* Determina si la zona es la que toca a continuación */
  _isCurrentZone(z) {
    const nextStep = GAME.step + 1;
    return z.step === nextStep || (z.step > GAME.step && this.zones.find(x => x.step > GAME.step && x.step <= z.step && x === z));
  }
};
