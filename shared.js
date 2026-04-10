// ──────────────────────────────────────────────
//  NurApp  –  shared.js
// ──────────────────────────────────────────────

// ── UI Language System ────────────────────────
const UI_STRINGS = {
  en: {
    dashboard:'Dashboard', prayer:'Prayer Times', qibla:'Qibla Direction',
    quran:'Quran Browser', memorize:'Memorization', dhikr:'Dhikr Counter',
    adhkar:'Adhkar & Duas', journal:'Dua Journal', hadith:'Hadith Explorer',
    quiz:'Islamic Quiz', zakat:'Zakat Calculator',
    greeting:'Assalamu Alaikum 🌙', detecting:'📍 Detecting location...',
    nextPrayer:'Next Prayer', verseOfDay:'📖 Verse of the Day',
    hadithOfDay:'📜 Hadith of the Day', quickDhikr:'📿 Quick Dhikr',
    morningAdhkar:'🤲 Morning Adhkar', testKnowledge:'🎓 Test Your Knowledge',
    quizDesc:'Challenge yourself with our Islamic Quiz covering Quran, Fiqh, History, Prophets and more.',
    startQuiz:'Start Quiz 🎓', zakatReminder:'💰 Zakat Reminder',
    zakatDesc:'Zakat purifies your wealth. Calculate your obligation for gold, silver, cash, and business assets.',
    calcZakat:'Calculate Zakat →', openCounter:'Open Counter →',
    allAdhkar:'All Adhkar →', viewAllTimes:'View all times →',
    calculating:'Calculating...', until:'Until',
    home:'Home', prayerGroup:'Prayer', quranGroup:'Quran',
    worshipGroup:'Worship', knowledgeGroup:'Knowledge', financeGroup:'Finance',
    tagline:'Muslim Daily Companion', langLabel:'🌐 Language'
  },
  bn: {
    // Navigation
    dashboard:'ড্যাশবোর্ড', prayer:'নামাজের সময়', qibla:'কিবলার দিক',
    quran:'কুরআন ব্রাউজার', memorize:'মুখস্থকরণ', dhikr:'জিকির কাউন্টার',
    adhkar:'আজকার ও দোয়া', journal:'দোয়া জার্নাল', hadith:'হাদিস অন্বেষণ',
    quiz:'ইসলামিক কুইজ', zakat:'যাকাত হিসাবক',
    // Groups
    home:'হোম', prayerGroup:'নামাজ', quranGroup:'কুরআন',
    worshipGroup:'ইবাদত', knowledgeGroup:'জ্ঞান', financeGroup:'অর্থ',
    // Dashboard
    greeting:'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু 🌙',
    detecting:'📍 আপনার অবস্থান নির্ণয় হচ্ছে...',
    nextPrayer:'পরবর্তী নামাজ',
    verseOfDay:'📖 আজকের কুরআনের আয়াত',
    hadithOfDay:'📜 আজকের হাদিস',
    quickDhikr:'📿 দ্রুত জিকির',
    morningAdhkar:'🤲 সকালের আজকার',
    testKnowledge:'🎓 আপনার জ্ঞান যাচাই করুন',
    quizDesc:'কুরআন, ফিকহ, ইসলামের ইতিহাস, নবী-রাসূলগণ সম্পর্কে আমাদের ইসলামিক কুইজে অংশগ্রহণ করুন।',
    startQuiz:'কুইজ শুরু করুন 🎓',
    zakatReminder:'💰 যাকাতের স্মরণ',
    zakatDesc:'যাকাত আপনার সম্পদ পবিত্র করে এবং গরিবদের হক আদায় করে। সোনা, রুপা, নগদ অর্থ ও ব্যবসায়িক সম্পদের যাকাত হিসাব করুন।',
    calcZakat:'যাকাত হিসাব করুন →',
    openCounter:'জিকির কাউন্টার খুলুন →',
    allAdhkar:'সমস্ত আজকার দেখুন →',
    viewAllTimes:'সব নামাজের সময় দেখুন →',
    calculating:'গণনা করা হচ্ছে...',
    until:'বাকি আছে',
    // Misc
    tagline:'মুসলিম দৈনন্দিন সহায়ক', langLabel:'🌐 ভাষা নির্বাচন'
  }
};

function getUILang(){ return localStorage.getItem('nur-ui-lang') || 'en'; }
function t(key){ return (UI_STRINGS[getUILang()] || UI_STRINGS.en)[key] || UI_STRINGS.en[key] || key; }
function setUILang(lang){
  localStorage.setItem('nur-ui-lang', lang);
  location.reload();
}


(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a=>{
    const href = a.getAttribute('href');
    if(href && href === path) a.classList.add('active');
  });
})();

// ── Toast ─────────────────────────────────────
function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._to);
  t._to = setTimeout(()=>t.classList.remove('show'), 2400);
}

// ── Copy to clipboard ─────────────────────────
function copyText(text){
  navigator.clipboard.writeText(text).then(()=>showToast('Copied ✓'));
}

// ── Hijri date (via Intl.DateTimeFormat) ─────
function getHijriStr(){
  const now = new Date();
  try {
    const arFmt = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {day:'numeric',month:'long',year:'numeric'});
    const enFmt = new Intl.DateTimeFormat('en-u-ca-islamic',    {day:'numeric',month:'long',year:'numeric'});
    return { ar: arFmt.format(now), en: enFmt.format(now) + ' AH' };
  } catch(e) {
    return { ar:'', en:'Hijri date unavailable' };
  }
}

// ── Country timezone map (standard offsets) ──────────────────────────────
const COUNTRY_TZ = { bd:+6, jp:+9, us:-5, de:+1, it:+1, cn:+8, au:+10 };

