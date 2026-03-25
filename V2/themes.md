# LeerWereld - Thema Toevoegen AI Prompt

## 🤖 AI Prompt voor Cursor/Andere AI Tools

Gebruik deze prompt om een nieuw thema toe te voegen aan LeerWereld:

---

**PROMPT:**

```
Voeg een nieuw thema toe aan LeerWereld met de naam "[THEMA_NAAM]" en displayName "[THEMA_WEERGAVE_NAAM]".

Thema details:
- Hoofdicoon: [EMOJI_ICOON]
- Achtergrond: [KLEUR_BESCHRIJVING] (gebruik gradient)
- 6 items met emoji's, Nederlandse namen en unieke geluidsnamen:
  1. [EMOJI] - [NEDERLANDSE_NAAM] - [GELUID_NAAM]
  2. [EMOJI] - [NEDERLANDSE_NAAM] - [GELUID_NAAM]
  3. [EMOJI] - [NEDERLANDSE_NAAM] - [GELUID_NAAM]
  4. [EMOJI] - [NEDERLANDSE_NAAM] - [GELUID_NAAM]
  5. [EMOJI] - [NEDERLANDSE_NAAM] - [GELUID_NAAM]
  6. [EMOJI] - [NEDERLANDSE_NAAM] - [GELUID_NAAM]

Voer de volgende stappen uit:

1. Voeg het thema toe aan themes.js in het Themes object
2. Voeg een HTML knop toe in index.html in de thema sectie
3. Voeg CSS styling toe in styles.css met passende kleuren
4. Voeg WebAudio geluiden toe in audio-engines.js (webaudio sectie)
5. Voeg JSFXR 8-bit geluiden toe in audio-engines.js (jsfxr sectie)

Zorg ervoor dat:
- Alle geluidsnamen uniek zijn
- Emoji's geschikt zijn voor kinderen
- Nederlandse namen eenvoudig en correct zijn
- Kleuren passen bij het thema en voldoende contrast hebben
- WebAudio geluiden realistisch klinken
- JSFXR geluiden 8-bit retro stijl hebben
- Alle bestanden consistent zijn met bestaande code stijl
```

---

## 📋 Voorbeeld Invulling

**THEMA_NAAM:** `dierenpark`  
**THEMA_WEERGAVE_NAAM:** `Dierenpark`  
**EMOJI_ICOON:** `🦒`  
**KLEUR_BESCHRIJVING:** `groen/bruin gradient voor natuur`  

**Items:**
1. 🦒 - giraf - giraf_geluid
2. 🐘 - olifant - olifant_trompet  
3. 🦁 - leeuw - leeuw_brul
4. 🐧 - pinguïn - pinguïn_waggel
5. 🦜 - papegaai - papegaai_praat
6. 🐨 - koala - koala_knuffel

## 🎨 Kleur Suggesties per Thema Type

### Natuur Thema's:
```css
--bg-color: #f0f8f0;
--primary-color: #2e7d32;
--secondary-color: #1b5e20;
--accent-color: #4caf50;
--text-color: #1b5e20;
```

### Stad Thema's:
```css
--bg-color: #f5f5f5;
--primary-color: #424242;
--secondary-color: #212121;
--accent-color: #ff9800;
--text-color: #212121;
```

### Feest Thema's:
```css
--bg-color: #fff3e0;
--primary-color: #e91e63;
--secondary-color: #c2185b;
--accent-color: #ffeb3b;
--text-color: #c2185b;
```

## 🎵 Geluid Types

### WebAudio Types:
- `tone`: Eenvoudige toon - `{ type: 'tone', freq: 440, duration: 0.3, wave: 'sine' }`
- `click`: Korte klik - `{ type: 'click' }`
- `noise`: Ruis met filter - `{ type: 'noise', duration: 0.2, filter: 'lowpass', freq: 400 }`
- `chord`: Akkoord - `{ type: 'chord', frequencies: [523, 659], duration: 0.25 }`
- `sequence`: Notenreeks - `{ type: 'sequence', notes: [440, 523, 659], duration: 0.1 }`

### JSFXR 8-bit Patronen:
- **Dierengeluiden**: `[0,.5,.15,.1,.7,.2,,.1,,,,,,,,,1,,,]`
- **Klik geluiden**: `[3,,.01,.6,,.1,,,,,,,,,.3,,,.1,1,,,]`
- **Toon geluiden**: `[3,,.1,.3,.2,.1,,,,,,,,,.5,,,.1,1,,,]`
- **Ruis geluiden**: `[3,,.2,.1,.3,.3,,,,,,,,,.4,,,.1,1,,,]`

## 📝 Checklist voor AI

Zorg dat de AI deze checklist volgt:

- [ ] Thema toegevoegd aan `themes.js` met correcte structuur
- [ ] HTML knop toegevoegd in `index.html` thema sectie
- [ ] CSS styling toegevoegd in `styles.css` met unieke data-theme
- [ ] WebAudio geluiden toegevoegd met realistische parameters
- [ ] JSFXR geluiden toegevoegd met 8-bit stijl
- [ ] Alle geluidsnamen zijn uniek en beschrijvend
- [ ] Emoji's zijn geschikt voor kinderen (3-8 jaar)
- [ ] Nederlandse namen zijn eenvoudig en correct
- [ ] Kleuren hebben voldoende contrast
- [ ] Code volgt bestaande stijl en conventies
- [ ] Geen linter errors geïntroduceerd

## 🔍 Bestaande Thema's als Referentie

Bekijk deze bestaande thema's voor inspiratie:
- `sea` - Onderwaterwereld met blauwe tinten
- `jungle` - Wilde dieren met groene tinten  
- `farm` - Boerderij met aardse tinten
- `space` - Ruimte met donkere tinten
- `supermarket` - Winkelen met rode tinten
- `shop` - Kleding met groene tinten

## ⚠️ Belangrijke Notities

1. **Unieke namen**: Zorg dat thema ID en geluidsnamen uniek zijn
2. **Kinderen**: Alle content moet geschikt zijn voor 3-8 jarigen
3. **Toegankelijkheid**: Houd rekening met kleurcontrast en duidelijkheid
4. **Consistentie**: Volg de bestaande code stijl en structuur
5. **Testen**: Controleer of alle bestanden correct zijn bijgewerkt

---

*Gebruik deze prompt om nieuwe thema's toe te voegen aan LeerWereld met behulp van AI tools zoals Cursor.*
