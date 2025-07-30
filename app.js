// ---- Utility base ----
function getStorage(key, fallback) { return JSON.parse(localStorage.getItem(key)) || fallback; }
function setStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

// ---- Cronologie globali ----
let clientiAnagrafica = getStorage('clientiAnagrafica', []);
let tipologieGlobali = getStorage('tipologieGlobali', []);
let sensiAperturaGlobali = getStorage('sensiAperturaGlobali', [
  "Dx a tirare", "Sx a tirare", "Dx a spingere", "Sx a spingere",
  "Scorrere verso Dx", "Scorrere verso Sx", "Dx Anta Ribalta", "Wasistas"
]);
let riferimentiRecenti = getStorage('riferimentiRecenti', []);

let clienteAttivo = getStorage('clienteAttivo', null);
let cantiereAttivo = getStorage('cantiereAttivo', '');
let misure = getStorage('misure', []);

function saveClienteAnagrafica(nome, telefono, email) {
  if (!clientiAnagrafica.find(c => c.nome === nome)) {
    clientiAnagrafica.push({nome, telefono, email});
    setStorage('clientiAnagrafica', clientiAnagrafica);
  }
}
function renderClientiDropdown() {
  const select = document.getElementById('cliente-select');
  select.innerHTML = '<option value="">Seleziona cliente</option>';
  clientiAnagrafica.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.nome;
    opt.textContent = `${c.nome}${c.telefono ? ' ('+c.telefono+')' : ''}`;
    select.appendChild(opt);
  });
  select.value = clienteAttivo || '';
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
      if (clienteAttivo === c.nome) {
        clienteAttivo = null;
        setStorage('clienteAttivo', clienteAttivo);
        aggiornaTutto();
      }
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
document.getElementById('associa-btn').addEventListener('click', () => {
  const sel = document.getElementById('cliente-select');
  const cliente = sel.value;
  const cantiere = document.getElementById('cantiere-input').value.trim();
  if (cliente && cantiere) {
    clienteAttivo = cliente;
    cantiereAttivo = cantiere;
    setStorage('clienteAttivo', clienteAttivo);
    setStorage('cantiereAttivo', cantiereAttivo);
    aggiornaTutto();
  }
});

