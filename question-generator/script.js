/* =============================================
   🌾 কৃষিশিক্ষা - Question Generator Main Script
   ============================================= */

// ========== Global Variables ==========
let subjectsData = null;
let currentChapters = null;
let currentQuestions = [];
let selectedQuestions = [];
let currentSubject = null;

// ========== Initialize App ==========
document.addEventListener('DOMContentLoaded', function() {
    loadSubjects();
    setupEventListeners();
});

// ========== Setup Event Listeners ==========
function setupEventListeners() {
    // Subject dropdown change
    const subjectSelect = document.getElementById('subjectSelect');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', handleSubjectChange);
    }
    
    // Load questions button
    const loadBtn = document.getElementById('loadQuestionsBtn');
    if (loadBtn) {
        loadBtn.addEventListener('click', loadQuestions);
    }
    
    // Close modals on outside click
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
        previewModal.addEventListener('click', function(e) {
            if (e.target === this) hidePreviewModal();
        });
    }
    
    const premiumModal = document.getElementById('premiumModal');
    if (premiumModal) {
        premiumModal.addEventListener('click', function(e) {
            if (e.target === this) hidePremiumModal();
        });
    }
}

// ========== Load Subjects ==========
async function loadSubjects() {
    try {
        const response = await fetch('data/subjects.json');
        subjectsData = await response.json();
        populateSubjectDropdown();
    } catch (error) {
        console.error('Error loading subjects:', error);
        showToast('বিষয় লোড করতে সমস্যা হয়েছে।', 'error');
    }
}

// ========== Populate Subject Dropdown ==========
function populateSubjectDropdown() {
    const select = document.getElementById('subjectSelect');
    if (!select || !subjectsData) return;
    
    select.innerHTML = '<option value="">-- বিষয় নির্বাচন করুন --</option>';
    
    subjectsData.subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.id;
        option.textContent = `${subject.icon} ${subject.nameBn}`;
        if (subject.isPremium) {
            option.textContent += ' 👑';
        }
        select.appendChild(option);
    });
}

// ========== Handle Subject Change ==========
async function handleSubjectChange(e) {
    const subjectId = e.target.value;
    const chapterList = document.getElementById('chapterList');
    const loadBtn = document.getElementById('loadQuestionsBtn');
    
    // Reset
    currentChapters = null;
    currentQuestions = [];
    selectedQuestions = [];
    document.getElementById('questionsList').innerHTML = '<p class="placeholder">অধ্যায় সিলেক্ট করে "প্রশ্ন লোড করুন" বাটনে ক্লিক করুন</p>';
    updateSelectedCount();
    
    if (!subjectId) {
        chapterList.innerHTML = '<p class="placeholder">প্রথমে বিষয় নির্বাচন করুন</p>';
        loadBtn.disabled = true;
        currentSubject = null;
        return;
    }
    
    // Find subject
    currentSubject = subjectsData.subjects.find(s => s.id === subjectId);
    
    // Update subject name input
    const subjectNameInput = document.getElementById('subjectNameInput');
    if (subjectNameInput && currentSubject) {
        subjectNameInput.value = currentSubject.nameBn;
    }
    
    // Load chapters
    chapterList.innerHTML = '<div class="loading"></div>';
    
    try {
        const response = await fetch(`data/${subjectId}/chapters.json`);
        const data = await response.json();
        currentChapters = data.chapters;
        displayChapters();
        loadBtn.disabled = false;
    } catch (error) {
        console.error('Error loading chapters:', error);
        chapterList.innerHTML = '<p class="placeholder">অধ্যায় লোড করতে সমস্যা হয়েছে।</p>';
        loadBtn.disabled = true;
    }
}

// ========== Display Chapters ==========
function displayChapters() {
    const chapterList = document.getElementById('chapterList');
    if (!chapterList || !currentChapters) return;
    
    chapterList.innerHTML = '';
    
    // Select All checkbox
    const selectAllDiv = document.createElement('div');
    selectAllDiv.className = 'chapter-item';
    selectAllDiv.innerHTML = `
        <input type="checkbox" id="selectAllChapters" onchange="toggleAllChapters(this)">
        <label for="selectAllChapters"><strong>সব অধ্যায় নির্বাচন</strong></label>
    `;
    chapterList.appendChild(selectAllDiv);
    
    // Individual chapters
    currentChapters.forEach(chapter => {
        if (!chapter.isVisible) return; // Hide invisible chapters
        
        const div = document.createElement('div');
        div.className = 'chapter-item';
        div.innerHTML = `
            <input type="checkbox" id="${chapter.id}" class="chapter-checkbox" value="${chapter.id}">
            <label for="${chapter.id}">${chapter.nameBn}</label>
        `;
        chapterList.appendChild(div);
    });
}

