/**
 * 퀴즈 데이터
 * bg: 질문 화면 배경 이미지 파일명
 * answers: 답변 목록
 *   - img: 답변 버튼 이미지 파일명
 *   - types: 이 답변을 선택했을 때 점수를 받을 AI 유형 목록
 */
const questions = [
    {
        bg: "1.png",
        answers: [
            { img: "1_A.png", types: ["perplexity", "copilot"] },
            { img: "1_B.png", types: ["claude", "chatgpt"] },
            { img: "1_C.png", types: ["gemini", "notion"] },
        ]
    },
    {
        bg: "2.png",
        answers: [
            { img: "2_A.png", types: ["claude", "chatgpt"] },
            { img: "2_B.png", types: ["deepseek", "perplexity"] },
            { img: "2_C.png", types: ["wrtn", "copilot"] },
        ]
    },
    {
        bg: "3.png",
        answers: [
            { img: "3_A.png", types: ["notion", "claude"] },
            { img: "3_B.png", types: ["chatgpt", "gemini"] },
            { img: "3_C.png", types: ["deepseek", "wrtn"] },
        ]
    },
    {
        bg: "4.png",
        answers: [
            { img: "4_A.png", types: ["copilot", "wrtn"] },
            { img: "4_B.png", types: ["deepseek", "notion"] },
            { img: "4_C.png", types: ["chatgpt", "gemini"] },
        ]
    },
    {
        bg: "5.png",
        answers: [
            { img: "5_A.png", types: ["claude", "chatgpt"] },
            { img: "5_B.png", types: ["deepseek", "gemini"] },
            { img: "5_C.png", types: ["notion", "copilot"] },
        ]
    },
    {
        bg: "6.png",
        answers: [
            { img: "6_A.png", types: ["deepseek", "claude"] },
            { img: "6_B.png", types: ["gemini", "chatgpt"] },
            { img: "6_C.png", types: ["notion", "wrtn"] },
        ]
    },
    {
        bg: "7.png",
        answers: [
            { img: "7_A.png", types: ["wrtn", "gemini"] },
            { img: "7_B.png", types: ["deepseek", "notion"] },
            { img: "7_C.png", types: ["perplexity", "copilot"] },
        ]
    },
    {
        bg: "8.png",
        answers: [
            { img: "8_A.png", types: ["claude", "chatgpt"] },
            { img: "8_B.png", types: ["deepseek", "perplexity"] },
            { img: "8_C.png", types: ["gemini", "copilot"] },
        ]
    },
    {
        bg: "9.png",
        answers: [
            // BUG FIX: "Wr" -> "wrtn"으로 수정
            { img: "9_A.png", types: ["wrtn", "chatgpt"] },
            { img: "9_B.png", types: ["deepseek", "perplexity"] },
            { img: "9_C.png", types: ["gemini", "copilot"] },
        ]
    },
    {
        bg: "10.png",
        answers: [
            { img: "10_A.png", types: ["claude", "notion"] },
            // BUG FIX: "Deepseek" -> "deepseek"으로 수정 (대소문자 일치)
            { img: "10_B.png", types: ["deepseek", "gemini"] },
            { img: "10_C.png", types: ["wrtn", "chatgpt"] },
        ]
    },
];

/**
 * AI 유형별 결과 이미지 파일명 매핑
 */
const results = {
    notion: "notion.png",
    chatgpt: "chatgpt.png",
    wrtn: "wrtn.png",
    copilot: "copilot.png",
    claude: "claude.png",
    gemini: "gemini.png",
    deepseek: "deepseek.png",
    perplexity: "perplexity.png",
};

// --- 전역 변수 ---
let current = 0; // 현재 질문 인덱스
let scores = {};   // AI 유형별 점수 저장 객체
let videoStream = null; // 카메라 스트림 저장 변수

// --- 화면 전환 함수 ---
/**
 * 퀴즈를 시작하는 함수
 */
function startQuiz() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");
    showQuestion();
}

/**
 * 현재 질문을 화면에 표시하는 함수
 */
