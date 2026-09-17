/* ============================================================
   KATHĀ — content data for young minds
   ============================================================ */
window.KATHA_DATA = (function () {

  const themes = [
    { id: "fables",    name: "Tales & Fables",      deva: "नीति",   translit: "Neeti",    color: "var(--marigold)", icon: "fox",    blurb: "Clever animals, big lessons.", count: 6 },
    { id: "heroes",    name: "Gods & Heroes",       deva: "वीर",    translit: "Veera",    color: "var(--blue)",     icon: "bow",    blurb: "Brave hearts and wondrous deeds.", count: 6 },
    { id: "sciences",  name: "Wonder Sciences",     deva: "विज्ञान", translit: "Vignana",  color: "var(--teal)",     icon: "atom",   blurb: "Numbers, stars, breath & body.", count: 11 },
    { id: "festivals", name: "Festivals & Why",     deva: "उत्सव",  translit: "Utsava",   color: "var(--pink)",     icon: "diya",   blurb: "Why we light, sing and celebrate.", count: 4 },
    { id: "values",    name: "Good Values",         deva: "धर्म",    translit: "Dharma",   color: "var(--green)",    icon: "heart",  blurb: "Truth, kindness and courage.", count: 5 },
    { id: "nature",    name: "Nature & Sacred Earth", deva: "प्रकृति", translit: "Prakriti", color: "var(--purple)",  icon: "leaf",   blurb: "Trees, rivers and gentle creatures.", count: 4 },
  ];

  const stories = [
    { id: "lion-rabbit", title: "The Lion and the Clever Rabbit", theme: "fables", age: "5–8", mins: 6, color: "var(--marigold)", scene: "forest",
      word: { deva: "बुद्धि", iast: "buddhi", en: "wisdom" }, moral: "A sharp mind can outdo great strength.",
      blurb: "A tiny rabbit must face a fierce lion — with nothing but a clever idea.", featured: true },
    { id: "krishna-butter", title: "Little Krishna and the Butter", theme: "heroes", age: "4–7", mins: 5, color: "var(--blue)", scene: "village",
      word: { deva: "आनन्द", iast: "ānanda", en: "joy" }, moral: "Joy shared is joy doubled.",
      blurb: "Naughty baby Krishna and his friends go on a buttery adventure.", featured: true },
    { id: "counting-stars", title: "The Boy Who Counted the Stars", theme: "sciences", sub: "astronomy", age: "7–11", mins: 8, color: "var(--teal)", scene: "night",
      word: { deva: "गणित", iast: "gaṇita", en: "mathematics" }, moral: "Curiosity turns the sky into a teacher.",
      blurb: "Young Aryabhata wonders how far the stars are — and begins to measure the heavens.", featured: true },
    { id: "magic-zero", title: "The Magic of Zero", theme: "sciences", sub: "astronomy", age: "7–11", mins: 7, color: "var(--sky)", scene: "scroll",
      word: { deva: "शून्य", iast: "śūnya", en: "zero / void" }, moral: "Sometimes 'nothing' is the biggest idea of all.",
      blurb: "How a little circle that means 'nothing' changed counting forever.", featured: false },
    { id: "hanuman-sun", title: "Hanuman Leaps for the Sun", theme: "heroes", age: "5–9", mins: 6, color: "var(--coral)", scene: "sky",
      word: { deva: "साहस", iast: "sāhasa", en: "courage" }, moral: "A brave heart can reach surprising heights.",
      blurb: "Baby Hanuman mistakes the sun for a juicy mango and leaps into the sky!", featured: true },
    { id: "dhruva-star", title: "Dhruva and the Pole Star", theme: "values", age: "6–10", mins: 7, color: "var(--green)", scene: "night",
      word: { deva: "स्थिरता", iast: "sthiratā", en: "steadiness" }, moral: "Stay steady, and you become someone others can follow.",
      blurb: "A determined little prince becomes the unmoving star the whole sky turns around.", featured: false },
    { id: "monkey-croc", title: "The Monkey and the Crocodile", theme: "fables", age: "5–8", mins: 6, color: "var(--marigold)", scene: "river",
      word: { deva: "चातुर्य", iast: "cāturya", en: "cleverness" }, moral: "Think calmly, even when you are scared.",
      blurb: "A friendly monkey must use his wits to escape a hungry crocodile.", featured: false },
    { id: "why-diyas", title: "Why We Light the Diyas", theme: "festivals", age: "4–8", mins: 5, color: "var(--pink)", scene: "village",
      word: { deva: "दीप", iast: "dīpa", en: "lamp / light" }, moral: "A small light can chase away a lot of darkness.",
      blurb: "The story behind Diwali — and why every little lamp matters.", featured: true },
    { id: "nachiketa", title: "Nachiketa's Big Questions", theme: "values", age: "8–12", mins: 9, color: "var(--purple)", scene: "scroll",
      word: { deva: "सत्य", iast: "satya", en: "truth" }, moral: "Brave questions lead to the best answers.",
      blurb: "A fearless boy asks the biggest question of all — and won't take a shortcut.", featured: false },
    { id: "breath-calm", title: "The Breath That Calms the Storm", theme: "sciences", sub: "yoga", age: "5–9", mins: 5, color: "var(--teal)", scene: "sky",
      word: { deva: "प्राण", iast: "prāṇa", en: "life-breath" }, moral: "When the mind is stormy, the breath is an anchor.",
      blurb: "A simple breathing trick from the yogis to feel calm and strong.", featured: false },
    { id: "moon-hide", title: "Why the Moon Plays Hide-and-Seek", theme: "sciences", sub: "astronomy", age: "6–10", mins: 6, color: "var(--sky)", scene: "night",
      word: { deva: "ग्रहण", iast: "grahaṇa", en: "eclipse" }, moral: "The world is full of patterns waiting to be noticed.",
      blurb: "What is an eclipse? A gentle, ancient answer to a sky that suddenly goes dark.", featured: false },
    { id: "twelve-signs", title: "The Twelve Signs of the Sky", theme: "sciences", sub: "astrology", age: "7–11", mins: 7, color: "var(--teal)", scene: "night",
      word: { deva: "राशि", iast: "rāśi", en: "zodiac sign" }, moral: "For thousands of years the sky has been a calendar and a storybook.",
      blurb: "Meet the twelve rāśis the ancients traced among the stars.", featured: false },
    { id: "star-calendar", title: "Grandfather's Star Calendar", theme: "sciences", sub: "astrology", age: "7–11", mins: 7, color: "var(--sky)", scene: "scroll",
      word: { deva: "नक्षत्र", iast: "nakṣatra", en: "lunar mansion" }, moral: "Look closely, and the moon will tell you the time of year.",
      blurb: "How a grandfather reads the moon's twenty-seven homes to know the seasons.", featured: false },
    { id: "healing-garden", title: "The Garden That Heals", theme: "sciences", sub: "ayurveda", age: "5–9", mins: 6, color: "var(--teal)", scene: "forest",
      word: { deva: "औषधि", iast: "auṣadhi", en: "healing herb" }, moral: "Nature keeps a gentle remedy for almost everything.",
      blurb: "Tulsi, neem and a whole garden of little green helpers.", featured: false },
    { id: "golden-milk", title: "The Secret of Golden Milk", theme: "sciences", sub: "ayurveda", age: "4–8", mins: 5, color: "var(--sky)", scene: "village",
      word: { deva: "हरिद्रा", iast: "haridrā", en: "turmeric" }, moral: "The oldest cures are often the simplest.",
      blurb: "Why grandmothers everywhere swear by a warm cup of turmeric milk.", featured: false },
    { id: "mountain-pose", title: "The Mountain That Stood Still", theme: "sciences", sub: "yoga", age: "4–8", mins: 5, color: "var(--sky)", scene: "sky",
      word: { deva: "आसन", iast: "āsana", en: "posture" }, moral: "Strength can be quiet and steady, like a mountain.",
      blurb: "A fidgety child learns to stand tall and calm as a mountain.", featured: false },
    { id: "sushruta", title: "Sushruta, the First Surgeon", theme: "sciences", sub: "autobiographies", age: "8–12", mins: 8, color: "var(--teal)", scene: "scroll",
      word: { deva: "वैद्य", iast: "vaidya", en: "healer" }, moral: "Careful hands and a curious mind can ease the world's pain.",
      blurb: "Meet the ancient teacher who wrote one of the first books on surgery.", featured: false },
    { id: "charaka", title: "Charaka and the Book of Life", theme: "sciences", sub: "autobiographies", age: "8–12", mins: 8, color: "var(--sky)", scene: "scroll",
      word: { deva: "आयुस्", iast: "āyus", en: "life" }, moral: "To heal a person, first listen to their whole life.",
      blurb: "The wandering physician who taught that food, sleep and balance are medicine.", featured: false },
    { id: "banyan-arms", title: "The Banyan's Thousand Arms", theme: "nature", age: "5–9", mins: 6, color: "var(--purple)", scene: "forest",
      word: { deva: "वृक्ष", iast: "vṛkṣa", en: "tree" }, moral: "The one who gives shade to all is never alone.",
      blurb: "Why the banyan is loved, and how one tree can shelter a whole village.", featured: false },
    { id: "savitri", title: "Savitri's Clever Heart", theme: "values", age: "8–12", mins: 9, color: "var(--coral)", scene: "forest",
      word: { deva: "निष्ठा", iast: "niṣṭhā", en: "devotion" }, moral: "Love and cleverness together can move mountains.",
      blurb: "A wise princess outwits even the lord of endings to save the one she loves.", featured: false },
  ];

  /* Featured storybook for the reader — fully paged */
  const storybook = {
    id: "lion-rabbit",
    title: "The Lion and the Clever Rabbit",
    theme: "fables",
    color: "var(--marigold)",
    scene: "forest",
    age: "5–8", mins: 6,
    word: { deva: "बुद्धि", iast: "buddhi", en: "wisdom" },
    moral: "A sharp mind can do what great strength cannot.",
    pages: [
      { art: "forest",  heading: "A Hungry Lion", text: "Deep in a green forest lived Bhasuraka, a lion so fierce that every animal trembled when he roared. Each day he hunted far too many creatures — far more than he could ever eat." },
      { art: "council", heading: "A Clever Plan", text: "The worried animals gathered together. \u201cLet us make a deal,\u201d they said to the lion. \u201cEach day, one of us will come to you. But please stop chasing us all!\u201d The lion, feeling lazy, agreed." },
      { art: "rabbit",  heading: "The Little Rabbit's Turn", text: "One by one the animals went. At last it was the turn of a small, quick-thinking rabbit. \u201cI am tiny,\u201d he thought, \u201cbut I have my wits.\u201d So he walked very, very slowly toward the lion's den." },
      { art: "angry",   heading: "A Roar of Anger", text: "By the time he arrived, the sun was high and the lion was furious with hunger. \u201cWhy are you so late, and so small?\u201d he growled. The rabbit bowed politely and began his clever tale." },
      { art: "well",    heading: "\u201cAnother Lion!\u201d", text: "\u201cForgive me, O King. Four of us set out, but another lion stopped us. He says HE is the true king of this forest!\u201d The lion's eyes blazed. \u201cTake me to this impostor at once!\u201d" },
      { art: "reflect", heading: "The Lion in the Well", text: "The rabbit led him to an old stone well and pointed inside. The lion peered down — and saw a fierce lion glaring back! It was only his own reflection, but he did not know that." },
      { art: "splash",  heading: "A Brave, Foolish Leap", text: "Roaring with rage, the lion leaped down to fight the other king… and landed with a great SPLASH! The clever little rabbit had saved the whole forest with nothing but a good idea." },
    ],
    end: {
      heading: "What we learned",
      text: "The smallest creature became the bravest hero — not with claws or teeth, but with a calm and clever mind.",
    },
  };

  /* sub-shelves within a genre (currently Wonder Sciences) */
  const subgenres = {
    sciences: [
      { id: "autobiographies", name: "Autobiographies", deva: "जीवनी" },
      { id: "ayurveda",        name: "Ayurveda",        deva: "आयुर्वेद" },
      { id: "yoga",            name: "Yoga",            deva: "योग" },
      { id: "astrology",       name: "Astrology",       deva: "ज्योतिष" },
      { id: "astronomy",       name: "Astronomy",       deva: "खगोल" },
    ],
  };

  /* festival calendar — kid-friendly, ties into the Festivals stories */
  const festivals = [
    { id: "raksha",      name: "Raksha Bandhan", deva: "रक्षाबन्धन", when: "August",   color: "var(--coral)",   icon: "heart",   emoji: "🧵", why: "Sisters and brothers tie a thread of love and promise to look after each other." },
    { id: "janmashtami", name: "Krishna's Birthday", deva: "जन्माष्टमी", when: "August", color: "var(--blue)", icon: "star", emoji: "🪈", why: "We celebrate the night baby Krishna was born — with songs, swings and sweet butter!", story: "krishna-butter" },
    { id: "navaratri",   name: "Navaratri",      deva: "नवरात्रि",   when: "October",  color: "var(--pink)",    icon: "star",    emoji: "💃", why: "Nine nights of dancing and dressing up to honour the brave Goddess." },
    { id: "diwali",      name: "Diwali",         deva: "दीपावली",     when: "November", color: "var(--marigold)", icon: "diya",   emoji: "🪔", why: "We light little lamps to welcome Rama home — and let light win over dark.", story: "why-diyas" },
    { id: "pongal",      name: "Pongal / Makar Sankranti", deva: "मकर संक्रान्ति", when: "January", color: "var(--green)", icon: "leaf", emoji: "🌾", why: "A thank-you to the sun and the harvest — with kites and sweet rice!" },
    { id: "holi",        name: "Holi",           deva: "होली",        when: "March",    color: "var(--purple)",  icon: "sparkle", emoji: "🎨", why: "The festival of colours — we splash bright powders and forgive and play." },
    { id: "ramnavami",   name: "Rama Navami",    deva: "रामनवमी",    when: "April",    color: "var(--teal)",    icon: "bow",     emoji: "🏹", why: "The birthday of brave, kind Prince Rama, hero of the Ramayana." },
    { id: "guru",        name: "Guru Purnima",   deva: "गुरु पूर्णिमा", when: "July",   color: "var(--sky)",     icon: "book",    emoji: "📿", why: "A big thank-you day for teachers — the people who help us learn." },
  ];

  return { themes, stories, storybook, subgenres, festivals };
})();