// ── Prayer times ─────────────────────────────────────────────────────────
// method: 'karachi' = Fajr 18° / Isha 18° (Bangladesh default)
//         'mwl'     = Fajr 18° / Isha 17° (Muslim World League — all other countries)
// Asr: always Hanafi shadow-factor 2
// tzOffset: explicit UTC hours for country tabs; null = browser local tz
function calcPrayerTimes(lat=23.8103, lng=90.4125, tzOffset=null, method='karachi'){
  const now = new Date();
  const timezone = (tzOffset !== null) ? tzOffset : (-now.getTimezoneOffset() / 60);
  const Y = now.getFullYear(), Mo = now.getMonth()+1, D = now.getDate();

  // Reusable sun-position calc (for today + tomorrow)
  function sunCalc(year, month, day){
    const Nd = Math.floor(275*month/9)
      - Math.floor((month+9)/12)*(1+Math.floor((year-4*Math.floor(year/4)+2)/3))
      + day - 30;
    const L   = (280.461 + 0.9856474*Nd) % 360;
    const g   = (357.528 + 0.9856003*Nd) % 360;
    const gR  = g*Math.PI/180;
    const lam = L + 1.915*Math.sin(gR) + 0.02*Math.sin(2*gR);
    const lamR= lam*Math.PI/180;
    const eps = 23.439 - 0.0000004*Nd;
    const epsR= eps*Math.PI/180;
    const sinDec = Math.sin(epsR)*Math.sin(lamR);
    const dec    = Math.asin(sinDec);
    let RA = Math.atan2(Math.cos(epsR)*Math.sin(lamR), Math.cos(lamR))*180/Math.PI/15;
    RA = ((RA%24)+24)%24;
    const noon = 12 - (L/15 - RA) + timezone - lng/15;
    return {noon, dec, sinDec};
  }

  const {noon:solarNoon, dec, sinDec} = sunCalc(Y, Mo, D);
  const latR = lat*Math.PI/180;

  function hourAngle(angleDeg){
    const cosH = (Math.sin(angleDeg*Math.PI/180) - Math.sin(latR)*sinDec)
               / (Math.cos(latR)*Math.cos(dec));
    if(cosH<-1) return 12; if(cosH>1) return 0;
    return Math.acos(cosH)*180/Math.PI/15;
  }

  // Hanafi Asr: shadow factor = 2
  // Altitude angle = atan(1 / (factor + tan(|lat - dec|))) — POSITIVE degrees above horizon
  function asrHA(){
    const alt = Math.atan(1/(2+Math.tan(Math.abs(latR-dec)))); // radians, positive
    const cosH = (Math.sin(alt)-Math.sin(latR)*sinDec)/(Math.cos(latR)*Math.cos(dec));
    if(cosH<-1) return 12; if(cosH>1) return 0;
    return Math.acos(cosH)*180/Math.PI/15;
  }

  // Fajr always 18°; Isha: 18° (Karachi) or 17° (MWL)
  const ishaAngle = (method === 'mwl') ? -17 : -18;
  const fajrHA    = hourAngle(-18);
  const sunriseHA = hourAngle(-0.833);
  const asrOff    = asrHA();
  const maghribHA = hourAngle(-0.833);
  const ishaHA    = hourAngle(ishaAngle);

  function toDate(decHours){
    // Convert decimal local-time hours (in the TARGET timezone) to a UTC Date.
    // solarNoon and offsets are already expressed in target-tz clock hours,
    // so we subtract tzOffset to get UTC, then build a Date from UTC midnight + offset.
    let h = ((decHours % 24) + 24) % 24;
    // UTC midnight of today
    const utcMidnight = Date.UTC(Y, Mo-1, D, 0, 0, 0, 0);
    // Total minutes in target tz from midnight
    const totalMin = Math.round(h * 60);
    // Subtract tz offset to get UTC minutes from UTC midnight
    const utcMin = totalMin - Math.round(timezone * 60);
    return new Date(utcMidnight + utcMin * 60000);
  }

  const fajrTime    = toDate(solarNoon - fajrHA);
  const sunriseTime = toDate(solarNoon - sunriseHA);
  const dhuhrTime   = toDate(solarNoon + 0.05);
  const asrTime     = toDate(solarNoon + asrOff);
  const maghribTime = toDate(solarNoon + maghribHA);
  const ishaTime    = toDate(solarNoon + ishaHA);

  // ── Waqt end times (each waqt ends when the next begins) ─────────────
  // Fajr   → ends at Sunrise
  // Dhuhr  → ends at Asr
  // Asr    → ends at Maghrib (Shafi'i: ends ~15 min before Maghrib for makruh zone)
  // Maghrib→ ends at Isha
  // Isha   → ends at next Fajr (midnight is used as a practical cutoff by many scholars;
  //           we show next-day Fajr as the outer limit)
  const fajrEnd    = new Date(sunriseTime);
  const dhuhrEnd   = new Date(asrTime);
  const asrEnd     = new Date(maghribTime);          // outer limit (sunnah: before redness leaves sky)
  const maghribEnd = new Date(ishaTime);
  // Isha ends at next-day Fajr – recalculate for tomorrow
  const tomorrow   = new Date(now); tomorrow.setDate(now.getDate()+1);
  const tomN       = Math.floor(275*(tomorrow.getMonth()+1)/9)
    - Math.floor(((tomorrow.getMonth()+1)+9)/12)*(1+Math.floor((tomorrow.getFullYear()-4*Math.floor(tomorrow.getFullYear()/4)+2)/3))
    + tomorrow.getDate() - 30;
  const tomG  = (357.528 + 0.9856003*tomN) % 360;
  const tomL  = (280.461 + 0.9856474*tomN) % 360;
  const tomGR = tomG * Math.PI/180;
  const tomLambda  = tomL + 1.915*Math.sin(tomGR) + 0.02*Math.sin(2*tomGR);
  const tomEps     = 23.439 - 0.0000004*tomN;
  const tomSinDec  = Math.sin(tomEps*Math.PI/180)*Math.sin(tomLambda*Math.PI/180);
  const tomDec     = Math.asin(tomSinDec);
  let tomRA        = Math.atan2(Math.cos(tomEps*Math.PI/180)*Math.sin(tomLambda*Math.PI/180), Math.cos(tomLambda*Math.PI/180))*180/Math.PI/15;
  tomRA            = ((tomRA%24)+24)%24;
  const tomNoon    = 12 - (tomL/15 - tomRA) + timezone - lng/15;
  const tomFajrHA  = (function(){
    const cosH = (Math.sin(-18*Math.PI/180) - Math.sin(latR)*tomSinDec)/(Math.cos(latR)*Math.cos(tomDec)); // Fajr always 18°
    if(cosH<-1) return 12; if(cosH>1) return 0;
    return Math.acos(cosH)*180/Math.PI/15;
  })();
  const ishaEnd = (function(){
    let h = (((tomNoon - tomFajrHA) % 24)+24)%24;
    const tY=tomorrow.getFullYear(), tMo=tomorrow.getMonth()+1, tD=tomorrow.getDate();
    const utcMidTom = Date.UTC(tY, tMo-1, tD, 0, 0, 0, 0);
    const utcMin = Math.round(h*60) - Math.round(timezone*60);
    return new Date(utcMidTom + utcMin*60000);
  })();

  // ── Forbidden prayer times ────────────────────────────────────────────
  const forbidden1Start = new Date(sunriseTime);
  const forbidden1End   = new Date(sunriseTime.getTime() + 15*60000);
  const forbidden2Start = toDate(solarNoon - 5/60);
  const forbidden2End   = new Date(dhuhrTime);
  const forbidden3Start = new Date(maghribTime.getTime() - 15*60000);
  const forbidden3End   = new Date(maghribTime);

  return [
    {name:'Fajr',    ar:'الفجر',   time:fajrTime,    end:fajrEnd,    endLabel:'Sunrise'},
    {name:'Sunrise', ar:'الشروق',  time:sunriseTime,  end:forbidden1End, endLabel:'End of forbidden'},
    {name:'Dhuhr',   ar:'الظهر',   time:dhuhrTime,    end:dhuhrEnd,   endLabel:'Asr begins'},
    {name:'Asr',     ar:'العصر',   time:asrTime,      end:asrEnd,     endLabel:'Maghrib begins'},
    {name:'Maghrib', ar:'المغرب',  time:maghribTime,  end:maghribEnd, endLabel:'Isha begins'},
    {name:'Isha',    ar:'العشاء',  time:ishaTime,     end:ishaEnd,    endLabel:'Next Fajr'},
    {name:'_forbidden1', start:forbidden1Start, end:forbidden1End, label:'🚫 Sunrise (forbidden)'},
    {name:'_forbidden2', start:forbidden2Start, end:forbidden2End, label:'🚫 Istiwa / Solar Noon (forbidden)'},
    {name:'_forbidden3', start:forbidden3Start, end:forbidden3End, label:'🚫 Before Sunset (forbidden)'},
  ];
}

// Helper: get only the 6 main prayers (strip hidden objects)
function getMainPrayers(lat, lng, tz=null, method='karachi'){
  return calcPrayerTimes(lat, lng, tz, method).filter(p => !p.name.startsWith('_'));
}

// Helper: get forbidden times
function getForbiddenTimes(lat, lng, tz=null, method='karachi'){
  return calcPrayerTimes(lat, lng, tz, method).filter(p => p.name.startsWith('_forbidden'));
}

// _activeTZ: set when a country tab is selected so fmt12 shows that tz's clock
let _activeTZ = null; // null = browser local tz

function fmt12(d, tzOverride){
  if(!(d instanceof Date)||isNaN(d)) return '--:--';
  const tz = (tzOverride !== undefined) ? tzOverride : _activeTZ;
  let h, m;
  if(tz !== null){
    // Build display from UTC + tz offset
    const utcMs = d.getTime();
    const tzMs  = Math.round(tz * 3600000);
    const local = new Date(utcMs + tzMs);
    h = local.getUTCHours();
    m = local.getUTCMinutes();
  } else {
    h = d.getHours();
    m = d.getMinutes();
  }
  const a = h>=12?'PM':'AM';
  h = h%12||12;
  return `${h}:${String(m).padStart(2,'0')} ${a}`;
}

function getNextPrayer(prayers){
  const now=new Date();
  const main=['Fajr','Dhuhr','Asr','Maghrib','Isha'];
  const filtered=prayers.filter(p=>main.includes(p.name));
  for(const p of filtered) if(p.time>now) return p;
  return filtered[0];
}

// ── Language options ──────────────────────────
const LANG_OPTIONS = [
  {code:'en.asad',     label:'English – Muhammad Asad'},
  {code:'en.sahih',    label:'English – Sahih International'},
  {code:'en.pickthall',label:'English – Pickthall'},
  {code:'en.yusufali', label:'English – Yusuf Ali'},
  {code:'fr.hamidullah',label:'French – Hamidullah'},
  {code:'de.bubenheim', label:'German – Bubenheim'},
  {code:'es.asad',     label:'Spanish – Asad'},
  {code:'tr.diyanet',  label:'Turkish – Diyanet'},
  {code:'ur.jalandhry',label:'Urdu – Jalandhry'},
  {code:'bn.bengali',  label:'Bengali – Bengali'},
  {code:'id.indonesian',label:'Indonesian – Indonesian'},
  {code:'ru.kuliev',   label:'Russian – Kuliev'},
  {code:'zh.malay',    label:'Chinese – Malay'},
  {code:'hi.hindi',    label:'Hindi – Hindi'},
];