function showQuestion() {
    const q = questions[current];
    document.getElementById("question-bg").src = `images/${q.bg}`;

    const btnContainer = document.getElementById("quiz-buttons");
    btnContainer.innerHTML = ""; // 이전 버튼들 제거

    // 현재 질문의 답변 버튼들을 생성하여 화면에 추가
    q.answers.forEach(a => {
        const btn = document.createElement("img");
        btn.src = `images/${a.img}`;
        btn.classList.add("answer-btn");

        // 버튼 클릭 이벤트 처리
        btn.onclick = () => {
            // 선택된 답변에 해당하는 AI 유형들의 점수 증가
            a.types.forEach(t => {
                scores[t] = (scores[t] || 0) + 1;
            });

            current++; // 다음 질문으로 이동

            // 모든 질문에 답했는지 확인
            if (current < questions.length) {
                showQuestion(); // 다음 질문 표시
            } else {
                showResult();   // 결과 표시
            }
        };

        btnContainer.appendChild(btn);
    });
}

/**
 * 최종 결과를 계산하고 화면에 표시하는 함수
 */
function showResult() {
    // 퀴즈 화면 숨기고 로딩 화면 표시
    document.getElementById("quiz-screen").classList.add("hidden");
    const loading = document.getElementById("loading-screen");
    loading.classList.remove("hidden");

    // 1.5초 후 로딩 화면 숨기고 결과 화면 표시
    setTimeout(() => {
        loading.classList.add("hidden");
        document.getElementById("result-screen").classList.remove("hidden");

        // 가장 높은 점수를 받은 AI 유형을 찾음
        const topType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
        // 해당 AI의 결과 이미지 표시
        document.getElementById("result-image").src = `images/${results[topType]}`;

        console.log("Final scores:", scores); // 디버깅용 로그 추가

        startCamera(); // Show camera on result screen

    }, 1500);
}

/**
 * 테스트를 처음부터 다시 시작하는 함수
 */
function reset() {
    current = 0;
    scores = {};
    // 모든 화면을 숨기고 시작 화면만 표시
    document.getElementById("result-screen").classList.add("hidden");
    document.getElementById("all-results-screen").classList.add("hidden"); // Ensure all-results is hidden
    document.getElementById("start-screen").classList.remove("hidden");
    stopCamera(); // Hide camera on reset
}

/**
 * 전체 AI 결과 목록을 보여주는 함수
 */
function showAllResults() {
    document.getElementById("result-screen").classList.add("hidden");
    document.getElementById("all-results-screen").classList.remove("hidden");
    // Camera should remain visible, but behind this screen (handled by CSS z-index)
    // No stopCamera() here
}

/**
 * 전체 결과 목록에서 특정 AI 로고를 클릭했을 때, 해당 AI의 결과 화면을 보여주는 함수
 * @param {string} type - 보여줄 AI의 유형 (e.g., 'notion', 'chatgpt')
 */
function showSingleResult(type) {
    // 해당 AI의 결과 이미지 경로 설정
    const resultSrc = `images/${results[type]}`;
    const resultImg = document.getElementById("result-image");
    resultImg.src = resultSrc;
    resultImg.style.display = "block"; // Ensure image is visible

    document.getElementById("all-results-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");
    startCamera(); // Show camera on single result screen
}

// --- 카메라 제어 함수 ---
/**
 * 페이지 로드 시 카메라를 초기화하고 권한을 요청하는 함수.
 * 스트림을 가져와 비디오 요소에 연결하고, 평소에는 숨겨둡니다.
 */
async function initCamera() {
    const video = document.getElementById('camera');
    const container = document.getElementById('camera-container');
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = videoStream;
        container.style.display = 'none'; // Hidden initially
    } catch (err) {
        console.error('카메라 접근 오류:', err);
        container.style.display = 'none';
    }
}

/**
 * 웹캠 비디오를 화면에 보여주는 함수
 */
function startCamera() {
    const container = document.getElementById('camera-container');
    if (videoStream) {
        container.style.display = 'block';
    }
}

/**
 * 웹캠 비디오를 화면에서 숨기는 함수 (스트림은 중지하지 않음)
 */
function stopCamera() {
    document.getElementById('camera-container').style.display = 'none';
}

// --- 초기 설정 ---
document.addEventListener('DOMContentLoaded', () => {
    initCamera(); // Initialize camera once on page load
    // Add event listener for the AI_button
    const aiButton = document.querySelector('.fixed-btn.right');
    if (aiButton) {
        aiButton.addEventListener('click', showAllResults);
        console.log("AI_button event listener added.");
    } else {
        console.error("AI_button not found for event listener!");
    }
});