// ========== Toggle All Chapters ==========
function toggleAllChapters(checkbox) {
    const chapterCheckboxes = document.querySelectorAll('.chapter-checkbox');
    chapterCheckboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
}

// ========== Load Questions ==========
async function loadQuestions() {
    const selectedChapters = getSelectedChapters();
    
    if (selectedChapters.length === 0) {
        showToast('অন্তত একটি অধ্যায় সিলেক্ট করুন।', 'warning');
        return;
    }
    
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = '<div class="loading"></div>';
    
    currentQuestions = [];
    selectedQuestions = [];
    
    try {
        // Load questions from each selected chapter
        for (const chapterId of selectedChapters) {
            const response = await fetch(`data/${currentSubject.id}/${chapterId}.json`);
            const data = await response.json();
            
            if (data.questions) {
                // Add chapter info to each question
                data.questions.forEach(q => {
                    q.chapterId = chapterId;
                    q.chapterName = data.chapterName;
                });
                currentQuestions = currentQuestions.concat(data.questions);
            }
        }
        
        displayQuestions();
        showToast(`${currentQuestions.length}টি প্রশ্ন লোড হয়েছে।`, 'success');
        
    } catch (error) {
        console.error('Error loading questions:', error);
        questionsList.innerHTML = '<p class="placeholder">প্রশ্ন লোড করতে সমস্যা হয়েছে।</p>';
        showToast('প্রশ্ন লোড করতে সমস্যা হয়েছে।', 'error');
    }
}

