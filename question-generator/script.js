let subjectsData = null;
let currentChapters = null;
let allQuestions = [];
let filteredQuestions = [];
let selectedQuestions = [];
let currentSubject = null;
let currentPage = 1;
const questionsPerPageView = 30;

document.addEventListener('DOMContentLoaded', function() {
    loadSubjects();
    setupEventListeners();
});

function setupEventListeners() {
    const subjectSelect = document.getElementById('subjectSelect');
    if (subjectSelect) subjectSelect.addEventListener('change', handleSubjectChange);
    
    const chapterSelect = document.getElementById('chapterSelect');
    if (chapterSelect) chapterSelect.addEventListener('change', handleChapterChange);
    
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

function populateSubjectDropdown() {
    const select = document.getElementById('subjectSelect');
    if (!select || !subjectsData) return;
    
    select.innerHTML = '<option value="">বিষয় নির্বাচন করুন</option>';
    
    subjectsData.subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.id;
        option.textContent = `${subject.icon} ${subject.nameBn}`;
        if (subject.isPremium) option.textContent += ' 👑';
        select.appendChild(option);
    });
}

async function handleSubjectChange() {
    const subjectId = document.getElementById('subjectSelect').value;
    const chapterSelect = document.getElementById('chapterSelect');
    
    currentChapters = null;
    allQuestions = [];
    filteredQuestions = [];
    selectedQuestions = [];
    currentPage = 1;
    
    document.getElementById('questionsList').innerHTML = '<p class="placeholder">অধ্যায় লোড হচ্ছে...</p>';
    updateSelectedCount();
    hideReviewButton();
    
    if (!subjectId) {
        chapterSelect.innerHTML = '<option value="">সব অধ্যায়</option>';
        chapterSelect.disabled = true;
        currentSubject = null;
        document.getElementById('questionsList').innerHTML = '<p class="placeholder">বিষয় নির্বাচন করুন</p>';
        return;
    }
    
    currentSubject = subjectsData.subjects.find(s => s.id === subjectId);
    
    const subjectNameInput = document.getElementById('subjectNameInput');
    if (subjectNameInput && currentSubject) {
        subjectNameInput.value = currentSubject.nameBn;
    }
    
    try {
        const response = await fetch(`data/${subjectId}/chapters.json`);
        const data = await response.json();
        currentChapters = data.chapters;
        
        chapterSelect.innerHTML = '<option value="">সব অধ্যায়</option>';
        currentChapters.forEach(chapter => {
            if (!chapter.isVisible) return;
            const option = document.createElement('option');
            option.value = chapter.id;
            option.textContent = chapter.nameBn;
            chapterSelect.appendChild(option);
        });
        
        chapterSelect.disabled = false;
        await loadAllQuestions(subjectId);
        
    } catch (error) {
        console.error('Error loading chapters:', error);
        document.getElementById('questionsList').innerHTML = '<p class="placeholder">অধ্যায় লোড করতে সমস্যা হয়েছে।</p>';
        chapterSelect.disabled = true;
    }
}

async function loadAllQuestions(subjectId) {
    document.getElementById('questionsList').innerHTML = '<div class="loading"></div>';
    allQuestions = [];
    
    try {
        for (const chapter of currentChapters) {
            if (!chapter.isVisible) continue;
            const response = await fetch(`data/${subjectId}/${chapter.id}.json`);
            const data = await response.json();
            if (data.questions) {
                data.questions.forEach(q => {
                    q.chapterId = chapter.id;
                    q.chapterName = chapter.nameBn;
                });
                allQuestions = allQuestions.concat(data.questions);
            }
        }
        filteredQuestions = allQuestions.filter(q => q.type !== 'passage');
        currentPage = 1;
        displayQuestions();
        showToast(`${filteredQuestions.length}টি প্রশ্ন লোড হয়েছে।`, 'success');
    } catch (error) {
        console.error('Error loading questions:', error);
        document.getElementById('questionsList').innerHTML = '<p class="placeholder">প্রশ্ন লোড করতে সমস্যা হয়েছে।</p>';
        showToast('প্রশ্ন লোড করতে সমস্যা হয়েছে।', 'error');
    }
}

