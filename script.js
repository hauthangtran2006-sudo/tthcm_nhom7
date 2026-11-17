/**
 * SCRIPT.JS - TƯ TƯỞNG HỒ CHÍ MINH VỀ CON NGƯỜI & KHÁT VỌNG TUỔI TRẺ
 * Handles: Theme toggle, Progress indicator, Audio Quotes (Web Speech API),
 * Checklist with localStorage, Search modal, and Interactive Quiz.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollProgress();
    initMobileMenu();
    initActiveNav();
    initChecklist();
    initQuiz();
    initSearch();
    initMindmapModal();
});

/* ==========================================================================
   1. THEME SWITCHER (Nền Đỏ / Nền Kem / Nền Tối)
   ========================================================================== */
function initTheme() {
    const themeCycleBtn = document.getElementById('themeCycleBtn');
    const themeLabel = document.getElementById('themeLabel');
    const savedTheme = localStorage.getItem('site-theme') || 'red';

    applyTheme(savedTheme);

    if (themeCycleBtn) {
        themeCycleBtn.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('site-theme') || 'red';
            let nextTheme = 'red';
            if (currentTheme === 'red') nextTheme = 'cream';
            else if (currentTheme === 'cream') nextTheme = 'dark';
            else nextTheme = 'red';

            applyTheme(nextTheme);
            localStorage.setItem('site-theme', nextTheme);

            if (nextTheme === 'red') showToast('Đã chọn: Nền Đỏ Truyền Thống');
            else if (nextTheme === 'cream') showToast('Đã chọn: Nền Kem Slide');
            else showToast('Đã chọn: Nền Tối Sang Trọng');
        });
    }

    function applyTheme(theme) {
        document.body.classList.remove('theme-red', 'theme-cream', 'dark');
        document.documentElement.classList.remove('dark');

        if (theme === 'cream') {
            document.body.classList.add('theme-cream');
            if (themeLabel) themeLabel.textContent = 'Nền Kem';
        } else if (theme === 'dark') {
            document.body.classList.add('dark');
            document.documentElement.classList.add('dark');
            if (themeLabel) themeLabel.textContent = 'Nền Tối';
        } else {
            // Default: red
            document.body.classList.add('theme-red');
            if (themeLabel) themeLabel.textContent = 'Nền Đỏ';
        }
    }
}

/* ==========================================================================
   2. SCROLL PROGRESS BAR & STICKY HEADER
   ========================================================================== */
function initScrollProgress() {
    const scrollBar = document.getElementById('scrollProgress');
    const navBar = document.getElementById('mainNav');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (scrollBar) {
            scrollBar.style.width = scrolled + '%';
        }

        if (winScroll > 50) {
            navBar.classList.add('shadow-sm');
        } else {
            navBar.classList.remove('shadow-sm');
        }
    });
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

/* ==========================================================================
   4. ACTIVE NAV LINK ON SCROLL
   ========================================================================== */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   5. WEB SPEECH API & AUDIO QUOTES
   ========================================================================== */
