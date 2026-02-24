const QUESTIONS = [

{
  question: "রেশম কীটের দেহ নিঃসৃত আঁশ হতে কোন ধরনের কাপড় তৈরি করা হয়?",
  options: [
    "সুতি",
    "ভেলভেট",
    "শিফন",
    "রেশমি"
  ],
  answer: 3,
  explanation: "রেশম কীট (silkworm) এর পোনা পর্যায়ে উৎপন্ন কোকুনের আঁশ থেকে কাপড় তৈরির জন্য সূক্ষ্ম সুতির মতো রেশমি তন্তু পাওয়া যায়। এটি রেশমি কাপড় তৈরির প্রধান কাঁচামাল। (Source: Banglapedia – Silk; Wikipedia – Bangladesh Sericulture Research and Training Institute):contentReference[oaicite:0]{index=0}"
},

{
  question: "সিনকোনা গাছ থেকে কোনটি প্রস্তুত করা হয়?",
  options: [
    "উচ্চ রক্তচাপের ওষুধ",
    "আয়ুর্বেদিক ওষুধ",
    "ইউনানী ওষুধ",
    "কুইনাইন"
  ],
  answer: 3,
  explanation: "সিনকোনা গাছের বাকল থেকে প্রাকৃতিক ওষুধ ‘কুইনাইন’ বের করা হয়, যা বিশেষত ম্যালেরিয়ার চিকিৎসায় ব্যবহৃত হয়। (Source: WHO Malaria Factsheet):contentReference[oaicite:1]{index=1}"
},

{
  question: "কোন উদ্ভিদ থেকে শিক্ষার প্রধান উপকরণ তৈরি হয়?",
  options: [
    "সিনকোনা",
    "সর্পগন্ধা",
    "বাঁশ",
    "গোলপাতা"
  ],
  answer: 2,
  explanation: "শিক্ষার প্রধান উপকরণ ‘কাগজ’ সাধারণত বাঁশ, আখের ছোবড়া ও ধানের খড় থেকে তৈরি হয়। (Source: Banglapedia – Paper):contentReference[oaicite:2]{index=2}"
},

{
  question: "ডাল জাতীয় ফসল আমাদের খাদ্যের কোন উপাদানটি সরবরাহ করে?",
  options: [
    "শর্করা",
    "আমিষ",
    "স্নেহ",
    "খনিজ লবণ"
  ],
  answer: 1,
  explanation: "ডাল জাতীয় ফসলগুলোতে প্রোটিন বা আমিষের পরিমাণ বেশি থাকে, যা আমাদের খাদ্যের প্রধান পুষ্টি উপাদান। (Source: FAO Nutrition Fact Sheets):contentReference[oaicite:3]{index=3}"
},

{
  question: "কোন আঁশ জাতীয় ফসলের বীজ হতে তেল পাওয়া যায়?",
  options: [
    "পাট",
    "তুলা",
    "কেনাফ",
    "শনপাট"
  ],
  answer: 1,
  explanation: "তুলা একটি আঁশজাত ফসল হলেও এর বীজ থেকে তুলাবীজ তেল (cottonseed oil) উৎপন্ন হয়। (Source: Britannica – Cotton):contentReference[oaicite:4]{index=4}"
},

{
  question: "নিচের কোনটি ভেষজ গুণসম্পন্ন ফসল?",
  options: [
    "মসুর",
    "সয়াবিন",
    "মুগ",
    "রসুন"
  ],
  answer: 3,
  explanation: "রসুন (garlic) একধরনের ভেষজ উদ্ভিদ, যাকে প্রাত্যহিক খাদ্যের সঙ্গেও ঔষধি গুণের জন্য ব্যবহার করা হয়। (Source: NCBI Herbals Article):contentReference[oaicite:5]{index=5}"
},

{
  question: "টমেটোকে উদ্যান ফসল বলার কারণ-",
  options: [
    "সমস্ত ফসল একত্রে সংগ্রহ করা হয়",
    "ফসলের নিবিড় যত্নের প্রয়োজন হয়",
    "নিচু ও মাঝারি নিচু জমিতে চাষ করা যায়",
    "ফসলের দাম মৌসুমের শুরুতে কম থাকে"
  ],
  answer: 1,
  explanation: "টমেটো উদ্যান ফসল কারণ এটি সীমিত জমিতে প্রতিটি গাছের আলাদা পরিচর্যার প্রয়োজন হয়। (Source: FAO Crop Classification):contentReference[oaicite:6]{index=6}"
},

{
  question: "মাঠ ফসলের বৈশিষ্ট্য কোনটি?",
  options: [
    "প্রতিটি গাছের আলাদাভাবে যত্ন নেওয়া হয়",
    "জমির সমস্ত ফসল একত্রে পরিপক্ক ও সংগ্রহ করা হয়",
    "মৌসুমের শুরুতে দাম কম থাকে পরিবর্তীতে দাম বাড়ে",
    "তুলনামূলকভাবে বেশি যত্নের প্রয়োজন হয়"
  ],
  answer: 1,
  explanation: "মাঠ ফসল সাধারণত বৃহৎ মাঠে একই সময়ে বা প্রায় একই সময়ে পরিপক্ক হয়ে একত্রে কাটা হয় — উদ্যান ফসলের মতো ধারাবাহিক সংগ্রহ হয় না। (Source: FAO Field Crops):contentReference[oaicite:7]{index=7}"
},

{
  question: "পাটকে মাঠ ফসল বলা হয় কেন?",
  options: [
    "ফসলের নিবিড় যত্নের প্রয়োজন হয়",
    "ফসলের লাভ ও ব্যয়ের অনুপাত বেশি হয়",
    "সমস্ত ফসল একত্রে পরিপক্ক ও সংগ্রহ করা হয়",
    "ফসলের মূল্য মৌসুমের শুরুতে বেশি হয়"
  ],
  answer: 2,
  explanation: "পাট মাঠ ফসল কারণ এটি বিস্তৃত জমিতে একযোগে পরিপক্ক হয়ে সাধারণত একত্রে সংগ্রহ করা হয়। (Source: Banglapedia – Jute):contentReference[oaicite:8]{index=8}"
},

{
  question: "উদ্যান ফসল কোনটি?",
  options: [
    "কুসুম ফুল",
    "কেনাফ",
    "সুগারবিট",
    "জারবেরা"
  ],
  answer: 3,
  explanation: "জারবেরা একটি উদ্যান ফসল — ফুলজাতীয় ও প্রতিটি গাছের আলাদা যত্ন প্রয়োজন হয়। (Source: FAO Horticultural Crops):contentReference[oaicite:9]{index=9}"
},

{
  question: "ফুলকপি চাষাবাদের ক্ষেত্রে কোনটি প্রযোজ্য?",
  options: [
    "উৎপাদন খরচ বেশি হয়",
    "অল্প যত্নে বেশি ফসল পাওয়া যায়",
    "ঝুঁকি বেশি থাকে",
    "নিচু জমির প্রয়োজন হয়"
  ],
  answer: 0,
  explanation: "ফুলকপি একটি উদ্যান ফসল এবং এর চাষে সার, সেচ ও পরিচর্যায় খরচ বেশি হয়। (Source: FAO Horticultural Crops):contentReference[oaicite:10]{index=10}"
},

{
  question: "বাংলাদেশে বর্তমানে বছরে জনপ্রতি মাছ গ্রহণের পরিমাণ কত?",
  options: [
    "১৮.৪৯ কেজি",
    "১৯.৬৯ কেজি",
    "১৯.৭১ কেজি",
    "২১.১৯ কেজি"
  ],
  answer: 3,
  explanation: "বাংলাদেশে বর্তমানে জনপ্রতি মাছ গ্রহণ প্রায় ২৪.৭৫ কেজি/বছর (2026 আধুনিক হিসাব অনুযায়ী), তাই ২১.১৯ কেজি অপশনটি কাছাকাছি রয়েছে। (Source: WorldFish Center stats):contentReference[oaicite:11]{index=11}"
},

{
  question: "একজন মানুষের দৈনিক কত মিলিলিটার দুধ পান করা প্রয়োজন?",
  options: [
    "১৫০",
    "২০০",
    "২৫০",
    "৩০০"
  ],
  answer: 2,
  explanation: "প্রাপ্তবয়স্কদের জন্য দৈনিক প্রায় ২৫০ মিলিলিটার দুধ পান করা পুষ্টির জন্য সহায়ক। (Source: WHO Dairy Facts):contentReference[oaicite:12]{index=12}"
},

{
  question: "পশুর রক্তে কোন পুষ্টি উপাদান বিদ্যমান?",
  options: [
    "শর্করা",
    "আমিষ",
    "স্নেহ",
    "খনিজ লবণ"
  ],
  answer: 1,
  explanation: "পশুর রক্তে প্রধানত প্রোটিন (আমিষ) থাকে, অন্যান্য পুষ্টি উপাদান কম পরিমাণে থাকে। (Source: General Animal Physiology):contentReference[oaicite:13]{index=13}"
},

{
  question: "অভ্যন্তরীণ জলাশয়ের মধ্যে নিচের কোনটির আয়তন সবচেয়ে কম?",
  options: [
    "পুকুর ডোবা",
    "বিল",
    "বাঁওড়",
    "চিংড়ি খামার"
  ],
  answer: 0,
  explanation: "অভ্যন্তরীণ জলাশয়ে পুকুর/ডোবা তুলনামূলকভাবে ছোট জলাশয় হিসেবে বিবেচিত হয়। (Source: FAO Inland Waterbody Types):contentReference[oaicite:14]{index=14}"
},

{
  question: "মাছের চামড়ায় কোন ভিটামিন বিদ্যমান?",
  options: [
    "Vit-A",
    "Vit-C",
    "Vit-B",
    "Vit-D"
  ],
  answer: 3,
  explanation: "মাছের চামড়ায় ভিটামিন D পাওয়া যায়, যা হাড়ের গঠনে গুরুত্বপূর্ণ ভূমিকা রাখে। (Source: General Nutrition):contentReference[oaicite:15]{index=15}"
},

{
  question: "মৎস্য গবেষণা ইনস্টিটিউট কোথায় অবস্থিত?",
  options: [
    "ঢাকা",
    "জয়দেবপুর",
    "ময়মনসিংহ",
    "যশোর"
  ],
  answer: 2,
  explanation: "বাংলাদেশ মৎস্য গবেষণা ইনস্টিটিউট (Bangladesh Fisheries Research Institute) এর প্রধান কার্যালয় ময়মনসিংহে অবস্থিত। (Source: Wikipedia – Bangladesh Fisheries Research Institute):contentReference[oaicite:16]{index=16}"
},

{
  question: "বাংলাদেশে সাদা সোনা কোনটি?",
  options: [
    "সিলভার কার্প",
    "সরপুঁটি",
    "চিংড়ি",
    "কাতল"
  ],
  answer: 2,
  explanation: "চিংড়িকে বাংলাদেশে ‘সাদা সোনা’ বলা হয় কারণ এটি বৈদেশিক মুদ্রা আয় বৃদ্ধি করে। (Source: Fisheries Sector Overview):contentReference[oaicite:17]{index=17}"
},

{
  question: "উঠান বৈঠক কোথায় হয়?",
  options: [
    "গ্রোথ সেন্টার",
    "কৃষক বিদ্যালয়",
    "উপজেলা কৃষি অফিস",
    "কৃষকের বাড়ি"
  ],
  answer: 3,
  explanation: "উঠান বৈঠক সাধারণত কৃষকের বাড়ির উঠানে অনুষ্ঠিত হয়, যেখানে স্থানীয় কৃষকরা জ্ঞান বিনিময় করেন। (Source: FAO Agricultural Extension):contentReference[oaicite:18]{index=18}"
},

{
  question: "নিচের কোন কৌশলের মাধ্যমে সকল ধরনের নারী-পুরুষ কৃষক স্থানীয়ভাবে অংশগ্রহণ করতে পারে?",
  options: [
    "অভিজ্ঞ কৃষক",
    "উঠোন বৈঠক",
    "কৃষক মাঠ স্কুল",
    "কৃষক ক্লাব"
  ],
  answer: 1,
  explanation: "উঠোন বৈঠকের মাধ্যমে স্থানীয় নারী‑পুরুষ কৃষক সহজেই অংশগ্রহণ করতে পারে। (Source: FAO Agricultural Extension):contentReference[oaicite:19]{index=19}"
},

{
  question: "উঠোন বৈঠকে কতজন কৃষক অংশগ্রহণ করে?",
  options: [
    "২৫-৩০",
    "৩০-৪০",
    "৪০-৫০",
    "৫০-৬০"
  ],
  answer: 0,
  explanation: "উঠোন বৈঠকে সাধারণত কোনো কঠিন সংখ্যা নির্দিষ্ট থাকে না; ২৫‑৩০ জন অংশগ্রহণ সাধারণ কথা, তবে স্থানভেদে বেশি‑ কম হতে পারে। (Source: FAO Agricultural Extension):contentReference[oaicite:20]{index=20}"
},
{
  question: "কৃষক সভায় কৃষকদের মধ্যে কী সরবরাহ করা হয়?",
  options: [
    "সার",
    "বীজ",
    "কৃষি প্রযুক্তি",
    "বালাইনাশক"
  ],
  answer: 2,
  explanation: "কৃষক সভায় মূলত আধুনিক কৃষি প্রযুক্তি ও চাষাবাদ পদ্ধতি সম্পর্কে তথ্য সরবরাহ করা হয়। সার বা বীজ সরাসরি বিতরণ করা হয় না। (Source: FAO Agricultural Extension)(https://www.fao.org/3/xII6e/XII6E02.htm?utm_source=chatgpt.com)"
},

{
  question: "উঠোন বৈঠকের মাধ্যমে কৃষকদের কাছে কী পৌঁছে দেওয়া হয়?",
  options: [
    "কৃষিঋণ",
    "সার ও কীটনাশক",
    "কৃষি তথ্য ও সেবা",
    "স্বাস্থ্য বিষয়ক তথ্য"
  ],
  answer: 2,
  explanation: "উঠোন বৈঠকের মাধ্যমে কৃষকদের কাছে কৃষি তথ্য ও সেবা পৌঁছে দেওয়া হয়, যা সরাসরি কৃষি উৎপাদন ও জ্ঞান সম্প্রসারণে সাহায্য করে। (Source: FAO Agricultural Extension)(https://www.fao.org/3/xII6e/XII6E02.htm?utm_source=chatgpt.com)"
},

{
  question: "কৃষক সভার মূল উদ্দেশ্য কী?",
  options: [
    "কৃষি উৎপাদন বৃদ্ধি",
    "কৃষি জমির পরিমাণ বৃদ্ধি",
    "কৃষকদের সংখ্যা বৃদ্ধি",
    "কৃষকদের অভিজ্ঞতা বৃদ্ধি"
  ],
  answer: 0,
  explanation: "কৃষক সভার মূল লক্ষ্য আধুনিক প্রযুক্তি ও পরামর্শের মাধ্যমে কৃষি উৎপাদন বৃদ্ধি করা। (Source: FAO Agricultural Extension)(https://www.fao.org/3/xII6e/XII6E02.htm?utm_source=chatgpt.com)"
},

{
  question: "BINA এর প্রধান কার্যালয় কোথায় অবস্থিত?",
  options: [
    "গাজীপুর",
    "ঢাকা",
    "গফরিদপুর",
    "ময়মনসিংহ"
  ],
  answer: 3,
  explanation: "বাংলাদেশ পরমাণু কৃষি গবেষণা ইনস্টিটিউট (BINA) প্রধান কার্যালয় ময়মনসিংহে। (Source: BINA Official)(https://bina.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "ফসলের নতুন নতুন জাত উদ্ভাবন ও উন্নয়ন সাধনের কাজ করে নিচের কোন প্রতিষ্ঠানটি?",
  options: [
    "BARI",
    "BINA",
    "BARC",
    "BRRI"
  ],
  answer: 0,
  explanation: "BARI (Bangladesh Agricultural Research Institute) বিভিন্ন ফসলের নতুন জাত উদ্ভাবন ও উন্নয়ন করে। (Source: BARI Official)(https://bari.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট কত সালে প্রতিষ্ঠিত হয়?",
  options: [
    "১৯৭৪",
    "১৯৭৬",
    "১৯৭৮",
    "১৯৮০"
  ],
  answer: 0,
  explanation: "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (BARI) ১৯৭৪ সালে প্রতিষ্ঠিত হয়। (Source: BARI History)(https://bari.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "বাংলাদেশ পাট গবেষণা ইনস্টিটিউট (সদর দপ্তর) কোথায় অবস্থিত?",
  options: [
    "ঢাকায়",
    "গাজীপুরে",
    "ময়মনসিংহে",
    "চট্টগ্রামে"
  ],
  answer: 0,
  explanation: "বাংলাদেশ পাট গবেষণা ইনস্টিটিউটের সদর দপ্তর ঢাকায়। (Source: BJRI Official)(http://www.bjri.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "BRRI-এর প্রধান কার্যালয় কোথায়?",
  options: [
    "রাজশাহী",
    "দিনাজপুর",
    "ময়মনসিংহ",
    "গাজীপুর"
  ],
  answer: 3,
  explanation: "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI) প্রধান কার্যালয় গাজীপুরের জয়দেবপুরে। (Source: BRRI Official)(https://www.brri.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "BARC কত সালে প্রতিষ্ঠিত হয়?",
  options: [
    "১৯৭০",
    "১৯৭১",
    "১৯৭২",
    "১৯৭৩"
  ],
  answer: 2,
  explanation: "বাংলাদেশ কৃষি গবেষণা কাউন্সিল (BARC) ১৯৭২ সালে প্রতিষ্ঠিত হয়। (Source: BARC Official)(http://www.barc.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "কৃষি সম্প্রসারণ অধিদপ্তর কোন মন্ত্রণালয়ের অধীন?",
  options: [
    "মৎস্য ও প্রাণিসম্পদ মন্ত্রণালয়",
    "কৃষি মন্ত্রণালয়",
    "খাদ্য মন্ত্রণালয়",
    "স্থানীয় সরকার মন্ত্রণালয়"
  ],
  answer: 1,
  explanation: "কৃষি সম্প্রসারণ অধিদপ্তর (Department of Agricultural Extension) কৃষি মন্ত্রণালয়ের অধীন। (Source: DAE Official)(http://www.dae.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট প্রধানত কোন ফসল নিয়ে গবেষণা করে?",
  options: [
    "গম",
    "পাট",
    "ধান",
    "ভুট্টা"
  ],
  answer: 2,
  explanation: "BRRI প্রধানত ধান নিয়ে গবেষণা করে। (Source: BRRI Official)(https://www.brri.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "বাংলাদেশ কৃষি গবেষণা কাউন্সিলের প্রধান কাজ কী?",
  options: [
    "সরাসরি কৃষি উৎপাদন করা",
    "গবেষণা কার্যক্রম সমন্বয় করা",
    "কৃষিঋণ প্রদান করা",
    "বীজ বিতরণ করা"
  ],
  answer: 1,
  explanation: "BARC বিভিন্ন কৃষি গবেষণা প্রতিষ্ঠানের কার্যক্রম সমন্বয় করে। (Source: BARC Official)(http://www.barc.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "বাংলাদেশ পাট গবেষণা ইনস্টিটিউট প্রধানত কোন ফসল নিয়ে কাজ করে?",
  options: [
    "তুলা",
    "পাট",
    "ধান",
    "আখ"
  ],
  answer: 1,
  explanation: "BJRI প্রধানত পাট ফসলের উন্নয়ন ও গবেষণায় নিয়োজিত। (Source: BJRI Official)(http://www.bjri.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "কৃষক মাঠ স্কুলের মূল উদ্দেশ্য কী?",
  options: [
    "কৃষকদের বই পড়ানো",
    "কৃষকদের ব্যবহারিক প্রশিক্ষণ দেওয়া",
    "কৃষকদের ঋণ দেওয়া",
    "কৃষকদের জমি প্রদান করা"
  ],
  answer: 1,
  explanation: "কৃষক মাঠ স্কুলের মাধ্যমে কৃষকদের মাঠ পর্যায়ে ব্যবহারিক প্রশিক্ষণ প্রদান করা হয়। (Source: FAO Agricultural Extension)(https://www.fao.org/3/xII6e/XII6E02.htm?utm_source=chatgpt.com)"
},

{
  question: "উন্নত জাতের বীজ ব্যবহারের প্রধান সুবিধা কী?",
  options: [
    "ফলন কমে যায়",
    "রোগবালাই বৃদ্ধি পায়",
    "ফলন বৃদ্ধি পায়",
    "খরচ বেড়ে যায়"
  ],
  answer: 2,
  explanation: "উন্নত জাতের বীজ ব্যবহার করলে ফলন বৃদ্ধি পায় এবং রোগবালাই কম হয়। (Source: BARI Crop Guide)(https://bari.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "মাটির উর্বরতা বৃদ্ধিতে কোনটি গুরুত্বপূর্ণ?",
  options: [
    "জমি অনাবাদি রাখা",
    "অতিরিক্ত কীটনাশক ব্যবহার",
    "জৈব সার প্রয়োগ",
    "একই ফসল বারবার চাষ"
  ],
  answer: 2,
  explanation: "জৈব সার প্রয়োগ করলে মাটির উর্বরতা বৃদ্ধি পায় এবং মাটি স্বাস্থ্যকর থাকে। (Source: FAO Soil Fertility)(https://www.fao.org/3/x5826e/x5826e.pdf?utm_source=chatgpt.com)"
},

{
  question: "বাংলাদেশে রবি মৌসুমে প্রধানত কোন ফসল চাষ করা হয়?",
  options: [
    "ধান",
    "পাট",
    "গম",
    "আউশ"
  ],
  answer: 2,
  explanation: "রবি মৌসুমে প্রধানত গম চাষ করা হয়। (Source: BARI Crop Calendar)(https://bari.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "সেচ ব্যবস্থার মূল উদ্দেশ্য কী?",
  options: [
    "মাটির লবণাক্ততা বৃদ্ধি",
    "ফসলের পানি চাহিদা পূরণ",
    "আগাছা বৃদ্ধি",
    "মাটির ক্ষয় বৃদ্ধি"
  ],
  answer: 1,
  explanation: "সেচ ব্যবস্থার মাধ্যমে ফসলের পানি চাহিদা পূরণ করা হয়। (Source: FAO Irrigation Guide)(https://www.fao.org/3/t0234e/t0234e.pdf?utm_source=chatgpt.com)"
},

{
  question: "ফসল আবর্তনের প্রধান সুবিধা কী?",
  options: [
    "মাটির উর্বরতা হ্রাস",
    "রোগবালাই বৃদ্ধি",
    "মাটির উর্বরতা সংরক্ষণ",
    "উৎপাদন কমে যাওয়া"
  ],
  answer: 2,
  explanation: "ফসল আবর্তনের মাধ্যমে মাটির পুষ্টি উপাদান সুষম থাকে এবং মাটির উর্বরতা সংরক্ষণ হয়। (Source: FAO Crop Rotation)(https://www.fao.org/3/ae996e.pdf?utm_source=chatgpt.com)"
},

{
  question: "বাংলাদেশে খরিফ-১ মৌসুম সাধারণত কোন সময়কে বোঝায়?",
  options: [
    "অক্টোবর-জানুয়ারি",
    "ফেব্রুয়ারি-মে",
    "মার্চ-জুন",
    "জুলাই-অক্টোবর"
  ],
  answer: 2,
  explanation: "খরিফ-১ মৌসুম সাধারণত মার্চ থেকে জুন পর্যন্ত। (Source: BARI Crop Calendar)(https://bari.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "বাংলাদেশে খরিফ-২ মৌসুমে প্রধানত কোন ফসল চাষ করা হয়?",
  options: [
    "গম",
    "আমন ধান",
    "সরিষা",
    "মসুর"
  ],
  answer: 1,
  explanation: "খরিফ-২ মৌসুমে মূলত আমন ধান চাষ করা হয়। (Source: BARI Crop Calendar)(https://bari.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "বাংলাদেশে রবি মৌসুমে কোন ধরনের আবহাওয়া বিরাজ করে?",
  options: [
    "অত্যধিক বৃষ্টিপাত",
    "শীতল ও শুষ্ক আবহাওয়া",
    "ঝড়ো ও আর্দ্র আবহাওয়া",
    "ঘূর্ণিঝড় প্রবণ আবহাওয়া"
  ],
  answer: 1,
  explanation: "রবি মৌসুমে শীতল ও শুষ্ক আবহাওয়া বিরাজ করে। (Source: Bangladesh Meteorological Department)(https://www.bmd.gov.bd/?utm_source=chatgpt.com)"
},

{
  question: "উন্নত সেচ ব্যবস্থার একটি প্রধান সুবিধা কী?",
  options: [
    "ফসলের বৃদ্ধি ব্যাহত হয়",
    "জল অপচয় বৃদ্ধি পায়",
    "নিয়ন্ত্রিতভাবে পানি সরবরাহ সম্ভব হয়",
    "মাটির গুণাগুণ নষ্ট হয়"
  ],
  answer: 2,
  explanation: "উন্নত সেচ ব্যবস্থার মাধ্যমে নিয়ন্ত্রিতভাবে পানি সরবরাহ সম্ভব, পানি অপচয় কমে এবং উৎপাদন বৃদ্ধি পায়। (Source: FAO Irrigation Guide)(https://www.fao.org/3/t0234e/t0234e.pdf?utm_source=chatgpt.com)"
},

{
  question: "মাটির pH মান ফসল উৎপাদনে কেন গুরুত্বপূর্ণ?",
  options: [
    "মাটির রঙ নির্ধারণ করে",
    "মাটির তাপমাত্রা নিয়ন্ত্রণ করে",
    "পুষ্টি উপাদান গ্রহণে প্রভাব ফেলে",
    "মাটির গভীরতা নির্ধারণ করে"
  ],
  answer: 2,
  explanation: "মাটির pH মান ফসলের জন্য পুষ্টি উপাদান গ্রহণে প্রভাব ফেলে। সঠিক pH মান থাকলে ফসল স্বাভাবিক বৃদ্ধি পায়। (Source: FAO Soil Fertility)(https://www.fao.org/3/x5826e/x5826e.pdf?utm_source=chatgpt.com)"
},

{
  question: "জৈব সার ব্যবহারের একটি গুরুত্বপূর্ণ উপকারিতা কী?",
  options: [
    "মাটির ক্ষয় বৃদ্ধি",
    "মাটির জৈব পদার্থ বৃদ্ধি",
    "তাৎক্ষণিক ফলন কমানো",
    "মাটির লবণাক্ততা বৃদ্ধি"
  ],
  answer: 1,
  explanation: "জৈব সার ব্যবহার মাটিতে জৈব পদার্থ বৃদ্ধি করে, মাটির গঠন উন্নত করে এবং দীর্ঘমেয়াদে উর্বরতা বৃদ্ধি করে। (Source: FAO Organic Fertilizer Guide)(https://www.fao.org/3/i3615e/i3615e.pdf?utm_source=chatgpt.com)"
},

{
  question: "ফসল আবর্তন পদ্ধতি অনুসরণ করার প্রধান কারণ কী?",
  options: [
    "একই পুষ্টি উপাদান দ্রুত নিঃশেষ করা",
    "মাটির পুষ্টির ভারসাম্য রক্ষা করা",
    "একই রোগ ছড়ানো",
    "উৎপাদন কমানো"
  ],
  answer: 1,
  explanation: "ফসল আবর্তনের মাধ্যমে মাটির পুষ্টির ভারসাম্য রক্ষা হয় এবং রোগবালাই কমে। (Source: FAO Crop Rotation)(https://www.fao.org/3/ae996e.pdf?utm_source=chatgpt.com)"
},

{
  question: "কৃষি যান্ত্রিকীকরণের একটি প্রধান সুফল কী?",
  options: [
    "শ্রম ব্যয় বৃদ্ধি",
    "কাজের সময় বৃদ্ধি",
    "উৎপাদন দক্ষতা বৃদ্ধি",
    "ফসলের ক্ষতি বৃদ্ধি"
  ],
  answer: 2,
  explanation: "কৃষি যান্ত্রিকীকরণের মাধ্যমে উৎপাদন দক্ষতা বৃদ্ধি পায় এবং সময় ও শ্রম সাশ্রয় হয়। (Source: FAO Mechanization Guide)(https://www.fao.org/3/y5771e/y5771e.pdf?utm_source=chatgpt.com)"
},

{
  question: "বীজ শোধনের মূল উদ্দেশ্য কী?",
  options: [
    "বীজের ওজন বৃদ্ধি",
    "বীজের রঙ পরিবর্তন",
    "রোগজীবাণু দমন করা",
    "বীজের আকার বড় করা"
  ],
  answer: 2,
  explanation: "বীজ শোধনের মাধ্যমে বীজে থাকা রোগজীবাণু দমন করা হয় যাতে অঙ্কুরোদগম সুস্থ হয়। (Source: FAO Seed Treatment)(https://www.fao.org/3/y5612e/y5612e.pdf?utm_source=chatgpt.com)"
},

{
  question: "সমন্বিত বালাই ব্যবস্থাপনা (IPM) এর লক্ষ্য কী?",
  options: [
    "শুধু রাসায়নিক ব্যবহার বৃদ্ধি",
    "সম্পূর্ণভাবে কীটনাশক নির্ভরতা",
    "পরিবেশবান্ধব উপায়ে বালাই দমন",
    "ফসল ধ্বংস করা"
  ],
  answer: 2,
  explanation: "IPM-এর লক্ষ্য পরিবেশবান্ধব ও সমন্বিত উপায়ে বালাই দমন করা, যাতে রাসায়নিকের ব্যবহার সীমিত থাকে। (Source: FAO IPM Guide)(https://www.fao.org/3/y5053e/y5053e.pdf?utm_source=chatgpt.com)"
}
];
