/*
================================================================
  HOW TO USE THIS FILE
================================================================
Each exam has a `category`:

  "live"     → Shows in the 🔴 LIVE section on Exam Corner.
               • Leave startDate & endDate empty ("") to make it
                 open immediately with no time limit (like your
                 old "visible: true" exams worked).
               • Fill in startDate & endDate to make it go live
                 and lock itself AUTOMATICALLY at those exact
                 moments — you never have to flip a switch by hand.

  "archived" → Always shown inside the 📁 আর্কাইভ folder at the
               top of Exam Corner. Open for students at any time,
               no schedule needed. Great for old chapters students
               can still practice.

  "draft"    → Hidden everywhere (not in Live, not in Archive).
               Use this while a chapter's questions.js isn't
               ready yet.

Dates MUST be written with the +06:00 (Bangladesh) offset so the
exam goes live at the correct real-world moment no matter what
timezone a student's phone happens to be set to:

    "2026-07-25T10:00:00+06:00"

================================================================
*/

const EXAM_STATUS = {
  "exam-1": {
    title: "ডেমো পরীক্ষা code:1111🔴",
    category: "live",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["1111"]
  },

  "exam-2": {
    title: "HSC 1st Paper 1st Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-3": {
    title: "HSC 1st Paper 2nd Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-4": {
    title: "HSC 1st Paper 3rd Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-5": {
    title: "HSC 1st Paper 4rth Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-6": {
    title: "HSC 1st Paper 5th Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-7": {
    title: "HSC 1st Paper 6th Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-8": {
    title: "HSC 2nd Paper 1st Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-9": {
    title: "HSC 2nd Paper 2nd Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-10": {
    title: "HSC 2nd Paper 3rd Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-11": {
    title: "HSC 2nd Paper 4rth Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-12": {
    title: "HSC 2nd Paper 5th Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-13": {
    title: "SSC 1st Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-14": {
    title: "SSC 2nd Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-15": {
    title: "SSC 3rd Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-16": {
    title: "SSC 4rth Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-17": {
    title: "SSC 5th Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-18": {
    title: "SSC 6th Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-19": {
    title: "SSC 7th Chapter",
    category: "archived",
    codes: ["exam1111"]
  },

  "exam-20": {
    title: "HSC 1st Paper 1st Chapter🔴",
    category: "live",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["2222"]
  },

  "exam-21": {
    title: "HSC 1st Paper 2nd Chapter🔴",
    category: "live",
    startDate: "2026-08-04T06:00:00+06:00",
    endDate: "2026-08-08T11:00:00+06:00",
    codes: ["exam4422"]
  },

  "exam-22": {
    title: "HSC 1st Paper 3rd Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-23": {
    title: "HSC 1st Paper 4rth Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-24": {
    title: "HSC 1st Paper 5th Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-25": {
    title: "HSC 1st Paper 6th Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-26": {
    title: "HSC 2nd Paper 1st Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-27": {
    title: "HSC 2nd Paper 2nd Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-28": {
    title: "HSC 2nd Paper 3rd Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-29": {
    title: "HSC 2nd Paper 4rth Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-30": {
    title: "HSC 2nd Paper 5th Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-31": {
    title: "SSC 1st Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-32": {
    title: "SSC 2nd Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-33": {
    title: "SSC 3rd Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-34": {
    title: "SSC 4rth Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-35": {
    title: "SSC 5th Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-36": {
    title: "SSC 6th Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-37": {
    title: "SSC 7nth Chapter",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-38": {
    title: "None",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-39": {
    title: "None",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  },

  "exam-40": {
    title: "None",
    category: "draft",
    startDate: "2026-07-22T06:00:00+06:00",
    endDate: "2026-09-25T11:00:00+06:00",
    codes: ["exam2222"]
  }

  // -------------------- EXAMPLE: scheduled exam --------------------
  // "exam-20": {
  //   title: "নতুন মডেল টেস্ট",
  //   category: "live",
  //   startDate: "2026-07-25T10:00:00+06:00",
  //   endDate:   "2026-07-25T11:25:00+06:00",
  //   codes: ["newcode123"]
  // }
};
