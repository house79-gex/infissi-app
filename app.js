// Storage locale di base
let clienti = JSON.parse(localStorage.getItem('clienti')) || [];
let misure = JSON.parse(localStorage.getItem('misure')) || [];

function renderClienti() {
  const ul = document.getElementById('lista-clienti');
  ul.innerHTML = '';
  clienti.forEach((c, i) => {
    const li = document.createElement('li');
    li.textContent = `${c.nome} - ${c.cantiere}`;
    ul.appendChild(li);
  });
}
function renderMisure() {
  const ul = document.getElementById('lista-misure');
  ul.innerHTML = '';
  misure.forEach((m, i) => {
    const li = document.createElement('li');
    li.textContent = `${m.tipo} | ${m.larghezza}x${m.altezza} mm | Apertura: ${m.senso}`;
    ul.appendChild(li);
  });
}

document.getElementById('cliente-form').addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome-cliente').value.trim();
  const cantiere = document.getElementById('nome-cantiere').value.trim();
  if (nome && cantiere) {
    clienti.push({nome, cantiere});
    localStorage.setItem('clienti', JSON.stringify(clienti));
    renderClienti();
    e.target.reset();
  }
});

document.getElementById('misura-form').addEventListener('submit', e => {
  e.preventDefault();
  const tipo = document.getElementById('tipo-infisso').value.trim();
  const larghezza = Number(document.getElementById('larghezza').value);
  const altezza = Number(document.getElementById('altezza').value);
  const senso = document.getElementById('senso-apertura').value.trim();
  if (tipo && larghezza && altezza && senso) {
    misure.push({tipo, larghezza, altezza, senso});
    localStorage.setItem('misure', JSON.stringify(misure));
    renderMisure();
    e.target.reset();
  }
});

// Export dati come JSON semplice
document.getElementById('export-btn').addEventListener('click', () => {
  const dati = {
    clienti,
    misure
  };
  const blob = new Blob([JSON.stringify(dati, null, 2)], {type: 'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'rilievo-infissi.json';
  a.click();
});

// Export PDF
document.getElementById('export-pdf-btn').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Rilievo Infissi - Report', 10, 15);

  // Clienti & Cantieri
  doc.setFontSize(12);
  doc.text('Clienti & Cantieri:', 10, 25);
  clienti.forEach((c, i) => {
    doc.text(`${i + 1}. ${c.nome} - ${c.cantiere}`, 12, 32 + (i * 7));
  });

  let startY = 32 + (clienti.length * 7) + 10;
  doc.setFontSize(12);
  doc.text('Misure Infissi:', 10, startY);

  // Tabella Misure
  let headers = ['Tipo', 'Larghezza', 'Altezza', 'Senso apertura'];
  let data = misure.map(m => [m.tipo, m.larghezza + ' mm', m.altezza + ' mm', m.senso]);

  // Semplice tabella (senza plugin)
  let rowY = startY + 7;
  doc.setFontSize(10);
  doc.text(headers.join(' | '), 12, rowY);
  for (let i = 0; i < data.length; i++) {
    doc.text(data[i].join(' | '), 12, rowY + 6 + (i * 6));
  }

  doc.save('rilievo-infissi.pdf');
});

// Export Excel
document.getElementById('export-excel-btn').addEventListener('click', () => {
  // SheetJS (xlsx)
  const wb = XLSX.utils.book_new();

  // Foglio Clienti
  const clientiData = [['Nome', 'Cantiere']].concat(
    clienti.map(c => [c.nome, c.cantiere])
  );
  const clientiSheet = XLSX.utils.aoa_to_sheet(clientiData);
  XLSX.utils.book_append_sheet(wb, clientiSheet, 'Clienti_Cantieri');

  // Foglio Misure
  const misureData = [['Tipo infisso', 'Larghezza (mm)', 'Altezza (mm)', 'Senso apertura']].concat(
    misure.map(m => [m.tipo, m.larghezza, m.altezza, m.senso])
  );
  const misureSheet = XLSX.utils.aoa_to_sheet(misureData);
  XLSX.utils.book_append_sheet(wb, misureSheet, 'Misure');

  XLSX.writeFile(wb, 'rilievo-infissi.xlsx');
});

// Render iniziale
renderClienti();
renderMisure();
