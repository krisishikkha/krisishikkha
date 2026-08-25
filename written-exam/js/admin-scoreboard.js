// written-exam/js/admin-scoreboard.js

let currentScoreboardData = [];
let currentExamTitle = '';
let currentFromDate = '';
let currentToDate = '';
let currentExamInstitute = '';
let currentExamSetName = '';
let currentExamQuestionsCount = 0;
let currentExamTotalMarks = '';
let currentExamDuration = '';

async function checkAdminSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        showDashboard();
    } else {
        document.getElementById('loginScreen').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    }
}

async function handleLogin() {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');
    errorEl.style.display = 'none';

    if (!email || !password) {
        errorEl.textContent = 'Email ও Password দিন।';
        errorEl.style.display = 'block';
        return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        errorEl.textContent = 'ভুল Email অথবা Password।';
        errorEl.style.display = 'block';
        return;
    }

    showDashboard();
}

async function handleLogout() {
    await supabaseClient.auth.signOut();
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    populateExamSelect();
}

function populateExamSelect() {
    const select = document.getElementById('examSelect');
    select.innerHTML = '';
    EXAMS_REGISTRY.forEach(entry => {
        const opt = document.createElement('option');
        opt.value = entry.id;
        opt.textContent = entry.title;
        select.appendChild(opt);
    });
}

async function generateScoreboard() {
    const examId = document.getElementById('examSelect').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const resultEl = document.getElementById('scoreboardResult');
    const pdfBtn = document.getElementById('downloadPdfBtn');

    resultEl.innerHTML = '<p class="we-loading">Loading...</p>';
    pdfBtn.style.display = 'none';

    let query = supabaseClient
        .from(SUBMISSIONS_TABLE)
        .select('*')
        .eq('exam_id', examId)
        .order('obtained_marks', { ascending: false })
        .order('submitted_at', { ascending: true });

    if (fromDate) {
        query = query.gte('submitted_at', `${fromDate}T00:00:00`);
    }
    if (toDate) {
        query = query.lte('submitted_at', `${toDate}T23:59:59`);
    }

    const { data, error } = await query;

    if (error) {
        resultEl.innerHTML = '<p class="we-error">Data লোড করতে সমস্যা হয়েছে।</p>';
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        resultEl.innerHTML = '<p class="we-empty">এই ফিল্টারে কোনো submission পাওয়া যায়নি।</p>';
        return;
    }

    currentScoreboardData = data;

    const examEntry = EXAMS_REGISTRY.find(e => e.id === examId);
    currentExamTitle = examEntry ? examEntry.title : examId;

    const fullExamData = examEntry ? window[examEntry.dataVar] : null;
    currentExamInstitute = fullExamData ? (fullExamData.institute || '') : '';
    currentExamSetName = fullExamData ? (fullExamData.setName || '') : '';
    currentExamQuestionsCount = fullExamData ? fullExamData.questions.length : 0;
    currentExamTotalMarks = fullExamData ? fullExamData.totalMarks : '';
    currentExamDuration = fullExamData ? fullExamData.durationMinutes : '';

    currentFromDate = fromDate || '—';
    currentToDate = toDate || '—';

    renderScoreboardTable(data);
    pdfBtn.style.display = 'inline-block';
}

function renderScoreboardTable(data) {
    const resultEl = document.getElementById('scoreboardResult');

    let rows = data.map((row, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${row.student_name}</td>
            <td>${row.correct}</td>
            <td>${row.wrong}</td>
            <td>${row.skipped}</td>
            <td>${row.obtained_marks}/${row.total_marks}</td>
            <td>${row.percentage}%</td>
        </tr>
    `).join('');

    resultEl.innerHTML = `
        <p class="we-total-participants">Total Participants: ${data.length}</p>
        <table class="we-scoreboard-table">
            <thead>
                <tr>
                    <th>Rank</th><th>Name</th><th>Correct</th><th>Wrong</th>
                    <th>Not Answered</th><th>Marks</th><th>%</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

async function downloadScoreboardPdf() {
    const btn = document.getElementById('downloadPdfBtn');
    btn.disabled = true;
    btn.textContent = 'Generating...';

    const rowsHtml = currentScoreboardData.map((row, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${row.student_name}</td>
            <td>${row.correct}</td>
            <td>${row.wrong}</td>
            <td>${row.skipped}</td>
            <td>${row.obtained_marks}/${row.total_marks}</td>
            <td>${row.percentage}%</td>
        </tr>
    `).join('');

    const renderArea = document.createElement('div');
    renderArea.className = 'we-pdf-render-area';
    renderArea.innerHTML = `
        <div style="text-align:center;border-bottom:2px solid #16a34a;padding-bottom:8px;margin-bottom:10px;">
            <h2 style="margin:0;">Research Institute Job Preparation</h2>
            <p style="margin:2px 0;font-size:12px;">www.krisishikkha.com</p>
        </div>
        <h2 style="text-align:center;margin:6px 0;">WRITTEN EXAM SCOREBOARD</h2>
        <table style="width:100%;border:none;margin-bottom:14px;">
            <tr><td style="border:none;padding:2px 0;"><strong>Institute</strong></td><td style="border:none;">: ${currentExamInstitute}</td></tr>
            <tr><td style="border:none;padding:2px 0;"><strong>Exam</strong></td><td style="border:none;">: ${currentExamTitle}</td></tr>
            <tr><td style="border:none;padding:2px 0;"><strong>Set</strong></td><td style="border:none;">: ${currentExamSetName}</td></tr>
            <tr><td style="border:none;padding:2px 0;"><strong>Questions</strong></td><td style="border:none;">: ${currentExamQuestionsCount}   Marks: ${currentExamTotalMarks}   Time: ${currentExamDuration}m</td></tr>
            <tr><td style="border:none;padding:2px 0;"><strong>From – To</strong></td><td style="border:none;">: ${currentFromDate} to ${currentToDate}</td></tr>
            <tr><td style="border:none;padding:2px 0;"><strong>Participants</strong></td><td style="border:none;">: ${currentScoreboardData.length}</td></tr>
        </table>
        <table>
            <thead><tr><th>Rank</th><th>Name</th><th>Correct</th><th>Wrong</th><th>Not Ans.</th><th>Marks</th><th>%</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
        </table>
    `;
    document.body.appendChild(renderArea);

    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }

    try {
        const canvas = await html2canvas(renderArea, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        await canvasToMultiPagePdf(canvas, doc);
        doc.save(`${currentExamTitle.replace(/\s+/g, '_')}_scoreboard.pdf`);
    } catch (err) {
        console.error(err);
        alert('PDF তৈরি করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।');
    } finally {
        document.body.removeChild(renderArea);
        btn.disabled = false;
        btn.textContent = 'Download Scoreboard PDF';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadExamDataFiles(() => {
        checkAdminSession();
        document.getElementById('loginBtn').addEventListener('click', handleLogin);
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
        document.getElementById('generateBtn').addEventListener('click', generateScoreboard);
        document.getElementById('downloadPdfBtn').addEventListener('click', downloadScoreboardPdf);
    });
});