function handleChapterChange() {
    const chapterId = document.getElementById('chapterSelect').value;
    if (!chapterId) {
        filteredQuestions = allQuestions.filter(q => q.type !== 'passage');
    } else {
        filteredQuestions = allQuestions.filter(q => q.chapterId === chapterId && q.type !== 'passage');
    }
    currentPage = 1;
    displayQuestions();
}
function displayQuestions() {
    const container = document.getElementById('questionsList');
    if (filteredQuestions.length === 0) {
        container.innerHTML = '<p class="placeholder">কোনো প্রশ্ন পাওয়া যায়নি।</p>';
        hidePagination();
        return;
    }
    
    const startIndex = (currentPage - 1) * questionsPerPageView;
    const endIndex = startIndex + questionsPerPageView;
    const questionsToShow = filteredQuestions.slice(startIndex, endIndex);
    
    container.innerHTML = '';
    
    questionsToShow.forEach((q, index) => {
        const globalIndex = startIndex + index;
        const isPremium = currentSubject && currentSubject.isPremium && !isLoggedIn();
        const isSelected = selectedQuestions.includes(q.id);
        
        const card = document.createElement('div');
        card.className = `question-card ${isSelected ? 'selected' : ''} ${isPremium ? 'premium' : ''}`;
        card.setAttribute('data-id', q.id);
        card.onclick = () => toggleQuestion(q.id, isPremium);
        
        let html = `
            <div class="question-header">
                <input type="checkbox" ${isSelected ? 'checked' : ''} ${isPremium ? 'disabled' : ''}
                       onclick="event.stopPropagation(); toggleQuestion('${q.id}', ${isPremium})">
                <div class="question-text">
                    <strong>${globalIndex + 1}.</strong> ${q.question}
                    ${isPremium ? '<span class="premium-badge">Premium</span>' : ''}
                </div>
            </div>
        `;
        
        if (q.options && q.options.length > 0) {
            html += '<div class="question-options">';
            const letters = ['ক', 'খ', 'গ', 'ঘ'];
            q.options.forEach((opt, i) => {
                html += `${letters[i]}) ${opt} `;
            });
            html += '</div>';
        }
        
        card.innerHTML = html;
        container.appendChild(card);
    });
    
    updatePagination();
    updateSelectedCount();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPageView);
    if (totalPages <= 1) {
        hidePagination();
        return;
    }
    
    const container = document.getElementById('paginationContainer');
    const pageNumbers = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    container.style.display = 'flex';
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    pageNumbers.innerHTML = '';
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('div');
        btn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => goToPage(i);
        pageNumbers.appendChild(btn);
    }
}

function hidePagination() {
    document.getElementById('paginationContainer').style.display = 'none';
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayQuestions();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPageView);
    if (currentPage < totalPages) {
        currentPage++;
        displayQuestions();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function goToPage(page) {
    currentPage = page;
    displayQuestions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
          }
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
    
    const item = document.querySelector(`.question-card[data-id="${questionId}"]`);
    if (item) {
        item.classList.toggle('selected');
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = selectedQuestions.includes(questionId);
    }
    
    updateSelectedCount();
    if (selectedQuestions.length > 0) {
        showReviewButton();
    } else {
        hideReviewButton();
    }
}

function updateSelectedCount() {
    const countEl = document.getElementById('selectedCount');
    if (countEl) countEl.textContent = selectedQuestions.length.toString();
}

function showReviewButton() {
    document.getElementById('reviewBtnContainer').style.display = 'block';
}

function hideReviewButton() {
    document.getElementById('reviewBtnContainer').style.display = 'none';
}

function goToReview() {
    if (selectedQuestions.length === 0) {
        showToast('অন্তত একটি প্রশ্ন নির্বাচন করুন।', 'warning');
        return;
    }
    document.getElementById('questionSelectionPage').style.display = 'none';
    document.getElementById('reviewPanel').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updatePreview();
}