function buildLangSelector(selectId='lang-sel'){
  const saved = localStorage.getItem('nur-lang') || 'en.sahih';
  return `<div class="lang-bar">
    <label>🌐 Translation Language:</label>
    <select id="${selectId}" onchange="localStorage.setItem('nur-lang',this.value)">
      ${LANG_OPTIONS.map(l=>`<option value="${l.code}" ${l.code===saved?'selected':''}>${l.label}</option>`).join('')}
    </select>
  </div>`;
}

function getLang(){ return localStorage.getItem('nur-lang')||'en.sahih'; }

// ── Quran data: all 114 surahs ────────────────
const SURAHS = [
  [1,"Al-Fatiha","The Opening",7,"Meccan"],
  [2,"Al-Baqarah","The Cow",286,"Medinan"],
  [3,"Al-Imran","Family of Imran",200,"Medinan"],
  [4,"An-Nisa","The Women",176,"Medinan"],
  [5,"Al-Ma'idah","The Table Spread",120,"Medinan"],
  [6,"Al-An'am","The Cattle",165,"Meccan"],
  [7,"Al-A'raf","The Heights",206,"Meccan"],
  [8,"Al-Anfal","The Spoils of War",75,"Medinan"],
  [9,"At-Tawbah","The Repentance",129,"Medinan"],
  [10,"Yunus","Jonah",109,"Meccan"],
  [11,"Hud","Hud",123,"Meccan"],
  [12,"Yusuf","Joseph",111,"Meccan"],
  [13,"Ar-Ra'd","The Thunder",43,"Medinan"],
  [14,"Ibrahim","Abraham",52,"Meccan"],
  [15,"Al-Hijr","The Rocky Tract",99,"Meccan"],
  [16,"An-Nahl","The Bee",128,"Meccan"],
  [17,"Al-Isra","The Night Journey",111,"Meccan"],
  [18,"Al-Kahf","The Cave",110,"Meccan"],
  [19,"Maryam","Mary",98,"Meccan"],
  [20,"Ta-Ha","Ta-Ha",135,"Meccan"],
  [21,"Al-Anbiya","The Prophets",112,"Meccan"],
  [22,"Al-Hajj","The Pilgrimage",78,"Medinan"],
  [23,"Al-Mu'minun","The Believers",118,"Meccan"],
  [24,"An-Nur","The Light",64,"Medinan"],
  [25,"Al-Furqan","The Criterion",77,"Meccan"],
  [26,"Ash-Shu'ara","The Poets",227,"Meccan"],
  [27,"An-Naml","The Ant",93,"Meccan"],
  [28,"Al-Qasas","The Stories",88,"Meccan"],
  [29,"Al-Ankabut","The Spider",69,"Meccan"],
  [30,"Ar-Rum","The Romans",60,"Meccan"],
  [31,"Luqman","Luqman",34,"Meccan"],
  [32,"As-Sajdah","The Prostration",30,"Meccan"],
  [33,"Al-Ahzab","The Combined Forces",73,"Medinan"],
  [34,"Saba","Sheba",54,"Meccan"],
  [35,"Fatir","Originator",45,"Meccan"],
  [36,"Ya-Sin","Ya Sin",83,"Meccan"],
  [37,"As-Saffat","Those Who Set the Ranks",182,"Meccan"],
  [38,"Sad","The Letter Sad",88,"Meccan"],
  [39,"Az-Zumar","The Troops",75,"Meccan"],
  [40,"Ghafir","The Forgiver",85,"Meccan"],
  [41,"Fussilat","Explained in Detail",54,"Meccan"],
  [42,"Ash-Shura","The Consultation",53,"Meccan"],
  [43,"Az-Zukhruf","The Gold Adornments",89,"Meccan"],
  [44,"Ad-Dukhan","The Smoke",59,"Meccan"],
  [45,"Al-Jathiyah","The Crouching",37,"Meccan"],
  [46,"Al-Ahqaf","The Wind-Curved Sandhills",35,"Meccan"],
  [47,"Muhammad","Muhammad",38,"Medinan"],
  [48,"Al-Fath","The Victory",29,"Medinan"],
  [49,"Al-Hujurat","The Rooms",18,"Medinan"],
  [50,"Qaf","The Letter Qaf",45,"Meccan"],
  [51,"Adh-Dhariyat","The Winnowing Winds",60,"Meccan"],
  [52,"At-Tur","The Mount",49,"Meccan"],
  [53,"An-Najm","The Star",62,"Meccan"],
  [54,"Al-Qamar","The Moon",55,"Meccan"],
  [55,"Ar-Rahman","The Beneficent",78,"Medinan"],
  [56,"Al-Waqi'ah","The Inevitable",96,"Meccan"],
  [57,"Al-Hadid","The Iron",29,"Medinan"],
  [58,"Al-Mujadila","The Pleading Woman",22,"Medinan"],
  [59,"Al-Hashr","The Exile",24,"Medinan"],
  [60,"Al-Mumtahanah","She That Is to Be Examined",13,"Medinan"],
  [61,"As-Saf","The Ranks",14,"Medinan"],
  [62,"Al-Jumu'ah","The Congregation",11,"Medinan"],
  [63,"Al-Munafiqun","The Hypocrites",11,"Medinan"],
  [64,"At-Taghabun","The Mutual Disillusion",18,"Medinan"],
  [65,"At-Talaq","The Divorce",12,"Medinan"],
  [66,"At-Tahrim","The Prohibition",12,"Medinan"],
  [67,"Al-Mulk","The Sovereignty",30,"Meccan"],
  [68,"Al-Qalam","The Pen",52,"Meccan"],
  [69,"Al-Haqqah","The Reality",52,"Meccan"],
  [70,"Al-Ma'arij","The Ascending Stairways",44,"Meccan"],
  [71,"Nuh","Noah",28,"Meccan"],
  [72,"Al-Jinn","The Jinn",28,"Meccan"],
  [73,"Al-Muzzammil","The Enshrouded One",20,"Meccan"],
  [74,"Al-Muddaththir","The Cloaked One",56,"Meccan"],
  [75,"Al-Qiyamah","The Resurrection",40,"Meccan"],
  [76,"Al-Insan","The Man",31,"Medinan"],
  [77,"Al-Mursalat","The Emissaries",50,"Meccan"],
  [78,"An-Naba","The Tidings",40,"Meccan"],
  [79,"An-Nazi'at","Those Who Drag Forth",46,"Meccan"],
  [80,"Abasa","He Frowned",42,"Meccan"],
  [81,"At-Takwir","The Overthrowing",29,"Meccan"],
  [82,"Al-Infitar","The Cleaving",19,"Meccan"],
  [83,"Al-Mutaffifin","The Defrauding",36,"Meccan"],
  [84,"Al-Inshiqaq","The Sundering",25,"Meccan"],
  [85,"Al-Buruj","The Mansions of the Stars",22,"Meccan"],
  [86,"At-Tariq","The Nightcomer",17,"Meccan"],
  [87,"Al-A'la","The Most High",19,"Meccan"],
  [88,"Al-Ghashiyah","The Overwhelming",26,"Meccan"],
  [89,"Al-Fajr","The Dawn",30,"Meccan"],
  [90,"Al-Balad","The City",20,"Meccan"],
  [91,"Ash-Shams","The Sun",15,"Meccan"],
  [92,"Al-Layl","The Night",21,"Meccan"],
  [93,"Ad-Duha","The Morning Hours",11,"Meccan"],
  [94,"Ash-Sharh","The Relief",8,"Meccan"],
  [95,"At-Tin","The Fig",8,"Meccan"],
  [96,"Al-Alaq","The Clot",19,"Meccan"],
  [97,"Al-Qadr","The Power",5,"Meccan"],
  [98,"Al-Bayyinah","The Clear Proof",8,"Medinan"],
  [99,"Az-Zalzalah","The Earthquake",8,"Medinan"],
  [100,"Al-Adiyat","The Courser",11,"Meccan"],
  [101,"Al-Qari'ah","The Calamity",11,"Meccan"],
  [102,"At-Takathur","The Rivalry in World Increase",8,"Meccan"],
  [103,"Al-Asr","The Declining Day",3,"Meccan"],
  [104,"Al-Humazah","The Traducer",9,"Meccan"],
  [105,"Al-Fil","The Elephant",5,"Meccan"],
  [106,"Quraysh","Quraysh",4,"Meccan"],
  [107,"Al-Ma'un","The Small Kindnesses",7,"Meccan"],
  [108,"Al-Kawthar","The Abundance",3,"Meccan"],
  [109,"Al-Kafirun","The Disbelievers",6,"Meccan"],
  [110,"An-Nasr","The Divine Support",3,"Medinan"],
  [111,"Al-Masad","The Palm Fiber",5,"Meccan"],
  [112,"Al-Ikhlas","The Sincerity",4,"Meccan"],
  [113,"Al-Falaq","The Daybreak",5,"Meccan"],
  [114,"An-Nas","Mankind",6,"Meccan"],
];

