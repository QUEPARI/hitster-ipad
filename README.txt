HITSTER IPAD v16 — OFFLINE PWA

Deze versie heeft geen Node.js-server nodig tijdens het spelen.

Belangrijk:
- Een PWA moet éénmalig via HTTPS in Safari worden geopend en aan het beginscherm worden toegevoegd.
- Na installatie worden alle spelbestanden lokaal gecachet en werkt het spel offline.
- Verwijder je de app/websitegegevens van Safari, dan moet je hem opnieuw installeren.

Installatie op iPad:
1. Plaats de bestanden uit deze map op een HTTPS webadres.
2. Open index.html via Safari op de iPad.
3. Deel > Zet op beginscherm.
4. Open Hitster Buzzer vanaf het nieuwe beginscherm-icoon.
5. Open hem daarna één keer terwijl de site nog bereikbaar is om te controleren dat de cache compleet is.
6. Daarna kan de oorspronkelijke server/hosting uit; het spel werkt offline.


v17: Vraag-/winnaarlaag gecentreerd voor geïnstalleerde iPad PWA, inclusief safe-area.


v18 PWA:
- Dark mode instellingen hebben nu afzonderlijke donkergrijze kaarten/ballonnen.
- Light mode behoudt lichte grijze kaarten.
- Versienummer zichtbaar onderaan Instellingen: v18 PWA.
- Service worker cache opnieuw verhoogd voor duidelijkere update.


v19 PWA:
- Instellingenknop vervangen door tandwiel midden onder.
- Tandwiel verborgen tijdens actieve buzzerfase; spelerknoppen vullen dan het hele scherm.
- Openen Instellingen pauzeert een lopende vraagtimer; sluiten hervat deze.
- Naamveld wordt leeg bij focus wanneer nog de standaardnaam Speler 1/2/3/4 staat.
- Automatisch doorspelen verplaatst naar Parameters.
- Reset spel sluit de popup direct.
- Versienummer: v19 PWA.


v20 PWA:
- Herstelt fout waarbij Parameters onbedoeld automatisch opende.
- Donkere overlay bij opstart opgelost.
- Tandwiel vereenvoudigd.
- Versienummer bijgewerkt naar v20 PWA.


v21 PWA:
- Popup-startstatus hard gereset; beide modals starten altijd gesloten.
- CSS en JS hebben versiegebonden URLs om oude iPad-cache te omzeilen.
- Service worker gebruikt network-first voor pagina-navigatie.
- Eenvoudig minimalistisch instellingen-icoon als SVG.
- Versienummer v21 PWA.


v22 PWA:
- Versienummer zichtbaar op hoofdpagina naast Single‑iPad versie.


v23 PWA:
- JavaScript syntaxfout hersteld; app-logica draait weer.
- Tandwiel verplaatst van setup naar het spel zelf.
- Tandwiel is verborgen tijdens actieve buzzerfase en op de startpagina.
- Modal verborgen-status extra afgedwongen.
- Versie zichtbaar als v23 PWA.


v24 PWA:
- Aangeleverde tandwiel-SVG gebruikt.
- Tandwiel alleen zichtbaar wanneer de vraag in beeld staat.
- Tandwiel verborgen tijdens buzzerfase en winnaarweergave.
- Versie bijgewerkt naar v24 PWA.


v25 PWA:
- Automatisch doorspelen staat altijd aan en is niet meer instelbaar.
- Winnaar wordt standaard en vast 2 seconden getoond.
- Parameters staan nu direct in Instellingen onder Opdrachten.
- Aparte Parameters-popup verwijderd.
- Groene Opslaan-knop toegevoegd; deze past instellingen toe en sluit de popup.
- Versie bijgewerkt naar v25 PWA.


v26 PWA:
- Instellingenknop alleen zichtbaar op het startscherm.
- Instellingenknop verwijderd tijdens vraag/spel.
- Hitster Buzzer gecentreerd in de startbox.
- Alleen V26 PWA onder de box, gecentreerd.
- Spelerskeuze toont Aantal spelers met knoppen 2 / 3 / 4.


v27 PWA:
- Tandwiel terug tijdens het tonen van de vraag.
- Tandwiel verwijderd van het beginscherm.
- Normale Instellingen-knop boven Start spel op het beginscherm.
- Start spel knop groen gemaakt.
- Versie bijgewerkt naar v27 PWA.


v28 PWA:
- Oude CSS-regel die het tandwiel in het spel verborg overschreven.
- Tandwiel is nu zichtbaar tijdens de vraagfase en verborgen in andere fases.
- Start spel wordt in zowel Dark als Light mode geforceerd groen weergegeven.


v29 PWA:
- Bij 3 spelers is speler 3 geel.
- Bij 4 spelers is speler 4 geel in plaats van paars.
- Versie bijgewerkt naar v29 PWA.


v30 PWA:
- Label aangepast naar Checkbox Timer tonen.
- Opslaan en Reset spel hebben dezelfde lettergrootte.
- Versieregel 3px kleiner.
- Actieve Dark/Light keuze duidelijker zichtbaar.


v31 PWA:
- Timer tonen gebruikt nu dezelfde checkbox-opmaak als de opdrachten:
  eerst checkbox, daarna tekst.


v32 PWA:
- Vanaf 10 seconden begint de vraagbox te pulseren.
- Richting 0 wordt het effect steeds sneller en sterker.
- De originele vraagkleur blijft de basis.
- Effect stopt direct bij een nieuwe fase/ronde.


v33 PWA:
- Timer-spanning volledig frame-gebaseerd gemaakt met requestAnimationFrame.
- Pulsfrequentie en intensiteit lopen continu op van 10 naar 0 seconden.
- Geen sprongen meer bij hele seconden of wisselende CSS-animation-duration.


v34 PWA:
- Na afloop van de timer verschijnt eerst 1,5 seconde 'TIJD IS OP!'.
- Daarna valt een draaiende discobal vanaf boven in beeld.
- Zodra de discobal volledig in beeld is, explodeert die.
- Na de explosie start automatisch opnieuw de buzzerfase.
