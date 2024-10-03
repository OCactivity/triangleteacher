function checkTriangle() {
    const side1Input = document.getElementById("side1");
    const side2Input = document.getElementById("side2");
    const side3Input = document.getElementById("side3");

    const a = parseFloat(side1Input.value);
    const b = parseFloat(side2Input.value);
    const c = parseFloat(side3Input.value);

    // エラーフラグ
    let hasError = false;

    // 数値バリデーション関数
    function validateNumber(inputElement, value) {
        if (isNaN(value) || value <= 0) {
            inputElement.style.backgroundColor = "lightcoral"; // エラーの場合は赤色
            inputElement.value = "エラー: 数字を入力してください"; // エラーメッセージ
            hasError = true;
        } else {
            inputElement.style.backgroundColor = ""; // 正しい場合は元の色に戻す
        }
    }

    // 各辺の入力をチェック
    validateNumber(side1Input, a);
    validateNumber(side2Input, b);
    validateNumber(side3Input, c);

    // エラーがあれば終了
    if (hasError) {
        document.getElementById("triangleType").innerText = "";
        document.getElementById("sideLengths").innerText = "";
        document.getElementById("triangleCanvas").style.display = 'none'; // 画像を表示しない
        return;
    }

    let result = "";
    // 三角形が成立するかチェック
    if (a + b <= c || b + c <= a || c + a <= b) {
        result = "三角形は作れません";
        document.getElementById("triangleCanvas").style.display = 'none'; // 画像を表示しない
    } else {
        // 三角形の種類を判定
        if (Math.abs(a - b) < Number.EPSILON && Math.abs(b - c) < Number.EPSILON) {
            result = "正三角形";
            drawTriangle("正三角形", a, b, c);
        } else if (Math.abs(a - b) < Number.EPSILON || Math.abs(b - c) < Number.EPSILON || Math.abs(c - a) < Number.EPSILON) {
            // 二等辺三角形の場合の鋭角・鈍角判定
            const base = (Math.abs(a - b) < Number.EPSILON) ? c : (Math.abs(b - c) < Number.EPSILON) ? a : b;
            if (isAcuteIsosceles(a, base)) {
                result = "鋭角二等辺三角形";
                drawTriangle("鋭角二等辺三角形", a, b, c);
            } else {
                result = "鈍角二等辺三角形";
                drawTriangle("鈍角二等辺三角形", a, b, c);
            }
        } else if (isRightAngle(a, b, c)) {
            result = "直角三角形";
            drawTriangle("直角三角形", a, b, c);
        } else {
            result = "不等辺三角形";
            drawTriangle("不等辺三角形", a, b, c);
        }
    }

    // 結果の表示
    document.getElementById("triangleType").innerText = result;
    document.getElementById("sideLengths").innerText = `辺の長さ: ${a}, ${b}, ${c}`;
    document.querySelector('.output-container').style.display = 'flex';
    document.querySelector('.form-container').style.display = 'none';
}


function isAcuteIsosceles(a, base) {
    return base ** 2 < 2 * a ** 2 + Number.EPSILON; // 小数点誤差を許容
}

function isRightAngle(a, b, c) {
    const sides = [a, b, c].sort((x, y) => x - y);
    return Math.abs(sides[0] ** 2 + sides[1] ** 2 - sides[2] ** 2) < Number.EPSILON;
}

function drawTriangle(type, a, b, c) {
    const canvas = document.getElementById("triangleCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 以前の描画をクリア

    ctx.beginPath();
    if (type === "正三角形") {
        drawEquilateralTriangle(ctx);
    } else if (type === "鋭角二等辺三角形") {
        drawIsoscelesTriangle(ctx, "acute");
    } else if (type === "鈍角二等辺三角形") {
        drawIsoscelesTriangle(ctx, "obtuse");
    } else if (type === "直角三角形") {
        drawRightTriangle(ctx);
    } else if (type === "不等辺三角形") {
        drawScaleneTriangle(ctx);
    }

    // 辺の長さを描画
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`a: ${a}`, 10, 20);
    ctx.fillText(`b: ${b}`, 10, 40);
    ctx.fillText(`c: ${c}`, 10, 60);

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// 他の関数（drawEquilateralTriangle, drawIsoscelesTriangleなど）はそのまま


function drawEquilateralTriangle(ctx) {
    const size = 150; // 正三角形の1辺の長さ
    const height = size * Math.sqrt(3) / 2; // 高さを計算
    const centerX = 150; // 中心のX座標
    const centerY = 150; // 中心のY座標

    // 各頂点の座標を計算
    const topX = centerX;
    const topY = centerY - height / 2;
    const leftX = centerX - size / 2;
    const leftY = centerY + height / 2;
    const rightX = centerX + size / 2;
    const rightY = centerY + height / 2;

    // 三角形を描画
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();

    ctx.fillStyle = "lightblue"; // 色を設定
    ctx.fill();
}

function drawIsoscelesTriangle(ctx, type) {
    const base = 150; // ベースの長さ
    let height;

    ctx.beginPath();

    // 鋭角二等辺三角形の設定
    if (type === 'acute') {
        height = Math.sqrt(3) * base / 2; // 鋭角二等辺三角形の高さを計算
        ctx.moveTo(150, 50); // 上の頂点（高さを高めに）
    } 
    // 鈍角二等辺三角形の設定
    else if (type === 'obtuse') {
        height = 40; // 鈍角二等辺三角形の高さを設定
        ctx.moveTo(150, 100); // 上の頂点（高さを低めに）
    }

    ctx.lineTo(150 - base / 2, height + 150);  // 左の頂点
    ctx.lineTo(150 + base / 2, height + 150); // 右の頂点
    ctx.closePath();

    ctx.fillStyle = "lightgreen"; // 色を設定
    ctx.fill();
}


function drawRightTriangle(ctx) {
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(200, 200);
    ctx.lineTo(200, 50);
    ctx.lineTo(50, 200);
    ctx.fillStyle = "lightcoral"; // 色を設定
    ctx.fill();
}

function drawRightIsoscelesTriangle(ctx) {
    const base = 100;
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(200, 200);
    ctx.lineTo(100, 100);
    ctx.lineTo(100, 200);
    ctx.fillStyle = "yellow"; // 色を設定
    ctx.fill();
}

function drawScaleneTriangle(ctx) {
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(150, 100);
    ctx.lineTo(200, 150);
    ctx.lineTo(50, 200);
    ctx.fillStyle = "lightpink"; // 色を設定
    ctx.fill();
}

function resetForm() {
    document.getElementById("side1").value = "";
    document.getElementById("side2").value = "";
    document.getElementById("side3").value = "";
    document.getElementById("triangleType").innerText = "";
    document.getElementById("sideLengths").innerText = "";
    document.querySelector('.output-container').style.display = 'none';
    document.querySelector('.form-container').style.display = 'block';
}