// ========== Get Selected Chapters ==========
function getSelectedChapters() {
    const checkboxes = document.querySelectorAll('.chapter-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// ========== Display Questions ==========
function displayQuestions() {
    const questionsList = document.getElementById('questionsList');
    
    if (currentQuestions.length === 0) {
        questionsList.innerHTML = '<p class="placeholder">কোনো প্রশ্ন পাওয়া যায়নি।</p>';
        return;
    }
    
    questionsList.innerHTML = '';
    
    let passageHTML = '';
    let currentPassageId = null;
    
    currentQuestions.forEach((q, index) => {
        // Handle passage type
        if (q.type === 'passage') {
            passageHTML = `
                <div class="question-item passage-block" data-passage-id="${q.id}">
                    <div class="passage-text">
                        <strong>📖 অনুচ্ছেদ:</strong><br>
                        ${q.passage}
                    </div>
                </div>
            `;
            currentPassageId = q.id;
            questionsList.innerHTML += passageHTML;
            return;
        }
        
        const isPremium = currentSubject && currentSubject.isPremium && !isLoggedIn();
        const isSelected = selectedQuestions.includes(q.id);
        
        let questionHTML = `
            <div class="question-item ${isSelected ? 'selected' : ''} ${isPremium ? 'premium' : ''}" 
                 data-id="${q.id}" 
                 onclick="toggleQuestion('${q.id}', ${isPremium})">
                <div class="question-header">
                    <input type="checkbox" 
                           ${isSelected ? 'checked' : ''} 
                           ${isPremium ? 'disabled' : ''}
                           onclick="event.stopPropagation(); toggleQuestion('${q.id}', ${isPremium})">
                    <span class="question-text">
                        ${index + 1}. ${q.question}
                    </span>
                    ${isPremium ? '<span class="premium-lock">🔒</span>' : ''}
                </div>
        `;
        
        // Add statements for multiple type
        if (q.type === 'multiple' && q.statements) {
            questionHTML += '<div class="question-statements">';
            q.statements.forEach(s => {
                questionHTML += `<p>${s}</p>`;
            });
            questionHTML += '<p><em>নিচের কোনটি সঠিক?</em></p></div>';
        }
        
        questionHTML += '</div>';
        questionsList.innerHTML += questionHTML;
    });
    
    updateSelectedCount();
}

// ========== Toggle Question Selection ==========
function toggleQuestion(questionId, isPremium = false) {
    if (isPremium) {
        showPremiumModal();
        return;
    }
    
    const index = selectedQuestions.indexOf(questionId);
    
    if (index > -1) {
        selectedQuestions.splice(index, 1);
    } else {
        selectedQuestions.push(questionId);
    }
    
    // Update UI
    const item = document.querySelector(`.question-item[data-id="${questionId}"]`);
    if (item) {
        item.classList.toggle('selected');
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = selectedQuestions.includes(questionId);
    }
    
    updateSelectedCount();
}

// ========== Update Selected Count ==========
function updateSelectedCount() {
    const countEl = document.getElementById('selectedCount');
    if (countEl) {
        countEl.textContent = `নির্বাচিত: ${selectedQuestions.length}`;
    }
}

// ========== Select Random Questions ==========
function selectRandom(count) {
    if (currentQuestions.length === 0) {
        showToast('প্রথমে প্রশ্ন লোড করুন।', 'warning');
        return;
    }
    
    // Filter out passages and premium questions
    const isPremium = currentSubject && currentSubject.isPremium && !isLoggedIn();
    if (isPremium) {
        showPremiumModal();
        return;
    }
    
    const selectableQuestions = currentQuestions.filter(q => q.type !== 'passage');
    
    // Clear current selection
    selectedQuestions = [];
    
    // Shuffle and select
    const shuffled = [...selectableQuestions].sort(() => Math.random() - 0.5);
    const toSelect = shuffled.slice(0, Math.min(count, shuffled.length));
    
    selectedQuestions = toSelect.map(q => q.id);
    
    // Update UI
    displayQuestions();
    showToast(`${selectedQuestions.length}টি প্রশ্ন র‍্যান্ডমলি নির্বাচিত।`, 'success');
}

// ========== Select All Questions ==========
function selectAll() {
    if (currentQuestions.length === 0) {
        showToast('প্রথমে প্রশ্ন লোড করুন।', 'warning');
        return;
    }
    
    const isPremium = currentSubject && currentSubject.isPremium && !isLoggedIn();
    if (isPremium) {
        showPremiumModal();
        return;
    }
    
    // Select all except passages
    selectedQuestions = currentQuestions
        .filter(q => q.type !== 'passage')
        .map(q => q.id);
    
    displayQuestions();
    showToast(`${selectedQuestions.length}টি প্রশ্ন নির্বাচিত।`, 'success');
}

// ========== Deselect All Questions ==========
function deselectAll() {
    selectedQuestions = [];
    displayQuestions();
    showToast('সব প্রশ্ন বাদ দেওয়া হয়েছে।', 'info');
}

// ========== Generate Paper HTML ==========
function generatePaperHTML(showAnswers = false) {
    if (selectedQuestions.length === 0) {
        showToast('অন্তত একটি প্রশ্ন নির্বাচন করুন।', 'warning');
        return null;
    }
    
    // Get settings
    const institutionName = document.getElementById('institutionName').value || 'প্রতিষ্ঠানের নাম';
    const examName = document.getElementById('examName').value || 'পরীক্ষার নাম';
    const subjectName = document.getElementById('subjectNameInput').value || 'বিষয়ের নাম';
    const examTime = document.getElementById('examTime').value || '__';
    const fullMarks = document.getElementById('fullMarks').value || '__';
    const instructions = document.getElementById('instructions').value;
    const shuffleQ = document.getElementById('shuffleQuestions').checked;
    const shuffleOpt = document.getElementById('shuffleOptions').checked;
    const showNumbers = document.getElementById('showQuestionNumber').checked;
    
    // Get selected questions
    let questions = currentQuestions.filter(q => selectedQuestions.includes(q.id));
    
    // Also include related passages
    const passageIds = new Set();
    questions.forEach(q => {
        if (q.passageId) passageIds.add(q.passageId);
    });
    
    const passages = currentQuestions.filter(q => q.type === 'passage' && passageIds.has(q.id));
    
    // Shuffle if needed
    if (shuffleQ) {
        questions = questions.sort(() => Math.random() - 0.5);
    }
    
    // Build HTML
    let html = `
        <div class="paper-preview">
            <div class="paper-header">
                <h1>${institutionName}</h1>
                <h2>${examName}</h2>
                <h3>বিষয়: ${subjectName}</h3>
                <div class="paper-info">
                    <span>সময়: ${examTime}</span>
                    <span>পূর্ণমান: ${fullMarks}</span>
                </div>
            </div>
    `;
    
    // Instructions
    if (instructions) {
        html += `
            <div class="paper-instructions">
                <h4>নির্দেশনা:</h4>
                <p>${instructions}</p>
            </div>
        `;
    }
    
    // Start 3-column container
    html += `<div class="paper-questions-container">`;
    
    // Track which passages have been shown
    const shownPassages = new Set();
    let questionNumber = 1;
    
    // Questions
    questions.forEach(q => {
        // Show passage if this is a passage-q and passage not shown yet
        if (q.type === 'passage-q' && q.passageId && !shownPassages.has(q.passageId)) {
            const passage = passages.find(p => p.id === q.passageId);
            if (passage) {
                html += `
                    <div class="paper-passage">
                        <div class="paper-passage-title">📖 অনুচ্ছেদটি পড়ে প্রশ্নের উত্তর দাও:</div>
                        <p>${passage.passage}</p>
                    </div>
                `;
                shownPassages.add(q.passageId);
            }
        }
        
        // Question
        html += `<div class="paper-question">`;
        html += `<span class="paper-question-text">`;
        
        if (showNumbers) {
            html += `<strong>${questionNumber}.</strong> `;
        }
        
        html += q.question;
        html += `</span>`;
        
        // Statements for multiple type
        if (q.type === 'multiple' && q.statements) {
            html += `<div class="paper-question-statements">`;
            q.statements.forEach(s => {
                html += `${s} `;
            });
            html += `</div>`;
        }
        
        // Options
        if (q.options) {
            let options = [...q.options];
            let correctIndex = q.answer;
            
            // Shuffle options if needed
            if (shuffleOpt) {
                const optionsWithIndex = options.map((opt, idx) => ({ opt, isCorrect: idx === q.answer }));
                optionsWithIndex.sort(() => Math.random() - 0.5);
                options = optionsWithIndex.map(o => o.opt);
                correctIndex = optionsWithIndex.findIndex(o => o.isCorrect);
            }
            
            html += `<div class="paper-options">`;
            const letters = ['ক', 'খ', 'গ', 'ঘ'];
            options.forEach((opt, idx) => {
                if (showAnswers && idx === correctIndex) {
                    html += `<span class="paper-option"><strong style="color:green;">✓${letters[idx]}) ${opt}</strong></span>`;
                } else {
                    html += `<span class="paper-option">${letters[idx]}) ${opt}</span>`;
                }
            });
            html += `</div>`;
        }
        
        html += `</div>`;
        questionNumber++;
    });
    
    // Close container
    html += `</div></div>`;
    
    return html;
}

// ========== Preview Paper ==========
function previewPaper() {
    const html = generatePaperHTML(false);
    if (!html) return;
    
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = html;
    
    showPreviewModal();
}

// ========== Show Preview Modal ==========
function showPreviewModal() {
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// ========== Hide Preview Modal ==========
function hidePreviewModal() {
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========== Download PDF ==========
function downloadPDF() {
    if (!isLoggedIn()) {
        showLoginModal();
        showToast('PDF ডাউনলোড করতে লগইন করুন।', 'warning');
        return;
    }
    
    const html = generatePaperHTML(false);
    if (!html) return;
    
    showToast('PDF তৈরি হচ্ছে...', 'info');
    
    const pdfContent = document.getElementById('pdfContent');
    pdfContent.innerHTML = html;
    pdfContent.style.display = 'block';
    
    const opt = {
        margin: 10,
        filename: 'প্রশ্নপত্র.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(pdfContent).save().then(() => {
        pdfContent.style.display = 'none';
        showToast('PDF ডাউনলোড সম্পন্ন! ✅', 'success');
    }).catch(err => {
        console.error('PDF Error:', err);
        pdfContent.style.display = 'none';
        showToast('PDF তৈরিতে সমস্যা হয়েছে।', 'error');
    });
}

// ========== Download Answer Key ==========
function downloadAnswerKey() {
    if (!isLoggedIn()) {
        showLoginModal();
        showToast('উত্তরপত্র ডাউনলোড করতে লগইন করুন।', 'warning');
        return;
    }
    
    const html = generatePaperHTML(true);
    if (!html) return;
    
    showToast('উত্তরপত্র তৈরি হচ্ছে...', 'info');
    
    const pdfContent = document.getElementById('pdfContent');
    pdfContent.innerHTML = html;
    pdfContent.style.display = 'block';
    
    const opt = {
        margin: 10,
        filename: 'উত্তরপত্র.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(pdfContent).save().then(() => {
        pdfContent.style.display = 'none';
        showToast('উত্তরপত্র ডাউনলোড সম্পন্ন! ✅', 'success');
    }).catch(err => {
        console.error('PDF Error:', err);
        pdfContent.style.display = 'none';
                showToast('উত্তরপত্র তৈরিতে সমস্যা হয়েছে।', 'error');
    });
}
