// ---- Utility base ----
function getStorage(key, fallback) { return JSON.parse(localStorage.getItem(key)) || fallback; }
function setStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

// ---- Anagrafica clienti ----
let clientiAnagrafica = getStorage('clientiAnagrafica', []);
function saveClienteAnagrafica(nome, telefono, email) {
  if (!clientiAnagrafica.find(c => c.nome === nome)) {
    clientiAnagrafica.push({nome, telefono, email});
    setStorage('clientiAnagrafica', clientiAnagrafica);
  }
}
function renderClientiDropdown() {
  const select = document.getElementById('cliente-dropdown');
  select.innerHTML = '<option value="">Seleziona cliente</option>';
  clientiAnagrafica.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.nome;
    opt.textContent = `${c.nome}${c.telefono ? ' ('+c.telefono+')' : ''}`;
    select.appendChild(opt);
  });
}
function renderListaClienti() {
  const ul = document.getElementById('lista-clienti');
  ul.innerHTML = '';
  clientiAnagrafica.forEach((c, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${c.nome}</b> ${c.telefono || ''} ${c.email || ''}`;
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.onclick = () => {
      clientiAnagrafica.splice(i, 1);
      setStorage('clientiAnagrafica', clientiAnagrafica);
      renderListaClienti();
      renderClientiDropdown();
    };
    li.appendChild(delBtn);
    ul.appendChild(li);
  });
}
document.getElementById('gestisci-clienti-btn').addEventListener('click', () => {
  document.getElementById('clienti').style.display = '';
  renderListaClienti();
});
document.getElementById('chiudi-clienti-btn').addEventListener('click', () => {
  document.getElementById('clienti').style.display = 'none';
});
document.getElementById('cliente-form').addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome-cliente').value.trim();
  const telefono = document.getElementById('telefono-cliente').value.trim();
  const email = document.getElementById('email-cliente').value.trim();
  if (nome) {
    saveClienteAnagrafica(nome, telefono, email);
    renderListaClienti();
    renderClientiDropdown();
    e.target.reset();
  }
});

// ---- Progetti/Rilievi ----
let progetti = getStorage('progetti', []);
let progettoAttivoId = localStorage.getItem('progettoAttivoId') || null;
function creaProgetto(nome) {
  const nuovo = {
    id: Date.now().toString(),
    nome: nome || `Rilievo ${progetti.length+1}`,
    cliente: null,
    cantiere: '',
    misure: [],
    tipologie: [],
    sensiApertura: []
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

// ---- Cliente/Cantiere per progetto ----
document.getElementById('cliente-cantiere-form').addEventListener('submit', e => {
  e.preventDefault();
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  const cliente = document.getElementById('cliente-dropdown').value;
  const cantiere = document.getElementById('cantiere').value.trim();
  if (cliente && cantiere) {
    progetto.cliente = cliente;
    progetto.cantiere = cantiere;
    setStorage('progetti', progetti);
    e.target.reset();
    aggiornaTutto();
  }
});

// ---- Tipologie Infissi ----
function renderTipologieSelect() {
  const select = document.getElementById('tipo-infisso');
  select.innerHTML = '<option value="">Seleziona tipologia</option>';
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  let tipologie = progetto.tipologie.length ? progetto.tipologie : getStorage('tipologieGlobali', []);
  tipologie.forEach(t => {
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
  let tipologie = progetto.tipologie;
  tipologie.forEach((t, i) => {
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

// ---- Sensi di Apertura ----
let sensiAperturaGlobali = getStorage('sensiAperturaGlobali', [
  "Dx a tirare", "Sx a tirare", "Dx a spingere", "Sx a spingere",
  "Scorrere verso Dx", "Scorrere verso Sx", "Dx Anta Ribalta", "Wasistas"
]);
function renderSensiDropdown() {
  const select = document.getElementById('senso-apertura');
  select.innerHTML = '<option value="">Seleziona senso apertura</option>';
  const progetto = getProgettoAttivo();
  let sensi = progetto && progetto.sensiApertura.length ? progetto.sensiApertura : sensiAperturaGlobali;
  sensi.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  });
}
function apriGestioneSensi() {
  document.getElementById('sensi').style.display = '';
  renderListaSensi();
}
function chiudiGestioneSensi() {
  document.getElementById('sensi').style.display = 'none';
}
function renderListaSensi() {
  const ul = document.getElementById('lista-sensi');
  ul.innerHTML = '';
  const progetto = getProgettoAttivo();
  let sensi = progetto ? progetto.sensiApertura : sensiAperturaGlobali;
  sensi.forEach((s, i) => {
    const li = document.createElement('li');
    li.textContent = s;
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.onclick = () => {
      sensi.splice(i, 1);
      if (progetto) setStorage('progetti', progetti);
      else setStorage('sensiAperturaGlobali', sensiAperturaGlobali);
      renderListaSensi();
      renderSensiDropdown();
    };
    li.appendChild(delBtn);
    ul.appendChild(li);
  });
}
document.getElementById('gestisci-sensi-btn').addEventListener('click', apriGestioneSensi);
document.getElementById('chiudi-sensi-btn').addEventListener('click', chiudiGestioneSensi);
document.getElementById('senso-form').addEventListener('submit', e => {
  e.preventDefault();
  const progetto = getProgettoAttivo();
  let sensi = progetto ? progetto.sensiApertura : sensiAperturaGlobali;
  const nuovo = document.getElementById('nuovo-senso').value.trim();
  if (nuovo && !sensi.includes(nuovo)) {
    sensi.push(nuovo);
    if (progetto) setStorage('progetti', progetti);
    else setStorage('sensiAperturaGlobali', sensiAperturaGlobali);
    renderListaSensi();
    renderSensiDropdown();
    e.target.reset();
  }
});

// ---- Memorizzazione/suggerimento valori inseriti ----
function getSuggerimenti(field, progetto) {
  let values = [];
  if (progetto && progetto.misure.length) {
    values = [...new Set(progetto.misure.map(m => m[field]).filter(Boolean))];
  }
  return values;
}

// ---- Misure Infissi ----
function renderMisure() {
  const ul = document.getElementById('lista-misure');
  ul.innerHTML = '';
  const progetto = getProgettoAttivo();
  if (!progetto) return;
  progetto.misure.forEach((m, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>${m.tipo}</b> | ${m.larghezza}x${m.altezza} mm | <i>${m.riferimento || '-'}</i> | ${m.senso} <small>[Cliente: ${progetto.cliente || '-'}, Cantiere: ${progetto.cantiere || '-'}]</small>
    `;
    ul.appendChild(li);
  });
}
// Suggerimenti per riferimento infisso
document.getElementById('riferimento-infisso').addEventListener('focus', function() {
  const progetto = getProgettoAttivo();
  const suggerimenti = getSuggerimenti('riferimento', progetto);
  if (suggerimenti.length) {
    this.setAttribute('list', 'riferimento-suggerimenti');
    let datalist = document.getElementById('riferimento-suggerimenti');
    if (!datalist) {
      datalist = document.createElement('datalist');
      datalist.id = 'riferimento-suggerimenti';
      document.body.appendChild(datalist);
    }
    datalist.innerHTML = '';
    suggerimenti.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      datalist.appendChild(opt);
    });
  }
});
// Suggerimenti per tipo infisso (già in select)
// Suggerimenti per senso apertura (già in select)

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
    if (!progetto.tipologie.includes(tipo)) progetto.tipologie.push(tipo);
    if (!progetto.sensiApertura.includes(senso)) progetto.sensiApertura.push(senso);
    setStorage('progetti', progetti);
    renderMisure();
    e.target.reset();
  }
});

