# Rilievo Infissi App

Applicazione web per la gestione e il rilievo misure di infissi, clienti e cantieri, con esportazione dei dati in vari formati e funzioni avanzate per il lavoro in campo.

## Funzionalità principali

- **Gestione progetti/rilievi**: crea, seleziona, elimina e lavora su progetti separati.
- **Anagrafica clienti**: salva una lista di clienti con dati di base. Seleziona rapidamente un cliente esistente e cambia solo il cantiere per il nuovo rilievo.
- **Gestione cantieri**: campo cantiere modificabile per ogni progetto.
- **Tipologie infissi e sensi di apertura personalizzabili**: gestisci e richiama tipologie e sensi di apertura, con suggerimenti automatici dai valori già inseriti.
- **Memorizzazione valori inseriti**: i valori di riferimento, tipologia e senso apertura vengono suggeriti dai dati storici, velocizzando l’inserimento.
- **Misure infissi**: inserisci larghezza, altezza, tipologia, riferimento e senso apertura per ogni infisso rilevato.
- **Acquisizione Bluetooth**: pulsanti dedicati per acquisire larghezza e altezza da un distanziometro Bluetooth compatibile (es. Leica, Bosch).  
  > **Nota**: la funzione è predisposta per la Web Bluetooth API, pronta per l’integrazione con modelli compatibili. Vedi sotto per dettagli tecnici.
- **Esportazione dati**:
  - JSON: esporta tutti i dati del progetto.
  - PDF: report riepilogativo con cliente, cantiere, misure.
  - Excel: dati strutturati su fogli separati.

## Come si usa

1. **Seleziona o crea un progetto**  
   Dall’intestazione, scegli un progetto attivo o creane uno nuovo.
2. **Associa Cliente e Cantiere**  
   Seleziona un cliente dall’anagrafica o aggiungine uno nuovo (telefono/email opzionale). Inserisci il cantiere.
3. **Inserisci misure infissi**  
   Seleziona tipologia e senso apertura (o aggiungi nuovi valori direttamente). Inserisci larghezza, altezza (puoi acquisirle via Bluetooth), riferimento e aggiungi la misura.
4. **Gestisci tipologie e sensi di apertura**  
   Usa le icone ⚙️ per gestire e personalizzare elenchi di valori.
5. **Esporta dati**  
   Usa i pulsanti in basso per esportare il rilievo in PDF, Excel o JSON.

## Integrazione Bluetooth - Dettagli Tecnici

La sezione di acquisizione Bluetooth è pronta per integrare distanziometri compatibili con la [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API):

- Due pulsanti separati: “📏L” per larghezza, “📏A” per altezza.
- Quando premi il pulsante, l’app stabilisce una connessione con il dispositivo selezionato e inserisce la misura nel campo corrispondente.
- Implementazione base (stub) inclusa: per attivare la funzione reale, occorre personalizzare il codice in `app.js` secondo le specifiche del tuo distanziometro.
- Esempio di chiamata:
  ```js
  navigator.bluetooth.requestDevice({ filters: [{ namePrefix: 'Leica' }] })
    .then(device => device.gatt.connect())
    .then(server => server.getPrimaryService('<service-uuid>'))
    .then(service => service.getCharacteristic('<characteristic-uuid>'))
    .then(characteristic => characteristic.readValue())
    .then(value => {
      // Estrai valore e inserisci nel campo desiderato
    });
  ```
- **Consigliato**: consulta la documentazione del tuo modello per UUID e protocollo.

## Dipendenze

- [jsPDF](https://github.com/parallax/jsPDF) – generazione PDF
- [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs) – esportazione Excel

Sono incluse via CDN, senza installazione.

## Requisiti

- Browser moderno (Chrome, Edge, Firefox, Safari)
- Bluetooth supportato per acquisizione automatica (Web Bluetooth API)

## Esempio screenshot

*(Aggiungi qui una schermata della app, se vuoi)*

## Note tecniche

- Tutti i dati sono salvati localmente nel browser (`localStorage`).
- I valori inseriti sono suggeriti nei successivi rilievi, velocizzando il lavoro.
- Puoi resettare i dati svuotando la cache del browser.

## Autore

house79-gex

---

Per suggerimenti e richieste di nuove funzionalità (anche modelli Bluetooth specifici), apri una Issue o una Pull Request!
# Rilievo Infissi App

...

## Integrazione Bluetooth – Modelli supportati

Questa app è pronta per connettersi con distanziometri Bluetooth come **Leica DISTO D5** e **Bosch GLM 50-27G** (e modelli compatibili con la Web Bluetooth API).

### Come funziona

- Due pulsanti separati (“📏L” per larghezza, “📏A” per altezza) in fase di inserimento misura.
- Premi il pulsante, seleziona il dispositivo Bluetooth dalla lista.
- La misura rilevata viene inserita automaticamente nel campo selezionato.

### Implementazione tecnica

> **Nota:** la connessione Bluetooth dipende dallo specifico protocollo del dispositivo.  
> La funzione è predisposta, ma occorre inserire nel file `app.js` i codici UUID e la logica di parsing secondo il modello.

#### Esempio base per Leica DISTO D5

```javascript
// Avvio connessione Bluetooth
navigator.bluetooth.requestDevice({
  filters: [{ namePrefix: 'DISTO' }], // oppure service UUID noto
  optionalServices: ['battery_service', '<service-uuid-disto>']
})
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('<service-uuid-disto>'))
.then(service => service.getCharacteristic('<characteristic-uuid-disto>'))
.then(characteristic => characteristic.readValue())
.then(value => {
  // Decodifica la misura dal DataView (consultare documentazione Leica per formato)
  const misura = decodeLeicaDistoValue(value);
  document.getElementById('larghezza').value = misura; // o 'altezza'
});
```

#### Esempio base per Bosch GLM 50-27G

```javascript
navigator.bluetooth.requestDevice({
  filters: [{ namePrefix: 'GLM' }],
  optionalServices: ['battery_service', '<service-uuid-bosch>']
})
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('<service-uuid-bosch>'))
.then(service => service.getCharacteristic('<characteristic-uuid-bosch>'))
.then(characteristic => characteristic.readValue())
.then(value => {
  // Decodifica la misura dal DataView (consultare documentazione Bosch per formato)
  const misura = decodeBoschValue(value);
  document.getElementById('altezza').value = misura; // o 'larghezza'
});
```

**Importante:**  
- Consulta la documentazione tecnica dei tuoi modelli per individuare i corretti service/characteristic UUID e il formato dei dati trasmessi.
- Puoi trovare i dettagli tecnici nei manuali dei produttori o chiedere assistenza nelle community ufficiali.

### Risorse utili

- [Web Bluetooth API Reference (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Leica DISTO Bluetooth Integration](https://developer.leica-geosystems.com/)
- [Bosch GLM Bluetooth](https://www.bosch-professional.com/it/it/service/supporto-tecnico/)

---

Hai bisogno di aiuto per la decodifica dei dati o vuoi una demo di parsing?  
Apri una Issue sul repository oppure mandami i dati raw acquisiti dal dispositivo per assistenza!