function speakQuote(text) {
    if (!('speechSynthesis' in window)) {
        showToast('Trình duyệt của bạn không hỗ trợ đọc âm thanh trực tiếp.');
        return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Try finding Vietnamese voice
    const voices = window.speechSynthesis.getVoices();
    const vnVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VN'));
    if (vnVoice) {
        utterance.voice = vnVoice;
    }

    utterance.onstart = () => {
        showToast('Đang đọc trích dẫn...', 2000);
    };

    utterance.onerror = () => {
        showToast('Không thể phát âm thanh trên thiết bị này.');
    };

    window.speechSynthesis.speak(utterance);
}

// Global quote speech trigger button in header
const audioSpeechToggle = document.getElementById('audioSpeechToggle');
if (audioSpeechToggle) {
    audioSpeechToggle.addEventListener('click', () => {
        speakQuote('Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người. Cần phải biết làm cho phần tốt trong mỗi con người nảy nở như hoa mùa xuân và phần xấu phải mất dần đi.');
    });
}

/* ==========================================================================
   6. CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Đã sao chép vào bộ nhớ tạm!');
    }).catch(() => {
        showToast('Lỗi khi sao chép.');
    });
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, duration);
}

/* ==========================================================================
   7. CHECKLIST: "TỰ SOI TỰ SỬA" CỦA SINH VIÊN
   ========================================================================== */
const checklistData = [
    { id: 1, text: "Học tập nghiêm túc, gắn lý thuyết với thực tế giải quyết bài toán chuyên ngành." },
    { id: 2, text: "Tuyệt đối trung thực trong thi cử và làm đồ án; nói không với gian lận học thuật." },
    { id: 3, text: "Thực hành chuẩn mực 'Cần, Kiệm, Liêm, Chính' trong sinh hoạt và chi tiêu hàng ngày." },
    { id: 4, text: "Sống và học tập thượng tôn pháp luật, chấp hành nghiêm quy định nhà trường." },
    { id: 5, text: "Thường xuyên 'tự soi, tự sửa', nhìn nhận thẳng thắn khuyết điểm của bản thân." },
    { id: 6, text: "Nuôi dưỡng lòng nhân ái, tích cực chia sẻ và giúp đỡ bạn bè cùng tiến bộ." },
    { id: 7, text: "Tôn trọng sự thật, bảo vệ chân lý và lẽ phải; nâng cao tư duy phản biện khoa học." },
    { id: 8, text: "Sử dụng mạng xã hội văn minh; tuyệt đối không chia sẻ tin giả, chưa kiểm chứng." },
    { id: 9, text: "Tích cực tham gia các phong trào tình nguyện, xung kích vì cộng đồng và môi trường." },
    { id: 10, text: "Bồi dưỡng lý tưởng cách mạng, khát vọng cống hiến; rèn bản sắc HaUI 'Tâm sáng – Trí cao'." }
];

function initChecklist() {
    const container = document.getElementById('checklistContainer');
    const resetBtn = document.getElementById('resetChecklistBtn');
    const reflectionNote = document.getElementById('reflectionNote');
    const saveNoteBtn = document.getElementById('saveNoteBtn');

    if (!container) return;

    // Load saved states
    let savedState = JSON.parse(localStorage.getItem('student_checklist_state') || '{}');
    let savedNote = localStorage.getItem('student_reflection_note') || '';

    if (reflectionNote) {
        reflectionNote.value = savedNote;
    }

    // Render items
    renderChecklistItems(container, savedState);
    updateChecklistProgress(savedState);

    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Bạn có muốn đặt lại toàn bộ tiêu chí rèn luyện không?')) {
                localStorage.removeItem('student_checklist_state');
                savedState = {};
                renderChecklistItems(container, savedState);
                updateChecklistProgress(savedState);
                showToast('Đã đặt lại sổ tay rèn luyện.');
            }
        });
    }

    // Save Reflection Note
    if (saveNoteBtn && reflectionNote) {
        saveNoteBtn.addEventListener('click', () => {
            localStorage.setItem('student_reflection_note', reflectionNote.value);
            showToast('Đã lưu nhật ký tự soi bản thân!');
        });
    }
}

function renderChecklistItems(container, savedState) {
    container.innerHTML = '';
    checklistData.forEach(item => {
        const isChecked = !!savedState[item.id];
        const div = document.createElement('div');
        div.className = `checklist-item flex items-center justify-between p-4 rounded-2xl border transition-all ${
            isChecked 
            ? 'completed bg-emerald-950/40 border-emerald-500/60' 
            : 'inner-card hover:border-amber-400'
        }`;

        div.innerHTML = `
            <label class="flex items-start space-x-3 cursor-pointer w-full">
                <input type="checkbox" data-id="${item.id}" ${isChecked ? 'checked' : ''} class="checklist-checkbox mt-1 w-4 h-4 rounded text-red-600 focus:ring-amber-400 border-red-900/60">
                <span class="task-text text-xs sm:text-sm font-medium ${isChecked ? 'text-emerald-300' : 'text-stone-200'}">${item.text}</span>
            </label>
            <div class="text-xs text-stone-400 ml-2 shrink-0">
                ${isChecked ? '<i class="fa-solid fa-circle-check text-emerald-400"></i>' : '<i class="fa-regular fa-circle text-stone-500"></i>'}
            </div>
        `;

        const checkbox = div.querySelector('.checklist-checkbox');
        checkbox.addEventListener('change', (e) => {
            savedState[item.id] = e.target.checked;
            localStorage.setItem('student_checklist_state', JSON.stringify(savedState));
            renderChecklistItems(container, savedState);
            updateChecklistProgress(savedState);
        });

        container.appendChild(div);
    });
}