// ── Dhikr presets ─────────────────────────────
const DHIKRS = [
  {ar:'سُبْحَانَ اللَّهِ',       rom:'SubhanAllah',       en:'Glory be to Allah',              target:33},
  {ar:'الْحَمْدُ لِلَّهِ',       rom:'Alhamdulillah',     en:'All praise is due to Allah',     target:33},
  {ar:'اللَّهُ أَكْبَرُ',        rom:'Allahu Akbar',      en:'Allah is the Greatest',          target:34},
  {ar:'لَا إِلَهَ إِلَّا اللَّهُ', rom:'La ilaha illallah', en:'There is no god but Allah',     target:100},
  {ar:'أَسْتَغْفِرُ اللَّهَ',     rom:'Astaghfirullah',   en:'I seek forgiveness from Allah',  target:100},
  {ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', rom:'SubhanAllahi wa bihamdihi', en:'Glory and praise be to Allah', target:100},
  {ar:'سُبْحَانَ اللَّهِ الْعَظِيمِ', rom:"SubhanAllahil 'Azeem", en:'Glory be to Allah, the Magnificent', target:33},
  {ar:'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', rom:"La hawla wala quwwata illa billah", en:'There is no might or power except with Allah', target:100},
];

// ── Adhkar data ───────────────────────────────
const ADHKAR = {
  morning:[
    {title:'Ayat al-Kursi',   rom:"Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm...",
     ar:'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
     trans:'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
     times:1, source:'Quran 2:255'},
    {title:'Seeking Refuge – Morning',  rom:"A'udhu billahi minash-shaytanir rajeem...",
     ar:'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
     trans:'I seek refuge in Allah from the accursed devil.',
     times:3, source:'Sunnah'},
    {title:'Morning Supplication',  rom:"Asbahna wa asbahal-mulku lillah...",
     ar:'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
     trans:'We have entered the morning and the whole dominion belongs to Allah, and all praise is due to Allah.',
     times:1, source:'Abu Dawud'},
    {title:'Morning Dhikr × 100',   rom:"SubhanAllahi wa bihamdihi...",
     ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
     trans:'Glory and praise be to Allah.',
     times:100, source:'Muslim 2692'},
  ],
  evening:[
    {title:'Evening Supplication',  rom:"Amsayna wa amsal-mulku lillah...",
     ar:'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
     trans:'We have entered the evening and the whole dominion belongs to Allah, and all praise is due to Allah.',
     times:1, source:'Abu Dawud'},
    {title:'Seeking Forgiveness × 100', rom:"Astaghfirullaha wa atubu ilayh...",
     ar:'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
     trans:'I seek forgiveness from Allah and repent to Him.',
     times:100, source:'Bukhari, Muslim'},
    {title:'Evening Protection',    rom:"Allahuma bika amsayna wa bika asbahna...",
     ar:'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا',
     trans:'O Allah, by You we enter the evening and by You we enter the morning.',
     times:1, source:'Abu Dawud'},
  ],
  eating:[
    {title:'Before Eating',  rom:"Bismillah",
     ar:'بِسْمِ اللَّهِ',
     trans:'In the name of Allah.',
     times:1, source:'Bukhari 5376'},
    {title:'After Eating',   rom:"Alhamdu lillahilladhi at'amana...",
     ar:'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
     trans:'Praise be to Allah Who has given us food and drink and made us Muslims.',
     times:1, source:'Abu Dawud 3850'},
    {title:'Forgot to say Bismillah', rom:"Bismillahi awwalahu wa akhirah",
     ar:'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
     trans:'In the name of Allah at its beginning and its end.',
     times:1, source:'Abu Dawud, Tirmidhi'},
  ],
  sleeping:[
    {title:'Before Sleeping', rom:"Bismika Allahumma amutu wa ahya",
     ar:'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
     trans:'In Your name O Allah, I die and I live.',
     times:1, source:'Bukhari 6312'},
    {title:'Al-Ikhlas, Al-Falaq, An-Nas × 3', rom:"Qul huwallahu ahad...",
     ar:'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
     trans:'Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas three times each.',
     times:3, source:'Bukhari 5017'},
    {title:'Ayat al-Kursi before sleep', rom:"Allahu la ilaha illa Huwal-Hayyul-Qayyum...",
     ar:'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
     trans:'Allah – there is no deity except Him, the Ever-Living. Recite before sleeping to be protected until morning.',
     times:1, source:'Bukhari 2311'},
  ],
  travel:[
    {title:'Travelling Supplication', rom:"Subhanalladhi sakhkhara lana hadha...",
     ar:'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
     trans:'Glory to Him Who has subjected this to us, and we could not have otherwise subdued it. Surely, to our Lord we are to return.',
     times:1, source:'Quran 43:13-14'},
    {title:'Dua for a Good Journey',  rom:"Allahumma inna nas'aluka fi safarina hadhal-birra...",
     ar:'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى',
     trans:'O Allah, we ask You on this journey for righteousness and piety.',
     times:1, source:'Muslim 1342'},
  ],
  stress:[
    {title:"Dua of Prophet Yunus (AS)", rom:"La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
     ar:'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
     trans:'There is no god but You, glory be to You. Indeed, I was of the wrongdoers.',
     times:1, source:'Quran 21:87'},
    {title:'HasbunAllah',   rom:"Hasbunallahu wa ni'mal-wakeel",
     ar:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
     trans:'Allah is sufficient for us and He is the best disposer of affairs.',
     times:1, source:'Quran 3:173'},
    {title:'Dua for Anxiety',  rom:"Allahumma inni a'udhu bika minal-hammi wal-huzn...",
     ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
     trans:'O Allah, I seek refuge in You from grief and sadness, from weakness and laziness.',
     times:1, source:'Bukhari 6369'},
  ],
  waking:[
    {title:'Upon Waking',   rom:"Alhamdu lillahilladhi ahyana ba'da ma amatana...",
     ar:'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
     trans:'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
     times:1, source:'Bukhari 6312'},
  ],
};

// ── Hadiths — expanded sectorwise collection ─────────────────────────────
const HADITHS = [
  // Intention & Sincerity
  {ar:'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ', en:"Actions are judged by intentions; every person will have what they intended.", bn:"আমলসমূহ নিয়তের উপর নির্ভরশীল। প্রত্যেক ব্যক্তি তাই পাবে যা সে নিয়ত করেছে।", grade:"Sahih", ref:"Bukhari 1, Muslim 1907", narrator:"Umar ibn al-Khattab (RA)", topic:"Intention"},
  {ar:'إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ', en:"Allah does not look at your faces and wealth, but He looks at your hearts and deeds.", bn:"আল্লাহ তোমাদের চেহারা ও সম্পদের দিকে তাকান না, বরং তিনি তোমাদের অন্তর ও আমলের দিকে তাকান।", grade:"Sahih", ref:"Muslim 2564", narrator:"Abu Hurayrah (RA)", topic:"Sincerity"},
  {ar:'أَخْلِصْ دِينَكَ يَكْفِكَ الْعَمَلُ الْقَلِيلُ', en:"Be sincere in your religion and a little deed will suffice you.", bn:"তোমার দ্বীনকে খাঁটি করো, তাহলে অল্প আমলই তোমার জন্য যথেষ্ট হবে।", grade:"Sahih", ref:"Hakim 1/93", narrator:"Abu Hurayrah (RA)", topic:"Sincerity"},
  // Quran
  {ar:'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', en:"The best among you are those who learn the Quran and teach it.", bn:"তোমাদের মধ্যে সর্বোত্তম সে, যে কুরআন শেখে এবং অপরকে শেখায়।", grade:"Sahih", ref:"Bukhari 5027", narrator:"Uthman ibn Affan (RA)", topic:"Quran"},
  {ar:'اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ', en:"Recite the Quran, for it will come on the Day of Resurrection as an intercessor for its companions.", bn:"তোমরা কুরআন তিলাওয়াত করো, কারণ কিয়ামতের দিন এটি তার সাথীর জন্য সুপারিশ করবে।", grade:"Sahih", ref:"Muslim 804", narrator:"Abu Umamah (RA)", topic:"Quran"},
  {ar:'الْمَاهِرُ بِالْقُرْآنِ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ', en:"The one proficient in the Quran will be with the noble and righteous scribes.", bn:"যে কুরআনে দক্ষ সে সম্মানিত ও নেককার ফেরেশতাদের সাথে থাকবে।", grade:"Sahih", ref:"Bukhari 4937, Muslim 798", narrator:"Aisha (RA)", topic:"Quran"},
  // Salah
  {ar:'الصَّلَاةُ عِمَادُ الدِّينِ', en:"Prayer is the pillar of the religion.", bn:"নামাজ দ্বীনের স্তম্ভ।", grade:"Hasan", ref:"Bayhaqi", narrator:"Muadh ibn Jabal (RA)", topic:"Salah"},
  {ar:'أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ الصَّلَاةُ', en:"The first thing a servant will be held accountable for on the Day of Judgement is the prayer.", bn:"কিয়ামতের দিন বান্দার সর্বপ্রথম যে আমলের হিসাব নেওয়া হবে তা হলো নামাজ।", grade:"Sahih", ref:"Nasai 465, Abu Dawud 864", narrator:"Abu Hurayrah (RA)", topic:"Salah"},
  {ar:'بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكُ الصَّلَاةِ', en:"Between a man and disbelief is the abandonment of prayer.", bn:"একজন মানুষ এবং শিরক ও কুফরের মধ্যে পার্থক্য হলো নামাজ পরিত্যাগ করা।", grade:"Sahih", ref:"Muslim 82", narrator:"Jabir ibn Abdullah (RA)", topic:"Salah"},
  {ar:'مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ', en:"Whoever prays Fajr is under the protection of Allah.", bn:"যে ব্যক্তি ফজরের নামাজ পড়ে সে আল্লাহর জিম্মায় থাকে।", grade:"Sahih", ref:"Muslim 657", narrator:"Jundub ibn Sufyan (RA)", topic:"Salah"},
  // Fasting & Ramadan
  {ar:'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ', en:"Whoever fasts Ramadan out of faith and seeking reward, his past sins will be forgiven.", bn:"যে ব্যক্তি ঈমানের সাথে ও সওয়াবের আশায় রমজান মাসে রোজা রাখে, তার পূর্ববর্তী গুনাহ মাফ করে দেওয়া হয়।", grade:"Sahih", ref:"Bukhari 38, Muslim 760", narrator:"Abu Hurayrah (RA)", topic:"Ramadan"},
  {ar:'الصِّيَامُ جُنَّةٌ', en:"Fasting is a shield.", bn:"রোজা একটি ঢাল।", grade:"Sahih", ref:"Bukhari 1894, Muslim 1151", narrator:"Abu Hurayrah (RA)", topic:"Fasting"},
  {ar:'إِذَا جَاءَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ وَغُلِّقَتْ أَبْوَابُ النَّارِ', en:"When Ramadan comes, the gates of Paradise are opened and the gates of Hell are closed.", bn:"যখন রমজান আসে তখন জান্নাতের দরজাগুলো খুলে দেওয়া হয় এবং জাহান্নামের দরজাগুলো বন্ধ করা হয়।", grade:"Sahih", ref:"Bukhari 1899, Muslim 1079", narrator:"Abu Hurayrah (RA)", topic:"Ramadan"},
  {ar:'لِلصَّائِمِ فَرْحَتَانِ فَرْحَةٌ حِينَ يُفْطِرُ وَفَرْحَةٌ حِينَ يَلْقَى رَبَّهُ', en:"The fasting person has two moments of joy: when he breaks his fast and when he meets his Lord.", bn:"রোজাদারের জন্য দুটি আনন্দ রয়েছে: ইফতারের সময় এবং যখন সে তার রবের সাথে সাক্ষাৎ করবে।", grade:"Sahih", ref:"Bukhari 7492, Muslim 1151", narrator:"Abu Hurayrah (RA)", topic:"Fasting"},
  // Charity & Zakat
  {ar:'خَيْرُ الصَّدَقَةِ مَا كَانَ عَنْ ظَهْرِ غِنًى', en:"The best charity is that which is given from sufficiency.", bn:"সর্বোত্তম দান হলো যা সচ্ছলতার পর দেওয়া হয়।", grade:"Sahih", ref:"Bukhari 1426", narrator:"Abu Hurayrah (RA)", topic:"Charity"},
  {ar:'الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ', en:"Charity extinguishes sin just as water extinguishes fire.", bn:"সদকা গুনাহকে এভাবে মিটিয়ে দেয় যেভাবে পানি আগুন নেভায়।", grade:"Sahih", ref:"Tirmidhi 2616", narrator:"Muadh ibn Jabal (RA)", topic:"Charity"},
  {ar:'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ', en:"Charity does not decrease wealth.", bn:"দান করলে সম্পদ কমে না।", grade:"Sahih", ref:"Muslim 2588", narrator:"Abu Hurayrah (RA)", topic:"Charity"},
  {ar:'مَنْ تَصَدَّقَ بِعَدْلِ تَمْرَةٍ مِنْ كَسْبٍ طَيِّبٍ', en:"Whoever gives charity equal to a date from honest earnings, Allah will accept it with His right hand and nurture it for him.", bn:"যে ব্যক্তি হালাল উপার্জন থেকে একটি খেজুর পরিমাণ দান করে, আল্লাহ তা তাঁর ডান হাতে গ্রহণ করেন।", grade:"Sahih", ref:"Bukhari 1410, Muslim 1014", narrator:"Abu Hurayrah (RA)", topic:"Charity"},
  // Knowledge
  {ar:'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ', en:"Whoever travels a path seeking knowledge, Allah eases for him the path to Paradise.", bn:"যে ব্যক্তি জ্ঞান অন্বেষণের পথে চলে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।", grade:"Sahih", ref:"Muslim 2699", narrator:"Abu Hurayrah (RA)", topic:"Knowledge"},
  {ar:'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ', en:"Seeking knowledge is an obligation upon every Muslim.", bn:"জ্ঞান অর্জন করা প্রতিটি মুসলিমের উপর ফরজ।", grade:"Sahih", ref:"Ibn Majah 224", narrator:"Anas ibn Malik (RA)", topic:"Knowledge"},
  {ar:'الْعُلَمَاءُ وَرَثَةُ الأَنْبِيَاءِ', en:"The scholars are the inheritors of the Prophets.", bn:"আলেমরা হলেন নবীদের ওয়ারিশ।", grade:"Sahih", ref:"Abu Dawud 3641, Tirmidhi 2682", narrator:"Abu Darda (RA)", topic:"Knowledge"},
  // Character & Manners
  {ar:'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ', en:"I was sent only to perfect noble character.", bn:"আমাকে কেবল উত্তম চরিত্রকে পরিপূর্ণ করার জন্য পাঠানো হয়েছে।", grade:"Sahih", ref:"Bayhaqi & Ahmad", narrator:"Abu Hurayrah (RA)", topic:"Character"},
  {ar:'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ', en:"The strong man is not one who overpowers others; the strong is one who controls himself when angry.", bn:"শক্তিশালী সে নয় যে কুস্তিতে জয়ী হয়; বরং শক্তিশালী সে যে রাগের সময় নিজেকে নিয়ন্ত্রণ করে।", grade:"Sahih", ref:"Bukhari 6114", narrator:"Abu Hurayrah (RA)", topic:"Character"},
  {ar:'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', en:"The Muslim is one from whose tongue and hand the Muslims are safe.", bn:"মুসলিম সে, যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ।", grade:"Sahih", ref:"Bukhari 10, Muslim 40", narrator:"Abdullah ibn Amr (RA)", topic:"Character"},
  {ar:'أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا', en:"The most complete of the believers in faith is the one with the best character.", bn:"মুমিনদের মধ্যে ঈমানের দিক থেকে সবচেয়ে পরিপূর্ণ সে, যার চরিত্র সবচেয়ে উত্তম।", grade:"Sahih", ref:"Abu Dawud 4682, Tirmidhi 1162", narrator:"Abu Hurayrah (RA)", topic:"Character"},
  // Brotherhood
  {ar:'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', en:"None of you truly believes until he loves for his brother what he loves for himself.", bn:"তোমাদের কেউ প্রকৃত মুমিন হতে পারবে না যতক্ষণ না সে তার ভাইয়ের জন্য তাই পছন্দ করে যা নিজের জন্য পছন্দ করে।", grade:"Sahih", ref:"Bukhari 13, Muslim 45", narrator:"Anas ibn Malik (RA)", topic:"Brotherhood"},
  {ar:'الْمُسْلِمُ أَخُو الْمُسْلِمِ لَا يَظْلِمُهُ وَلَا يُسْلِمُهُ', en:"A Muslim is the brother of a Muslim; he does not wrong him nor hand him over to be wronged.", bn:"মুসলিম মুসলিমের ভাই। সে তার উপর জুলুম করে না এবং তাকে বিপদে ছেড়ে দেয় না।", grade:"Sahih", ref:"Bukhari 2442, Muslim 2580", narrator:"Ibn Umar (RA)", topic:"Brotherhood"},
  {ar:'مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ كَمَثَلِ الْجَسَدِ الْوَاحِدِ', en:"The example of the believers in affection and mercy is like a single body — when one part aches, the whole body responds with sleeplessness and fever.", bn:"পারস্পরিক ভালোবাসা ও দয়ায় মুমিনদের উদাহরণ একটি দেহের মতো — একটি অঙ্গ ব্যথিত হলে পুরো দেহ ব্যথা অনুভব করে।", grade:"Sahih", ref:"Bukhari 6011, Muslim 2586", narrator:"Numan ibn Bashir (RA)", topic:"Brotherhood"},
  // Speech
  {ar:'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', en:"Whoever believes in Allah and the Last Day should speak good or remain silent.", bn:"যে আল্লাহ ও আখেরাতে বিশ্বাস করে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।", grade:"Sahih", ref:"Bukhari 6018, Muslim 47", narrator:"Abu Hurayrah (RA)", topic:"Speech"},
  {ar:'إِنَّ الرَّجُلَ لَيَتَكَلَّمُ بِالْكَلِمَةِ لَا يَرَى بِهَا بَأْسًا يَهْوِي بِهَا سَبْعِينَ خَرِيفًا', en:"A man may speak a word thinking it harmless, yet it causes him to fall seventy autumns into Hellfire.", bn:"একজন মানুষ এমন কথা বলে যা সে তুচ্ছ মনে করে, অথচ সেই কথার কারণে সে সত্তর বছর জাহান্নামে পড়ে।", grade:"Sahih", ref:"Tirmidhi 2314", narrator:"Abu Hurayrah (RA)", topic:"Speech"},
  // Parents & Family
  {ar:'رِضَا اللَّهِ فِي رِضَا الْوَالِدَيْنِ وَسَخَطُ اللَّهِ فِي سَخَطِ الْوَالِدَيْنِ', en:"The pleasure of Allah is in the pleasure of the parents, and the anger of Allah is in their anger.", bn:"আল্লাহর সন্তুষ্টি পিতামাতার সন্তুষ্টির মধ্যে এবং আল্লাহর অসন্তুষ্টি পিতামাতার অসন্তুষ্টির মধ্যে।", grade:"Sahih", ref:"Tirmidhi 1899", narrator:"Abdullah ibn Amr (RA)", topic:"Parents"},
  {ar:'الْجَنَّةُ تَحْتَ أَقْدَامِ الأُمَّهَاتِ', en:"Paradise lies beneath the feet of mothers.", bn:"মায়েদের পায়ের নিচে জান্নাত।", grade:"Hasan", ref:"Nasai, Ibn Majah", narrator:"Muawiyah ibn Jahimah (RA)", topic:"Parents"},
  {ar:'مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ وَيُنْسَأَ لَهُ فِي أَثَرِهِ فَلْيَصِلْ رَحِمَهُ', en:"Whoever wishes to have his provision expanded and his age extended should maintain ties of kinship.", bn:"যে চায় তার রিজিক বাড়ুক এবং আয়ু দীর্ঘ হোক, সে যেন আত্মীয়তার সম্পর্ক বজায় রাখে।", grade:"Sahih", ref:"Bukhari 5986, Muslim 2557", narrator:"Anas ibn Malik (RA)", topic:"Family"},
  // Repentance
  {ar:'كُلُّ بَنِي آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ', en:"Every son of Adam sins, and the best of those who sin are those who repent.", bn:"প্রতিটি আদম সন্তানই গুনাহগার, আর গুনাহগারদের মধ্যে সর্বোত্তম হলো তওবাকারীরা।", grade:"Hasan", ref:"Tirmidhi 2499, Ibn Majah 4251", narrator:"Anas ibn Malik (RA)", topic:"Repentance"},
  {ar:'إِنَّ اللَّهَ يَقْبَلُ تَوْبَةَ الْعَبْدِ مَا لَمْ يُغَرْغِرْ', en:"Allah accepts the repentance of a servant as long as he has not reached the death rattle.", bn:"আল্লাহ বান্দার তওবা ততক্ষণ পর্যন্ত কবুল করেন যতক্ষণ না মৃত্যুর শেষ নিঃশ্বাস উপস্থিত হয়।", grade:"Hasan", ref:"Tirmidhi 3537", narrator:"Ibn Umar (RA)", topic:"Repentance"},
  {ar:'التَّائِبُ مِنَ الذَّنْبِ كَمَنْ لَا ذَنْبَ لَهُ', en:"The one who repents from sin is like one who has no sin.", bn:"যে গুনাহ থেকে তওবা করে সে যেন গুনাহ করেইনি।", grade:"Hasan", ref:"Ibn Majah 4250", narrator:"Ibn Masud (RA)", topic:"Repentance"},
  // Gratitude
  {ar:'لَا يَشْكُرُ اللَّهَ مَنْ لَا يَشْكُرُ النَّاسَ', en:"Whoever does not thank people has not thanked Allah.", bn:"যে মানুষের প্রতি কৃতজ্ঞ নয়, সে আল্লাহর প্রতিও কৃতজ্ঞ নয়।", grade:"Sahih", ref:"Abu Dawud 4811", narrator:"Abu Hurayrah (RA)", topic:"Gratitude"},
  {ar:'انْظُرُوا إِلَى مَنْ هُوَ أَسْفَلَ مِنْكُمْ وَلَا تَنْظُرُوا إِلَى مَنْ هُوَ فَوْقَكُمْ', en:"Look at those below you and do not look at those above you — this is better so you do not underestimate the favours of Allah upon you.", bn:"তোমাদের চেয়ে নিচে যারা আছে তাদের দিকে তাকাও, উপরে যারা আছে তাদের দিকে নয় — এটাই তোমাদের জন্য উচিত যাতে আল্লাহর নেয়ামতকে তুচ্ছ না করো।", grade:"Sahih", ref:"Bukhari 6490, Muslim 2963", narrator:"Abu Hurayrah (RA)", topic:"Gratitude"},
  // Worship & Consistency
  {ar:'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ', en:"The most beloved deeds to Allah are those done consistently, even if they are small.", bn:"আল্লাহর কাছে সবচেয়ে প্রিয় আমল হলো যা নিয়মিত করা হয়, যদিও তা পরিমাণে কম হয়।", grade:"Sahih", ref:"Bukhari 6464", narrator:"Aisha (RA)", topic:"Worship"},
  {ar:'أَفْضَلُ الصَّلَاةِ بَعْدَ الْفَرِيضَةِ صَلَاةُ اللَّيْلِ', en:"The best prayer after the obligatory prayers is the night prayer.", bn:"ফরজ নামাজের পরে সর্বোত্তম নামাজ হলো রাতের নামাজ (তাহাজ্জুদ)।", grade:"Sahih", ref:"Muslim 1163", narrator:"Abu Hurayrah (RA)", topic:"Worship"},
  {ar:'الطَّهُورُ شَطْرُ الْإِيمَانِ', en:"Cleanliness is half of faith.", bn:"পবিত্রতা ঈমানের অর্ধেক।", grade:"Sahih", ref:"Muslim 223", narrator:"Abu Malik al-Ashari (RA)", topic:"Purification"},
  // Tawakkul
  {ar:'اعْقِلْهَا وَتَوَكَّلْ', en:"Tie your camel, then put your trust in Allah.", bn:"উটটি বাঁধো, তারপর আল্লাহর উপর ভরসা করো।", grade:"Hasan", ref:"Tirmidhi 2517", narrator:"Anas ibn Malik (RA)", topic:"Tawakkul"},
  {ar:'لَوْ أَنَّكُمْ تَوَكَّلْتُمْ عَلَى اللَّهِ حَقَّ تَوَكُّلِهِ لَرَزَقَكُمْ كَمَا يَرْزُقُ الطَّيْرَ', en:"If you were to rely on Allah as He should be relied upon, He would provide for you as He provides for the birds.", bn:"তোমরা যদি আল্লাহর উপর যথাযথভাবে ভরসা করতে, তাহলে তিনি তোমাদের পাখিদের মতো রিজিক দিতেন।", grade:"Sahih", ref:"Tirmidhi 2344", narrator:"Umar ibn al-Khattab (RA)", topic:"Tawakkul"},
  // Dunya & Hereafter
  {ar:'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ', en:"The world is a prison for the believer and a paradise for the disbeliever.", bn:"দুনিয়া মুমিনের জন্য কারাগার এবং কাফিরের জন্য জান্নাত।", grade:"Sahih", ref:"Muslim 2956", narrator:"Abu Hurayrah (RA)", topic:"Dunya"},
  {ar:'كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ', en:"Be in this world as if you were a stranger or a traveller passing through.", bn:"দুনিয়ায় এমনভাবে থাকো যেন তুমি একজন পরদেশী অথবা পথচারী।", grade:"Sahih", ref:"Bukhari 6416", narrator:"Ibn Umar (RA)", topic:"Dunya"},
  {ar:'مَا لِي وَلِلدُّنْيَا مَا أَنَا فِي الدُّنْيَا إِلَّا كَرَاكِبٍ اسْتَظَلَّ تَحْتَ شَجَرَةٍ', en:"What is this world to me? I am in it only like a rider who rests briefly in the shade of a tree, then moves on.", bn:"দুনিয়ার সাথে আমার কী সম্পর্ক? আমি দুনিয়ায় একজন আরোহীর মতো যে একটি গাছের ছায়ায় বিশ্রাম নেয় তারপর চলে যায়।", grade:"Sahih", ref:"Tirmidhi 2377", narrator:"Ibn Masud (RA)", topic:"Dunya"},
  // Dhikr
  {ar:'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', en:"Verily, in the remembrance of Allah do hearts find rest.", bn:"জেনে রাখো, আল্লাহর স্মরণ দ্বারাই অন্তর প্রশান্ত হয়।", grade:"Sahih", ref:"Quran 13:28", narrator:"General", topic:"Dhikr"},
  {ar:'أَفْضَلُ الذِّكْرِ لَا إِلَهَ إِلَّا اللَّهُ', en:"The best remembrance is: There is no god but Allah.", bn:"সর্বোত্তম জিকির হলো: লা ইলাহা ইল্লাল্লাহ।", grade:"Sahih", ref:"Tirmidhi 3383, Ibn Majah 3800", narrator:"Jabir ibn Abdullah (RA)", topic:"Dhikr"},
  {ar:'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ ثَقِيلَتَانِ فِي الْمِيزَانِ', en:"Two words light on the tongue but heavy on the scales: SubhanAllahi wa bihamdihi, SubhanAllahil Azeem.", bn:"দুটি কালিমা যা জিহ্বায় হালকা কিন্তু মিজানে ভারী: সুবহানাল্লাহি ওয়া বিহামদিহি, সুবহানাল্লাহিল আজিম।", grade:"Sahih", ref:"Bukhari 6682, Muslim 2694", narrator:"Abu Hurayrah (RA)", topic:"Dhikr"},
  // Justice
  {ar:'اتَّقِ دَعْوَةَ الْمَظْلُومِ فَإِنَّهُ لَيْسَ بَيْنَهَا وَبَيْنَ اللَّهِ حِجَابٌ', en:"Beware of the supplication of the oppressed, for there is no barrier between it and Allah.", bn:"মজলুমের বদদোয়া থেকে ভয় করো, কারণ তার ও আল্লাহর মধ্যে কোনো পর্দা নেই।", grade:"Sahih", ref:"Bukhari 1496, Muslim 19", narrator:"Ibn Abbas (RA)", topic:"Justice"},
  {ar:'إِنَّ اللَّهَ يُمْلِي لِلظَّالِمِ حَتَّى إِذَا أَخَذَهُ لَمْ يُفْلِتْهُ', en:"Allah gives respite to the oppressor, but when He seizes him, He does not let him escape.", bn:"আল্লাহ জালিমকে অবকাশ দেন, কিন্তু যখন তাকে ধরেন তখন আর ছাড়েন না।", grade:"Sahih", ref:"Bukhari 4686, Muslim 2583", narrator:"Abu Musa al-Ashari (RA)", topic:"Justice"},
  // Health
  {ar:'نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ الصِّحَّةُ وَالْفَرَاغُ', en:"Two blessings that many people are deceived about: health and free time.", bn:"দুটি নেয়ামত যে বিষয়ে অধিকাংশ মানুষ ক্ষতিগ্রস্ত: সুস্বাস্থ্য এবং অবসর সময়।", grade:"Sahih", ref:"Bukhari 6412", narrator:"Ibn Abbas (RA)", topic:"Health"},
  {ar:'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ', en:"The strong believer is better and more beloved to Allah than the weak believer.", bn:"শক্তিশালী মুমিন দুর্বল মুমিনের চেয়ে উত্তম এবং আল্লাহর কাছে বেশি প্রিয়।", grade:"Sahih", ref:"Muslim 2664", narrator:"Abu Hurayrah (RA)", topic:"Health"},
  // Ease in Religion
  {ar:'يَسِّرُوا وَلَا تُعَسِّرُوا وَبَشِّرُوا وَلَا تُنَفِّرُوا', en:"Make things easy, do not make them difficult; give glad tidings and do not drive people away.", bn:"সহজ করো, কঠিন করো না; সুসংবাদ দাও, বিরক্ত করো না।", grade:"Sahih", ref:"Bukhari 69", narrator:"Ibn Abbas (RA)", topic:"Ease in Religion"},
];

// ── Memorization duas ─────────────────────────
const MEMO_DUAS = [
  {title:'Dua for Good in Both Worlds',ar:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',rom:"Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina azaban-nar",trans:'Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.',ref:'Quran 2:201'},
  {title:'Dua of Musa (AS) for Ease',ar:'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي',rom:"Rabbi shrah li sadri wa yassir li amri wahlul 'uqdatan min lisani",trans:'My Lord, expand for me my breast and ease for me my task, and untie the knot in my tongue.',ref:'Quran 20:25-28'},
  {title:"Dua of Yunus (AS)",ar:'لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',rom:"La ilaha illa Anta subhanaka inni kuntu minaz-zalimin",trans:'There is no god but You, glory be to You, indeed I was of the wrongdoers.',ref:'Quran 21:87'},
  {title:'Dua for Steadfastness',ar:'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً',rom:"Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah",trans:'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy.',ref:'Quran 3:8'},
  {title:'Dua for Help & Provision',ar:'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',rom:"Rabbi inni lima anzalta ilayya min khayrin faqir",trans:'My Lord, indeed I am in need of whatever good You would send down to me.',ref:'Quran 28:24'},
  {title:'Dua for Forgiveness',ar:'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',rom:"Rabbana zalamna anfusana wa il-lam taghfir lana wa tarhamna lanakunanna minal-khasirin",trans:'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.',ref:'Quran 7:23'},
  {title:'Dua for Knowledge',ar:'رَّبِّ زِدْنِي عِلْمًا',rom:"Rabbi zidni 'ilma",trans:'My Lord, increase me in knowledge.',ref:'Quran 20:114'},
  {title:'Dua of Ibrahim (AS)',ar:'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',rom:"Rabbi-j'alni muqimas-salati wa min dhurriyyati Rabbana wa taqabbal du'a",trans:'My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication.',ref:'Quran 14:40'},
  {title:'HasbunAllah',ar:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',rom:"Hasbunallahu wa ni'mal-wakeel",trans:'Allah is sufficient for us, and He is the best Disposer of affairs.',ref:'Quran 3:173'},
  {title:'Dua for Mercy',ar:'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',rom:"Rabbi-rhamhuma kama rabbayani saghira",trans:'My Lord, have mercy upon them as they brought me up when I was small.',ref:'Quran 17:24'},
];

// ── Quiz questions ────────────────────────────
const QUIZ_QUESTIONS = [
  {q:"How many verses does Surah Al-Baqarah have?",opts:["200","286","195","300"],ans:1,exp:"Al-Baqarah is the longest surah in the Quran with 286 verses.",topic:"Quran"},
  {q:"What is the first word revealed of the Quran?",opts:["Bismillah","Iqra","Alhamdulillah","Qul"],ans:1,exp:"The first revelation was 'Iqra' (Read/Recite) – Surah Al-Alaq 96:1.",topic:"Quran"},
  {q:"How many pillars does Islam have?",opts:["3","4","5","6"],ans:2,exp:"The Five Pillars: Shahada, Salah, Zakat, Sawm, Hajj.",topic:"Aqeedah"},
  {q:"In which year did the Hijra take place?",opts:["610 CE","622 CE","630 CE","615 CE"],ans:1,exp:"The Prophet ﷺ migrated to Madinah in 622 CE, marking the start of the Islamic calendar.",topic:"History"},
  {q:"What is the longest Surah in the Quran?",opts:["Al-Imran","Al-Fatiha","Al-Baqarah","An-Nisa"],ans:2,exp:"Al-Baqarah has 286 verses, making it the longest surah.",topic:"Quran"},
  {q:"Which prophet is called Khalilullah (Friend of Allah)?",opts:["Musa AS","Isa AS","Ibrahim AS","Nuh AS"],ans:2,exp:"Ibrahim (AS) is called Khalilullah – the intimate friend of Allah (Quran 4:125).",topic:"Prophets"},
  {q:"How many Fard Rakat does Fajr prayer have?",opts:["2","3","4","6"],ans:0,exp:"Fajr has 2 Fard rakats (+ 2 Sunnah before it).",topic:"Salah"},
  {q:"What does 'Zakat' literally mean?",opts:["Prayer","Purification & Growth","Fasting","Pilgrimage"],ans:1,exp:"Zakat means purification and growth – it purifies one's remaining wealth.",topic:"Zakat"},
  {q:"Which night is Laylat al-Qadr?",opts:["15th Sha'ban","1st Ramadan","One of the last 10 odd nights of Ramadan","27th Rajab"],ans:2,exp:"Laylat al-Qadr is sought in the last 10 odd nights of Ramadan (21, 23, 25, 27, 29).",topic:"Ramadan"},
  {q:"What is the Nisab for Zakat on gold?",opts:["20g","87.48g","100g","50g"],ans:1,exp:"The Nisab for gold is 87.48 grams (equivalent to 7.5 tola).",topic:"Zakat"},
  {q:"How many Surahs are in the Quran?",opts:["113","114","115","112"],ans:1,exp:"The Quran contains exactly 114 Surahs.",topic:"Quran"},
  {q:"What is the Arabic word for fasting?",opts:["Salah","Zakat","Sawm","Hajj"],ans:2,exp:"Sawm (صوم) is the Arabic word for fasting, one of the Five Pillars of Islam.",topic:"Worship"},
  {q:"Where was Prophet Muhammad ﷺ born?",opts:["Madinah","Jerusalem","Makkah","Ta'if"],ans:2,exp:"The Prophet ﷺ was born in Makkah in approximately 570 CE, the Year of the Elephant.",topic:"History"},
  {q:"Which Surah is known as the 'Heart of the Quran'?",opts:["Al-Fatiha","Al-Baqarah","Ya-Sin","Al-Mulk"],ans:2,exp:"Ya-Sin is called the heart of the Quran (Tirmidhi 2887).",topic:"Quran"},
  {q:"How many times is Salah (prayer) obligatory per day?",opts:["3","4","5","7"],ans:2,exp:"Muslims are required to pray 5 times a day: Fajr, Dhuhr, Asr, Maghrib, Isha.",topic:"Salah"},
  {q:"Who was the first Caliph after Prophet Muhammad ﷺ?",opts:["Umar ibn al-Khattab","Ali ibn Abi Talib","Uthman ibn Affan","Abu Bakr as-Siddiq"],ans:3,exp:"Abu Bakr as-Siddiq (RA) was elected as the first Caliph after the Prophet's ﷺ passing.",topic:"History"},
  {q:"What is the meaning of 'Islam'?",opts:["Peace","Submission to Allah","Worship","Guidance"],ans:1,exp:"Islam means 'submission (to Allah)' and derives from the root word 'Salam' (peace).",topic:"Aqeedah"},
  {q:"Which Surah has no Bismillah at the beginning?",opts:["Al-Fatiha","At-Tawbah","Al-Baqarah","Al-Anfal"],ans:1,exp:"Surah At-Tawbah (Chapter 9) does not begin with Bismillah, as it begins with a declaration.",topic:"Quran"},
  {q:"What is the minimum amount of Zakat on gold/silver?",opts:["2%","2.5%","5%","10%"],ans:1,exp:"The Zakat rate is 2.5% on gold, silver, cash, and business assets above the Nisab.",topic:"Zakat"},
  {q:"Which prophet built the Kaaba with his son?",opts:["Nuh AS","Ibrahim AS & Ismail AS","Musa AS","Sulayman AS"],ans:1,exp:"Ibrahim (AS) and his son Ismail (AS) built the Kaaba as the House of Allah (Quran 2:127).",topic:"History"},
];

// ── Render sidebar html ────────────────────────
function renderSidebar(activePage){
  const lang = getUILang();
  const navLinks = [
    {group: t('home'),       links:[{href:'index.html',  icon:'🕌', label:t('dashboard')}]},
    {group: t('prayerGroup'),links:[{href:'prayer.html', icon:'🕐', label:t('prayer')},{href:'qibla.html',icon:'🧭',label:t('qibla')}]},
    {group: t('quranGroup'), links:[{href:'quran.html',  icon:'📖', label:t('quran')},{href:'memorize.html',icon:'🧠',label:t('memorize')}]},
    {group: t('worshipGroup'),links:[{href:'dhikr.html', icon:'📿', label:t('dhikr')},{href:'adhkar.html',icon:'🌙',label:t('adhkar')},{href:'journal.html',icon:'📓',label:t('journal')}]},
    {group: t('knowledgeGroup'),links:[{href:'hadith.html',icon:'📜',label:t('hadith')},{href:'quiz.html',icon:'🎓',label:t('quiz')}]},
    {group: t('financeGroup'),links:[{href:'zakat.html', icon:'💰', label:t('zakat')}]},
  ];
  return `
  <aside class="sidebar" id="main-sidebar">
    <div class="sidebar-logo">
      <div class="logo-arabic">نُور</div>
      <div class="logo-en">NurApp</div>
      <div class="logo-tagline">${t('tagline')}</div>
    </div>

    <!-- Language switcher -->
    <div style="padding:10px 14px;border-bottom:1px solid rgba(201,168,76,.08)">
      <div style="font-size:.6rem;letter-spacing:2px;color:rgba(138,122,90,.5);text-transform:uppercase;margin-bottom:6px">${t('langLabel')}</div>
      <div style="display:flex;gap:6px">
        <button onclick="setUILang('en')" style="flex:1;padding:6px 4px;border-radius:7px;border:1px solid ${lang==='en'?'rgba(201,168,76,.5)':'rgba(201,168,76,.18)'};background:${lang==='en'?'rgba(201,168,76,.18)':'rgba(255,255,255,.04)'};color:${lang==='en'?'var(--gold)':'var(--text-muted)'};cursor:pointer;font-size:.75rem;font-family:'Lato',sans-serif;font-weight:${lang==='en'?'700':'400'}">🇬🇧 English</button>
        <button onclick="setUILang('bn')" style="flex:1;padding:6px 4px;border-radius:7px;border:1px solid ${lang==='bn'?'rgba(201,168,76,.5)':'rgba(201,168,76,.18)'};background:${lang==='bn'?'rgba(201,168,76,.18)':'rgba(255,255,255,.04)'};color:${lang==='bn'?'var(--gold)':'var(--text-muted)'};cursor:pointer;font-size:.75rem;font-family:'Lato',sans-serif;font-weight:${lang==='bn'?'700':'400'}">🇧🇩 বাংলা</button>
      </div>
    </div>

    ${navLinks.map(g=>`
      <div class="nav-group">
        <div class="nav-group-label">${g.group}</div>
        ${g.links.map(l=>`
          <a href="${l.href}" class="nav-link ${l.href===activePage?'active':''}" onclick="if(window.innerWidth<=640)closeSidebar()">
            <span class="nav-icon">${l.icon}</span>${l.label}
          </a>
        `).join('')}
      </div>
    `).join('')}
    <div class="sidebar-footer">
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ<br/>
      In the name of Allah, the Most Gracious
    </div>
  </aside>
  <div id="toast"></div>

`;
}

// ── Sidebar toggle (defined at top level so onclick= can find them) ───────

// Inject hamburger + overlay at <body> level (outside .layout stacking context)
// so position:fixed works correctly while scrolling on all devices
function injectMobileUI(){
  if(!document.getElementById('menu-toggle')){
    const btn = document.createElement('button');
    btn.id = 'menu-toggle';
    btn.setAttribute('aria-label','Menu');
    btn.textContent = '☰';
    btn.addEventListener('click', toggleSidebar);
    document.body.appendChild(btn);
  }
  if(!document.getElementById('sidebar-overlay')){
    const ov = document.createElement('div');
    ov.id = 'sidebar-overlay';
    ov.addEventListener('click', toggleSidebar);
    document.body.appendChild(ov);
  }
}
// Auto-inject after any page loads shared.js
document.addEventListener('DOMContentLoaded', injectMobileUI);
// Also call immediately in case DOM is already ready
if(document.readyState !== 'loading') injectMobileUI();

function toggleSidebar(){
  injectMobileUI(); // ensure elements exist
  const s=document.getElementById('main-sidebar');
  const o=document.getElementById('sidebar-overlay');
  if(!s||!o) return;
  const open = s.classList.toggle('open');
  if(open) o.classList.add('show'); else o.classList.remove('show');
}
function closeSidebar(){
  const s=document.getElementById('main-sidebar');
  const o=document.getElementById('sidebar-overlay');
  if(s) s.classList.remove('open');
  if(o) o.classList.remove('show');
}
document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeSidebar(); });
