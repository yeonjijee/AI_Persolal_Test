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
 * GoFullPage 확장 프로그램 감지 및 활용 시도
 */
function tryGoFullPageCapture() {
    // GoFullPage 확장 프로그램이 설치되어 있는지 확인
    if (window.gofullpage || document.querySelector('[data-extension="gofullpage"]')) {
        console.log("GoFullPage 감지됨");
        
        // GoFullPage 메시지 전송 시도
        try {
            window.postMessage({
                type: 'GOFULLPAGE_CAPTURE',
                target: 'gofullpage-extension'
            }, '*');
            
            return true;
        } catch (e) {
            console.log("GoFullPage 연동 실패:", e);
            return false;
        }
    }
    return false;
}

/**
 * 브라우저의 기본 스크린샷 API 시도 (Chrome 등)
 */
async function tryNativeScreenCapture() {
    try {
        // Screen Capture API 사용 시도 (실험적 기능)
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: 'screen' }
            });
            
            // 스트림을 비디오 요소에 연결하여 캡처
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            
            return new Promise((resolve) => {
                video.addEventListener('loadedmetadata', () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0);
                    
                    // 스트림 정리
                    stream.getTracks().forEach(track => track.stop());
                    
                    canvas.toBlob(resolve, 'image/png');
                });
            });
        }
    } catch (e) {
        console.log("네이티브 스크린 캡처 실패:", e);
        return null;
    }
}

/**
 * 결과 화면을 캡처하고 다운로드/공유 옵션을 제공하는 함수
 */
