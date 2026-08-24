// Admin Scoreboard Controller
class AdminScoreboardController {
    constructor() {
        this.isLoggedIn = false;
        this.scoreboardData = [];
        this.filteredData = [];
        this.init();
    }

    init() {
        this.setupLoginForm();
    }

    setupLoginForm() {
        document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;

            if (password === APP_CONFIG.adminAccessCode) {
                this.isLoggedIn = true;
                this.showAdminPanel();
            } else {
                alert('Invalid admin access code!');
            }
        });
    }

    showAdminPanel() {
        document.getElementById('adminLogin').classList.remove('active');
        document.getElementById('adminPanel').style.display = 'block';

        this.populateExamFilter();
        this.setupAdminEventListeners();
        this.loadScoreboard();
    }

    populateExamFilter() {
        const select = document.getElementById('examFilter');
        
        EXAMS_REGISTRY.forEach(exam => {
            const option = document.createElement('option');
            option.value = exam.id;
            option.textContent = exam.name;
            select.appendChild(option);
        });
    }

    setupAdminEventListeners() {
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        document.getElementById('filterBtn').addEventListener('click', () => {
            this.filterScoreboard();
        });

        document.getElementById('downloadPdfBtn').addEventListener('click', () => {
            this.downloadPDF();
        });

        // Set default dates
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        document.getElementById('fromDate').valueAsDate = lastWeek;
        document.getElementById('toDate').valueAsDate = today;
    }

    logout() {
        this.isLoggedIn = false;
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('adminLogin').classList.add('active');
        document.getElementById('adminPassword').value = '';
    }

    async loadScoreboard() {
        try {
            const { data, error } = await supabase
                .from('written_exam_submission')
                .select('*')
                .order('percentage', { ascending: false });

            if (error) throw error;

            this.scoreboardData = data || [];
            this.filteredData = this.scoreboardData;
            this.displayScoreboard();

        } catch (error) {
            console.error('Error loading scoreboard:', error);
            alert('Error loading scoreboard data');
        }
    }

    filterScoreboard() {
        const examId = document.getElementById('examFilter').value;
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;

        this.filteredData = this.scoreboardData.filter(item => {
            let matches = true;

            // Filter by exam
            if (examId && item.exam_id !== examId) {
                matches = false;
            }

            // Filter by date range
            if (fromDate || toDate) {
                const submittedDate = new Date(item.submitted_at).toISOString().split('T')[0];
                
                if (fromDate && submittedDate < fromDate) {
                    matches = false;
                }
                if (toDate && submittedDate > toDate) {
                    matches = false;
                }
            }

            return matches;
        });

        // Sort by percentage (descending)
        this.filteredData.sort((a, b) => b.percentage - a.percentage);

        this.displayScoreboard();
    }

    displayScoreboard() {
        const tbody = document.getElementById('scoreboardBody');
        document.getElementById('totalParticipants').textContent = this.filteredData.length;

        if (this.filteredData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align: center; padding: 40px;">
                        No data found for selected filters
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredData.map((item, index) => {
            const rank = index + 1;
            const rankBadge = this.getRankBadge(rank);
            const date = new Date(item.submitted_at).toLocaleString();

            return `
                <tr>
                    <td>${rankBadge}</td>
                    <td><strong>${item.student_name}</strong></td>
                    <td>${item.exam_name}</td>
                    <td style="color: #10B981; font-weight: 600;">${item.correct}</td>
                    <td style="color: #EF4444; font-weight: 600;">${item.wrong}</td>
                    <td style="color: #F59E0B; font-weight: 600;">${item.skipped}</td>
                    <td>${item.total_marks}</td>
                    <td><strong>${item.obtained_marks}</strong></td>
                    <td>
                        <span style="background: ${this.getPercentageColor(item.percentage)}22; 
                                     color: ${this.getPercentageColor(item.percentage)}; 
                                     padding: 5px 10px; 
                                     border-radius: 12px;
                                     font-weight: 600;">
                            ${item.percentage}%
                        </span>
                    </td>
                    <td style="font-size: 13px;">${date}</td>
                </tr>
            `;
        }).join('');
    }

    getRankBadge(rank) {
        let badgeClass = 'normal';
        let emoji = '';

        if (rank === 1) {
            badgeClass = 'gold';
            emoji = '🥇';
        } else if (rank === 2) {
            badgeClass = 'silver';
            emoji = '🥈';
        } else if (rank === 3) {
            badgeClass = 'bronze';
            emoji = '🥉';
        }

        return `<span class="rank-badge ${badgeClass}">${emoji || rank}</span>`;
    }

    getPercentageColor(percentage) {
        if (percentage >= 80) return '#10B981';
        if (percentage >= 60) return '#3B82F6';
        if (percentage >= 40) return '#F59E0B';
        return '#EF4444';
    }

    downloadPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Get filter values
        const examFilter = document.getElementById('examFilter');
        const examName = examFilter.options[examFilter.selectedIndex].text;
        const fromDate = document.getElementById('fromDate').value || 'All';
        const toDate = document.getElementById('toDate').value || 'All';

        // Add header
        doc.setFontSize(20);
        doc.setTextColor(79, 70, 229);
        doc.text(APP_CONFIG.brandName, 105, 15, { align: 'center' });

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Exam Scoreboard', 105, 25, { align: 'center' });

        // Add exam info
        doc.setFontSize(11);
        doc.text(`Exam: ${examName}`, 14, 35);
        doc.text(`From: ${fromDate}`, 14, 42);
        doc.text(`To: ${toDate}`, 14, 49);
        doc.text(`Total Participants: ${this.filteredData.length}`, 14, 56);

        // Prepare table data
        const tableData = this.filteredData.map((item, index) => [
            index + 1,
            item.student_name,
            item.exam_name,
            item.correct,
            item.wrong,
            item.skipped,
            item.total_marks,
            item.obtained_marks,
            item.percentage + '%'
        ]);

        // Add table
        doc.autoTable({
            head: [['Rank', 'Student Name', 'Exam', 'Correct', 'Wrong', 'Not Answered', 'Total', 'Obtained', 'Percentage']],
            body: tableData,
            startY: 65,
            theme: 'grid',
            headStyles: {
                fillColor: [79, 70, 229],
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [243, 244, 246]
            },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center' },
                3: { textColor: [16, 185, 129], fontStyle: 'bold' },
                4: { textColor: [239, 68, 68], fontStyle: 'bold' },
                5: { textColor: [245, 158, 11], fontStyle: 'bold' },
                7: { fontStyle: 'bold' },
                8: { fontStyle: 'bold', halign: 'center' }
            }
        });

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.setTextColor(128, 128, 128);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                `Generated on ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
                105,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        // Save PDF
        const fileName = `Scoreboard_${examName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AdminScoreboardController();
});