function backToQuestions() {
    document.getElementById('reviewPanel').style.display = 'none';
    document.getElementById('questionSelectionPage').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
                     }
function generatePaperHTML(showAnswers = false, isPreview = false) {
    if (selectedQuestions.length === 0) return null;
    
    const institutionName = document.getElementById('institutionName').value || 'প্রতিষ্ঠানের নাম';
    const examName = document.getElementById('examName').value || 'পরীক্ষার নাম';
    const subjectName = document.getElementById('subjectNameInput').value || 'বিষয়ের নাম';
    const subjectCode = document.getElementById('subjectCode').value || '';
    const examTime = document.getElementById('examTime').value || '__';
    const instructions = document.getElementById('instructions').value;
    const headerFont = document.getElementById('headerFontSize')?.value || '22';
    const qFont = document.getElementById('questionFontSize')?.value || '17';
    const oFont = document.getElementById('optionFontSize')?.value || '17';
    const qPerPage = parseInt(document.getElementById('questionsPerPage')?.value || '20');
    const firstPageCols = document.querySelector('input[name="firstPageColumns"]:checked')?.value || '3';
    const otherPagesCols = document.querySelector('input[name="otherPagesColumns"]:checked')?.value || '3';
    const colGap = document.getElementById('columnGap')?.value || '5';
    
    let questions = allQuestions.filter(q => selectedQuestions.includes(q.id) && q.type !== 'passage');
    
    const totalPages = Math.ceil(questions.length / qPerPage);
    let allPagesHTML = '';
    
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        const startIdx = pageNum * qPerPage;
        const endIdx = Math.min(startIdx + qPerPage, questions.length);
        const pageQuestions = questions.slice(startIdx, endIdx);
        const isFirstPage = pageNum === 0;
        const cols = isFirstPage ? firstPageCols : otherPagesCols;
        
        let pageHTML = `<div class="pdf-page" style="padding:5mm;font-family:'Hind Siliguri',Arial,sans-serif;font-size:${qFont}px;line-height:1.45;color:#000;page-break-after:always;min-height:287mm;">`;
        
        if (isFirstPage) {
            pageHTML += `
                <div style="text-align:center;border-bottom:2.5px solid #000;padding-bottom:8px;margin-bottom:10px;">
                    <div style="font-size:${headerFont}px;font-weight:bold;margin-bottom:3px;">${institutionName}</div>
                    <div style="font-size:${parseInt(headerFont)-2}px;margin-bottom:3px;">${examName}</div>
                    <div style="font-size:${parseInt(headerFont)-3}px;margin-bottom:5px;">বিষয়: ${subjectName} ${subjectCode ? `(কোড: ${subjectCode})` : ''}</div>
                    <div style="display:flex;justify-content:space-between;font-size:${parseInt(headerFont)-4}px;">
                        <span>সময়: ${examTime}</span>
                        <span>পূর্ণমান: ${questions.length}</span>
                    </div>
                </div>
            `;
            if (instructions) {
                pageHTML += `<div style="background:#f8f8f8;padding:5px 8px;margin-bottom:10px;border-left:3px solid #333;font-size:12px;"><strong>নির্দেশনা:</strong> ${instructions}</div>`;
            }
        }
        
        pageHTML += generateColumns(pageQuestions, startIdx, cols, colGap, qFont, oFont, showAnswers);
        pageHTML += `</div>`;
        allPagesHTML += pageHTML;
    }
    
    return `<div style="background:white;">${allPagesHTML}</div>`;
}

function generateColumns(questions, startNum, cols, gap, qFont, oFont, showAns) {
    const qPerCol = Math.ceil(questions.length / parseInt(cols));
    let html = '<table style="width:100%;border-collapse:collapse;table-layout:fixed;"><tr>';
    
    for (let c = 0; c < parseInt(cols); c++) {
        const colStart = c * qPerCol;
        const colEnd = Math.min(colStart + qPerCol, questions.length);
        const colQuestions = questions.slice(colStart, colEnd);
        
        html += `<td style="width:${100/parseInt(cols)}%;vertical-align:top;padding:0 ${gap}px;${c < parseInt(cols)-1 ? 'border-right:1px solid #ccc;' : ''}">`;
        colQuestions.forEach((q, idx) => {
            const qNum = startNum + colStart + idx + 1;
            html += formatQuestion(q, qNum, qFont, oFont, showAns);
        });
        html += '</td>';
    }
    
    html += '</tr></table>';
    return html;
}

