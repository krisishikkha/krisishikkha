const QUESTIONS = [
{
  question: "বাতাসে জলীয় বাষ্পের পরিমাণকে কী বলে?",
  options: ["বায়ুচাপ", "বায়ুর আর্দ্রতা", "বারিপাত", "বায়ুপুঞ্জ"],
  answer: 1,
  explanation: "বায়ুর আর্দ্রতা বলতে বায়ুমণ্ডলে থাকা জলীয় বাষ্পের পরিমাণকে বোঝায়। এটি আবহাওয়া ও ফসলের বৃদ্ধিতে গুরুত্বপূর্ণ প্রভাব ফেলে। (Source: BMD – Bangladesh Meteorological Department)"
},
{
  question: "কোনো অঞ্চলের ফসলের প্রকার ও জাত নির্বাচনে কোনটি প্রভাব বিস্তার করে?",
  options: ["জলবায়ু", "আবহাওয়া", "বায়ুর চাপ", "দৃষ্টিগ্রাহ্যতা"],
  answer: 0,
  explanation: "ফসলের ধরন এবং জাত নির্বাচন করার ক্ষেত্রে মূলত জলবায়ু গুরুত্বপূর্ণ ভূমিকা পালন করে। (Source: FAO – Food and Agriculture Organization)"
},
{
  question: "উত্তর-পূর্বাঞ্চলে কোন উদ্ভিদ ভালো জন্মে?",
  options: ["ধান", "গম", "পাট", "আলু"],
  answer: 0,
  explanation: "উত্তর-পূর্বাঞ্চলে মাটি ও জলবায়ুর উপযুক্ত পরিবেশ থাকার কারণে ধান ভাল জন্মায়। (Source: BRRI – Bangladesh Rice Research Institute)"
},
{
  question: "দিনে যত ঘন্টা সূর্যের আলো পাওয়া যায় তার পরিমাণকে কী বলে?",
  options: ["দিবা দৈর্ঘ্য", "সৌর বিকিরণ", "সূর্যালোক", "সৌরতাপ"],
  answer: 0,
  explanation: "দিনে প্রাপ্ত সূর্যালোকের সময়কালকে দিবা দৈর্ঘ্য বলা হয়। (Source: Encyclopedia of Plant Physiology)"
},
{
  question: "শীতল স্রোতের ওপর দিয়ে বায়ু প্রবাহিত হলে কী ঘটে?",
  options: ["তাপমাত্রা বাড়ে, বৃষ্টিপাত কমে", "তাপমাত্রা বাড়ে, বৃষ্টিপাত বাড়ে", "তাপমাত্রা ও বৃষ্টিপাত কমে", "তাপমাত্রা ও বৃষ্টিপাত অপরিবর্তিত থাকে"],
  answer: 2,
  explanation: "শীতল স্রোতের ওপর দিয়ে বায়ু প্রবাহিত হলে সাধারণত তাপমাত্রা কমে এবং বৃষ্টিপাতের পরিমাণও কমে। (Source: NOAA – National Oceanic and Atmospheric Administration)"
},
{
  question: "বায়ুমণ্ডলের শতকরা কত ভাগ নাইট্রোজেন বিদ্যমান?",
  options: ["৯৯", "৯৮", "৫০", "৭৮"],
  answer: 3,
  explanation: "বায়ুমণ্ডলের প্রায় ৭৮% নাইট্রোজেন নিয়ে গঠিত। (Source: NASA Earth Science)"
},
{
  question: "দিন রাতের সর্বোচ্চ ও সর্বনিম্ন তাপমাত্রা নির্ণায়ক যন্ত্রের নাম কী?",
  options: ["হাইগ্রোমিটার", "ল্যাক্টোমিটার", "থার্মোমিটার", "হাইড্রোমিটার"],
  answer: 2,
  explanation: "গরিষ্ঠ ও লঘিষ্ঠ থার্মোমিটার ব্যবহার করে দিন ও রাতের সর্বোচ্চ ও সর্বনিম্ন তাপমাত্রা নির্ণয় করা হয়। (Source: Physics Handbook)"
},
{
  question: "গভীর পানিতে জন্মায় কোন জাতের ধান?",
  options: ["স্থানীয় আমন", "হাইব্রিড আমন", "বোরো", "আউশ"],
  answer: 0,
  explanation: "গভীর পানিতে স্থানীয় আমন জাত জন্মায়। (Source: BRRI – Bangladesh Rice Research Institute)"
},
{
  question: "ভূ-পৃষ্ঠের ৭১% জলরাশি সমৃদ্ধ অংশকে কী বলে?",
  options: ["মেসোমন্ডল", "বারিমন্ডল", "তাপমন্ডল", "বায়ুমন্ডল"],
  answer: 1,
  explanation: "পৃথিবীর ৭১% পৃষ্ঠ জল দ্বারা ঢাকা। এই অংশকে বারিমন্ডল (Hydrosphere) বলা হয়। (Source: Encyclopedia Britannica)"
},
{
  question: "প্রতিকূল পরিবেশে ফসল উৎপাদনের পূর্বশর্ত কী?",
  options: ["ফসলের জাত নির্বাচন", "সেচ দেওয়া", "আবহাওয়া পর্যবেক্ষণ", "সরাসরি চাষ"],
  answer: 0,
  explanation: "প্রতিকূল পরিবেশে সফল ফসল উৎপাদনের জন্য প্রধান পূর্বশর্ত হলো ফসলের জাত সঠিকভাবে নির্বাচন করা। (Source: FAO – Food and Agriculture Organization)"
},
{
  question: "শিশির ও কুয়াশা বেড়ে গেলে আলুর কোন রোগ হয়?",
  options: ["আগাছা দমন", "পচন", "ব্লাস্ট", "ধ্বসা"],
  answer: 3,
  explanation: "শিশির ও কুয়াশা বেশি হলে আলুর মধ্যে ফাঙ্গাল প্যাথোজেন সক্রিয় হয়ে 'ধ্বসা রোগ' (Late Blight) দেখা দেয়। (Source: BARI – Bangladesh Agricultural Research Institute)"
},
{
  question: "লবণাক্ত এলাকায় বোরো চাষের জন্য ধানের জাত কোনটি?",
  options: ["ব্রি ধান ৪৭", "ব্রি ধান ৫৪", "ব্রি ধান ৪০", "ব্রি ধান ৪১"],
  answer: 1,
  explanation: "লবণাক্ত মাটিতে বোরো চাষের জন্য লবণ সহিষ্ণু জাত যেমন ব্রি ধান ৫৪ ভালো ফলন দেয়। (Source: BRRI – Bangladesh Rice Research Institute)"
},
{
  question: "শীতকালে বাছুরের কোন রোগ হয়?",
  options: ["কৃমি", "নিউমোনিয়া", "জলাতংক", "পেটের পীড়া"],
  answer: 1,
  explanation: "শীতকালে তাপমাত্রা কম হওয়ায় বাছুরের মধ্যে নিউমোনিয়ার সমস্যা দেখা দেয়। (Source: FAO Livestock Manual)"
},
{
  question: "ব্রয়লার মুরগির খামার করা হয় কোন দুর্যোগপ্রবণ এলাকায়?",
  options: ["খরাপ্রবণ", "জলোচ্ছ্বাসপ্রবণ", "বন্যা পীড়িত", "শীতপ্রবণ"],
  answer: 0,
  explanation: "ব্রয়লার মুরগি সাধারণত খরাপ্রবণ এলাকায় পালন করা হয়। (Source: DLS – Department of Livestock Services, Bangladesh)"
},
{
  question: "নিচের কোনগুলো গ্রীষ্মকালের ফসল?",
  options: ["টমেটো, বেগুন", "কচু, কপি", "শিম, মূলা", "ধান"],
  answer: 0,
  explanation: "টমেটো ও বেগুন গ্রীষ্মকালে চাষযোগ্য ফসল। (Source: BARI – Bangladesh Agricultural Research Institute)"
},
{
  question: "হাওর অঞ্চলের বোরো ধান পাকার সময় তলিয়ে যায় কোন দুর্যোগের প্রভাবে?",
  options: ["জলোচ্ছ্বাস", "অতিবৃষ্টি", "পাহাড়ী ঢল", "কালবৈশাখী"],
  answer: 2,
  explanation: "হাওর অঞ্চলে পাহাড়ী ঢলের কারণে বোরো ধান তলিয়ে যায়। (Source: Bangladesh Agricultural University Research)"
},
{
  question: "সবজি ক্ষেতে জাবড়া প্রয়োগ করে পানি সংরক্ষণ করা হয় কখন?",
  options: ["খরিফ-১", "খরিফ-২", "রবি মৌসুমে", "বর্ষাকালে"],
  answer: 2,
  explanation: "সবজি ক্ষেতে জাবড়া রবি মৌসুমে প্রয়োগ করে মাটির আর্দ্রতা ধরে রাখা হয়। (Source: BARI – Bangladesh Agricultural Research Institute)"
},
{
  question: "বাংলাদেশে সাধারণত কোন মাসে শিলাবৃষ্টি হয়?",
  options: ["ফেব্রুয়ারি-মার্চ", "মার্চ-এপ্রিল", "এপ্রিল-মে", "মে-জুন"],
  answer: 1,
  explanation: "বাংলাদেশে শিলাবৃষ্টি সাধারণত মার্চ থেকে এপ্রিল মাসে হয়। (Source: BMD – Bangladesh Meteorological Department)"
},
{
  question: "পানিশূন্যতা রোধকরণে কোষের অভিযোজন কোনটি?",
  options: ["পাতা কুঁচকে যাওয়া", "উচ্চতর অভিস্রবণ চাপ", "বেশি পাতা গজানো", "পাতা হলদে হয়ে যাওয়া"],
  answer: 1,
  explanation: "পানিশূন্য পরিবেশে উদ্ভিদের কোষ অভিযোজন হিসেবে অভ্যন্তরীণ অভিস্রবণ চাপ বৃদ্ধি পায়। (Source: Plant Physiology Textbook)"
},
{
  question: "উদ্ভিদের কোন অঙ্গ খরা সহ্য করতে পারে?",
  options: ["কাণ্ড", "পাতা", "ফল", "মুকুল"],
  answer: 0,
  explanation: "খরার পরিবেশে উদ্ভিদের প্রধান সহিষ্ণু অংশ হলো কাণ্ড, যা জল সংরক্ষণ ও স্থায়িত্বে গুরুত্বপূর্ণ। (Source: FAO – Drought Resistant Crops Report)"
},
{
  question: "বহুবর্ষী উদ্ভিদ মাটির নিচে কী গঠন করে সুপ্তাবস্থায় বেঁচে থাকে?",
  options: ["রাইজোম", "সাকার", "মূল", "বীজ"],
  answer: 0,
  explanation: "বহুবর্ষী উদ্ভিদ মাটির নিচে রাইজোম, কন্দ বা বাল্ব গঠন করে সুপ্তাবস্থায় বেঁচে থাকে। (Source: Plant Biology Textbook)"
},
{
  question: "পাতার রন্দ্র খোলা ও বন্ধ হওয়া কোন প্রক্রিয়ার সাথে যুক্ত?",
  options: ["শ্বসন", "অভিস্রবণ", "প্রস্বেদন", "অঙ্কুরোদগম"],
  answer: 2,
  explanation: "পাতার রন্দ্র খোলা ও বন্ধ হওয়া প্রস্বেদনের নিয়ন্ত্রণে গুরুত্বপূর্ণ। (Source: Plant Physiology Handbook)"
},
{
  question: "পরিবেশের তাপমাত্রা বাড়লে পত্ররন্দ্রের আকার কমিয়ে দেয় কোন ফসল?",
  options: ["ধান", "সরিষা", "শিম", "গাজর"],
  answer: 1,
  explanation: "সরিষার পাতার রন্দ্র তাপমাত্রা বাড়লে কমে যায়, ফলে পানি সংরক্ষণ হয়। (Source: BARI – Bangladesh Agricultural Research Institute)"
},
{
  question: "পাতার আকার হ্রাস করে প্রস্বেদন কমায় কোন ফসল?",
  options: ["গো-মটর", "মুগ ডাল", "শিম", "তিল"],
  answer: 0,
  explanation: "গো-মটরের পাতার আকার হ্রাস করে প্রস্বেদন নিয়ন্ত্রণ করে। (Source: FAO – Drought Resistant Crops Report)"
},
{
  question: "গাছের নিচ থেকে পুরাতন পাতা ঝরিয়ে প্রস্বেদন কমায় কোন ফসল?",
  options: ["তুলা", "ধান", "গম", "ভুট্টা"],
  answer: 0,
  explanation: "তুলা, চিনাবাদাম, জোয়ার ও গো-মটর পুরাতন পাতা ঝরিয়ে প্রস্বেদন কমায়। (Source: BARI – Bangladesh Agricultural Research Institute)"
},
{
  question: "কোনটি খরাসহিষ্ণু ফসল?",
  options: ["আখ", "খেজুর", "গবেল", "পেঁপে"],
  answer: 1,
  explanation: "খেজুর, কুল, অড়হর, তরমুজ ইত্যাদি খরাসহিষ্ণু। (Source: FAO – Drought Resistant Crops Report)"
},
{
  question: "কোনটি খরাসহিষ্ণু ফসলের বৈশিষ্ট্য বহির্ভূত?",
  options: ["মূল খুব দৃঢ় ও শাখাযুক্ত", "পাতা ছোট, সরু, পুরু বা প্যাচানো", "মূল গুচ্ছমূল", "মূল গভীরমূলী"],
  answer: 2,
  explanation: "গুচ্ছমূল খরাসহিষ্ণু ফসলের বৈশিষ্ট্য নয়। (Source: Plant Adaptation Studies)"
},
{
  question: "খরা সহিষ্ণু গমের জাত কোনটি?",
  options: ["আকবর", "সোনালি", "প্রতিভাঘ", "প্রদীপ"],
  answer: 1,
  explanation: "খরা সহিষ্ণু গমের মধ্যে সোনালি জাত ভালো ফলন দেয়। (Source: BARI – Bangladesh Agricultural Research Institute)"
},
{
  question: "কোনটি খরা সহিষ্ণু বেগুনের জাত?",
  options: ["বারি বেগুন-৪", "বারি বেগুন-১২", "বারি বেগুন-৮", "বিনা বেগুন-১৩"],
  answer: 2,
  explanation: "বারি বেগুন-৮ খরা অবস্থায় ভালো ফলন দেয়। (Source: BARI – Bangladesh Agricultural Research Institute)"
},
{
  question: "কোনটি উত্তম লবণাক্ততা সহিষ্ণু ফসল?",
  options: ["মরি", "লেবু", "গম", "বার্লি"],
  answer: 3,
  explanation: "বার্লি লবণাক্ত এলাকায় ভালো ফলন দেয়। (Source: FAO – Salt Tolerant Crops Report)"
},
{
  question: "কোনটি মধ্যম লবণাক্ততা সহিষ্ণু ফসল?",
  options: ["শালগম", "পালংশাক", "গাজর", "বিটরুট"],
  answer: 1,
  explanation: "পালংশাক মধ্যম লবণাক্ততা সহিষ্ণু। (Source: FAO – Salt Tolerant Crops Report)"
},
{
  question: "কোনটি লবণাক্ততা সংবেদনশীল ফসল?",
  options: ["নারিকেল", "মটর", "স্ট্রবেরি", "তুলা"],
  answer: 2,
  explanation: "স্ট্রবেরি লবণাক্ততায় সংবেদনশীল। (Source: FAO – Salt Sensitive Crops Report)"
},
{
  question: "মিষ্টি আলু কোন ধরনের ফসল?",
  options: ["উত্তম লবণাক্ততা সহিষ্ণু", "মধ্যম লবণাক্ততা সহিষ্ণু", "লবণাক্ততা সংবেদনশীল", "উত্তম খরা সহিষ্ণু"],
  answer: 3,
  explanation: "মিষ্টি আলু খরা সহিষ্ণু ফসল। (Source: BARI – Bangladesh Agricultural Research Institute)"
},
{
  question: "কোনটি উপকূলীয় লবণাক্ততা এলাকার প্রধান ফসল?",
  options: ["ধান", "গম", "পাট", "আখ"],
  answer: 0,
  explanation: "উপকূলীয় লবণাক্ত এলাকায় প্রধান ফসল ধান। (Source: BRRI – Bangladesh Rice Research Institute)"
},
{
  question: "সর্বনিম্ন বৃষ্টিপাত কোথায় হয়?",
  options: ["লালপুর", "লালখান", "লালমাটিয়া", "লালবাগ"],
  answer: 0,
  explanation: "সর্বনিম্ন বৃষ্টিপাত হয় লালপুরে। (Source: BMD – Bangladesh Meteorological Department)"
},
{
  question: "কোন ঋতুতে জলীয় বাষ্প কম থাকে?",
  options: ["গ্রীষ্ম", "বর্ষা", "শীত", "বসন্ত"],
  answer: 2,
  explanation: "শীতকালে আর্দ্রতা কম থাকে। (Source: BMD – Bangladesh Meteorological Department)"
},
{
  question: "শীতকালে বায়ুর গড় আর্দ্রতা কত ভাগ?",
  options: ["৩০-৪৫", "৪৫-৬০", "৭৫-৮৪", "৭০-৭৫"],
  answer: 0,
  explanation: "শীতকালে বায়ুর গড় আর্দ্রতা ৩০-৪৫%। (Source: BMD – Bangladesh Meteorological Department)"
},
{
  question: "গ্রীষ্মকালে গড় আর্দ্রতা শতকরা কত ভাগ?",
  options: ["৬০-৭৫", "৭২-৮২", "৮৩-৮৯", "৯০-৯২"],
  answer: 0,
  explanation: "গ্রীষ্মকালে বায়ুর গড় আর্দ্রতা ৬০-৭৫%। (Source: BMD – Bangladesh Meteorological Department)"
},
{
  question: "কোনটি উদ্ভিদের বৃদ্ধি ও পুষ্টির পূর্বশর্ত?",
  options: ["কীটনাশক", "রাসায়নিক সার", "পরিমিত পানি", "অত্যধিক সূর্যালোক"],
  answer: 2,
  explanation: "উদ্ভিদের বৃদ্ধি ও পুষ্টির জন্য পরিমিত পানি অপরিহার্য। (Source: Plant Physiology Handbook)"
},
{
  question: "কোনটির ওপর মাটির উর্বরতা নির্ভর করে?",
  options: ["মাটির সার গ্রহণ ক্ষমতা", "মাটি-বালুর মিশ্রণ", "মাটির পানি ধারণ ক্ষমতা", "মাটিতে মিশ্রিত কংকর"],
  answer: 0,
  explanation: "মাটির উর্বরতা প্রধানত মাটির সার গ্রহণ ক্ষমতার ওপর নির্ভর করে। (Source: Soil Science Textbook)"
},
{
  question: "চরাঞ্চলের বৈশিষ্ট্যপূর্ণ উদ্ভিদ কোনটি?",
  options: ["পেয়ারা", "কফি", "খেজুর", "পান"],
  answer: 2,
  explanation: "চরাঞ্চলের মাটি প্রায়শই বালুকাময় ও নদীর তাজা মাটি দ্বারা গঠিত। খেজুর গাছ এই ধরনের চরাঞ্চলে টেকসই। (Source: BARI – Bangladesh Agricultural Research Institute)"
},
{
  question: "রাসায়নিক সার ও কীটনাশকের বিষাক্ততা দূর হয় কীভাবে?",
  options: ["বায়ু প্রবাহের মাধ্যমে", "তাপমাত্রার কারণে", "অতিবৃষ্টির ফলে", "খরার কারণে"],
  answer: 2,
  explanation: "রাসায়নিক সার ও কীটনাশকের বিষাক্ততা প্রধানত অতিবৃষ্টির ফলে ধুয়ে যায় বা মাটিতে মিশে যায়। (Source: FAO – Environmental Impact of Fertilizers)"
},
{
  question: "কোন সময়ে মাটির আর্দ্রতা সবচেয়ে বেশি থাকে?",
  options: ["গ্রীষ্মকালে", "শরৎকালে", "বসন্তকালে", "শীতকালে"],
  answer: 1,
  explanation: "শরৎকালে বৃষ্টিপাত শেষ হয় এবং মাটি তাজা পানি ধরে রাখে। এই সময় মাটির আর্দ্রতা সর্বাধিক থাকে। (Source: Soil Science Textbook)"
},
{
  question: "দক্ষিণ-পশ্চিম মৌসুমি বায়ুর প্রবাহে বৃষ্টিপাত হয় কখন?",
  options: ["গ্রীষ্মে", "বর্ষায়", "শীতে", "বসন্তে"],
  answer: 1,
  explanation: "বাংলাদেশে দক্ষিণ-পশ্চিম মৌসুমি বায়ু বর্ষা মৌসুমে প্রবাহিত হয়, যা প্রচুর বৃষ্টি আনে। (Source: BMD – Bangladesh Meteorological Department)"
},
{
  question: "কোনটি আলোক বিমুখী ফসল?",
  options: ["বার্লি", "মাশরুম", "পেয়ারা", "লিচু"],
  answer: 1,
  explanation: "আলোক বিমুখী ফসল সূর্যালোকের কম উপস্থিতিতে বৃদ্ধি পায়। মাশরুম সূর্যালোকের প্রয়োজন হয় না। (Source: FAO – Crop Classification)"
},
{
  question: "আলোক নিরপেক্ষ ফসল কোনটি?",
  options: ["গোলাপ", "মুলা", "চন্দ্রমল্লিকা", "শিম"],
  answer: 3,
  explanation: "আলোক নিরপেক্ষ ফসল যেকোনো দৈর্ঘ্যের দিনে সমানভাবে বৃদ্ধি পায়। শিম এই শ্রেণীর উদ্ভিদ। (Source: Plant Physiology Handbook)"
},
{
  question: "আলোক সংবেদনশীলতার ভিত্তিতে ধানকে কতটি শ্রেণিতে ভাগ করা যায়?",
  options: ["২", "৩", "৮", "৯"],
  answer: 1,
  explanation: "ধান আলোক সংবেদনশীলতার ভিত্তিতে ৩টি শ্রেণিতে ভাগ করা যায়: স্বল্প, মধ্যম ও উচ্চ আলোক সংবেদনশীল। (Source: BRRI – Bangladesh Rice Research Institute)"
},
{
  question: "স্বল্প আলোক সংবেদনশীল ধানের জাত কোনটি?",
  options: ["বিআর ৯", "বিআর ১০", "বিআর ১১", "ব্রি ধান ২৫"],
  answer: 1,
  explanation: "বিআর ১০ ধান স্বল্প আলোক সংবেদনশীল। (Source: BRRI – Bangladesh Rice Research Institute)"
}
];
