// written-exam/data/exams.js
// এখানে নতুন exam যোগ করলেই Exam List-এ automatically দেখাবে
// প্রতিটা entry-র জন্য সংশ্লিষ্ট data ফাইল আলাদাভাবে <script> ট্যাগে লোড করতে হবে (নিচে নোট দেখুন)

const EXAMS_REGISTRY = [
    {
        id: 'bina-so-exam-1',
        title: 'BINA SO Exam – 1',
        dataVar: 'EXAM_BINA_SO_1'   // এই নামে ভ্যারিয়েবল bina-so-exam-1.js ফাইলে থাকবে
    }
    // নতুন exam যোগ করতে হলে এখানে আরেকটা object বসান, উদাহরণ:
    // { id: 'bari-so-exam-3', title: 'BARI SO Exam – 3', dataVar: 'EXAM_BARI_SO_3' }
];