// ---- Tipologie ----
function renderTipologieSelect() {
  const select = document.getElementById('tipo-infisso');
  select.innerHTML = '<option value="">Seleziona tipologia</option>';
  tipologieGlobali.forEach(t => {
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
  tipologieGlobali.forEach((t, i) => {
    const li = document.createElement('li');
    li.textContent = t;
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.onclick = () => {
      tipologieGlobali.splice(i, 1);
      setStorage('tipologieGlobali', tipologieGlobali);
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
  const nuova = document.getElementById('nuova-tipologia').value.trim();
  if (nuova && !tipologieGlobali.includes(nuova)) {
    tipologieGlobali.push(nuova);
    setStorage('tipologieGlobali', tipologieGlobali);
    renderListaTipologie();
    renderTipologieSelect();
    e.target.reset();
  }
});

// ---- Sensi apertura ----
function renderSensiDropdown() {
  const select = document.getElementById('senso-apertura');
  select.innerHTML = '<option value="">Seleziona senso apertura</option>';
  sensiAperturaGlobali.forEach(s => {
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
  sensiAperturaGlobali.forEach((s, i) => {
    const li = document.createElement('li');
    li.textContent = s;
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.onclick = () => {
      sensiAperturaGlobali.splice(i, 1);
      setStorage('sensiAperturaGlobali', sensiAperturaGlobali);
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
  const nuovo = document.getElementById('nuovo-senso').value.trim();
  if (nuovo && !sensiAperturaGlobali.includes(nuovo)) {
    sensiAperturaGlobali.push(nuovo);
    setStorage('sensiAperturaGlobali', sensiAperturaGlobali);
    renderListaSensi();
    renderSensiDropdown();
    e.target.reset();
  }
});

// ---- Misure: cronologia e suggerimenti ----
function aggiornaTabellaMisure() {
  const wrapper = document.getElementById('tabella-misure-wrapper');
  if (!clienteAttivo || !cantiereAttivo) {
    wrapper.innerHTML = `<p style="color:#c00;">Seleziona prima cliente e cantiere!</p>`;
    return;
  }
  const misureFiltrate = misure
    .filter(m => m.cliente === clienteAttivo && m.cantiere === cantiereAttivo);
  const tabRows = misureFiltrate
    .map((m, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${m.tipo}</td>
        <td>${m.larghezza}</td>
        <td>${m.altezza}</td>
        <td>${m.riferimento}</td>
        <td>${m.senso}</td>
        <td>
          <button onclick="rimuoviMisura(${m._idx})">🗑️</button>
        </td>
      </tr>
    `).join('');
  wrapper.innerHTML = `
    <table id="tabella-misure">
      <thead>
        <tr>
          <th>#</th>
          <th>Tipologia</th>
          <th>Larghezza (mm)</th>
          <th>Altezza (mm)</th>
          <th>Riferimento</th>
          <th>Senso Apertura</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${tabRows || '<tr><td colspan="7">Nessuna misura inserita.</td></tr>'}
      </tbody>
    </table>
  `;
}
// Per rimozione precisa serve salvare l'indice originale della misura
function recalcolaIndiciMisure() {
  misure.forEach((m, idx) => m._idx = idx);
}
window.rimuoviMisura = function(idx) {
  misure.splice(idx, 1);
  setStorage('misure', misure);
  recalcolaIndiciMisure();
  aggiornaTabellaMisure();
};

// Suggerimenti per riferimento infisso
function aggiornaSuggerimentiRiferimenti() {
  const datalist = document.getElementById('riferimento-suggerimenti');
  datalist.innerHTML = '';
  riferimentiRecenti.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    datalist.appendChild(opt);
  });
}

// Form misura
document.getElementById('misura-form').addEventListener('submit', e => {
  e.preventDefault();
  if (!clienteAttivo || !cantiereAttivo) {
    alert("Seleziona prima cliente e cantiere!");
    return;
  }
  const tipo = document.getElementById('tipo-infisso').value.trim();
  const larghezza = Number(document.getElementById('larghezza').value);
  const altezza = Number(document.getElementById('altezza').value);
  const riferimento = document.getElementById('riferimento-infisso').value.trim();
  const senso = document.getElementById('senso-apertura').value.trim();
  if (tipo && larghezza && altezza && senso) {
    if (!tipologieGlobali.includes(tipo)) {
      tipologieGlobali.push(tipo);
      setStorage('tipologieGlobali', tipologieGlobali);
      renderTipologieSelect();
    }
    if (!sensiAperturaGlobali.includes(senso)) {
      sensiAperturaGlobali.push(senso);
      setStorage('sensiAperturaGlobali', sensiAperturaGlobali);
      renderSensiDropdown();
    }
    if (riferimento && !riferimentiRecenti.includes(riferimento)) {
      riferimentiRecenti.push(riferimento);
      setStorage('riferimentiRecenti', riferimentiRecenti);
      aggiornaSuggerimentiRiferimenti();
    }
    misure.push({
      cliente: clienteAttivo,
      cantiere: cantiereAttivo,
      tipo,
      larghezza,
      altezza,
      riferimento,
      senso
    });
    setStorage('misure', misure);
    recalcolaIndiciMisure();
    aggiornaTabellaMisure();
    e.target.reset();
  }
});

// ---- Bluetooth: Pulsanti separati ----
function acquisisciBluetooth(targetInput, tipo) {
  alert(
    `Questa funzione permette di acquisire una misura (${tipo}) da un distanziometro Bluetooth compatibile.\n` +
    `L'integrazione dipende dal modello del dispositivo (es. Leica DISTO, Bosch GLM).\n` +
    `Al termine della connessione, la misura verrà inserita nel campo selezionato.`
  );
  // targetInput.value = valoreAcquisito;
}
document.getElementById('bluetooth-larghezza-btn').addEventListener('click', () => {
  acquisisciBluetooth(document.getElementById('larghezza'), 'larghezza');
});
document.getElementById('bluetooth-altezza-btn').addEventListener('click', () => {
  acquisisciBluetooth(document.getElementById('altezza'), 'altezza');
});

// ---- Export ----
document.getElementById('export-btn').addEventListener('click', () => {
  if (!clienteAttivo || !cantiereAttivo) return;
  const misureFiltrate = misure.filter(m => m.cliente === clienteAttivo && m.cantiere === cantiereAttivo);
  const dati = {
    cliente: clienteAttivo,
    cantiere: cantiereAttivo,
    misure: misureFiltrate
  };
  const blob = new Blob([JSON.stringify(dati, null, 2)], {type: 'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'rilievo-infissi.json';
  a.click();
});

// PDF tabella ordinata con jsPDF-autotable
document.getElementById('export-pdf-btn').addEventListener('click', () => {
  if (!clienteAttivo || !cantiereAttivo) return;
  const misureFiltrate = misure.filter(m => m.cliente === clienteAttivo && m.cantiere === cantiereAttivo);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Rilievo Infissi`, 10, 10);
  doc.setFontSize(12);
  doc.text(`Cliente: ${clienteAttivo} | Cantiere: ${cantiereAttivo}`, 10, 18);

  // Tabella ordinata
  const headers = [['#', 'Tipologia', 'Larghezza', 'Altezza', 'Riferimento', 'Senso Apertura']];
  const body = misureFiltrate.map((m, i) => [
    i+1, m.tipo, m.larghezza, m.altezza, m.riferimento, m.senso
  ]);
  doc.autoTable({
    head: headers,
    body: body,
    startY: 25,
    theme: 'grid',
    styles: { cellPadding: 2, fontSize: 10 }
  });
  doc.save('rilievo-infissi.pdf');
});

// Excel: larghezza colonne adattiva
document.getElementById('export-excel-btn').addEventListener('click', () => {
  if (!clienteAttivo || !cantiereAttivo) return;
  const misureFiltrate = misure.filter(m => m.cliente === clienteAttivo && m.cantiere === cantiereAttivo);
  const clientiData = [['Cliente', 'Cantiere'], [clienteAttivo, cantiereAttivo]];
  const clientiSheet = XLSX.utils.aoa_to_sheet(clientiData);

  const misureData = [['#', 'Tipologia', 'Larghezza (mm)', 'Altezza (mm)', 'Riferimento', 'Senso Apertura']]
    .concat(misureFiltrate.map((m, i) => [i+1, m.tipo, m.larghezza, m.altezza, m.riferimento, m.senso]));
  const misureSheet = XLSX.utils.aoa_to_sheet(misureData);

  // Adattamento larghezza colonne
  misureSheet['!cols'] = misureData[0].map((_, colIdx) => {
    const maxLen = Math.max(...misureData.map(row => (row[colIdx] ? row[colIdx].toString().length : 0)));
    return { wch: maxLen + 2 };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, clientiSheet, 'Cliente_Cantiere');
  XLSX.utils.book_append_sheet(wb, misureSheet, 'Misure');
  XLSX.writeFile(wb, 'rilievo-infissi.xlsx');
});

// Word DOCX tabella ordinata con docx.js
document.getElementById('export-docx-btn').addEventListener('click', () => {
  if (!clienteAttivo || !cantiereAttivo) return;
  const misureFiltrate = misure.filter(m => m.cliente === clienteAttivo && m.cantiere === cantiereAttivo);

  const doc = new window.docx.Document({
    sections: [{
      properties: {},
      children: [
        new window.docx.Paragraph({
          children: [
            new window.docx.TextRun({ text: "Rilievo Infissi", bold: true, size: 32 }),
          ],
        }),
        new window.docx.Paragraph({
          children: [
            new window.docx.TextRun({ text: `Cliente: ${clienteAttivo} | Cantiere: ${cantiereAttivo}`, size: 24 }),
          ],
        }),
        new window.docx.Table({
          rows: [
            new window.docx.TableRow({
              children: [
                'N', 'Tipologia', 'Larghezza', 'Altezza', 'Riferimento', 'Senso Apertura'
              ].map(h => new window.docx.TableCell({
                children: [new window.docx.Paragraph({ text: h, bold: true })]
              }))
            }),
            ...misureFiltrate.map((m, i) =>
              new window.docx.TableRow({
                children: [
                  i+1, m.tipo, m.larghezza, m.altezza, m.riferimento, m.senso
                ].map(val => new window.docx.TableCell({
                  children: [new window.docx.Paragraph({ text: String(val) })]
                }))
              })
            )
          ]
        })
      ]
    }]
  });

  window.docx.Packer.toBlob(doc).then(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rilievo-infissi.docx';
    a.click();
  });
});

// ---- Sync UI ----
function aggiornaTutto() {
  renderClientiDropdown();
  renderTipologieSelect();
  renderSensiDropdown();
  aggiornaSuggerimentiRiferimenti();
  recalcolaIndiciMisure();
  aggiornaTabellaMisure();
  chiudiGestioneTipologie();
  chiudiGestioneSensi();
  chiudiClienti();
}
function chiudiClienti() {
  document.getElementById('clienti').style.display = 'none';
}
aggiornaTutto();
