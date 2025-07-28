// ---- Utility base ----
function getStorage(key, fallback) { return JSON.parse(localStorage.getItem(key)) || fallback; }
function setStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

// ---- Progetti/Rilievi ----
let progetti = getStorage('progetti', []);
let progettoAttivoId = localStorage.getItem('progettoAttivoId') || null;
function creaProgetto(nome) {
  const nuovo = {
    id: Date.now().toString(),
    nome: nome || `Rilievo ${progetti.length+1}`,
    clienti: [],
    misure: [],
    tipologie: []
  };
  progetti.push(nuovo);
  setStorage('progetti', progetti);
  progettoAttivoId = nuovo.id;
  localStorage.setItem('progettoAttivoId', progettoAttivoId);
  aggiornaProgettiUI();
}
function eliminaProgetto(id) {
  if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
    progetti = progetti.filter(p => p.id !== id);
    setStorage('progetti', progetti);
    if (progetti.length) {
      progettoAttivoId = progetti[0].id;
      localStorage.setItem('progettoAttivoId', progettoAttivoId);
    } else {
      progettoAttivoId = null;
      localStorage.removeItem('progettoAttivoId');
    }
    aggiornaProgettiUI();
  }
}
function getProgettoAttivo() {
  return progetti.find(p => p.id === progettoAttivoId) || null;
}
function aggiornaProgettiUI() {
  const select = document.getElementById('progetto-select');
  select.innerHTML = '';
  progetti.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.nome;
    select.appendChild(opt);
  });
  if (progettoAttivoId) select.value = progettoAttivoId;
  aggiornaTutto();
}
document.getElementById('progetto-select').addEventListener('change', function() {
  progettoAttivoId = this.value;
  localStorage.setItem('progettoAttivoId', progettoAttivoId);
  aggiornaTutto();
});
document.getElementById('new-progetto-btn').addEventListener('click', function() {
  const nome = prompt('Nome nuovo progetto/rilievo:');
  if (nome) creaProgetto(nome);
});
document.getElementById('delete-progetto-btn').addEventListener('click', function() {
  if (progettoAttivoId) eliminaProgetto(progettoAttivoId);
});

// ---- Clienti & Cantieri ----
function renderClienti() {
  const ul = document.getElementById('lista-clienti');
  ul.innerHTML = '';
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  progetto.clienti.forEach((c, i) => {
    const li = document.createElement('li');
    li.textContent = `${c.nome} - ${c.cantiere}`;
    ul.appendChild(li);
  });
}
document.getElementById('cliente-form').addEventListener('submit', e => {
  e.preventDefault();
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  const nome = document.getElementById('nome-cliente').value.trim();
  const cantiere = document.getElementById('nome-cantiere').value.trim();
  if (nome && cantiere) {
    progetto.clienti.push({nome, cantiere});
    setStorage('progetti', progetti);
    renderClienti();
    e.target.reset();
  }
});

// ---- Tipologie Infissi ----
function renderTipologieSelect() {
  const select = document.getElementById('tipo-infisso');
  select.innerHTML = '<option value="">Seleziona tipologia</option>';
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  progetto.tipologie.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });
}
function apriGestioneTipologie() {
  document.getElementById('tipologie').style.display = '';
  renderListaTipologie();
}
function chiudiGestioneTipologie() {
  document.getElementById('tipologie').style.display = 'none';
}
function renderListaTipologie() {
  const ul = document.getElementById('lista-tipologie');
  ul.innerHTML = '';
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  progetto.tipologie.forEach((t, i) => {
    const li = document.createElement('li');
    li.textContent = t;
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.onclick = () => {
      progetto.tipologie.splice(i, 1);
      setStorage('progetti', progetti);
      renderListaTipologie();
      renderTipologieSelect();
    };
    li.appendChild(delBtn);
    ul.appendChild(li);
  });
}
document.getElementById('gestisci-tipologie-btn').addEventListener('click', apriGestioneTipologie);
document.getElementById('chiudi-tipologie-btn').addEventListener('click', chiudiGestioneTipologie);
document.getElementById('tipologia-form').addEventListener('submit', e => {
  e.preventDefault();
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  const nuova = document.getElementById('nuova-tipologia').value.trim();
  if (nuova && !progetto.tipologie.includes(nuova)) {
    progetto.tipologie.push(nuova);
    setStorage('progetti', progetti);
    renderListaTipologie();
    renderTipologieSelect();
    e.target.reset();
  }
});

