# 🕌 NurApp – Muslim Daily Companion

A beautiful, fully offline-capable Islamic web app. No frameworks, no build tools — pure HTML, CSS and JavaScript.

## Features

| Page | Description |
|------|-------------|
| 🕌 Dashboard | Hijri date, prayer strip, verse & hadith of the day |
| 🕐 Prayer Times | Live prayer times with auto location + city search |
| 🧭 Qibla | Compass pointing to the Kaaba from anywhere |
| 📖 Quran Browser | All 114 Surahs via Al-Quran Cloud API, multi-language |
| 🧠 Memorization | Spaced-repetition flashcards for Quranic duas |
| 📿 Dhikr Counter | Animated ring counter with presets & custom dhikr |
| 🌙 Adhkar & Duas | Morning, evening, travel, sleep supplications |
| 📓 Dua Journal | Personal dua log saved to localStorage |
| 📜 Hadith Explorer | Collection browser with authenticity grades |
| 🎓 Islamic Quiz | 20+ questions on Quran, Fiqh, History, Prophets |
| 💰 Zakat Calculator | Cash, gold, business assets with Nisab check |

## Usage

### Run locally
Just open `index.html` in any modern browser — no server required for most features.  
The Quran browser fetches from the [Al-Quran Cloud API](https://alquran.cloud/api) so an internet connection is needed for that page.

### Deploy to GitHub Pages
1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from branch → main → / (root)**
4. Your app will be live at `https://<your-username>.github.io/<repo-name>/`

## Project Structure

```
nurapp/
├── index.html          # Dashboard
├── prayer.html
├── qibla.html
├── quran.html
├── memorize.html
├── dhikr.html
├── adhkar.html
├── journal.html
├── hadith.html
├── quiz.html
├── zakat.html
├── css/
│   └── main.css        # All styles
└── js/
    └── shared.js       # Shared data, utilities, sidebar
```

## Credits
- Quran data: [AlQuran.cloud](https://alquran.cloud)
- Prayer algorithm: Solar equation method (Muslim World League parameters)
- Fonts: Google Fonts (Cinzel, Noto Naskh Arabic, Lato, Amiri)
