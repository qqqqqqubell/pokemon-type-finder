const SERVER_URL = 'https://giant-ghosts-speak.loca.lt/predict';

const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultArea = document.getElementById('resultArea');

const CLASS_NAMES = [
    "벌레",  "악", "드래곤", "전기", "페어리", 
    "격투",  "불꽃", "비행", "고스트", "풀", 
    "땅", "얼음", "노말", "독", "에스퍼",
    "바위", "강철", "물" 
];

const TYPE_COLORS = {
    "노말": "#949495", "불꽃": "#e56c3e", "물": "#5185c5", "풀": "#66a945", 
    "전기": "#fbb917", "얼음": "#6dc8eb", "격투": "#e09c40", "독": "#735198", 
    "땅": "#9c7443", "비행": "#a2c3e7", "에스퍼": "#dd6b7b", "벌레": "#9fa244", 
    "바위": "#bfb889", "고스트": "#684870", "드래곤": "#535ca8", "악": "#4c4948", 
    "강철": "#69a9c7", "페어리": "#dab4d4"
};

// 타입별 약점 상성 정리
const TYPE_WEAKNESSES = {
    "노말": ["격투"], "불꽃": ["물", "땅", "바위"], "물": ["전기", "풀"],
    "풀": ["불꽃", "얼음", "독", "비행", "벌레"], "전기": ["땅"],
    "얼음": ["불꽃", "격투", "바위", "강철"], "격투": ["비행", "에스퍼", "페어리"],
    "독": ["땅", "에스퍼"], "땅": ["물", "풀", "얼음"],
    "비행": ["전기", "얼음", "바위"], "에스퍼": ["벌레", "고스트", "악"],
    "벌레": ["불꽃", "비행", "바위"], "바위": ["물", "풀", "격투", "땅", "강철"],
    "고스트": ["고스트", "악"], "드래곤": ["얼음", "드래곤", "페어리"],
    "악": ["격투", "벌레", "페어리"], "강철": ["불꽃", "격투", "땅"], "페어리": ["독", "강철"]
};
// 이미지 선택 시 미리보기 코드
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

analyzeBtn.addEventListener('click', async function() {
    if (!imageInput.files[0]) {
        alert("분석할 이미지를 업로드해주세요!");
        return;
    }

    // 기존 결과창 비우고 몬스터볼 로딩창 표시
    resultArea.innerHTML = "";
    document.getElementById('loader').style.display = 'block';

    const formData = new FormData();
    formData.append('file', imageInput.files[0]);

    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        const firstType = CLASS_NAMES[data.first_class];
        const secondType = CLASS_NAMES[data.second_class];
        const firstColor = TYPE_COLORS[firstType] || "#333";
        const secondColor = TYPE_COLORS[secondType] || "#333";

        // AI 연산 후 데이터 도착, 로딩창 숨기기
        document.getElementById('loader').style.display = 'none';
        
        //  도감 스타일? 적당히 테마 UI 렌더링
        resultArea.innerHTML = `
            <div style="background: #ffffff; padding: 25px; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.05); margin: 30px auto 0 auto; max-width: 460px; text-align: left; border: 1px solid #eef0f3;">
                
                <h3 style="margin-top: 0; color: #2c3e50; font-size: 1.15em; text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 12px; letter-spacing: 1px;">📊 분석 결과 리포트</h3>
                
                <div style="margin: 20px 0 15px 0; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-weight: bold; color: #5a6a85; font-size: 0.9em;">주 타입</span>
                        <span style="background-color: ${firstColor}; color: white; padding: 5px 14px; border-radius: 20px; font-weight: bold; font-size: 0.9em; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); min-width: 55px; text-align: center; display: inline-block;">
                            ${firstType}
                        </span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; width: 55%;">
                        <div style="background: #e9ecef; border-radius: 10px; flex-grow: 1; height: 10px; overflow: hidden;">
                            <div style="background: ${firstColor}; width: ${data.first_prob}%; height: 100%; border-radius: 10px;"></div>
                        </div>
                        <span style="font-weight: bold; color: #2c3e50; font-size: 0.85em; min-width: 45px; text-align: right;">${data.first_prob.toFixed(1)}%</span>
                    </div>
                </div>

                <div style="margin: 15px 0 10px 0; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-weight: bold; color: #7a8a9e; font-size: 0.9em;">부 타입</span>
                        <span style="background-color: ${secondColor}; color: white; padding: 5px 14px; border-radius: 20px; font-weight: bold; font-size: 0.9em; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); min-width: 55px; text-align: center; display: inline-block;">
                            ${secondType}
                        </span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; width: 55%;">
                        <div style="background: #e9ecef; border-radius: 10px; flex-grow: 1; height: 10px; overflow: hidden;">
                            <div style="background: ${secondColor}; width: ${data.second_prob}%; height: 100%; border-radius: 10px;"></div>
                        </div>
                        <span style="font-weight: bold; color: #64748b; font-size: 0.85em; min-width: 45px; text-align: right;">${data.second_prob.toFixed(1)}%</span>
                    </div>
                </div>
            </div>

                <details style="margin-top: 20px; border-top: 1px solid #f1f3f5; padding-top: 15px;">
                    <summary style="cursor: pointer; color: #8fa4c4; font-weight: bold; font-size: 0.9rem; list-style: none; text-align: center;">
                        ▼ 배틀 상성 가이드 확인하기
                    </summary>
                    <div style="margin-top: 15px; background: #f8f9fa; padding: 15px; border-radius: 10px;">
                        <p style="margin: 0 0 10px 0; font-size: 0.85rem; color: #4a5568;">
                            💥 <strong>${firstType}</strong> 타입의 약점:<br>
                            ${TYPE_WEAKNESSES[firstType].map(t => `<span style="color:${TYPE_COLORS[t]}; font-weight:bold;">#${t}</span>`).join(' ')}
                        </p>
                        ${data.second_prob > 10 ? `
                        <p style="margin: 0; font-size: 0.85rem; color: #4a5568;">
                            💥 <strong>${secondType}</strong> 타입의 약점:<br>
                            ${TYPE_WEAKNESSES[secondType].map(t => `<span style="color:${TYPE_COLORS[t]}; font-weight:bold;">#${t}</span>`).join(' ')}
                        </p>` : ''}
                        <p style="margin-top: 10px; font-size: 0.75rem; color: #adb5bd;">* 상위 결과에 근거한 단일 타입별 약점 정보입니다.</p>
                    </div>
                </details>
            </div>
        
        `;
    } catch (error) {
        console.error("통신 에러:", error);
        resultArea.innerHTML = "<p style='color: red; text-align:center;'>❌ 도감 서버 통신에 실패했습니다.</p>";
    }
});