// ---- Misure Infissi ----
function renderMisure() {
  const ul = document.getElementById('lista-misure');
  ul.innerHTML = '';
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  progetto.misure.forEach((m, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>${m.tipo}</b> | ${m.larghezza}x${m.altezza} mm | <i>${m.riferimento || '-'}</i> | Apertura: ${m.senso}
    `;
    ul.appendChild(li);
  });
}
document.getElementById('misura-form').addEventListener('submit', e => {
  e.preventDefault();
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  const tipo = document.getElementById('tipo-infisso').value.trim();
  const larghezza = Number(document.getElementById('larghezza').value);
  const altezza = Number(document.getElementById('altezza').value);
  const riferimento = document.getElementById('riferimento-infisso').value.trim();
  const senso = document.getElementById('senso-apertura').value.trim();
  if (tipo && larghezza && altezza && senso) {
    progetto.misure.push({tipo, larghezza, altezza, riferimento, senso});
    setStorage('progetti', progetti);
    renderMisure();
    e.target.reset();
  }
});

// ---- Bluetooth Stub ----
document.getElementById('bluetooth-btn').addEventListener('click', async () => {
  // STUB: mostra dialog, pronto per Web Bluetooth API
  alert(
    "Questa funzione permette di acquisire una misura da un distanziometro Bluetooth compatibile.\n" +
    "L'integrazione dipende dal modello del dispositivo.\n" +
    "Per dispositivi come Leica/Bosch, assicurati che siano supportati dalla Web Bluetooth API.\n" +
    "Vuoi integrare uno specifico modello? Scrivilo nelle issue del progetto!"
  );
  // Esempio base per connessione:
  // navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
  // .then(device => { ... });
});

// ---- Export ----
function exportDati(dati, type, filename) {
  const blob = new Blob([dati], {type});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
document.getElementById('export-btn').addEventListener('click', () => {
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  exportDati(JSON.stringify(progetto, null, 2), 'application/json', 'rilievo-infissi.json');
});
document.getElementById('export-pdf-btn').addEventListener('click', () => {
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Rilievo Infissi - ${progetto.nome}`, 10, 15);
  doc.setFontSize(12);
  doc.text('Clienti & Cantieri:', 10, 25);
  progetto.clienti.forEach((c, i) => {
    doc.text(`${i + 1}. ${c.nome} - ${c.cantiere}`, 12, 32 + (i * 7));
  });
  let startY = 32 + (progetto.clienti.length * 7) + 10;
  doc.text('Misure Infissi:', 10, startY);
  let headers = ['Tipo', 'Larghezza', 'Altezza', 'Riferimento', 'Senso apertura'];
  let data = progetto.misure.map(m =>
    [m.tipo, m.larghezza + ' mm', m.altezza + ' mm', m.riferimento || '-', m.senso]
  );
  let rowY = startY + 7;
  doc.setFontSize(10);
  doc.text(headers.join(' | '), 12, rowY);
  for (let i = 0; i < data.length; i++) {
    doc.text(data[i].join(' | '), 12, rowY + 6 + (i * 6));
  }
  doc.save('rilievo-infissi.pdf');
});
document.getElementById('export-excel-btn').addEventListener('click', () => {
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  const wb = XLSX.utils.book_new();
  const clientiData = [['Nome', 'Cantiere']].concat(
    progetto.clienti.map(c => [c.nome, c.cantiere])
  );
  const clientiSheet = XLSX.utils.aoa_to_sheet(clientiData);
  XLSX.utils.book_append_sheet(wb, clientiSheet, 'Clienti_Cantieri');
  const misureData = [['Tipo infisso', 'Larghezza (mm)', 'Altezza (mm)', 'Riferimento', 'Senso apertura']].concat(
    progetto.misure.map(m => [m.tipo, m.larghezza, m.altezza, m.riferimento, m.senso])
  );
  const misureSheet = XLSX.utils.aoa_to_sheet(misureData);
  XLSX.utils.book_append_sheet(wb, misureSheet, 'Misure');
  XLSX.writeFile(wb, 'rilievo-infissi.xlsx');
});

// ---- Sync UI ----
function aggiornaTutto() {
  renderClienti();
  renderMisure();
  renderTipologieSelect();
  chiudiGestioneTipologie();
}
aggiornaProgettiUI();
