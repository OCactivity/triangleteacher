function checkTriangle() {
    const a = parseFloat(document.getElementById("side1").value);
    const b = parseFloat(document.getElementById("side2").value);
    const c = parseFloat(document.getElementById("side3").value);
    
    let result = "";
    // 三角形が成立するかチェック
    if (a + b <= c || b + c <= a || c + a <= b) {
        result = "三角形は作れません";
        document.getElementById("triangleCanvas").style.display = 'none'; // 画像を表示しない
    } else {
        // 三角形の種類を判定
        if (a === b && b === c) {
            result = "正三角形";
            drawTriangle("正三角形", a, b, c);
        } else if (a === b || b === c || c === a) {
            if (isRightAngle(a, b, c)) {
                result = "直角二等辺三角形";
                drawTriangle("直角二等辺三角形", a, b, c);
            } else {
                result = "二等辺三角形";
                drawTriangle("二等辺三角形", a, b, c);
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

function isRightAngle(a, b, c) {
    const sides = [a, b, c].sort((x, y) => x - y);
    return Math.abs(sides[0] ** 2 + sides[1] ** 2 - sides[2] ** 2) < 0.0001;
}

function drawTriangle(type, a, b, c) {
    const canvas = document.getElementById("triangleCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 以前の描画をクリア

    ctx.beginPath();
    if (type === "正三角形") {
        drawEquilateralTriangle(ctx);
    } else if (type === "二等辺三角形") {
        drawIsoscelesTriangle(ctx);
    } else if (type === "直角三角形") {
        drawRightTriangle(ctx);
    } else if (type === "直角二等辺三角形") {
        drawRightIsoscelesTriangle(ctx);
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
    document.getElementById("triangleCanvas").style.display = 'block'; // 画像を表示
}

function drawEquilateralTriangle(ctx) {
    const size = 100;
    ctx.moveTo(150, 50);
    ctx.lineTo(100, 200);
    ctx.lineTo(200, 200);
    ctx.lineTo(150, 50);
    ctx.fillStyle = "lightblue"; // 色を設定
}

function drawIsoscelesTriangle(ctx) {
    const base = 150;
    const height = 100;
    ctx.moveTo(125, 50);
    ctx.lineTo(75, 150);
    ctx.lineTo(175, 150);
    ctx.lineTo(125, 50);
    ctx.fillStyle = "lightgreen"; // 色を設定
}

function drawRightTriangle(ctx) {
    ctx.moveTo(50, 200);
    ctx.lineTo(200, 200);
    ctx.lineTo(200, 50);
    ctx.lineTo(50, 200);
    ctx.fillStyle = "lightcoral"; // 色を設定
}

function drawRightIsoscelesTriangle(ctx) {
    const base = 100;
    ctx.moveTo(100, 200);
    ctx.lineTo(200, 200);
    ctx.lineTo(100, 100);
    ctx.lineTo(100, 200);
    ctx.fillStyle = "yellow"; // 色を設定
}

function drawScaleneTriangle(ctx) {
    ctx.moveTo(50, 200);
    ctx.lineTo(150, 100);
    ctx.lineTo(200, 150);
    ctx.lineTo(50, 200);
    ctx.fillStyle = "lightpink"; // 色を設定
}

function resetForm() {
    document.getElementById("side1").value = "";
    document.getElementById("side2").value = "";
    document.getElementById("side3").value = "";
    document.getElementById("triangleType").innerText = "";
    document.getElementById("sideLengths").innerText = "";
    document.getElementById("triangleCanvas").style.display = 'none'; // キャンバスを隠す
    document.querySelector('.output-container').style.display = 'none';
    document.querySelector('.form-container').style.display = 'block';
}