function updateChecklistProgress(savedState) {
    const total = checklistData.length;
    const completed = Object.values(savedState).filter(Boolean).length;
    const percentage = Math.round((completed / total) * 100);

    const progressBar = document.getElementById('checklistBar');
    const counterText = document.getElementById('checklistCounter');
    const percentageText = document.getElementById('checklistPercentage');

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (counterText) counterText.textContent = `${completed}/${total} tiêu chí đã thực hiện`;
    if (percentageText) percentageText.textContent = `${percentage}% Hoàn Thành`;

    if (completed === total) {
        showToast('Xuất sắc! Bạn đã hoàn thành trọn vẹn 10 tiêu chí rèn luyện hôm nay! 🌟');
    }
}

/* ==========================================================================
   8. INTERACTIVE QUIZ
   ========================================================================== */
const quizQuestions = [
    {
        title: "Theo Hồ Chí Minh, khi nhìn nhận hai mặt đối lập trong mỗi con người, Người đã đưa ra hình ảnh ẩn dụ nổi tiếng nào?",
        options: [
            "Làm cho phần tốt nảy nở như hoa mùa xuân và phần xấu phải mất dần đi.",
            "Con người như hạt ngọc giấu trong đá sỏi ven sông.",
            "Con người như một dòng sông chảy mãi không ngừng nghỉ.",
            "Người hiền như tùng bách giữa mùa đông giá rét."
        ],
        correct: 0,
        explanation: "Hồ Chí Minh chỉ rõ: Trong mỗi con người luôn có thiện - ác, tốt - xấu. Cần phải biết làm cho phần tốt trong mỗi con người nảy nở như hoa mùa xuân và phần xấu phải mất dần đi."
    },
    {
        title: "Lời khẳng định 'Dân khí mạnh thì quân lính nào, súng ống nào cũng không chống lại nổi' thể hiện luận điểm then chốt nào?",
        options: [
            "Con người là mục tiêu duy nhất của cuộc cải cách ruộng đất.",
            "Con người là vốn quý nhất, là nhân tố quyết định thành công của cách mạng.",
            "Tập trung trang bị vũ khí hiện đại hơn là bồi dưỡng con người.",
            "Chỉ coi trọng trí thức thay vì đông đảo nhân dân lao động nghèo khổ."
        ],
        correct: 1,
        explanation: "Hồ Chí Minh nhấn mạnh sức mạnh vĩ đại của quần chúng nhân dân. Khi dân có lòng yêu nước, đoàn kết và ý chí, không một thế lực bạo tàn nào có thể ngăn cản."
    },
    {
        title: "Chủ tịch Hồ Chí Minh phát biểu câu: 'Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người' vào thời gian và dịp nào?",
        options: [
            "Ngày 02/09/1945 tại Quảng trường Ba Đình lịch sử.",
            "Ngày 13/09/1958 tại lớp học chính trị của giáo viên cấp II, cấp III toàn miền Bắc.",
            "Ngày 19/05/1965 nhân dịp kỷ niệm ngày sinh của Người.",
            "Năm 1930 khi thành lập Đảng Cộng sản Việt Nam."
        ],
        correct: 1,
        explanation: "Tại lớp học chính trị của giáo viên cấp II, cấp III toàn miền Bắc ngày 13/9/1958, Người đã khẳng định tầm chiến lược của giáo dục và đào tạo con người."
    },
    {
        title: "Đâu KHÔNG PHẢI là một trong bốn tiêu chuẩn của con người xã hội chủ nghĩa theo tư tưởng Hồ Chí Minh?",
        options: [
            "Có tư tưởng XHCN (ý thức làm chủ, mình vì mọi người, dám nghĩ dám làm).",
            "Đạo đức và lối sống XHCN (Cần kiệm liêm chính, chí công vô tư).",
            "Có năng lực làm chủ và tác phong XHCN (làm việc kỷ luật, năng suất cao).",
            "Chỉ chú trọng phát triển kinh tế làm giàu cá nhân, không cần tham gia hoạt động xã hội."
        ],
        correct: 3,
        explanation: "4 tiêu chuẩn của con người mới XHCN theo Bác gồm: Tư tưởng XHCN, Đạo đức lối sống XHCN, Tác phong XHCN và Năng lực làm chủ; luôn gắn lợi ích cá nhân hài hòa với tập thể và Tổ quốc."
    },
    {
        title: "Trong phần kết luận và liên hệ thực tiễn, sinh viên Đại học Công nghiệp Hà Nội (HaUI) quyết tâm thẩm thấu triết lý của Người để kiến tạo bản sắc nào?",
        options: [
            "Tâm sáng – Trí cao",
            "Đức độ – Tài hoa",
            "Xung kích – Sáng tạo",
            "Kiên trung – Bất khuất"
        ],
        correct: 0,
        explanation: "Sinh viên HaUI thẩm thấu triết lý của Người để kiến tạo bản sắc 'Tâm sáng – Trí cao', sẵn sàng làm chủ tri thức, vững vàng đạo đức nghề nghiệp và phụng sự đất nước trong kỷ nguyên số."
    }
];

