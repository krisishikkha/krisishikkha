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
    const subjectSelect = document.getElementById('subjectSelect');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', handleSubjectChange);
    }
    
    const loadBtn = document.getElementById('loadQuestionsBtn');
    if (loadBtn) {
        loadBtn.addEventListener('click', loadQuestions);
    }
    
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
    
    currentSubject = subjectsData.subjects.find(s => s.id === subjectId);
    
    const subjectNameInput = document.getElementById('subjectNameInput');
    if (subjectNameInput && currentSubject) {
        subjectNameInput.value = currentSubject.nameBn;
    }
    
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
    
    const selectAllDiv = document.createElement('div');
    selectAllDiv.className = 'chapter-item';
    selectAllDiv.innerHTML = `
        <input type="checkbox" id="selectAllChapters" onchange="toggleAllChapters(this)">
        <label for="selectAllChapters"><strong>সব অধ্যায় নির্বাচন</strong></label>
    `;
    chapterList.appendChild(selectAllDiv);
    
    currentChapters.forEach(chapter => {
        if (!chapter.isVisible) return;
        
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
        for (const chapterId of selectedChapters) {
            const response = await fetch(`data/${currentSubject.id}/${chapterId}.json`);
            const data = await response.json();
            
            if (data.questions) {
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
    
    currentQuestions.forEach((q, index) => {
        if (q.type === 'passage') {
            const passageDiv = document.createElement('div');
            passageDiv.className = 'question-item passage-block';
            passageDiv.innerHTML = `
                <div class="passage-text">
                    <strong>📖 অনুচ্ছেদ:</strong><br>
                    ${q.passage}
                </div>
            `;
            questionsList.appendChild(passageDiv);
            return;
        }
        
        const isPremium = currentSubject && currentSubject.isPremium && !isLoggedIn();
        const isSelected = selectedQuestions.includes(q.id);
        
        const div = document.createElement('div');
        div.className = `question-item ${isSelected ? 'selected' : ''} ${isPremium ? 'premium' : ''}`;
        div.setAttribute('data-id', q.id);
        div.onclick = () => toggleQuestion(q.id, isPremium);
        
        let html = `
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
        
        if (q.type === 'multiple' && q.statements) {
            html += '<div class="question-statements">';
            q.statements.forEach(s => {
                html += `<p>${s}</p>`;
            });
            html += '<p><em>নিচের কোনটি সঠিক?</em></p></div>';
        }
        
        div.innerHTML = html;
        questionsList.appendChild(div);
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
    
    const isPremium = currentSubject && currentSubject.isPremium && !isLoggedIn();
    if (isPremium) {
        showPremiumModal();
        return;
    }
    
    const selectableQuestions = currentQuestions.filter(q => q.type !== 'passage');
    
    selectedQuestions = [];
    
    const shuffled = [...selectableQuestions].sort(() => Math.random() - 0.5);
    const toSelect = shuffled.slice(0, Math.min(count, shuffled.length));
    
    selectedQuestions = toSelect.map(q => q.id);
    
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
        return null;
    }
    
    const institutionName = document.getElementById('institutionName').value || 'প্রতিষ্ঠানের নাম';
    const examName = document.getElementById('examName').value || 'পরীক্ষার নাম';
    const subjectName = document.getElementById('subjectNameInput').value || 'বিষয়ের নাম';
    const examTime = document.getElementById('examTime').value || '__';
    const fullMarks = document.getElementById('fullMarks').value || '__';
    const instructions = document.getElementById('instructions').value;
    const shuffleQ = document.getElementById('shuffleQuestions').checked;
    const shuffleOpt = document.getElementById('shuffleOptions').checked;
    const showNumbers = document.getElementById('showQuestionNumber').checked;
    
    let questions = currentQuestions.filter(q => selectedQuestions.includes(q.id) && q.type !== 'passage');
    
    const passageIds = new Set();
    questions.forEach(q => {
        if (q.passageId) passageIds.add(q.passageId);
    });
    
    const passages = currentQuestions.filter(q => q.type === 'passage' && passageIds.has(q.id));
    
    if (shuffleQ) {
        questions = questions.sort(() => Math.random() - 0.5);
    }
    
    let html = `
        <div style="padding:5px;font-family:'Hind Siliguri',Arial,sans-serif;font-size:9px;line-height:1.25;color:#000;">
            <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:8px;">
                <div style="font-size:13px;font-weight:bold;margin-bottom:2px;">${institutionName}</div>
                <div style="font-size:11px;margin-bottom:2px;">${examName}</div>
                <div style="font-size:10px;margin-bottom:4px;">বিষয়: ${subjectName}</div>
                <div style="display:flex;justify-content:space-between;font-size:9px;">
                    <span>সময়: ${examTime}</span>
                    <span>পূর্ণমান: ${fullMarks}</span>
                </div>
            </div>
    `;
    
    if (instructions) {
        html += `<div style="background:#f5f5f5;padding:3px 6px;margin-bottom:6px;border-left:2px solid #000;font-size:8px;"><strong>নির্দেশনা:</strong> ${instructions}</div>`;
    }
    
    html += `<div style="column-count:3;column-gap:8px;">`;
    
    const shownPassages = new Set();
    let questionNumber = 1;
    
    questions.forEach(q => {
        if (q.type === 'passage-q' && q.passageId && !shownPassages.has(q.passageId)) {
            const passage = passages.find(p => p.id === q.passageId);
            if (passage) {
                html += `<div style="font-style:italic;padding:4px 0;margin-bottom:4px;font-size:8px;break-inside:avoid;"><strong>অনুচ্ছেদ:</strong> ${passage.passage}</div>`;
                shownPassages.add(q.passageId);
            }
        }
        
        html += `<div style="margin-bottom:5px;break-inside:avoid;">`;
        html += `<div style="margin-bottom:1px;font-size:9px;">`;
        if (showNumbers) html += `<strong>${questionNumber}.</strong> `;
        html += `${q.question}</div>`;
        
        if (q.type === 'multiple' && q.statements) {
            html += `<div style="padding-left:6px;font-size:8px;margin-bottom:1px;">`;
            q.statements.forEach(s => html += `${s} `);
            html += `</div>`;
        }
        
        if (q.options) {
            let options = [...q.options];
            let correctIndex = q.answer;
            
            if (shuffleOpt) {
                const optionsWithIndex = options.map((opt, idx) => ({ opt, isCorrect: idx === q.answer }));
                optionsWithIndex.sort(() => Math.random() - 0.5);
                options = optionsWithIndex.map(o => o.opt);
                correctIndex = optionsWithIndex.findIndex(o => o.isCorrect);
            }
            
            html += `<div style="padding-left:4px;font-size:8px;">`;
            const letters = ['ক', 'খ', 'গ', 'ঘ'];
            options.forEach((opt, idx) => {
                if (showAnswers && idx === correctIndex) {
                    html += `<span style="color:green;font-weight:bold;margin-right:5px;">✓${letters[idx]}) ${opt}</span>`;
                } else {
                    html += `<span style="margin-right:5px;">${letters[idx]}) ${opt}</span>`;
                }
            });
            html += `</div>`;
        }
        
        html += `</div>`;
        questionNumber++;
    });
    
    html += `</div></div>`;
    return html;
}

// ========== Preview Paper ==========
function previewPaper() {
    const html = generatePaperHTML(false);
    if (!html) {
        showToast('অন্তত একটি প্রশ্ন নির্বাচন করুন।', 'warning');
        return;
    }
    
    document.getElementById('previewContent').innerHTML = html;
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


 // ========== Download PDF (Updated with jsPDF) ==========
function downloadPDF() {
    if (!isLoggedIn()) {
        showLoginModal();
        showToast('PDF ডাউনলোড করতে লগইন করুন।', 'warning');
        return;
    }
    
    const html = generatePaperHTML(false);
    if (!html) {
        showToast('অন্তত একটি প্রশ্ন নির্বাচন করুন।', 'warning');
        return;
    }
    
    showToast('PDF তৈরি হচ্ছে... অপেক্ষা করুন', 'info');
    
    // Create temp container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm';
    container.style.background = 'white';
    container.innerHTML = html;
    document.body.appendChild(container);
    
    // Wait and generate
    setTimeout(() => {
        html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: 794,
            windowHeight: 1123
        }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            pdf.save('প্রশ্নপত্র.pdf');
            document.body.removeChild(container);
            showToast('PDF ডাউনলোড সম্পন্ন! ✅', 'success');
        }).catch(err => {
            console.error('Error:', err);
            document.body.removeChild(container);
            showToast('PDF তৈরিতে সমস্যা হয়েছে।', 'error');
        });
    }, 500);
}

// ========== Download Answer Key (Updated with jsPDF) ==========
function downloadAnswerKey() {
    if (!isLoggedIn()) {
        showLoginModal();
        showToast('উত্তরপত্র ডাউনলোড করতে লগইন করুন।', 'warning');
        return;
    }
    
    const html = generatePaperHTML(true);
    if (!html) {
        showToast('অন্তত একটি প্রশ্ন নির্বাচন করুন।', 'warning');
        return;
    }
    
    showToast('উত্তরপত্র তৈরি হচ্ছে... অপেক্ষা করুন', 'info');
    
    // Create temp container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm';
    container.style.background = 'white';
    container.innerHTML = html;
    document.body.appendChild(container);
    
    // Wait and generate
    setTimeout(() => {
        html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: 794,
            windowHeight: 1123
        }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            pdf.save('উত্তরপত্র.pdf');
            document.body.removeChild(container);
            showToast('উত্তরপত্র ডাউনলোড সম্পন্ন! ✅', 'success');
        }).catch(err => {
            console.error('Error:', err);
            document.body.removeChild(container);
            showToast('উত্তরপত্র তৈরিতে সমস্যা হয়েছে।', 'error');
        });
    }, 500);
}
