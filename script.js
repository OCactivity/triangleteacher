window.onload = function() {
    // 誤差許容モードの初期設定（オフ）
    document.getElementById("toleranceToggle").checked = false;
    
    // 入力フィールドにフォーカス時のアニメーション効果
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // CSS アニメーションの追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-30px);
            }
        }
        
        @keyframes shake {
            0%, 100% {
                transform: translateX(0);
            }
            10%, 30%, 50%, 70%, 90% {
                transform: translateX(-5px);
            }
            20%, 40%, 60%, 80% {
                transform: translateX(5px);
            }
        }
    `;
    document.head.appendChild(style);
};

function checkTriangle() {
    const side1Input = document.getElementById("side1");
    const side2Input = document.getElementById("side2");
    const side3Input = document.getElementById("side3");

    const a = parseFloat(side1Input.value);
    const b = parseFloat(side2Input.value);
    const c = parseFloat(side3Input.value);

    let hasError = false;

    function validateNumber(inputElement, value) {
        if (isNaN(value) || value <= 0) {
            inputElement.style.backgroundColor = "rgba(255, 107, 107, 0.3)";
            inputElement.style.borderColor = "#ff6b6b";
            inputElement.style.boxShadow = "0 0 15px rgba(255, 107, 107, 0.5)";
            inputElement.value = "エラー: 数字を入力してください";
            inputElement.style.color = "#ff6b6b";
            hasError = true;
            
            // エラー時の振動アニメーション
            inputElement.style.animation = "shake 0.5s ease-in-out";
            setTimeout(() => {
                inputElement.style.animation = "";
            }, 500);
        } else {
            inputElement.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            inputElement.style.borderColor = "rgba(255, 255, 255, 0.2)";
            inputElement.style.boxShadow = "";
            inputElement.style.color = "white";
        }
    }

    validateNumber(side1Input, a);
    validateNumber(side2Input, b);
    validateNumber(side3Input, c);

    if (hasError) {
        document.getElementById("triangleType").innerText = "";
        document.getElementById("sideLengths").innerText = "";
        document.getElementById("triangleArea").innerText = "";
        document.getElementById("triangleCanvas").style.display = 'none';
        return;
    }

    // 誤差許容モードの確認と設定
    const toleranceToggle = document.getElementById("toleranceToggle");
    const tolerance = toleranceToggle.checked ? 0.04 : 0; // 誤差許容モードがオンなら4%、オフなら0%

    let result = "";

    if (a + b <= c || b + c <= a || c + a <= b) {
        result = "三角形は作れません";
        document.getElementById("triangleCanvas").style.display = 'none';
    } else {
        if (withinTolerance(a, b, tolerance) && withinTolerance(b, c, tolerance)) {
            result = "正三角形";
            drawTriangle("正三角形", a, b, c);
        } else if (isRightAngle(a, b, c, tolerance)) {
            if (withinTolerance(a, b, tolerance) || withinTolerance(b, c, tolerance) || withinTolerance(c, a, tolerance)) {
                result = "直角二等辺三角形";
                drawTriangle("直角二等辺三角形", a, b, c);
            } else {
                result = "直角三角形";
                drawTriangle("直角三角形", a, b, c);
            }
        } else if (withinTolerance(a, b, tolerance) || withinTolerance(b, c, tolerance) || withinTolerance(c, a, tolerance)) {
            const base = withinTolerance(a, b, tolerance) ? c : withinTolerance(b, c, tolerance) ? a : b;
            if (isAcuteIsosceles(a, base, tolerance)) {
                result = "鋭角二等辺三角形";
                drawTriangle("鋭角二等辺三角形", a, b, c);
            } else {
                result = "鈍角二等辺三角形";
                drawTriangle("鈍角二等辺三角形", a, b, c);
            }
        } else {
            result = "不等辺三角形";
            drawTriangle("不等辺三角形", a, b, c);
        }
    }

    // 結果の表示とアニメーション
    document.getElementById("triangleType").innerText = result;
    document.getElementById("sideLengths").innerText = `辺の長さ: ${a}, ${b}, ${c}`;

    // 面積を計算して表示
    const area = calculateArea(a, b, c);
    if (area > 0) {
        document.getElementById("triangleArea").innerText = `面積: ${area.toFixed(2)}`;
    } else {
        document.getElementById("triangleArea").innerText = "";
    }

    // 画面遷移のアニメーション
    const formContainer = document.querySelector('.form-container');
    const outputContainer = document.querySelector('.output-container');
    
    // フォームをフェードアウト
    formContainer.style.animation = 'fadeOut 0.3s ease-in-out forwards';
    
    setTimeout(() => {
        formContainer.style.display = 'none';
        outputContainer.style.display = 'block';
        
        // 結果カードを順番にアニメーション表示
        const cards = document.querySelectorAll('.result-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.animation = `slideUp 0.6s ease-out forwards`;
                card.style.animationDelay = `${index * 0.1}s`;
            }, 100);
        });
    }, 300);
}

function withinTolerance(x, y, tolerance) {
    return Math.abs(x - y) / Math.max(x, y) <= tolerance;
}

function isAcuteIsosceles(a, base, tolerance) {
    return base ** 2 < 2 * a ** 2 * (1 + tolerance);
}

function isRightAngle(a, b, c, tolerance) {
    const sides = [a, b, c].sort((x, y) => x - y);
    return withinTolerance(sides[0] ** 2 + sides[1] ** 2, sides[2] ** 2, tolerance);
}

function drawTriangle(type, a, b, c) {
    const canvas = document.getElementById("triangleCanvas");
    const ctx = canvas.getContext("2d");
    canvas.style.display = 'block';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 影の効果を追加
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    ctx.beginPath();
    if (type === "正三角形") {
        drawEquilateralTriangle(ctx);
    } else if (type === "鋭角二等辺三角形") {
        drawIsoscelesTriangle(ctx, "acute");
    } else if (type === "鈍角二等辺三角形") {
        drawIsoscelesTriangle(ctx, "obtuse");
    } else if (type === "直角二等辺三角形") {
        drawRightIsoscelesTriangle(ctx);
    } else if (type === "直角三角形") {
        drawRightTriangle(ctx);
    } else if (type === "不等辺三角形") {
        drawScaleneTriangle(ctx);
    }

    // 影をリセット
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // 辺の長さテキストをより美しく表示
    ctx.fillStyle = "#333";
    ctx.font = "bold 16px 'Segoe UI', sans-serif";
    ctx.textAlign = "left";
    
    // 背景付きテキスト
    const textData = [
        { text: `a: ${a}`, x: 15, y: 25 },
        { text: `b: ${b}`, x: 15, y: 50 },
        { text: `c: ${c}`, x: 15, y: 75 }
    ];
    
    textData.forEach(data => {
        // 背景の白い矩形
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(data.x - 5, data.y - 18, 60, 23);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.strokeRect(data.x - 5, data.y - 18, 60, 23);
        
        // テキスト
        ctx.fillStyle = "#333";
        ctx.fillText(data.text, data.x, data.y);
    });
}

function drawEquilateralTriangle(ctx) {
    const size = 150;
    const height = size * Math.sqrt(3) / 2;
    const centerX = 150;
    const centerY = 150;

    const topX = centerX;
    const topY = centerY - height / 2;
    const leftX = centerX - size / 2;
    const leftY = centerY + height / 2;
    const rightX = centerX + size / 2;
    const rightY = centerY + height / 2;

    // グラデーション効果
    const gradient = ctx.createLinearGradient(topX, topY, centerX, leftY);
    gradient.addColorStop(0, "#FF6B6B");
    gradient.addColorStop(0.5, "#FFD93D");
    gradient.addColorStop(1, "#6BCF7F");

    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 境界線
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawIsoscelesTriangle(ctx, type) {
    const base = 150;
    let height;
    let gradient;

    ctx.beginPath();

    if (type === 'acute') {
        height = Math.sqrt(3) * base / 2;
        ctx.moveTo(150, 50);
        
        gradient = ctx.createLinearGradient(150, 50, 150, height + 150);
        gradient.addColorStop(0, "#6BCF7F");
        gradient.addColorStop(1, "#4ECDC4");
    } else if (type === 'obtuse') {
        height = 40;
        ctx.moveTo(150, 100);
        
        gradient = ctx.createLinearGradient(150, 100, 150, height + 150);
        gradient.addColorStop(0, "#FFB74D");
        gradient.addColorStop(1, "#FF8A65");
    }

    ctx.lineTo(150 - base / 2, height + 150);
    ctx.lineTo(150 + base / 2, height + 150);
    ctx.closePath();
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawRightTriangle(ctx) {
    const gradient = ctx.createLinearGradient(50, 50, 200, 200);
    gradient.addColorStop(0, "#FF6B6B");
    gradient.addColorStop(1, "#C44569");
    
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(200, 200);
    ctx.lineTo(200, 50);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 直角マーク
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.strokeRect(180, 180, 20, 20);
}

function drawRightIsoscelesTriangle(ctx) {
    const base = 100;
    const gradient = ctx.createLinearGradient(100, 100, 200, 200);
    gradient.addColorStop(0, "#FFD93D");
    gradient.addColorStop(1, "#F39C12");
    
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(200, 200);
    ctx.lineTo(100, 100);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 直角マーク
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.strokeRect(100, 180, 20, 20);
}

function drawScaleneTriangle(ctx) {
    const gradient = ctx.createLinearGradient(50, 100, 200, 200);
    gradient.addColorStop(0, "#9B59B6");
    gradient.addColorStop(0.5, "#E91E63");
    gradient.addColorStop(1, "#FF5722");
    
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(150, 100);
    ctx.lineTo(200, 150);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function resetForm() {
    // フェードアウトアニメーション
    const outputContainer = document.querySelector('.output-container');
    const formContainer = document.querySelector('.form-container');
    
    outputContainer.style.animation = 'fadeOut 0.3s ease-in-out forwards';
    
    setTimeout(() => {
        // 値をクリア
        document.getElementById("side1").value = "";
        document.getElementById("side2").value = "";
        document.getElementById("side3").value = "";
        document.getElementById("triangleType").innerText = "";
        document.getElementById("sideLengths").innerText = "";
        document.getElementById("triangleArea").innerText = "";
        
        // 表示を切り替え
        outputContainer.style.display = 'none';
        formContainer.style.display = 'flex';
        formContainer.style.animation = 'fadeIn 0.5s ease-in-out forwards';

        // 誤差許容モードをオフにする
        document.getElementById("toleranceToggle").checked = false;
        
        // 入力フィールドのスタイルをリセット
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            input.style.borderColor = "rgba(255, 255, 255, 0.2)";
            input.style.boxShadow = "";
            input.style.color = "white";
        });
    }, 300);
}

function calculateArea(a, b, c) {
    if (a + b <= c || b + c <= a || c + a <= b) {
        return 0; // 無効な三角形の場合
    }
    const s = (a + b + c) / 2; // 半周長
    return Math.sqrt(s * (s - a) * (s - b) * (s - c)); // ヘロンの公式
}

// CSS アニメーションの追加
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-30px);
        }
    }
    
    @keyframes shake {
        0%, 100% {
            transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
        }
        20%, 40%, 60%, 80% {
            transform: translateX(5px);
        }
    }
`;
document.head.appendChild(style);