let currentQuestionIndex = 0;
let userAnswers = new Array(quizQuestions.length).fill(null);
let quizScore = 0;

function initQuiz() {
    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');
    const restartBtn = document.getElementById('quizRestartBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                loadQuizQuestion(currentQuestionIndex);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentQuestionIndex < quizQuestions.length - 1) {
                currentQuestionIndex++;
                loadQuizQuestion(currentQuestionIndex);
            } else {
                showQuizResult();
            }
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            currentQuestionIndex = 0;
            userAnswers = new Array(quizQuestions.length).fill(null);
            quizScore = 0;
            document.getElementById('quizResultBox').classList.add('hidden');
            document.getElementById('quizApp').classList.remove('hidden');
            loadQuizQuestion(0);
        });
    }

    loadQuizQuestion(0);
}

function loadQuizQuestion(index) {
    const q = quizQuestions[index];
    const titleEl = document.getElementById('quizQuestionTitle');
    const counterEl = document.getElementById('quizQuestionCounter');
    const scoreEl = document.getElementById('quizScoreDisplay');
    const optionsContainer = document.getElementById('quizOptionsContainer');
    const feedbackBox = document.getElementById('quizFeedbackBox');
    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');

    if (!titleEl || !optionsContainer) return;

    // Update headers
    counterEl.textContent = `Câu hỏi ${index + 1} / ${quizQuestions.length}`;
    scoreEl.textContent = `Điểm: ${quizScore}`;
    titleEl.textContent = `${index + 1}. ${q.title}`;

    prevBtn.disabled = index === 0;

    // Reset feedback
    feedbackBox.className = 'hidden';
    feedbackBox.innerHTML = '';

    // Render options
    optionsContainer.innerHTML = '';
    const hasAnswered = userAnswers[index] !== null;

    q.options.forEach((optText, optIndex) => {
        const optDiv = document.createElement('div');
        optDiv.className = `quiz-option p-4 rounded-2xl inner-card text-xs sm:text-sm font-medium flex items-center space-x-3`;

        const letter = String.fromCharCode(65 + optIndex);
        optDiv.innerHTML = `
            <span class="w-6 h-6 rounded-full bg-red-900/60 text-amber-300 border border-amber-400/30 font-bold text-xs flex items-center justify-center shrink-0">${letter}</span>
            <span class="leading-relaxed text-stone-200">${optText}</span>
        `;

        if (hasAnswered) {
            optDiv.classList.add('disabled');
            if (optIndex === q.correct) {
                optDiv.classList.add('correct');
            } else if (optIndex === userAnswers[index]) {
                optDiv.classList.add('wrong');
            }
        } else {
            optDiv.addEventListener('click', () => {
                handleOptionSelect(index, optIndex);
            });
        }

        optionsContainer.appendChild(optDiv);
    });

    if (hasAnswered) {
        showQuestionFeedback(q, userAnswers[index]);
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

function handleOptionSelect(qIndex, selectedOptIndex) {
    const q = quizQuestions[qIndex];
    userAnswers[qIndex] = selectedOptIndex;

    if (selectedOptIndex === q.correct) {
        quizScore += 1;
    }

    loadQuizQuestion(qIndex);
}

function showQuestionFeedback(q, selectedOptIndex) {
    const feedbackBox = document.getElementById('quizFeedbackBox');
    const isCorrect = selectedOptIndex === q.correct;

    feedbackBox.classList.remove('hidden');
    if (isCorrect) {
        feedbackBox.className = 'p-4 rounded-xl text-xs sm:text-sm leading-relaxed mb-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300';
        feedbackBox.innerHTML = `
            <div class="font-bold flex items-center space-x-1.5 mb-1">
                <i class="fa-solid fa-circle-check"></i>
                <span>Chính xác tuyệt đối!</span>
            </div>
            <div>${q.explanation}</div>
        `;
    } else {
        feedbackBox.className = 'p-4 rounded-xl text-xs sm:text-sm leading-relaxed mb-6 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300';
        feedbackBox.innerHTML = `
            <div class="font-bold flex items-center space-x-1.5 mb-1">
                <i class="fa-solid fa-circle-xmark"></i>
                <span>Chưa chính xác!</span>
            </div>
            <div>${q.explanation}</div>
        `;
    }
}

function showQuizResult() {
    document.getElementById('quizApp').classList.add('hidden');
    const resultBox = document.getElementById('quizResultBox');
    resultBox.classList.remove('hidden');

    const scoreDisplay = document.getElementById('quizFinalScore');
    const feedbackDisplay = document.getElementById('quizFinalFeedback');

    scoreDisplay.textContent = `Bạn trả lời đúng ${quizScore} / ${quizQuestions.length} câu hỏi!`;

    if (quizScore === 5) {
        feedbackDisplay.textContent = 'Tuyệt vời! Bạn đã nắm vững toàn bộ kiến thức cốt lõi về tư tưởng Hồ Chí Minh và chuẩn mực sinh viên HaUI!';
    } else if (quizScore >= 3) {
        feedbackDisplay.textContent = 'Khá tốt! Bạn đã nắm được đa số các luận điểm cơ bản. Hãy xem lại các trích dẫn để khắc sâu thêm nhé!';
    } else {
        feedbackDisplay.textContent = 'Hãy đọc lại nội dung trên trang và thử sức lần nữa để củng cố kiến thức tốt hơn bạn nhé!';
    }
}

/* ==========================================================================
   9. QUICK SEARCH MODAL (Ctrl + K)
   ========================================================================== */
const searchableItems = [
    { title: "Bản chất con người là một chỉnh thể", desc: "Hài hòa tâm lực, sức khỏe và các hoạt động thực tiễn.", href: "#intro" },
    { title: "Hai mặt đối lập: Hoa mùa xuân", desc: "Làm cho phần tốt nảy nở như hoa mùa xuân và phần xấu phải mất dần đi.", href: "#intro" },
    { title: "Con người cụ thể, lịch sử", desc: "Gắn với hoàn cảnh lịch sử, giai cấp, giới tính và thời đại cụ thể.", href: "#intro" },
    { title: "Bản chất mang tính xã hội", desc: "Quan hệ gia đình, anh em, cha con, đồng nghiệp và đồng bào.", href: "#intro" },
    { title: "Con người là vốn quý nhất", desc: "Kế thừa tư tưởng 'Dân vi quý', nhân dân là nhân tố quyết định cách mạng.", href: "#role" },
    { title: "Sức mạnh dân khí", desc: "Dân khí mạnh thì quân lính nào, súng ống nào cũng không chống lại nổi.", href: "#role" },
    { title: "Mục tiêu và Động lực cách mạng", desc: "Con người vừa là mục tiêu giải phóng vừa là động lực của cách mạng.", href: "#role" },
    { title: "Chiến lược trồng người trăm năm", desc: "Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người (13/9/1958).", href: "#planting" },
    { title: "4 Tiêu chuẩn con người XHCN", desc: "Tư tưởng, Đạo đức lối sống, Tác phong và Năng lực làm chủ.", href: "#planting" },
    { title: "Giáo dục và tu dưỡng", desc: "Hiền dữ phải đâu là tính sẵn, phần nhiều do giáo dục mà nên. Óc trẻ như tấm lụa trắng.", href: "#planting" },
    { title: "Trách nhiệm của sinh viên", desc: "Học đi đôi với hành, thượng tôn pháp luật, Cần - Kiệm - Liêm - Chính.", href: "#students" },
    { title: "Hệ giá trị Chân – Thiện – Mỹ", desc: "Cái Chân (lẽ phải), Cái Thiện (đạo đức, nhân ái), Cái Mỹ (văn minh, thẩm mỹ).", href: "#students" },
    { title: "Sinh viên trong kỷ nguyên số", desc: "Văn hóa mạng xã hội, tinh thần tình nguyện và bản lĩnh dân tộc.", href: "#students" },
    { title: "Dấu ấn sinh viên HaUI", desc: "Thẩm thấu triết lý của Bác để kiến tạo bản sắc: 'Tâm sáng – Trí cao'.", href: "#students" }
];

function initSearch() {
    const openBtn = document.getElementById('openSearchBtn');
    const closeBtn = document.getElementById('closeSearchBtn');
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');

    if (!modal || !input) return;

    function openModal() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        input.value = '';
        input.focus();
        results.innerHTML = '<p class="text-stone-400 text-center py-6">Nhập từ khóa để bắt đầu tra cứu nhanh nội dung.</p>';
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openModal();
        }
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
            results.innerHTML = '<p class="text-stone-400 text-center py-6">Nhập từ khóa để bắt đầu tra cứu nhanh nội dung.</p>';
            return;
        }

        const filtered = searchableItems.filter(item => 
            item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            results.innerHTML = `<p class="text-stone-400 text-center py-6">Không tìm thấy kết quả phù hợp với "${query}".</p>`;
            return;
        }

        results.innerHTML = filtered.map(item => `
            <a href="${item.href}" onclick="document.getElementById('searchModal').classList.add('hidden');" class="block p-3 rounded-xl hover:bg-red-900/40 border border-transparent hover:border-amber-400/30 transition-colors">
                <div class="font-bold text-amber-300 text-xs sm:text-sm">${item.title}</div>
                <div class="text-[11px] text-stone-300 mt-0.5 line-clamp-1">${item.desc}</div>
            </a>
        `).join('');
    });
}

/* ==========================================================================
   10. MINDMAP LIGHTBOX MODAL
   ========================================================================== */
function initMindmapModal() {
    const trigger = document.getElementById('mindmapImgTrigger');
    const openBtn = document.getElementById('openMindmapModalBtn');
    const closeBtn = document.getElementById('closeMindmapModalBtn');
    const modal = document.getElementById('mindmapModal');

    if (!modal) return;

    function openModal() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }

    if (trigger) trigger.addEventListener('click', openModal);
    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}
