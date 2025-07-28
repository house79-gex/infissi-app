# Rilievo Infissi App

Applicazione web per la gestione e il rilievo misure di infissi, clienti e cantieri, con esportazione dei dati in vari formati.

## Funzionalità principali

- Gestione clienti e cantieri
- Inserimento misure infissi (tipo, larghezza, altezza, senso apertura)
- Salvataggio automatico in locale (localStorage)
- Esportazione dati:
  - **JSON**: esporta tutti i dati come file `.json`
  - **PDF**: genera un report riepilogativo in PDF
  - **Excel**: esporta i dati in file `.xlsx` con fogli separati per clienti/cantieri e misure

## Come si usa

1. **Aggiungi Cliente e Cantiere**
   - Compila il modulo nella sezione "Clienti & Cantieri" e premi "Aggiungi Cliente"
2. **Aggiungi Misura Infisso**
   - Compila il modulo nella sezione "Misure Infissi" e premi "Aggiungi Misura"
3. **Visualizza Dati**
   - I dati inseriti sono mostrati nelle rispettive liste
4. **Esporta Dati**
   - Usa i pulsanti in basso per esportare in JSON, PDF o Excel

## Esportazione

- **Export JSON**: scarica un file strutturato con tutti i dati raccolti.
- **Export PDF**: genera un PDF riepilogativo dei clienti/cantieri e delle misure degli infissi.
- **Export Excel**: genera un file .xlsx con due fogli ("Clienti_Cantieri" e "Misure").

## Dipendenze

- [jsPDF](https://github.com/parallax/jsPDF) - per la generazione del PDF
- [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs) - per l'esportazione Excel

Le librerie sono incluse via CDN e non richiedono installazione aggiuntiva.

## Requisiti

- Browser moderno (Chrome, Edge, Firefox, Safari)

## Esempio screenshot

*(Aggiungi qui una schermata dell'app, se desideri)*

## Note tecniche

- I dati vengono salvati localmente nel browser (`localStorage`). Non è previsto al momento un backend.
- Puoi resettare i dati svuotando la cache del browser.

## Autore

house79-gex

---

Se hai suggerimenti o richieste di nuove funzionalità, apri una Issue o una Pull Request!