function formatQuestion(q, num, qFont, oFont, showAns) {
    let html = `<div style="margin-bottom:8px;break-inside:avoid;"><div style="margin-bottom:3px;font-size:${qFont}px;font-weight:500;"><strong>${num}.</strong> ${q.question}</div>`;
    
    if (q.type === 'multiple' && q.statements) {
        html += `<div style="padding-left:6px;font-size:${oFont}px;margin-bottom:2px;">`;
        q.statements.forEach(s => html += `${s}<br>`);
        html += `</div>`;
    }
    
    if (q.options) {
        html += `<div style="padding-left:6px;font-size:${oFont}px;line-height:1.35;">`;
        const letters = ['ক', 'খ', 'গ', 'ঘ'];
        q.options.forEach((opt, idx) => {
            if (showAns && idx === q.answer) {
                html += `<span style="color:green;font-weight:bold;margin-right:8px;display:inline-block;">✓${letters[idx]}) ${opt}</span>`;
            } else {
                html += `<span style="margin-right:8px;display:inline-block;">${letters[idx]}) ${opt}</span>`;
            }
        });
        html += `</div>`;
    }
    
    html += `</div>`;
    return html;
}
function updatePreview() {
    const html = generatePaperHTML(false, true);
    if (!html) {
        showToast('প্রশ্ন জেনারেট করতে সমস্যা।', 'error');
        return;
    }
    document.getElementById('livePreview').innerHTML = html;
    showToast('প্রিভিউ আপডেট হয়েছে!', 'success');
}

function downloadPDF() {
    if (!isLoggedIn()) {
        showLoginModal();
        showToast('PDF ডাউনলোড করতে লগইন করুন।', 'warning');
        return;
    }
    
    const html = generatePaperHTML(false, false);
    if (!html) {
        showToast('প্রশ্ন নির্বাচন করুন।', 'warning');
        return;
    }
    
    showToast('PDF তৈরি হচ্ছে... অপেক্ষা করুন', 'info');
    
    const element = document.createElement('div');
    element.innerHTML = html;
    
    const opt = {
        margin: [5, 5, 5, 5],
        filename: 'প্রশ্নপত্র.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
        showToast('PDF ডাউনলোড সম্পন্ন! ✅', 'success');
    }).catch(err => {
        console.error('PDF Error:', err);
        showToast('PDF তৈরিতে সমস্যা।', 'error');
    });
}

function downloadAnswerKey() {
    if (!isLoggedIn()) {
        showLoginModal();
        showToast('উত্তরপত্র ডাউনলোড করতে লগইন করুন।', 'warning');
        return;
    }
    
    const html = generatePaperHTML(true, false);
    if (!html) {
        showToast('প্রশ্ন নির্বাচন করুন।', 'warning');
        return;
    }
    
    showToast('উত্তরপত্র তৈরি হচ্ছে... অপেক্ষা করুন', 'info');
    
    const element = document.createElement('div');
    element.innerHTML = html;
    
    const opt = {
        margin: [5, 5, 5, 5],
        filename: 'উত্তরপত্র.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
        showToast('উত্তরপত্র ডাউনলোড সম্পন্ন! ✅', 'success');
    }).catch(err => {
        console.error('PDF Error:', err);
        showToast('উত্তরপত্র তৈরিতে সমস্যা।', 'error');
    });
}

function hidePreviewModal() {
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function hidePremiumModal() {
    document.getElementById('premiumModal').classList.remove('active');
    document.body.style.overflow = '';
}

function showPremiumModal() {
    document.getElementById('premiumModal').classList.add('active');
    document.body.style.overflow = 'hidden';
          }
