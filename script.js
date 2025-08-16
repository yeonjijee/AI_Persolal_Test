console.log("script.js loaded and executing.");

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
    
    // 결과 이미지 다시 보이도록 설정
    const resultImage = document.getElementById("result-image");
    if (resultImage) {
        resultImage.style.display = "block";
    }
    
    // 모든 화면을 숨기고 시작 화면만 표시
    document.getElementById("result-screen").classList.add("hidden");
    document.getElementById("all-results-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
    stopCamera();
    console.log("Reset completed - back to start screen.");
}

/**
 * 전체 AI 결과 목록을 보여주는 함수
 */
function showAllResults() {
    console.log("🔥 showAllResults() called - AI button clicked!");
    try {
        const resultScreen = document.getElementById("result-screen");
        const allResultsScreen = document.getElementById("all-results-screen");
        const resultImage = document.getElementById("result-image");

        console.log("resultScreen before hiding:", resultScreen);
        console.log("allResultsScreen before showing:", allResultsScreen);

        // 결과 이미지 숨기기
        if (resultImage) {
            resultImage.style.display = 'none';
            console.log("Result image hidden.");
        }

        if (resultScreen) {
            resultScreen.classList.add("hidden");
            console.log("resultScreen after hiding:", resultScreen.classList.contains("hidden"));
        } else {
            console.error("resultScreen not found!");
        }

        if (allResultsScreen) {
            allResultsScreen.classList.remove("hidden");
            allResultsScreen.style.display = "flex"; // 명시적으로 display 설정
            allResultsScreen.style.backgroundImage = "url('./images/AI.png')";
            allResultsScreen.style.backgroundSize = "auto 100vh"; // 높이 100vh, 너비 자동 (비율 고정)
            allResultsScreen.style.backgroundPosition = "center top"; // 수평 중앙, 수직 상단 정렬
            allResultsScreen.style.backgroundRepeat = "no-repeat";
            
            console.log("All results screen shown with AI.png background (center top)");
        } else {
            console.error("allResultsScreen not found!");
        }
        stopCamera();
        console.log("Camera stopped.");

    } catch (e) {
        console.error("Error in showAllResults():", e);
    }
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
    console.log(`Showing single result for: ${type}`);
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

// --- 화면 캡처 및 공유 기능 ---
/**
 * 결과 화면을 캡처하고 다운로드/공유 옵션을 제공하는 함수
 */
async function captureAndShare() {
    try {
        console.log("화면 캡처 시작...");
        
        // html2canvas 라이브러리가 로드되었는지 확인
        if (typeof html2canvas === 'undefined') {
            console.error("html2canvas 라이브러리가 로드되지 않았습니다.");
            alert("캡처 라이브러리 로딩 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        
        // 캡처할 영역을 결과 화면으로 설정 (웹캠 포함)
        const resultScreen = document.getElementById('result-screen');
        if (!resultScreen) {
            throw new Error("결과 화면을 찾을 수 없습니다.");
        }
        
        // 웹캠이 현재 표시되고 있는지 확인하고 강제로 표시
        const cameraContainer = document.getElementById('camera-container');
        const cameraVideo = document.getElementById('camera');
        
        // 웹캠을 확실히 표시되도록 설정
        if (cameraContainer) {
            cameraContainer.style.display = 'block';
            cameraContainer.style.visibility = 'visible';
            console.log("웹캠 강제 표시됨");
        }
        if (cameraVideo) {
            cameraVideo.style.display = 'block';
            cameraVideo.style.visibility = 'visible';
        }
        
        // 캡처 버튼만 임시로 숨김 (결과 이미지에서 제외)
        const captureBtn = document.querySelector('.capture-btn');
        const btnWasVisible = captureBtn && captureBtn.style.display !== 'none';
        if (captureBtn) {
            captureBtn.style.display = 'none';
        }
        
        console.log("html2canvas 실행 중...");
        
        // html2canvas로 화면 캡처 (웹캠 포함, 전체 화면)
        const canvas = await html2canvas(resultScreen, {
            allowTaint: true, // Tainted 이미지 허용
            useCORS: true, // CORS 활성화
            scale: 1,
            backgroundColor: '#FBEBCF',
            logging: false,
            height: window.innerHeight,
            width: window.innerWidth,
            scrollX: 0,
            scrollY: 0,
            foreignObjectRendering: true,
            imageTimeout: 0,
            removeContainer: true,
            // 웹캠(video) 요소 캡처를 위한 설정
            ignoreElements: function(element) {
                // 캡처 버튼만 제외하고 모든 요소 포함 (웹캠 포함)
                return element.classList && element.classList.contains('capture-btn');
            }
        });
        
        console.log("캔버스 생성 완료:", canvas.width, "x", canvas.height);
        
        // 캡처 버튼 다시 보이기 (웹캠은 원래 숨기지 않았음)
        if (btnWasVisible && captureBtn) {
            captureBtn.style.display = 'block';
        }
        
        // 캔버스를 이미지로 변환 (대체 방법 포함)
        try {
            // 방법 1: toBlob 시도
            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error("Blob 생성 실패");
                }
                
                console.log("Blob 생성 완료, 크기:", blob.size);
                
                // 다운로드 링크 생성
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `AI-성격테스트-결과-${new Date().getTime()}.png`;
                link.href = url;
                
                // 다운로드 실행
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // 메모리 정리
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                
                // 공유 옵션 표시
                showShareOptions();
                
                console.log("화면 캡처 및 다운로드 완료!");
                
            }, 'image/png', 0.9);
            
        } catch (blobError) {
            console.log("toBlob 실패, 대체 방법 사용:", blobError);
            
            // 방법 2: toDataURL 사용 (대체 방법)
            try {
                const dataURL = canvas.toDataURL('image/png', 0.9);
                const link = document.createElement('a');
                link.download = `AI-성격테스트-결과-${new Date().getTime()}.png`;
                link.href = dataURL;
                
                // 다운로드 실행
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // 공유 옵션 표시
                showShareOptions();
                
                console.log("대체 방법으로 캡처 완료!");
                
            } catch (dataURLError) {
                console.error("toDataURL도 실패:", dataURLError);
                
                // 방법 3: 브라우저 스크린샷 기능 안내
                alert("화면 캡처가 제한되어 있습니다.\n\n대안:\n1. 휴대폰 스크린샷 기능 사용\n2. 브라우저 개발자 도구 > 스크린샷 기능 사용\n\n죄송합니다!");
            }
        }
        
    } catch (error) {
        console.error("화면 캡처 상세 오류:", error);
        alert(`화면 캡처에 실패했습니다.\n오류: ${error.message}\n브라우저를 새로고침 후 다시 시도해주세요.`);
        
        // 캡처 버튼 복원 (웹캠은 원래 숨기지 않았음)
        const captureBtn = document.querySelector('.capture-btn');
        if (captureBtn) captureBtn.style.display = 'block';
    }
}

/**
 * 공유 옵션을 표시하는 함수
 */
function showShareOptions() {
    // 약간의 딜레이 후 공유 옵션 표시
    setTimeout(() => {
        // 모바일 기기에서 Web Share API 사용 가능한지 확인
        if (navigator.share) {
            // Web Share API 사용 (모바일)
            navigator.share({
                title: 'AI 성격 테스트 결과',
                text: '나의 AI 성격 테스트 결과를 확인해보세요!',
                url: window.location.href
            }).catch(err => console.log('공유 취소:', err));
        } else {
            // 데스크톱에서는 URL 복사 알림
            const currentUrl = window.location.href;
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    alert('테스트 링크가 클립보드에 복사되었습니다!\n친구들에게 공유해보세요: ' + currentUrl);
                }).catch(() => {
                    alert('테스트 링크: ' + currentUrl + '\n\n위 링크를 복사해서 친구들에게 공유해보세요!');
                });
            } else {
                alert('테스트 링크: ' + currentUrl + '\n\n위 링크를 복사해서 친구들에게 공유해보세요!');
            }
        }
    }, 500);
}

// --- 초기 설정 ---
document.addEventListener('DOMContentLoaded', () => {
    initCamera(); // Initialize camera once on page load
});