async function captureAndShare() {
    try {
        console.log("화면 캡처 시작...");
        
        // 1단계: GoFullPage 확장 프로그램 시도
        console.log("1단계: GoFullPage 시도");
        if (tryGoFullPageCapture()) {
            alert("GoFullPage 확장 프로그램을 통해 캡처하세요!\n\n확장 프로그램 아이콘을 클릭하거나\n단축키 (Ctrl+Shift+P)를 사용하세요.");
            return;
        }
        
        // 2단계: 브라우저 네이티브 스크린 캡처 시도
        console.log("2단계: 네이티브 스크린 캡처 시도");
        const nativeBlob = await tryNativeScreenCapture();
        if (nativeBlob) {
            console.log("네이티브 캡처 성공!");
            downloadAndShare(nativeBlob, "네이티브-스크린-캡처");
            return;
        }
        
        // 3단계: html2canvas 사용 (기존 방법)
        console.log("3단계: html2canvas 사용");
        
        // html2canvas 라이브러리가 로드되었는지 확인
        if (typeof html2canvas === 'undefined') {
            console.error("html2canvas 라이브러리가 로드되지 않았습니다.");
            alert("캡처 라이브러리 로딩 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        
        // 캡처할 영역을 전체 body로 설정 (화면에 보이는 모든 것 포함)
        const captureTarget = document.body;
        if (!captureTarget) {
            throw new Error("캡처할 영역을 찾을 수 없습니다.");
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
        
        // html2canvas로 전체 화면 캡처 (화면에 보이는 그대로)
        const canvas = await html2canvas(captureTarget, {
            allowTaint: true,
            useCORS: false,
            scale: 1,
            backgroundColor: '#FBEBCF',
            logging: true,
            width: window.innerWidth,
            height: window.innerHeight,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            onclone: function(clonedDoc) {
                // 클론된 문서에서도 웹캠이 보이도록 설정
                const clonedCamera = clonedDoc.getElementById('camera-container');
                if (clonedCamera) {
                    clonedCamera.style.display = 'block';
                    clonedCamera.style.visibility = 'visible';
                }
            },
            ignoreElements: function(element) {
                // 캡처 버튼과 숨겨진 화면들 제외
                if (element.classList && element.classList.contains('capture-btn')) {
                    return true;
                }
                if (element.classList && element.classList.contains('hidden')) {
                    return true;
                }
                return false;
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
                
                // 공통 다운로드 및 공유 함수 사용
                downloadAndShare(blob, "html2canvas-캡처");
                
            }, 'image/png', 0.9);
            
        } catch (blobError) {
            console.log("toBlob 실패, 대체 방법 사용:", blobError);
            
            // 방법 2: toDataURL 사용 (대체 방법)
            try {
                const dataURL = canvas.toDataURL('image/png', 0.9);
                
                // DataURL을 Blob으로 변환하여 공유
                const blob = dataURLtoBlob(dataURL);
                downloadAndShare(blob, "dataURL-캡처");
                
                console.log("대체 방법으로 캡처 완료!");
                
            } catch (dataURLError) {
                console.error("toDataURL도 실패:", dataURLError);
                
                // 방법 3: 수동 캡처 방법 안내
                showCaptureAlternatives();
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
 * 캡처된 이미지를 다운로드하고 공유하는 공통 함수
 */
function downloadAndShare(blob, filename = "AI-성격테스트-결과") {
    // 다운로드 링크 생성
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}-${new Date().getTime()}.png`;
    link.href = url;
    
    // 다운로드 실행
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 캡처한 이미지로 공유 옵션 표시
    showShareOptions(blob);
    
    // 메모리 정리 (공유 후에)
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    
    console.log("화면 캡처 및 다운로드 완료!");
}

/**
 * DataURL을 Blob으로 변환하는 헬퍼 함수
 */
function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

/**
 * 캡처한 이미지를 공유하는 함수
 */
function showShareOptions(imageBlob) {
    // 약간의 딜레이 후 공유 옵션 표시
    setTimeout(() => {
        // 모바일 기기에서 Web Share API 사용 가능한지 확인
        if (navigator.share && navigator.canShare) {
            // 이미지 파일 공유 (모바일)
            const shareData = {
                title: 'AI 성격 테스트 결과',
                text: '나의 AI 성격 테스트 결과를 확인해보세요!',
                files: [new File([imageBlob], 'AI-성격테스트-결과.png', { type: 'image/png' })]
            };
            
            // 파일 공유 가능한지 확인
            if (navigator.canShare(shareData)) {
                navigator.share(shareData).catch(err => {
                    console.log('이미지 공유 취소:', err);
                    // 이미지 공유 실패시 링크 공유로 대체
                    shareLink();
                });
            } else {
                console.log('파일 공유 불가능, 링크 공유로 대체');
                shareLink();
            }
        } else {
            // 데스크톱에서는 이미지 다운로드 완료 알림 + 링크 복사
            alert('이미지가 다운로드되었습니다!\n\n친구들과 공유하려면:\n1. 다운로드된 이미지를 SNS에 업로드\n2. 아래 링크도 함께 공유해보세요!');
            shareLink();
        }
    }, 500);
}

/**
 * 사이트 링크를 공유하는 함수 (대체 방법)
 */
function shareLink() {
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

/**
 * 수동 캡처 방법들을 안내하는 함수
 */
function showCaptureAlternatives() {
    const alternatives = `
🔧 화면 캡처 대안 방법들:

📱 모바일:
• 볼륨키 + 전원키 (안드로이드)
• 홈버튼 + 전원키 (구형 아이폰)
• 사이드키 + 볼륨키 (신형 아이폰)

💻 PC/Mac:
• GoFullPage 확장프로그램 설치 추천!
• Windows: Win + Shift + S
• Mac: Cmd + Shift + 4
• Chrome: F12 > Device Toggle > 스크린샷 아이콘

🌟 GoFullPage 사용법:
1. Chrome 웹스토어에서 설치
2. 확장프로그램 아이콘 클릭
3. 또는 Ctrl+Shift+P (단축키)

더 나은 화질과 전체 페이지 캡처가 가능합니다!
    `;
    
    alert(alternatives);
}

/**
 * GoFullPage 설치 링크 제공
 */
function openGoFullPageInstall() {
    window.open('https://chrome.google.com/webstore/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl', '_blank');
}

// --- 초기 설정 ---
document.addEventListener('DOMContentLoaded', () => {
    initCamera(); // Initialize camera once on page load
});