// ---- Bluetooth: Pulsanti separati ----
function acquisisciBluetooth(targetInput) {
  // STUB: mostra dialog, pronto per Web Bluetooth API
  alert(
    "Questa funzione permette di acquisire una misura da un distanziometro Bluetooth compatibile.\n" +
    "L'integrazione dipende dal modello del dispositivo.\n" +
    "Per dispositivi come Leica/Bosch, assicurati che siano supportati dalla Web Bluetooth API.\n" +
    "Al termine della connessione, la misura verrà inserita nel campo selezionato."
  );
  // Esempio: navigator.bluetooth.requestDevice...
  // targetInput.value = valoreAcquisito;
}
document.getElementById('bluetooth-larghezza-btn').addEventListener('click', () => {
  acquisisciBluetooth(document.getElementById('larghezza'));
});
document.getElementById('bluetooth-altezza-btn').addEventListener('click', () => {
  acquisisciBluetooth(document.getElementById('altezza'));
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
  doc.text(`Cliente: ${progetto.cliente || '-'} - Cantiere: ${progetto.cantiere || '-'}`, 10, 25);
  doc.text('Misure Infissi:', 10, 35);
  let headers = ['Tipo', 'Larghezza', 'Altezza', 'Riferimento', 'Senso apertura'];
  let data = progetto.misure.map(m =>
    [m.tipo, m.larghezza + ' mm', m.altezza + ' mm', m.riferimento || '-', m.senso]
  );
  let rowY = 40;
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
  const clientiData = [['Cliente', 'Cantiere'], [progetto.cliente || '-', progetto.cantiere || '-']];
  const clientiSheet = XLSX.utils.aoa_to_sheet(clientiData);
  XLSX.utils.book_append_sheet(wb, clientiSheet, 'Cliente_Cantiere');
  const misureData = [['Tipo infisso', 'Larghezza (mm)', 'Altezza (mm)', 'Riferimento', 'Senso apertura']].concat(
    progetto.misure.map(m => [m.tipo, m.larghezza, m.altezza, m.riferimento, m.senso])
  );
  const misureSheet = XLSX.utils.aoa_to_sheet(misureData);
  XLSX.utils.book_append_sheet(wb, misureSheet, 'Misure');
  XLSX.writeFile(wb, 'rilievo-infissi.xlsx');
});

// ---- Sync UI ----
function aggiornaTutto() {
  renderClientiDropdown();
  renderTipologieSelect();
  renderSensiDropdown();
  renderMisure();
  chiudiGestioneTipologie();
  chiudiGestioneSensi();
  chiudiClienti();
}
function chiudiClienti() {
  document.getElementById('clienti').style.display = 'none';
}
aggiornaProgettiUI();
